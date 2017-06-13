//Pages: Calendario principal de la app
//https://github.com/mattlewis92/angular-calendar
//https://github.com/linkedin/oncall
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, AfterViewInit, NgZone, ApplicationRef  } from '@angular/core';

/*RxJS*/
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/first';
/*models*/
import { User, ShiftEventModel, MyEvent, EventDTO, InterchangeDTO } from 'app/_models/index';
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

  //Usuario previamente autenticado (Usuario Actual)
  currentUser: User;

  //Variable que crea shiftEvent (con las caracteristicas en /models)
  shiftEvents: ShiftEventModel[] = [];

 // Turnos  ["24 Horas", "12 Horas" , "8 Horas", "6 Horas"];
  shifts;

  //Tipos  'Assigned shifts' , 'Desired free shifts', 'Untouchable free shifts', 'Free Shifts'
  /*
  Assigned shifts :  Asignado conforme
  Desired free shifts : Asignado eliminar
  Untouchable free shifts : Intocable
  Free Shifts : Libre
  */
  types;

  // Colores preasignados a cada tipo
  colors;

  constructor(private calendarRepository: CalendarRepository, shiftUtilsService: ShiftUtilsService) {
    this.colors = shiftUtilsService.getColors();
    this.shifts = shiftUtilsService.getShifts();
    this.types = shiftUtilsService.getTypes();
  }

  // Vista por defecto del calendario
  public view = 'month';

  viewDate: Date = new Date();

  // Calendario
  refresh: Subject<any> = new Subject();

  // todos los eventos que tiene el usuario actual
  events: MyEvent[] = [];


  // msgs PrimeNg growl component
  msgs: Message[] = [];

  // stickymsgs PrimeNg growl component
  stickymsgs: Message[] = [];

  // free users for current date
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
    //Esta funcion se encuentra en el servidor
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
          sender: result[v].sender};

        this.populateSpecificEventsCollections(currentEvent);

        /* Muestra el numero de turnos / dia (numero de circulos)
         Hay que tener en cuenta que funcionalmente
         en la  primera version no sirve para nada*/
        let dotsCount = this.shifts.indexOf(this.currentUser.shift)+1;
        let shiftEvent = new ShiftEventModel(currentEvent, v, dotsCount);
        this.shiftEvents.push(shiftEvent);
        shiftEvent.populateOriginalEventList(this.events);
      }
      // El calendario se actualiza cuando algún evento cambia
      this.refresh.next();
    });

    this.calendarRepository.initializePolling(this.currentUser.cname, this.currentUser.username, 'normal').subscribe(result => {

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
          sender: result[i].sender};

        let element = currentEvent;
        //Switch para controlar el tipo de PETICIONES
        switch(element.status) {
          case "pending": {
            pendingEvents.push(element);
            break;
          }
          case "declined": {
            this.declineEvents.push(element);
            break;
          }
          case "accepted": {
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

      // Comprueba si la cantidad de eventos pendientes ha cambiado
      if (this.pendingEventCounter < pendingEvents.length){
        this.addMessage({severity:'warn', summary:'Pending Events'});
      }
      // Cambia el número de eventos pendientes
      this.pendingEventCounter = pendingEvents.length;

    // Comprueba si la cantidad de eventos rechazados ha cambiado
      if (this.declineEventCounter < this.declineEvents.length){
        this.addMessage({severity:'error', summary:'Declined Events'});
      }
        // Cambia el número de eventos rechazados
      this.declineEventCounter = this.declineEvents.length;

      // Comprueba si la cantidad de eventos aceptados ha cambiado
      if (this.acceptedEventCounter < this.acceptedEvents.length){
        this.addMessage({severity:'success', summary:'Accepted Events'});
      }
        // Cambia el número de eventos aceptados
      this.acceptedEventCounter = this.acceptedEvents.length;

      //Nota: los contadores se establecene en el template (ngFor*)

      let originalEvent;
      for (let i= 0; i< this.shiftEvents.length; i++ ){
        let flag = true;
        let currentShiftEvent = this.shiftEvents[i];
        // Comprueba eventos pendientes
        for(let j = 0; j < pendingEvents.length; j++){

          //Si encuentra un evento (pendiente) en el calendario
          if(currentShiftEvent.isEqual(pendingEvents[j]._id)){
            flag = false; //Cambio la variable
            //Establece el estado y el emisor
            currentShiftEvent.setStatus(pendingEvents[j].status);
            currentShiftEvent.setSender(pendingEvents[j].sender);
          }
        }
        // Sincronizacion mientras la variable no cambie
        if(!this.flagContinue){

              // Comprueba eventos rechazados
          for(let j = 0; j < this.declineEvents.length; j++){

            //Si encuentra un evento (rechazado) en el calendario
            if(currentShiftEvent.isEqual(this.declineEvents[j]._id)){
              flag = false;
            //Establece el estado y el emisor del evento PENDIENTE
              currentShiftEvent.setStatus(this.declineEvents[j].status);
              currentShiftEvent.setSender(this.declineEvents[j].sender);
            }
          }

           // Comprueba eventos aceptados
          for(let j = 0; j < this.acceptedEvents.length; j++){

            //Si encuentra un evento (aceptado) en el calendario
            if(currentShiftEvent.isEqual(this.acceptedEvents[j]._id)){
              flag = false;
              if( currentShiftEvent.getStatus() != 'accepted'){
                // Actualiza el evento
                // aceptado = evento del emisor
                currentShiftEvent.updateOriginalEvent( this.acceptedEvents[j], []);
              }
            }
          }
        }
        // Si no es pendiente, ni rechazado ni aceptado, entonces es normal.
        if(flag &&  currentShiftEvent.getStatus() != 'required' ){
          currentShiftEvent.setStatus('normal');
          currentShiftEvent.setSender('');
        }
      }
    });
  }

