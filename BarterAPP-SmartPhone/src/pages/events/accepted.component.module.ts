import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AcceptedComponent } from './accepted.component';

@NgModule({
  declarations: [
    AcceptedComponent,
  ],
  imports: [
    IonicPageModule.forChild(AcceptedComponent),
  ],
  exports: [
    AcceptedComponent
  ]
})
export class AcceptedComponentModule {}
