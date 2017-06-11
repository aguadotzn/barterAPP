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
import { HomeComponent } from './pages/home/index';
import { RegisterComponent } from './pages/register/index';
import { AngularCalendarComponent } from './pages/angular_calendar/angular_calendar.component';

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
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupModule } from 'ng2-opd-popup';

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
        NgbModalModule.forRoot(),
        NgbDropdownModule.forRoot(),
        PopupModule.forRoot(),
        Ng2Bs3ModalModule,
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
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        AngularCalendarComponent
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
