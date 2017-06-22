//Pages: Calendario principal de la app
//https://github.com/mattlewis92/angular-calendar
//https://github.com/linkedin/oncall
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, AfterViewInit, NgZone, ApplicationRef  } from '@angular/core';

/*RxJS*/
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';

/*App*/
/*models*/
import { User, MyEvent, EventDTO, InterchangeDTO } from 'app/_models/index';
/*services*/
import { CalendarRepository } from 'app/repository/calendar.repository';
/*utils*/
import { ShiftUtilsService } from 'app/utils/shift.utils.service';


/*Bootstrap-ng*/
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

/*Calendar*/
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';

/*PrimeNG*/
import { Message } from 'primeng/primeng';

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['styles.css'],
  templateUrl: 'angular_calendar.component.html'
})
export class AngularCalendarComponent implements AfterViewInit {


  private activeDayIsOpen: boolean = true;
  // Bandera que se asigna en función de la selección del usuario
  showNormalEvent = 0; // 0 - normal, 1 - pending, 2 - decline, 3 - accepted
  // Contadores que muestran en los botones el numero de peticiones
  pendingEventCounter: number = 0; //Pendientes
  declineEventCounter: number = 0; //Rechazadas
  acceptedEventCounter: number = 0; //Aceptadas

  currentUser: User;

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


  constructor(private calendarRepository: CalendarRepository, shiftUtilsService: ShiftUtilsService) {
    this.colors = shiftUtilsService.getColors();
    this.shifts = shiftUtilsService.getShifts();
    this.types = shiftUtilsService.getTypes();
    this.turnInDay = shiftUtilsService.getTurnInDay();
  }

  // Vista por defecto del calendario
  public view = 'month';

  viewDate: Date = new Date();

  // Observable Calenario
  refresh: Subject<any> = new Subject();

  // Todos los eventos que tiene el usuario actual
  events: MyEvent[] = [];


  // msgs PrimeNg growl component
  msgs: Message[] = [];

  // stickymsgs PrimeNg growl component
  stickymsgs: Message[] = [];

  // array de usuarios libres para un evento concreto
  freeUsers: Array<MyEvent> =[];


  // Usuario con el que se elige cambiar
  // (condicion para entrar en el if)
  choosenFreeUser = -1;

  // Bandera para mostrar/ocultar el mensaje
  displayShiftDialog: boolean = false;
  // Alerta: un usuario debe elegir algún usuario con días libres antes
  //de una acción de intercambio. Se usa otra bandera
  alert = "";
  showShiftAlert = false;

  // La misma lógica anterior se aplica a los turnos en los que se separa un día
  showTurnInDay: boolean = true;
  chosenTurn = -1;


  // Cuando el usuario clicka en un día del calendarios
  private eventForChosenDay : MyEvent;
  // Aventos aceptados (es un array puesto que puede existir más de uno)
  acceptedEvents  = [];
  // Aventos rechazados (es un array puesto que puede existir más de uno)
  declineEvents  = [];

  // Se utiliza para sincronizacion
  flagContinue = false;

