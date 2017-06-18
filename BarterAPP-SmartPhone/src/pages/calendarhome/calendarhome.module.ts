import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarhomePage } from './calendarhome';

@NgModule({
  declarations: [
    CalendarhomePage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarhomePage),
  ],
  exports: [
    CalendarhomePage
  ]
})
export class CalendarhomePageModule {}
