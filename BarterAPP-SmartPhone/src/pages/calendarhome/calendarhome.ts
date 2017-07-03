import { Component, OnDestroy } from '@angular/core';
import { IonicPage, ToastController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
/*RxJS*/
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

/*models*/
import { MyEvent, EventDTO, InterchangeDTO, DateUpdateDTO ,ShiftEventModel } from '../models/index';

/*repository*/
import { CalendarRepository } from '../_repository/index';

/*services*/
import { EventAggregatorService, IonicLocalStorageService } from '../_services/index';

/*utils*/
import { ShiftUtilsService } from '../_utils/shift.utils.service';

/*Calendario*/
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarDateFormatter, CalendarEventTimesChangedEvent } from 'angular-calendar';

/*Cambio idioma*/
import { CustomDateFormatter } from './custom-date-formatter-provider';

/*PrimeNG*/
import { Message } from 'primeng/primeng';


@IonicPage()
@Component({
  selector: 'page-calendarhome',
  templateUrl: 'calendarhome.html',
  providers: [{
  provide: CalendarDateFormatter,
  useClass: CustomDateFormatter
}]
})
export class CalendarhomePage implements OnDestroy{

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController,
              private calendarRepository: CalendarRepository, private shiftUtilsService: ShiftUtilsService,
              private eventAggregator: EventAggregatorService,
              private ionicLocalStorageService: IonicLocalStorageService,
			  private alertCtrl: AlertController
  ) {
    this.colors = shiftUtilsService.getColors();
    this.shifts = shiftUtilsService.getShifts();
    this.types = shiftUtilsService.getTypes();
    this.turnInDay = shiftUtilsService.getTurnInDay();
  }

  private activeDayIsOpen: boolean = true;
  // Bandera que se asigna en función de la selección del usuario
  showNormalEvent = 0; // 0 - normal, 1 - pending, 2 - decline, 3 - accepted
  // Contadores que muestran en los botones el numero de peticiones
  pendingEventCounter: number = 0; //Pendientes
  declineEventCounter: number = 0; //Rechazadas
  acceptedEventCounter: number = 0; //Aceptadas

  currentUser;

  // Tipología de Turnos de la empresa  ["24 Horas", "12 Horas" , "8 Horas", "6 Horas"];
  shifts;

  //Tipos  'Assigned shifts' , 'Desired free shifts', 'Untouchable free shifts', 'Free Shifts'
  /*
   Assigned shifts :  Asignado conforme
   Desired free shifts : Asignado eliminar
   Untouchable free shifts : Intocable
   Free Shifts : Libre
   */  types;

  // Turnos de un día
  turnInDay;

  // Colores preasignados a cada tipo
  colors;

  // vista por defecto calendario
  public view = 'month';

  locale: string = 'es';

  viewDate: Date = new Date();

  // Observable Calendario
  refresh: Subject<any> = new Subject();

  events: MyEvent[] = [];


  msgs: Message[] = [];


  stickymsgs: Message[] = [];

  freeUsers: Array<MyEvent> =[];


  choosenFreeUser = -1;

  displayShiftDialog: boolean = false;
  alert = "";
  showShiftAlert = false;


  showTurnInDay: boolean = true;

  chosenTurn = -1;



  eventForChosenDay : MyEvent;

  acceptedEvents  = [];

  declineEvents  = [];


  flagContinue = false;

  shiftEvents: Array<ShiftEventModel> =[];

  clickedDate;
  possibleDesiredShift;

  pollingSubscription;

  ionViewWillEnter(){


this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!this.currentUser){
this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));
}

	 let oneDayEvent = [];
    let startIndex;
    let veryOldDate = new Date(2001,10,10);
	this.shiftEvents = [];
	this.events = [];
  this.pendingEventCounter  = 0;
  this.declineEventCounter  = 0;
  this.acceptedEventCounter = 0;


    this.calendarRepository.getEventsByCompanyByWorker(this.currentUser.cname, this.currentUser.username).subscribe(result => {

      for ( var v = 0; v < result.length; v++ ) {
        let currentEvent = <MyEvent> { _id    : result[v]._id,
          type      : result[v].type,
          title     : result[v].title,
          start     : new Date(result[v].start),
          end       : new Date(result[v].end),
          color     : { primary : result[v].primary_color, secondary : result[v].secondary_color},
          action    : [],
          draggable : result[v].draggable,
          resizable : {
            beforeStart: result[v].resizable_beforeStart,
            afterEnd: result[v].resizable_afterEnd
          },
          username : result[v].username,
          status: result[v].status,
          sender: result[v].sender,
          turn_in_day: result[v].turn_in_day
        };

        this.populateSpecificEventsCollections(currentEvent);
        this.eventAggregator.setPendingEventCounter(this.pendingEventCounter);
        this.eventAggregator.setDeclinedEventCounter(this.declineEventCounter);
        this.eventAggregator.setAcceptedEventCounter(this.acceptedEventCounter);


        let dotsCount = this.shifts.indexOf(this.currentUser.shift)+1;


        if(currentEvent.start.getTime() !== veryOldDate.getTime()){
          veryOldDate = currentEvent.start;
          if(oneDayEvent.length!=0){
            this.populateShiftEvent(oneDayEvent, startIndex);

          }
          oneDayEvent = [];
          oneDayEvent.push(currentEvent);
          startIndex = v;
        }else{
          oneDayEvent.push(currentEvent);
        }
        this.events.push(currentEvent);
      }
      if(this.events.length != 0) {
        this.populateShiftEvent(oneDayEvent, startIndex);
        this.eventAggregator.setShiftEvents(this.shiftEvents);

      }

      this.refresh.next();
    });


    this.pollingSubscription = this.calendarRepository.initializePolling(this.currentUser.cname, this.currentUser.username, ShiftUtilsService.eventStatus.normal).subscribe(result => {

      let pendingEvents = [];
      this.acceptedEvents  = [];
      this.declineEvents  = [];

      for (let i = 0; i < result.length; i++){
        let currentEvent = <MyEvent> { _id    : result[i]._id,
          type      : result[i].type,
          title     : result[i].title,
          start     : new Date(result[i].start),
          end       : new Date(result[i].end),
          color     : { primary : result[i].primary_color, secondary : result[i].secondary_color},
          action    : [],
          draggable : result[i].draggable,
          resizable : {
            beforeStart: result[i].resizable_beforeStart,
            afterEnd: result[i].resizable_afterEnd
          },
          username : result[i].username,
          status: result[i].status,
          sender: result[i].sender,
          turn_in_day: result[i].turn_in_day};

        let element = currentEvent;
        switch(element.status) {
          case ShiftUtilsService.eventStatus.pending: {
            pendingEvents.push(element);
            break;
          }
          case ShiftUtilsService.eventStatus.declined: {
            this.declineEvents.push(element);
            break;
          }
          case ShiftUtilsService.eventStatus.accepted: {
            this.acceptedEvents.push(element);
            break;
          }
          default: {
            break;
          }
        }
      }
      this.msgs = [];

      if (this.pendingEventCounter < pendingEvents.length){
        this.addMessage({severity:'warn', summary:'Peticiones pendientes!'});
      }
      this.pendingEventCounter = pendingEvents.length;

      if (this.declineEventCounter < this.declineEvents.length){
        this.addMessage({severity:'error', summary:'Cambio rechazado.'});
      }
      this.declineEventCounter = this.declineEvents.length;

      if (this.acceptedEventCounter < this.acceptedEvents.length){
        this.addMessage({severity:'success', summary:'Cambio aceptado.'});
      }
      this.acceptedEventCounter = this.acceptedEvents.length;

      this.eventAggregator.setPendingEventCounter(this.pendingEventCounter);
      this.eventAggregator.setDeclinedEventCounter(this.declineEventCounter);
      this.eventAggregator.setAcceptedEventCounter(this.acceptedEventCounter);


      for (let i= 0; i< this.events.length; i++ ){
        let flag = true;
        let currentEvent = this.events[i];
        for(let j = 0; j < pendingEvents.length; j++){

          if(this.isEqual(currentEvent._id, pendingEvents[j]._id)){
            flag = false;
            currentEvent.status = pendingEvents[j].status;
            currentEvent.sender = pendingEvents[j].sender;
          }
        }
        if(!this.flagContinue){

          for(let j = 0; j < this.declineEvents.length; j++){

            if(this.isEqual(currentEvent._id, this.declineEvents[j]._id)){
              flag = false;
              currentEvent.status = this.declineEvents[j].status;
              currentEvent.sender = this.declineEvents[j].sender;
            }
          }

          for(let j = 0; j < this.acceptedEvents.length; j++){

            if(this.isEqual(currentEvent._id, this.acceptedEvents[j]._id)){
              flag = false;
              if( currentEvent.status != ShiftUtilsService.eventStatus.accepted){
                this.updateOriginalEvent( currentEvent, this.acceptedEvents[j], []);
              }
            }
          }
        }
        if(flag &&  currentEvent.status != ShiftUtilsService.eventStatus.required ){
          currentEvent.status = ShiftUtilsService.eventStatus.normal;
          currentEvent.sender = '';
        }
      }


    });


  }

  ionViewDidLoad() {
  this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if(!this.currentUser){
  this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));
  }

  this.shiftUtilsService.setCurrentUserTurnInDay(this.currentUser.shift);
  }

  ionViewWillLeave(){
	this.pollingSubscription.unsubscribe();
  }

  public populateShiftEvent(oneDayEvent, startIndex):void{
    let shiftEvent = new ShiftEventModel(oneDayEvent, startIndex, this.events, this.shiftEvents);
    this.shiftEvents.push(shiftEvent);
  }

  private updateOriginalEvent(originalEvent, newEventValue, actions){
    originalEvent._id    	 = newEventValue._id,
      originalEvent.type      = newEventValue.type,
      originalEvent.title     = newEventValue.title,
      originalEvent.start     = newEventValue.start,
      originalEvent.end       = newEventValue.end,
      originalEvent.color     = newEventValue.color,
      originalEvent.actions   = actions,
      originalEvent.draggable = newEventValue.draggable,
      originalEvent.resizable = newEventValue.resizable,
      originalEvent.username  = newEventValue.username,
      originalEvent.status    = newEventValue.status,
      originalEvent.sender    = newEventValue.sender
  }

  private populateSpecificEventsCollections(currentEvent) {
    switch (currentEvent.status) {
      case ShiftUtilsService.eventStatus.pending:
      {
        this.pendingEventCounter++;
        break;
      }
      case ShiftUtilsService.eventStatus.declined:
      {
        this.declineEventCounter++;
        break;
      }
      case ShiftUtilsService.eventStatus.accepted:
      {
        this.acceptedEventCounter++;
        break;
      }
      default:
      {

        break;
      }
    }
  }

  addMessage(messageText){
  this.msgs.push(messageText);
  }
  addStickyMessage(messageText){
  this.stickymsgs.push(messageText);
  }

  dayClicked({date, events}: {date: Date, events: MyEvent[]}): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }

    }

    if(events.length > 0){
      this.possibleDesiredShift = this.findDesiredFreeShiftEvents(events);
      if( this.possibleDesiredShift.length == 0){
        return;
      }else{
        this.displayShiftDialog = true;
      }

      this.clickedDate  = date;
    }
  }

  private findDesiredFreeShiftEvents(events){
    let desiredShift = [];
    for(let i = 0; i < events.length; i ++){
      let event = events[i];
      if(event.type == this.types[1] && event.status == ShiftUtilsService.eventStatus.normal){
        desiredShift.push(events[i]);
      }
    }
    return desiredShift;
  }


  private createAllEvents(){
    let events = [];
    let currentTurnInDay = this.turnInDay.get(this.currentUser.shift);

    for (let i = 0; i < currentTurnInDay.length; i++){
      let event: EventDTO = {
           title: 'Turno ' + currentTurnInDay[i] + ' de '+ this.currentUser.firstName,
        type: this.types[3],
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        primary_color: this.colors.green.primary,
        secondary_color: this.colors.green.secondary,
        draggable: true,
        resizable_beforeStart: true,
        resizable_afterEnd: true,
        company: '',
        username: this.currentUser.username,
        status: ShiftUtilsService.eventStatus.normal,
        sender: '',
        turn_in_day: currentTurnInDay[i]
      };
      event.company = this.currentUser.cname;
      event.username = this.currentUser.username;
      this.clearDateTime(event.start);
      this.clearDateTime(event.end);

      events.push(event);
    }
    return events;
  }

  //nuevo evento
  addEvent(): void {

    let dayEvents = this.createAllEvents();

    this.calendarRepository.createEvents(dayEvents).subscribe(result => {
      let createdDayEvents = [];
      let currentIndex = this.events.length-1;
      for(let i = 0; i < result.length; i++ ){

        let currentEvent = <MyEvent> { _id    : result[i]._id,
          type      : result[i].type,
          title     : result[i].title,
          start     : new Date(result[i].start),
          end       : new Date(result[i].end),
          color     : { primary : result[i].primary_color, secondary : result[i].secondary_color},
          action    : [],
          draggable : result[i].draggable,
          resizable : {
            beforeStart: result[i].resizable_beforeStart,
            afterEnd: result[i].resizable_afterEnd
          },
          username : this.currentUser.username,
          status: result[i].status,
          sender: result[i].sender,
          turn_in_day: result[i].turn_in_day
        };

        this.events.push(currentEvent);
        createdDayEvents.push(currentEvent);
      }
      this.populateShiftEvent(createdDayEvents, currentIndex);

      this.refresh.next();

    });
  }

  deleteEvent(index): void {
    let eventToDelete = this.events[index];
    this.calendarRepository.deleteEvent(eventToDelete._id).subscribe(
        result => {
        this.events.splice(index, 1);
        this.refresh.next();
      });

  }

  deleteShiftEvent(shiftEvent:ShiftEventModel):void{
     let ids: any;
     ids = [];

     for( let event of shiftEvent.getEventsInOneDay()){
       ids.push(event._id);
     }

     this.calendarRepository.deleteEvents(ids).subscribe(
         result => {

         this.deleteCurrentShiftEvent(shiftEvent);
         this.refresh.next();
       });

   }

   deleteCurrentShiftEvent(currentShiftEvent){
     let currentShiftEventIndex =  -1;
     for(let i = 0; i < this.shiftEvents.length; i++){
         if(currentShiftEvent.eventsInOneDay[0]._id === this.shiftEvents[i].eventsInOneDay[0]._id ){
           currentShiftEventIndex = i;
           break;
         }
     }
     let firstOriginalIndex = -1;

   for(let i = 0 ; i < this.events.length; i++){
     if(currentShiftEvent.eventsInOneDay[0]._id === this.events[i]._id){
       firstOriginalIndex = i;
       break;
     }
   }

   this.shiftEvents.splice(currentShiftEventIndex,1);
   this.events.splice(firstOriginalIndex, currentShiftEvent.eventsInOneDay.length);


 }


  valueChange(index): void {
    let changedEvent = this.events[index];
    this.changeTypeEvent(changedEvent);

    this.clearDateTime(changedEvent.start);
    this.makeEndDateEqualToStartDate(changedEvent);

    this.calendarRepository.updateEvent(changedEvent).subscribe(result => {
      this.refresh.next();
    });
  }


  valueChangeInShiftEvent(event): void {
    let changedEvent = event;
    this.changeTypeEvent(changedEvent);

    this.clearDateTime(changedEvent.start);
    this.makeEndDateEqualToStartDate(changedEvent);

    this.calendarRepository.updateEvent(changedEvent).subscribe(result => {
      this.refresh.next();
    });
  }



  updateDayDate(shiftEvent: ShiftEventModel){
    let idDateBinding:Array<DateUpdateDTO>;
    idDateBinding = [];
    for(let event of shiftEvent.eventsInOneDay){
      let dateUpdate = <DateUpdateDTO>{_id: event._id, start: event.start, end: event.end};
      idDateBinding.push(dateUpdate);
    }
    this.calendarRepository.updateEvents(idDateBinding).subscribe(result => {
      this.refresh.next();
    });
  }


  private makeEndDateEqualToStartDate(event: MyEvent){
    event.end = event.start;
  }

  private updateTypeColor(event, primaryColor, secondaryColor){

    event.color.primary   = primaryColor;
    event.color.secondary = secondaryColor;
  }

  private changeTypeEvent(event){
    switch ( event.type ) {
      case 'Assigned shifts':
        this.updateTypeColor(event, this.colors.blue.primary, this.colors.blue.secondary);
        break;
      case 'Desired free shifts':
        this.updateTypeColor(event, this.colors.yellow.primary, this.colors.yellow.secondary);
        break;
      case 'Untouchable free shifts':
        this.updateTypeColor(event, this.colors.red.primary, this.colors.red.secondary);
        break;
      case 'Free Shifts':
        this.updateTypeColor(event, this.colors.green.primary, this.colors.green.secondary);
        break;
      default:
        break;
    }
  }

  public showNormal(flag){
    this.showNormalEvent =  flag;
  }

  public acceptInShiftEvent(event) {

    let eventAccepted = event;

    const params: EventDTO = {
      _id: eventAccepted._id,
      title: eventAccepted.title,
      type: eventAccepted.type,
      start: eventAccepted.start,
      end: eventAccepted.end,
      primary_color: eventAccepted.color.primary,
      secondary_color: eventAccepted.color.secondary,
      draggable: eventAccepted.draggable,
      resizable_beforeStart: eventAccepted.resizable.beforeStart,
      resizable_afterEnd: eventAccepted.resizable.afterEnd,
      company: this.currentUser.cname,
      username: eventAccepted.username,
      status: eventAccepted.status,
      sender: eventAccepted.username,
      turn_in_day: eventAccepted.turn_in_day
    };

    this.calendarRepository.acceptShift(params).subscribe(result => {
      let currentEvent = <MyEvent> {
        _id: result._id,
        type: result.type,
        title: result.title,
        start: new Date(result.start),
        end: new Date(result.end),
        color: {primary: result.primary_color, secondary: result.secondary_color},
        actions: [],
        draggable: result.draggable,
        resizable: {
          beforeStart: result.resizable_beforeStart,
          afterEnd: result.resizable_afterEnd
        },
        username: this.currentUser.username,
        status: result.status,
        sender: result.sender
      };
      let event = eventAccepted;

      this.updateOriginalEvent(event, currentEvent, []);
      this.pendingEventCounter--;
      this.refresh.next();
    });

  }

  public accept(index) {

    let eventAccepted = this.events[index];

    const params: EventDTO = {
      _id: eventAccepted._id,
      title: eventAccepted.title,
      type: eventAccepted.type,
      start: eventAccepted.start,
      end: eventAccepted.end,
      primary_color: eventAccepted.color.primary,
      secondary_color: eventAccepted.color.secondary,
      draggable: eventAccepted.draggable,
      resizable_beforeStart: eventAccepted.resizable.beforeStart,
      resizable_afterEnd: eventAccepted.resizable.afterEnd,
      company: this.currentUser.cname,
      username: eventAccepted.username,
      status: eventAccepted.status,
      sender: eventAccepted.username,
      turn_in_day: eventAccepted.turn_in_day
    };

    this.calendarRepository.acceptShift(params).subscribe(result => {
      let currentEvent = <MyEvent> {
        _id: result._id,
        type: result.type,
        title: result.title,
        start: new Date(result.start),
        end: new Date(result.end),
        color: {primary: result.primary_color, secondary: result.secondary_color},
        actions: [],
        draggable: result.draggable,
        resizable: {
          beforeStart: result.resizable_beforeStart,
          afterEnd: result.resizable_afterEnd
        },
        username: this.currentUser.username,
        status: result.status,
        sender: result.sender
      };
      let event = this.events[index];

      this.updateOriginalEvent(event, currentEvent, []);
      this.pendingEventCounter--;
      this.refresh.next();
    });

  }

  public declineInShiftEvent(event) {

    let eventDeclined = event;

    this.calendarRepository.declineShift(eventDeclined).subscribe(result => {
      eventDeclined.status = ShiftUtilsService.eventStatus.normal;
      this.pendingEventCounter--;
    });
    this.refresh.next();
  }


  public decline(index) {

    let eventDeclined = this.events[index];

    this.calendarRepository.declineShift(eventDeclined).subscribe(result => {

      eventDeclined.status = ShiftUtilsService.eventStatus.normal;

      this.pendingEventCounter--;
    });
    this.refresh.next();
  }

  public findFreeEvents(date, turn_in_day){
    let choosedDay = date;
    this.clearDateTime(choosedDay);
    this.calendarRepository.findFreeEventsByDayByShift(choosedDay.toISOString(), turn_in_day ,this.currentUser).subscribe(result => {
      if(result.length > 0){
        this.freeUsers = result;
        this.displayShiftDialog = true;
      }else{
        this.freeUsers = [];
        this.addMessage({severity:'warn', summary:'No existen usuarios libres para este dia. '});
      } this.refresh.next();
    });

  }

  findEventById(id){
    for(let i = 0; i < this.events.length; i++){
      let event = this.events[i];
      if(this.isEqual(event._id, id)){
        return event;
      }

    }
    return null;
  }


  private isEqual(event1Id, event2Id){
    return event1Id === event2Id;
  }

  private changeEventStatusById(id, status){
    for(let i = 0; i < this.events.length; i++){
      let event = this.events[i];
      if(this.isEqual(event._id ,id)){
        event.status = status;
      }

    }
  }




  private clearDateTime(d){
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setHours(0);
    d.setMinutes(0);

  }



  public activateShift(){
    if (this.choosenFreeUser == -1){
      this.showShiftAlert = true;
      this.alert = "Debes elegir un usuario.";

      return;
    }
    this.displayShiftDialog = false;
    this.showShiftAlert = false;

    this.showTurnInDay = true;

    let selectedEvent:MyEvent = this.freeUsers[this.choosenFreeUser];

    let interchangeObject = <InterchangeDTO  > {
      requestor             : this.eventForChosenDay.username,
      acknowledger          : selectedEvent.username,
      requestor_event_id    : this.eventForChosenDay._id,
      acknowledger_event_id : selectedEvent._id,
      status: ShiftUtilsService.eventStatus.pending
    };

    this.changeEventStatusById(this.eventForChosenDay._id, 'required');

    this.calendarRepository.activateShift(interchangeObject).subscribe(result => {

      this.refresh.next();
    });
    this.freeUsers = [];
    this.choosenFreeUser = -1;
    this.refresh.next();
  }


  makeNormalInShiftEvent(event){

    this.flagContinue = true;

    event.sender = "";
    event.status = ShiftUtilsService.eventStatus.normal;


    this.calendarRepository.updateEvent(event).subscribe(result => {
      this.refresh.next();

      let originalEvent = event;
      for(let j = 0; j < this.declineEvents.length; j++){
        if(originalEvent._id == this.declineEvents[j]._id){
          this.declineEvents[j].status = ShiftUtilsService.eventStatus.normal;
          this.declineEventCounter--;
        }
      }

      for(let j = 0; j < this.acceptedEvents.length; j++){
        if(originalEvent._id == this.acceptedEvents[j]._id ){
          this.acceptedEvents[j].status = ShiftUtilsService.eventStatus.normal;
          this.acceptedEventCounter--;
        }
      }

      this.flagContinue = false;


    });
  }

  makeNormal(index){

    this.flagContinue = true;
    let event = this.events[index];
    event.sender = "";
    event.status = ShiftUtilsService.eventStatus.normal;

    this.calendarRepository.updateEvent(event).subscribe(result => {
      this.refresh.next();

      let originalEvent = this.events[index];
      for(let j = 0; j < this.declineEvents.length; j++){
        if(originalEvent._id == this.declineEvents[j]._id){
          this.declineEvents[j].status = ShiftUtilsService.eventStatus.normal;
          this.declineEventCounter--;
        }
      }

      for(let j = 0; j < this.acceptedEvents.length; j++){
        if(originalEvent._id == this.acceptedEvents[j]._id ){
          this.acceptedEvents[j].status = ShiftUtilsService.eventStatus.normal;
          this.acceptedEventCounter--;
        }
      }

      this.flagContinue = false;


    });
  }


  hideActivateShiftButton() {
    return this.freeUsers.length == 0;
  }


  setTurn(event) {
    this.showTurnInDay = false;
    this.eventForChosenDay = event;
    this.findFreeEvents(this.clickedDate, this.eventForChosenDay.turn_in_day);
  }

  hideDialog(){
    this.displayShiftDialog = false;
    this.showShiftAlert = false;

    this.showTurnInDay = true;
  }


  ngOnDestroy(){
  }

}
