//app.module: fichero de declaracion de todos los componentes. Fichero obligatorio en angular.
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
/*Obligatorios desde Angular 4*/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/*App*/
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AlertComponent } from './_directives/index';

import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from './utils/demo-utils/module';

/*pages*/
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/index';
import { HelpComponent } from './pages/help/index';
import { RegisterComponent } from './pages/register/index';
import { AngularCalendarComponent } from './pages/angular_calendar/angular_calendar.component';
import { AboutComponent } from './pages/about/about.component';

/*routing*/
import { routing } from './app.routing';
import { AuthGuard } from './_guards/index';

/*services*/
import { AlertService, AuthenticationService, LocalStorageService } from './_services/index';

/*repository*/
import { CalendarRepository, UserRepository } from './repository/index';

/*utils*/
import { ShiftUtilsService } from './utils/shift.utils.service';

/*NG Bootstrap*/
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

/*PrimeNG*/
import { RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';


@NgModule({
    imports: [
      /*Obligatorios*/
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      /*Routing*/
       routing,
      /*Calendar*/
        CalendarModule.forRoot(),
        DemoUtilsModule,
      /*NgBootstrap*/
        NgbDropdownModule.forRoot(),
        /*PrimeNG*/
        RadioButtonModule,
        DialogModule,
        GrowlModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        /*pages*/
        WelcomeComponent,
        HelpComponent,
        LoginComponent,
        RegisterComponent,
        AngularCalendarComponent,
        AboutComponent
    ],
    providers: [
        /*App*/
        AppConfig,
        /*guard*/
        AuthGuard,
        /*services*/
        AlertService,
        AuthenticationService,
        LocalStorageService,
        /*repository*/
        UserRepository,
        CalendarRepository,
        /*utils*/
        ShiftUtilsService
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
