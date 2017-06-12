//Pages: Calendario
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

  //Usuario previamente autenticado
  currentUser: User;

  //Variable que crea shiftEvent (con las caracteristicas en /models)
  shiftEvents: ShiftEventModel[] = [];

 // Turnos  ["24 Horas", "12 Horas" , "8 Horas", "6 Horas"];
  shifts;

  //Tipos  'Assigned shifts' , 'Desired free shifts','Untouchable free shifts','Free Shifts'
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

  /* Acciones proporcionadas por el calendario, no se usan
  actions: CalendarEventAction[] = [{
    label: '<i class="fa fa-fw fa-pencil"></i>',
    onClick: ({event}: {event: MyEvent}): void => {
      this.handleEvent('Edited', event);
    }
  }, {
    label: '<i class="fa fa-fw fa-times"></i>',
    onClick: ({event}: {event: MyEvent}): void => {
      this.events = this.events.filter(iEvent => iEvent !== event);
      this.handleEvent('Deleted', event);
    }
  }];*/
