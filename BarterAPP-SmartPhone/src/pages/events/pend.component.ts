/*Angular*/
import { Component, OnInit } from '@angular/core';
/*App*/
/*models*/
import { ShiftEventModel } from '../models/index';
import { IonicPage, ToastController, NavController, NavParams,  } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/*services*/
import { EventAggregatorService } from '../_services/index';

@IonicPage()
@Component({
  templateUrl: 'pend.component.html'
})
export class PendComponent implements OnInit {

  shiftEvents: Array<ShiftEventModel>;
  isEmptyArray: Array<ShiftEventModel>;


  constructor(public navCtrl: NavController, public navParams: NavParams,
  private eventAggregator: EventAggregatorService , public alertCtrl: AlertController){
      this.isEmptyArray = [];
  }

  ionViewWillEnter(){
    this.shiftEvents = this.eventAggregator.getShiftEvents();
    this.isEmptyArray = this.eventAggregator.getShiftEvents().filter(value => this.deepFilter(value));
  }

  deepFilter(shiftEvent) {

    for (let originalEvent of shiftEvent.eventsInOneDay) {
      if (originalEvent.status === 'pending') {
        return true;
      }
    }
    return false;
  }

  ngOnInit(){
	    this.shiftEvents = this.eventAggregator.getShiftEvents();
  }
}
