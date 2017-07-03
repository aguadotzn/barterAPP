import { Injectable } from '@angular/core';
import { ShiftEventModel } from '../models/index';


@Injectable()
export class EventAggregatorService {

  shiftEvents: Array<ShiftEventModel>;

  specialShiftEventsCounter = {"pendingEventCounter": 0, "declinedEventCounter": 0,"acceptedEventCounter": 0};

  constructor() {
    this.shiftEvents = [];
  }

  setShiftEvents(referenceToShiftEvents){
    this.shiftEvents = referenceToShiftEvents;
  }

  getShiftEvents(){
    return this.shiftEvents;
  }

  getSpecialShiftEventsCounter(){
    return this.specialShiftEventsCounter;
  }

  setPendingEventCounter( newPendingEventsAmmount){
    this.specialShiftEventsCounter.pendingEventCounter = newPendingEventsAmmount;
  }

  setDeclinedEventCounter( newDeclinedEventsAmmount){
    this.specialShiftEventsCounter.declinedEventCounter = newDeclinedEventsAmmount;
  }

  setAcceptedEventCounter( newAcceptedEventsAmmount){
    this.specialShiftEventsCounter.acceptedEventCounter = newAcceptedEventsAmmount;
  }


  decreaseByOnePendingCounter(){
    this.specialShiftEventsCounter.pendingEventCounter--;
  }

  decreaseByOneDeclinedCounter(){
    this.specialShiftEventsCounter.declinedEventCounter--;
  }

  decreaseByOneAcceptedCounter(){
    this.specialShiftEventsCounter.acceptedEventCounter--;
  }
}
