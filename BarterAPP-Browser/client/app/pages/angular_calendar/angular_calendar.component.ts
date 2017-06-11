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

//Exportar modulo