/*
Función para aumentar los contadores
*/
  private populateSpecificEventsCollections(currentEvent) {
    switch (currentEvent.status) {
      case "pending":
      {
        this.pendingEventCounter++;
        break;
      }
      case "declined":
      {
        this.declineEventCounter++;
        break;
      }
      case "accepted":
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
        let markedEvent = this.findEventById(events[0]._id);
        // Los tipos, "asignado", "intocable", "libre" no se pueden intercambiar
        if(markedEvent.type != this.types[1]){
         return;
        }
        /*
        Podríamos hacer facilmente que los libre sean intercambiables, pero no tiene sentido
        if(markedEvent.type == this.types[0] || markedEvent.type == this.types[2]){
          return;
        }*/

        // RESTRICCIÓN: Si se ha solitado un cambio, hay que esperar a que el otro usuario responda
        if (markedEvent.status != "normal"){
          this.addStickyMessage({severity:'warn', summary:'Puede solicitar el cambio de turno una sola vez. Ahora debe esperar a que el usuario acepte o rechaze su petición.'});
        }else
        // Comprueba si hay más usuarios con turnos libres, en esa FECHA
        if(events.length == this.shifts.indexOf(this.currentUser.shift)+1 ){
          this.eventForChosenDay = events[0];
          // Busca mas eventos libres
          this.findFreeEvents(date);
        }
      }
    }
  }
  /*
  Metodo que proviene de las acciones, propio del calendario. No se usa.
  handleEvent(action: string, event: MyEvent): void {
    // this.modal.open(this.modalContent, {size: 'lg'});
  }*/

  /* Añadir un nuevo evento */
  addEvent(): void {
    const params: EventDTO = {
      title: 'Turno de ' + this.currentUser.firstName,
      type: 'Assigned shifts',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      primary_color: this.colors.blue.primary,
      secondary_color: this.colors.blue.secondary,
      draggable: true,
      resizable_beforeStart: true,
      resizable_afterEnd: true,
      company: '',
      username: this.currentUser.username,
      status: 'normal',
      sender: ''
    };

    //En el calendario orignal se establece un fecha de inicio y final
    //aqui no nos interesa, en principio, estas variables
    //Lo que sí hay que hacer es eliminar la fecha y hora
    this.clearDateTime(params.start);
    this.clearDateTime(params.end);

    // Llamada http para crear el evento en la BD
    this.calendarRepository.createEvent(params).subscribe(result => {
      let currentEvent = <MyEvent> { _id    : result._id,
        type      : result.type,
        title     : result.title,
        start     : new Date(result.start),
        end       : new Date(result.end),
        color     : { primary : result.primary_color, secondary : result.secondary_color},
        action    : [],
        draggable : result.draggable,
        resizable : {
          beforeStart: result.resizable_beforeStart,
          afterEnd: result.resizable_afterEnd
        },
        username : this.currentUser.username,
        status: result.status,
        sender: result.sender};

      // Aqui se calcula el numero de circulos
      /* Hay que tener en cuenta que funcionalmente
       en la  primera version no sirve para nada*/
      let dotsCount = this.shifts.indexOf(this.currentUser.shift)+1;

      let shiftEvent =  new ShiftEventModel(currentEvent, this.events.length, dotsCount);
      this.shiftEvents.push(new ShiftEventModel(currentEvent, this.events.length, dotsCount));

      shiftEvent.populateOriginalEventList(this.events);

      // Se refresca el calendario por que se han añadido nuevos elementos
      this.refresh.next();

    });
  }

  /* Eliminar un nuevo evento */
  deleteEvent(index): void {
    // El elemento a eliminar se elimina por un indice establecido en el template (ngFor)
    let shiftEvent = this.shiftEvents[index];
    // Llamada http para eliminar en la base de datos
    this.calendarRepository.deleteEvent(shiftEvent.getOriginalEvent()._id).subscribe(
        result => {
        // Se elimina de la lista original
        shiftEvent.deleteFromOriginalEventList(this.events, index);
        shiftEvent.deleteOneSelf(this.shiftEvents, index);
        // Se refresca el calendario por que se han eliminado nuevos elementos
        this.refresh.next();
      });
  }

  // Editar eventos
  valueChange(index): void {
    // El elemento a eliminar se elimina por un indice establecido en el template (ngFor)
    let changedShiftEvent = this.shiftEvents[index];
    // Se cambia el tipo en funcion de las preferencias del usuario
    this.changeTypeShiftEvent(changedShiftEvent);
    //Cuando el usuario cambia la fecha hay que borrarla y crear una nueva
    this.clearDateTime(changedShiftEvent.getStartDate());
    // Igual que antes la fecha de inicio = a la fecha final (no nos interesa hacer distinciones)
    changedShiftEvent.makeEndDateEqualToStartDate();

    // Llamada http para editar el evento en la BD
    this.calendarRepository.updateEvent(changedShiftEvent.getOriginalEvent()).subscribe(result => {
        // Se refresca el calendario por que se ha editado un elemento
      this.refresh.next();
    });
  }

  // Metodo anexo al anterior que cambia el TIPO de evento
  private changeTypeShiftEvent(changedShiftEvent){
    switch ( changedShiftEvent.getType() ) {
      case 'Assigned shifts':
        changedShiftEvent.updateTypeColor(this.colors.blue.primary, this.colors.blue.secondary);
        break;
      case 'Desired free shifts':
        changedShiftEvent.updateTypeColor(this.colors.yellow.primary, this.colors.yellow.secondary);
        break;
      case 'Untouchable free shifts':
        changedShiftEvent.updateTypeColor(this.colors.red.primary, this.colors.red.secondary);
        break;
      case 'Free Shifts':
        changedShiftEvent.updateTypeColor(this.colors.green.primary, this.colors.green.secondary);
        break;
      default:
        break;
    }
  }

  // Metodo para cambiar la bandera en función del botón presionado por el usuario
  // normal,pending,declined,accepted
  public showNormal(flag){
    this.showNormalEvent =  flag;
  }

  /*Método peticón aceptada*/
  public accept(index) {

    //Cuando se acepta el intercambio debes enviar el evento para intercambiarlo con el evento del receptor
    //por lo tanto la coleccion 'interchange' debe ser usada
    // El evento se elige por un indice establecido en el template (ngFor)
    let eventAccepted = this.shiftEvents[index].getOriginalEvent();

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
      sender: eventAccepted.username
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
      let shiftEvent = this.shiftEvents[index];
      //Se actualiza el evento original con el nuevo evento creado dado que se van a intercambiar no a crear nuevos eventos
      shiftEvent.updateOriginalEvent(currentEvent, []);
      // El contador de pendientes disminuye
      this.pendingEventCounter--;
      // Se refresca el calendario por que los eventos se han intercambiado
      this.refresh.next();
    });

  }
  /*Método peticón rechazada*/
  public decline(index) {
    // Se escoge el elemento por el índice que éste tiene, establecido en el template (ngFor)
    let shiftEvent = this.shiftEvents[index];
    let eventDeclined = shiftEvent.getOriginalEvent();
    this.calendarRepository.declineShift(eventDeclined).subscribe(result => {
      //Como se ha rechazado, la prioridad volverá a ser normal
      shiftEvent.setStatus("normal");
        // El contador de pendientes disminuye
      this.pendingEventCounter--;
    });
    // Se refresca el calendario
    this.refresh.next();
  }

  /*Metodo buscar eventos por fecha*/
  public findFreeEvents(date){
    let choosedDay = date;
    // Fecha
    this.clearDateTime(choosedDay);
    // Llamada http para saber turnos libres
    this.calendarRepository.findFreeEventsByDayByShift(choosedDay.toISOString(), this.currentUser).subscribe(result => {
      // Comprobamos si hay alguien con turnos libres
      if(result.length > 0){
        // Si hay, guardamos en el array usuarios
        this.freeUsers = result;
        // Se muestra ventana para escoger usuarios
        this.displayShiftDialog = true;
      }else{
        // No hay dias libres
        this.freeUsers = [];
        this.addMessage({severity:'warn', summary:'No existen usuarios libres para este día. '});
      } this.refresh.next();
    });
  }

  // Se busca el elemento escogido en el array donde es almacenan los eventos
  findEventById(id){
    for(let i = 0; i < this.shiftEvents.length; i++){
      let shiftEvent = this.shiftEvents[i];
      if(shiftEvent.isEqual(id)){
        return shiftEvent.getOriginalEvent();
      }
    }
    return null;
  }

  //Solo un evento por dia (buscar evento por fecha)
  private findEventByDate(date){
    for(let i = 0; i < this.shiftEvents.length; i++){
      let event = this.shiftEvents[i].getOriginalEvent();
      if(date.toISOString() === event.start.toISOString()){
        return event;
      }

    }
    return null;
  }

  // Cambiar el estado de un evento (por id)
  private changeEventStatusById(id, status){
    for(let i = 0; i < this.shiftEvents.length; i++){
      let shiftEvent = this.shiftEvents[i];
      if(shiftEvent.isEqual(id)){
        shiftEvent.setStatus(status);
      }
    }
  }

  // Cambiar el estado de un evento (por fecha)
  private changeEventStatusByDate(date, status){
    for(let i = 0; i < this.shiftEvents.length; i++){
      let shiftEvent = this.shiftEvents[i];
      let event = shiftEvent.getOriginalEvent();
      if(date.toISOString() === event.start.toISOString()){
        shiftEvent.setStatus(status);
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
  activateShift(){
    //Comprobamos que existan usuarios para activar la ventana
    if (this.choosenFreeUser == -1){
      this.showShiftAlert = true;
      //Si el usuario no elige se muestar un mensaje
      this.alert = "Por favor, elija un usuario.";
      return;
    }
    this.alert = "Petición enviada";
    // Se cierra la ventana
    this.displayShiftDialog = false;
    // Se cierra el aviso
    this.showShiftAlert = false;
    // Se escoge el evento "libre" del usuario que se ha seleccionado para intercambio
    let selectedEvent:MyEvent = this.freeUsers[this.choosenFreeUser];

    // Se crea el intercambiao
    // El valor de la variable es ahora pendiente, por que falta confirmación
    let interchangeObject = <InterchangeDTO  > {
      requestor             : this.eventForChosenDay.username,
      acknowledger          : selectedEvent.username,
      requestor_event_id    : this.eventForChosenDay._id,
      acknowledger_event_id : selectedEvent._id,
      status: "pending"
    };

    // Se cambia estado del evento por ID
    this.changeEventStatusById(this.eventForChosenDay._id, 'required');

    // Llamada http para intercambiar turnos
    this.calendarRepository.activateShift(interchangeObject).subscribe(result => {

    // Se refresca
      this.refresh.next();
    });
   // El array de usuarios libres pasara a estar vacío
    this.freeUsers = [];
    // El usuario elegido pasa a tener valor de -1
    this.choosenFreeUser = -1;
    this.refresh.next();
  }

  /*Metodo para cuando el usuario presiona ok*/
  makeNormal(index){
    this.flagContinue = true;
    // El elemento buscado se busca por un indice establecido en el template (ngFor)
    let shiftEvent = this.shiftEvents[index];
    // Elimina el emisor
    shiftEvent.setSender('');
    //El evento pasara a tener prioridad normal
    shiftEvent.setStatus('normal');
    // Llamada http para actualizar el evento
    this.calendarRepository.updateEvent(shiftEvent.getOriginalEvent()).subscribe(result => {
      // Actualiza el calendario por que ha cambiado el evento
      this.refresh.next();
      // Sincronizacion, todos los eventos deben tener prioridad normal
      let originalEvent = this.shiftEvents[index].getOriginalEvent();
      for(let j = 0; j < this.declineEvents.length; j++){
        if(originalEvent._id == this.declineEvents[j]._id){
          this.declineEvents[j].status = "normal";
          this.declineEventCounter--;
        }
      }
      for(let j = 0; j < this.acceptedEvents.length; j++){
        if(originalEvent._id == this.acceptedEvents[j]._id ){
          this.acceptedEvents[j].status = "normal";
          this.acceptedEventCounter--;
        }
      }
      this.flagContinue = false;
    });
  }

  // Se fuerza a que los eventos sean ASINGADOS CONFORMES (cuando se produce el intercambio)
  // En realidad esto lo he asumido yo, dado que si has intercambiado un turno
  // se da por hecho que aceptas la operacion con el otro usuario y por tanto debes trabajar
  makeAssignedShift(event){
    event.type = this.types[0];
    event.color.primary  = this.colors.blue.primary;
    event.color.secondary = this.colors.blue.secondary;
  }

  // No es posible hacer click cuando no hay usuarios libres
  hideActivateShiftButton(){
    return this.freeUsers.length == 0;
  }
}
