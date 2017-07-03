import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeclinedComponent } from './index';

@NgModule({
  declarations: [
    DeclinedComponent,
  ],
  imports: [
    IonicPageModule.forChild(DeclinedComponent),
  ],
  exports: [
    DeclinedComponent
  ]
})
export class DeclinedComponentModule {}