  /*
   Carga los eventos
   https://angular.io/docs/ts/latest/api/core/index/AfterViewInit-class.html
   */
  ngAfterViewInit(): void {

    this.currentUser = JSON.parse(localStorage.currentUser);
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

        /* Muestra el numero de turnos / dia (numero de circulos)*/
        let dotsCount = this.shifts.indexOf(this.currentUser.shift)+1;
        this.events.push(currentEvent);

      }
      // El calendario se actualiza cuando algún evento cambia
      this.refresh.next();
    });



    this.calendarRepository.initializePolling(this.currentUser.cname, this.currentUser.username, ShiftUtilsService.eventStatus.normal).subscribe(result => {

      //Variables locales para el calendario
      let pendingEvents = [];
      this.acceptedEvents  = [];
      this.declineEvents  = [];

      for (let i = 0; i < result.length; i++){
        // Crear un nuevo evento (variables propias del calendario)
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
        //Switch para controlar el tipo de PETICIONES
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
      // primeNg growl: muestra mensajes
      this.msgs = [];

      // Comprueba si la cantidad de eventos pendientes ha cambiado y lanza un aviso
      if (this.pendingEventCounter < pendingEvents.length){
        this.addMessage({severity:'warn', summary:'Peticiones pendientes!'});
      }
      // Cambia el número de eventos pendientes
      this.pendingEventCounter = pendingEvents.length;

      // Comprueba si la cantidad de eventos rechazados ha cambiado y lanza un aviso
      if (this.declineEventCounter < this.declineEvents.length){
        this.addMessage({severity:'error', summary:'Cambio rechazado.'});
      }
      // Cambia el número de eventos rechazados
      this.declineEventCounter = this.declineEvents.length;

      // Comprueba si la cantidad de eventos aceptados ha cambiado y lanza un aviso
      if (this.acceptedEventCounter < this.acceptedEvents.length){
        this.addMessage({severity:'success', summary:'Cambio aceptado.'});
      }
      // Cambia el número de eventos aceptados
      this.acceptedEventCounter = this.acceptedEvents.length;

      //Nota: los contadores se establecen en el template (ngFor*)



      let originalEvent;
      for (let i= 0; i< this.events.length; i++ ){
        let flag = true;
        let currentEvent = this.events[i];
        // Comprueba eventos pendientes
        for(let j = 0; j < pendingEvents.length; j++){

          //Si encuentra un evento (pendiente) en el calendario
          if(this.isEqual(currentEvent._id, pendingEvents[j]._id)){
            flag = false;
            //Establece el estado y el emisor
            currentEvent.status = pendingEvents[j].status;
            currentEvent.sender = pendingEvents[j].sender;
          }
        }
        // Sincronizacion mientras la variable no cambie
        if(!this.flagContinue){

          // Comprueba eventos rechazados
          for(let j = 0; j < this.declineEvents.length; j++){

            //Si encuentra un evento (rechazado) en el calendario
            if(this.isEqual(currentEvent._id, this.declineEvents[j]._id)){
              flag = false;
              //Establece el estado y el emisor del evento PENDIENTE
              currentEvent.status = this.declineEvents[j].status;
              currentEvent.sender = this.declineEvents[j].sender;
            }
          }

          // Comprueba eventos aceptados
          for(let j = 0; j < this.acceptedEvents.length; j++){

            //Si encuentra un evento (aceptado) en el calendario
            if(this.isEqual(currentEvent._id, this.acceptedEvents[j]._id)){
              flag = false;
              if( currentEvent.status != ShiftUtilsService.eventStatus.accepted){
                // Actualiza el evento
                // aceptado = evento del emisor
                this.updateOriginalEvent( currentEvent, this.acceptedEvents[j], []);
              }
            }
          }
        }
        // Si no es pendiente, ni rechazado ni aceptado, entonces se fuerza a ser normal.
        if(flag &&  currentEvent.status != ShiftUtilsService.eventStatus.required ){
          currentEvent.status = ShiftUtilsService.eventStatus.normal;
          currentEvent.sender = '';
        }
      }


    });

  }

  /*
   Se actualiza el evento original
   */
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



  /*
   Función para aumentar los contadores
   */
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
  // PrimeNG growl: muestra mensaje
  addMessage(messageText){
    this.msgs.push(messageText);
  }
  // PrimeNG growl: muestra mensaje
  addStickyMessage(messageText){
    this.stickymsgs.push(messageText);
  }

  /*
   Cuando el usuario clicka en un día concreto.
   https://github.com/mattlewis92/angular-bootstrap-calendar
   */
  clickedDate;
  possibleDesiredShift;
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
      // RESTRICCIÓN: solo un evento por día
      // Dado que se asume solo se puede trabajar una vez por día
      if(events.length > 0){
        // Buscamos el evento elegido en el array
        this.possibleDesiredShift = this.findDesiredFreeShiftEvents(events);
        if( this.possibleDesiredShift.length == 0){
          return;
        }else{
          this.displayShiftDialog = true;
        }
        this.clickedDate  = date;
      }
    }
  }

  /*
  Metodo para buscar eventos asignados a eliminar
   */
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


  /* Añadir un nuevo evento */
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
      //En el calendario original se establece un fecha de inicio y final
      //aqui no nos interesa, en principio, estas variables
      //Lo que sí hay que hacer es eliminar la fecha y hora
      this.clearDateTime(event.start);
      this.clearDateTime(event.end);

      events.push(event);
    }
    return events;
  }

  // Llamada http para crear el evento en la BD
  addEvent(): void {

    let dayEvents = this.createAllEvents();

    this.calendarRepository.createEvents(dayEvents).subscribe(result => {
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
      }

      // refresh calendar because some event was added
      this.refresh.next();

    });
  }

  /* Eliminar un nuevo evento */
  deleteEvent(index): void {
    // El elemento a eliminar se elimina por un indice establecido en el template (ngFor)
    let eventToDelete = this.events[index];
    // Llamada http para eliminar en la base de datos
    this.calendarRepository.deleteEvent(eventToDelete._id).subscribe(
        result => {
        this.events.splice(index, 1);
        this.refresh.next();
      });




  }

  /* Editar un nuevo evento */
  valueChange(index): void {
    // El elemento a eliminar se elimina por un indice establecido en el template (ngFor)
    let changedEvent = this.events[index];
    // Se cambia el tipo en funcion de las preferencias del usuario
    this.changeTypeEvent(changedEvent);
    //Cuando el usuario cambia la fecha hay que borrarla y crear una nueva
    this.clearDateTime(changedEvent.start);
    // Igual que antes la fecha de inicio = a la fecha final (no nos interesa hacer distinciones)
    this.makeEndDateEqualToStartDate(changedEvent);

    // Llamada http para editar el evento en la BD
    this.calendarRepository.updateEvent(changedEvent).subscribe(result => {
      // Se refresca el calendario por que se ha editado un elemento
      this.refresh.next();
    });
  }


  //Para que la fecha sea igual a la fecha de inicio
  private makeEndDateEqualToStartDate(event: MyEvent){
    event.end = event.start;
  }

  //Actualizar los colores
  private updateTypeColor(event, primaryColor, secondaryColor){

    event.color.primary   = primaryColor;
    event.color.secondary = secondaryColor;
  }

  //Actualizar el evento
  private Event(originalEvent, newEventValue, actions){
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


  // Metodo que cambia el TIPO de evento
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
    /*
    private changeTypeEvent(event){
      switch ( event.type ) {
        case 'Asignado Conforme':
          this.updateTypeColor(event, this.colors.blue.primary, this.colors.blue.secondary);
          break;
        case 'Asignado Eliminar':
          this.updateTypeColor(event, this.colors.yellow.primary, this.colors.yellow.secondary);
          break;
        case 'Intocable':
          this.updateTypeColor(event, this.colors.red.primary, this.colors.red.secondary);
          break;
        case 'Día libre':
          this.updateTypeColor(event, this.colors.green.primary, this.colors.green.secondary);
          break;
        default:
          break;
      }*/


  }

  // Método para cambiar la bandera en función del botón presionado por el usuario
  // normal,pending,declined,accepted
  public showNormal(flag){
    this.showNormalEvent =  flag;
  }

  /*Método peticón aceptada*/
  public accept(index) {

    //Cuando se acepta el intercambio debes enviar el evento para intercambiarlo con el evento del receptor
    //por lo tanto la coleccion 'interchange' debe ser usada
    // El evento se elige por un indice establecido en el template (ngFor)
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

    // LLama al método http para intecambiar los eventos
    this.calendarRepository.acceptShift(params).subscribe(result => {
      // Aqui creas el nuevo evento para poder intercambiarlos
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
      // El nuevo evento debe ser "Assigned Shift"
      this.makeAssignedShift(currentEvent);
      // Se escoge el elemento por el índice que éste tiene, establecido en el template (ngFor)
      let event = this.events[index];
      //Se actualiza el evento original con el nuevo evento creado dado que se van a intercambiar no a crear nuevos eventos
      this.updateOriginalEvent(event, currentEvent, []);
      // El contador de pendientes disminuye
      this.pendingEventCounter--;
      // Se refresca el calendario por que los eventos se han intercambiado
      this.refresh.next();
    });

  }

  /*Método peticón rechazada*/
  public decline(index) {
    // Se escoge el elemento por el índice que éste tiene, establecido en el template (ngFor)
    let eventDeclined = this.events[index];

    this.calendarRepository.declineShift(eventDeclined).subscribe(result => {
      //Como se ha rechazado, la prioridad volverá a ser normal
      eventDeclined.status = ShiftUtilsService.eventStatus.normal;
      // El contador de pendientes disminuye
      this.pendingEventCounter--;
    });
    // Se refresca el calendario
    this.refresh.next();
  }


  /*Metodo para buscar eventos libres*/
  public findFreeEvents(date, turn_in_day){
    let choosedDay = date;
    this.clearDateTime(choosedDay);
    // Llamada http para saber turnos libres
    this.calendarRepository.findFreeEventsByDayByShift(choosedDay.toISOString(), turn_in_day ,this.currentUser).subscribe(result => {
      // Comprobamos si hay alguien con turnos libres
      if(result.length > 0){
        // Si hay, guardamos en el array usuarios
        this.freeUsers = result;
        // Se muestra ventana para escoger usuarios
        this.displayShiftDialog = true;
      }else{
        // No hay dias libres
        this.freeUsers = [];
        this.addMessage({severity:'warn', summary:'No existen usuarios libres para este dia. '});
      } this.refresh.next();
    });

  }

  // Se busca el elemento escogido en el array donde es almacenan los eventos
  findEventById(id){
    for(let i = 0; i < this.events.length; i++){
      let event = this.events[i];
      if(this.isEqual(event._id, id)){
        return event;
      }

    }
    return null;
  }

  //Metodo para comprobar si un evento es igual a otro
  private isEqual(event1Id, event2Id){
    return event1Id === event2Id;
  }

  //Solo un evento por dia (buscar evento por fecha)
  private findEventByDate(date){
    for(let i = 0; i < this.events.length; i++){
      let event = this.events[i];
      if(date.toISOString() === event.start.toISOString()){
        return event;
      }

    }
    return null;

  }

  // Cambiar el estado de un evento (por id y estado del mismo)
  private changeEventStatusById(id, status){
    for(let i = 0; i < this.events.length; i++){
      let event = this.events[i];
      if(this.isEqual(event._id ,id)){
        event.status = status;
      }

    }
  }

  // Cambiar el estado de un evento (por fecha)
  private changeEventStatusByDate(date, status){

    for(let i = 0; i < this.events.length; i++){
      let event = this.events[i];
      if(date.toISOString() === event.start.toISOString()){
        event.status  = status;
        break;
      }

    }
    return
  }

  /* El calendario funciona un poco raro y cada vez que un usuario
   edita una fecha, guarda automaticamente la hora del usuario por defecto.
   De ahi este metodo que debe establecer a cero la fecha. Así se
   evitan errores innecesarios.*/
  private clearDateTime(d){
    d.setSeconds(0);
    d.setMilliseconds(0);
    d.setHours(0);
    d.setMinutes(0);

  }

  /*Ventana de envio de petición de cambio*/
  public activateShift(){
    //Comprobamos que existan usuarios para activar la ventana
    if (this.choosenFreeUser == -1){
      this.showShiftAlert = true;
      //Si el usuario no elige se muestar un mensaje
      this.alert = "Por favor, elija un usuario.";
      return;
    }
    // Se cierra la ventana, se ha enviado la petición
    this.displayShiftDialog = false;
    // Se cierra el aviso
    this.showShiftAlert = false;

    // Se muestra el turno del día
    this.showTurnInDay = true;

    // Se escoge el evento "libre" del usuario que se ha seleccionado para intercambio
    let selectedEvent:MyEvent = this.freeUsers[this.choosenFreeUser];

    // Se crea el intercambiao
    // El valor de la variable es ahora pendiente, por que falta confirmación
    let interchangeObject = <InterchangeDTO  > {
      requestor             : this.eventForChosenDay.username,
      acknowledger          : selectedEvent.username,
      requestor_event_id    : this.eventForChosenDay._id,
      acknowledger_event_id : selectedEvent._id,
      status: ShiftUtilsService.eventStatus.pending
    };

    // Se cambia estado del evento por ID
    this.changeEventStatusById(this.eventForChosenDay._id, 'required');

    // Llamada http para intercambiar turnos
    this.calendarRepository.activateShift(interchangeObject).subscribe(result => {

      // Se refresca el calendario
      this.refresh.next();
    });
    // El array de usuarios libres pasara a estar vacío
    this.freeUsers = [];
    // El usuario elegido pasa a tener valor de -1 de nuevo
    this.choosenFreeUser = -1;
    this.refresh.next();
  }

  /*Método para cuando el usuario presiona ok*/
  makeNormal(index){

    this.flagContinue = true;
    // El elemento buscado se busca por un indice establecido en el template (ngFor)
    let event = this.events[index];
    // Elimina el emisor
    event.sender = "";
    //El evento pasara a tener prioridad normal
    event.status = ShiftUtilsService.eventStatus.normal;

    // Llamada http para actualizar el evento
    this.calendarRepository.updateEvent(event).subscribe(result => {
      // Actualiza el calendario por que ha cambiado el evento
      this.refresh.next();

      // Sincronizacion, todos los eventos deben tener prioridad normal
      let originalEvent = this.events[index];
      for(let j = 0; j < this.declineEvents.length; j++){ //Aceptados
        if(originalEvent._id == this.declineEvents[j]._id){
          this.declineEvents[j].status = ShiftUtilsService.eventStatus.normal;
          this.declineEventCounter--;
        }
      }

      for(let j = 0; j < this.acceptedEvents.length; j++){ //Rechazados
        if(originalEvent._id == this.acceptedEvents[j]._id ){
          this.acceptedEvents[j].status = ShiftUtilsService.eventStatus.normal;
          this.acceptedEventCounter--;
        }
      }

      this.flagContinue = false;
    });
  }

  // Se fuerza a que los eventos sean ASIGNADOS CONFORMES (cuando se produce el intercambio)
  // En realidad esto lo he asumido yo, dado que si has intercambiado un turno
  // se da por hecho que aceptas la operacion con el otro usuario y por tanto debes trabajar
  makeAssignedShift(event) {
    event.type = this.types[0];
    event.color.primary  = this.colors.blue.primary;
    event.color.secondary = this.colors.blue.secondary;
  }

  // No es posible hacer click cuando no hay usuarios libres
  hideActivateShiftButton() {
    return this.freeUsers.length == 0;
  }

  //Establecer eventos
  setTurn(event) {
    this.showTurnInDay = false;
    this.eventForChosenDay = event;
    this.findFreeEvents(this.clickedDate, this.eventForChosenDay.turn_in_day);
  }

  //Cerrar dialogo
  hideDialog(){
    this.displayShiftDialog = false;
    this.showShiftAlert = false;
    this.showTurnInDay = true;
  }
}
