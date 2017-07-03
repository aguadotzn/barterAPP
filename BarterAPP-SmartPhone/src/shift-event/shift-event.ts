import { Component, OnInit,  Output, ViewEncapsulation, EventEmitter, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

/*App*/
import { MyEvent, ShiftEventModel, EventDTO } from '../pages//models/index';

/*utils*/
import { ShiftUtilsService } from '../pages/_utils/shift.utils.service';

/*services*/
import { IonicLocalStorageService, EventAggregatorService } from '../pages/_services/index';

/*repository*/
import { CalendarRepository } from '../pages/_repository/calendar.repository';


/*PrimeNG*/
import {Message} from 'primeng/primeng';

@Component({
  selector: 'shift-event',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'shift-event.html'
})
export class ShiftEventComponent implements OnInit {

  msgs: Message[] = [];

  @Input("showNormal")
    showNormal:number;

  @Input("shiftEvent")
    shiftEventModel;

  @Output()
    updateDateForDay: EventEmitter<ShiftEventModel> = new EventEmitter();

  @Output()
    deleteEvent: EventEmitter<ShiftEventModel> = new EventEmitter();

  @Output()
    makeNormalOriginalEvent: EventEmitter<MyEvent> = new EventEmitter();

  @Output()
    acceptOriginalEvent: EventEmitter<MyEvent> = new EventEmitter();

  @Output()
    declineOriginalEvent: EventEmitter<MyEvent> = new EventEmitter();

  @Output()
    changeOriginalEvent: EventEmitter<MyEvent> = new EventEmitter();




  currentEvent:MyEvent = null;


  // Tipología de Turnos de la empresa  ["24 Horas", "12 Horas" , "8 Horas", "6 Horas"];
  shifts;

  //Tipos  'Assigned shifts' , 'Desired free shifts', 'Untouchable free shifts', 'Free Shifts'
  /*
   Assigned shifts :  Asignado conforme
   Desired free shifts : Asignado eliminar
   Untouchable free shifts : Intocable
   Free Shifts : Libre
   */
     types;

     // Turnos de un día
  turnInDay;

  // Colores preasignados a cada tipo
  colors;

  text;

  date;
  defaultEmptyEvent:MyEvent;
  forbidChanges:boolean  = false;
  currentUser;

  constructor(private dateTimePipe: DatePipe,
   private shiftUtilsService:ShiftUtilsService,
   private calendarRepository: CalendarRepository,
   private ionicLocalStorageService: IonicLocalStorageService, private eventAggregatorService: EventAggregatorService
  ){
    this.colors = shiftUtilsService.getColors();
    this.shifts = shiftUtilsService.getShifts();
    this.types = shiftUtilsService.getTypes();
    this.turnInDay = shiftUtilsService.getCurrentUserTurnInDay();
        this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));

  }

  ngOnInit(){
    this.currentEvent = this.shiftEventModel.getFirstNormalEvent();
  }

  ionViewWillEnter(){

  }

  ionViewDidLoad() {
    this.currentEvent = this.shiftEventModel.getFirstNormalEvent();
    this.date = new Date();
  }

  public toJson(){
    this.shiftEventModel.shiftEventCollections = null;
  }

  // method is called when user choose  event by turnInDay property
  turnInDayChange(turnInDay): void {
    if(this.findEventByPartInDay(turnInDay)){
      this.forbidChanges = false;
    }else{
      this.forbidChanges = true;
    }
  }

  dateChange(newDate){

    if(this.isAnyEventNoNormal()){
    }else{
      this.changeDateForAll(newDate);
      this.updateDateForDay.next(this.shiftEventModel);
    }

  }


  private changeDateForAll(newDate){
    for(let event of this.shiftEventModel.eventsInOneDay){
      event.start = newDate;
      event.end = newDate;
    }
  }

  private isAnyEventNoNormal(){
    for(let event of this.shiftEventModel.eventsInOneDay){
      if (event.status !== ShiftUtilsService.eventStatus.normal){
        return true;
      }
    }
    return false;
  }

  private findEventByPartInDay(partInDay):boolean{
    for(let event of this.shiftEventModel.eventsInOneDay){
      if (event.status === ShiftUtilsService.eventStatus.normal &&  event.turn_in_day === partInDay){
        this.currentEvent = event;
        return true;
      }
    }
    return false;
  }


  delete(){
    if(this.isAnyEventNoNormal()){
      this.msgs.push({severity:'info', summary:'Tiene eventos pendientes, aceptados o rechazados. Por favor, revíselos.'});
    }else{
      this.deleteEvent.next(this.shiftEventModel);
    }
  }

  makeNormal(index){
  let event = this.shiftEventModel.eventsInOneDay[index];
    let eventStatus = event.status;
    event.sender = "";
    event.status = ShiftUtilsService.eventStatus.normal;

    this.calendarRepository.updateEvent(event).subscribe(result => {
      this.shiftEventModel.eventsInOneDay.splice(index, 1);
      if(eventStatus == 'accepted') {
        this.eventAggregatorService.decreaseByOneAcceptedCounter();
      }else{
        this.eventAggregatorService.decreaseByOneDeclinedCounter();
      }
    });

  }

  accept(index){
  let eventAccepted = this.shiftEventModel.eventsInOneDay[index];
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
      this.shiftEventModel.eventsInOneDay.splice(index, 1);
      this.eventAggregatorService.decreaseByOnePendingCounter();
    });
   // this.acceptOriginalEvent.next(this.shiftEventModel.eventsInOneDay[index]);

  }

  decline(index){
    let eventDeclined = this.shiftEventModel.eventsInOneDay[index];
    this.calendarRepository.declineShift(eventDeclined).subscribe(result => {
      this.shiftEventModel.eventsInOneDay.splice(index, 1);
      this.eventAggregatorService.decreaseByOnePendingCounter();
    });

//    this.declineOriginalEvent.next(this.shiftEventModel.eventsInOneDay[index]);
  }

  valueChange(index){
    this.changeOriginalEvent.next(this.currentEvent);
  }


  /*truco eventos calendario*/
  makeDisabled() {
    if(this.forbidChanges) {
      return {
        "pointer-events": "none",
        opacity : 0.4
      };
    } else {
      return {};
    }
  }



}
