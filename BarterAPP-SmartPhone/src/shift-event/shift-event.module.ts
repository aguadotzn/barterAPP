import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ShiftEventComponent } from './shift-event';

@NgModule({
  declarations: [
    ShiftEventComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    ShiftEventComponent
  ]
})
export class ShiftEventComponentModule {}
