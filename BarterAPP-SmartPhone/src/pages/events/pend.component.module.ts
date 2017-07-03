import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendComponent } from './index';

@NgModule({
  declarations: [
    PendComponent,
  ],
  imports: [
    IonicPageModule.forChild(PendComponent),
  ],
  exports: [
    PendComponent
  ]
})
export class PendComponentModule {}
