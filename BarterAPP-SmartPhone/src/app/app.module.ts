import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';

/*PrimeNG*/
import { RadioButtonModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { GrowlModule } from 'primeng/primeng';
import { PanelModule } from 'primeng/primeng';
import { SplitButtonModule } from 'primeng/primeng';

/*App*/
import { MyApp } from './app.component';
import { CalendarhomePage } from '../pages/calendarhome/calendarhome';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { HelpPage } from '../pages/help/help';
import { TabsPage } from '../pages/tabs/tabs';

import { AlertComponent } from '../pages/_directives/alert.component';
import { PendComponent, DeclinedComponent, AcceptedComponent } from '../pages/events/index';


import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from '../pages/_utils/demo-utils/module';

/*services*/
import { AlertService, AuthenticationService, LocalStorageService, EventAggregatorService, IonicLocalStorageService } from '../pages/_services/index';

/*repository*/
import { UserRepository, CalendarRepository } from '../pages/_repository/index';

/*utils*/
import { ShiftUtilsService } from '../pages/_utils/shift.utils.service';
import { ShiftEventComponent } from '../shift-event/shift-event';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    CalendarhomePage,
    AlertComponent,
    ShiftEventComponent,
    HelpPage,
    TabsPage,
    PendComponent, DeclinedComponent, AcceptedComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    BrowserAnimationsModule,
    RouterModule,
    CommonModule,
    /*Calendar*/
    CalendarModule.forRoot(),
    DemoUtilsModule,
    /*PrimeNG*/
    RadioButtonModule,
    DialogModule,
    GrowlModule,
    PanelModule,
    SplitButtonModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    CalendarhomePage,
    HelpPage,
    TabsPage,
    PendComponent, DeclinedComponent, AcceptedComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlertService,
    AuthenticationService,
    LocalStorageService,
    /*repository*/
    UserRepository,
    CalendarRepository,
    /*utils*/
    ShiftUtilsService,
    EventAggregatorService,
    IonicLocalStorageService,
    /*pipes*/
    DatePipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
