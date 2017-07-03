import {  MyEvent } from './index';
import {  ShiftUtilsService } from '../_utils/shift.utils.service';

export class ShiftEventModel {
  startIndex: number;  


  eventsInOneDay:Array<MyEvent> =[];

  originalEventCollection:Array<MyEvent> =[];


  shiftEventCollections: Array<ShiftEventModel> =[];


  constructor(eventsInOneDay:Array<MyEvent>, startIndex, originalEventCollection:Array<MyEvent> ,shiftEventCollections :  Array<ShiftEventModel>){
    this.eventsInOneDay = eventsInOneDay;
    this.startIndex = startIndex;
    this.originalEventCollection = originalEventCollection;
    this.shiftEventCollections = shiftEventCollections;
  }

  public getFirstNormalEvent():MyEvent{
    for(let i=0; i < this.eventsInOneDay.length; i++){
      let event = this.eventsInOneDay[i];
      if(event.status == ShiftUtilsService.eventStatus.normal){
        return event;
      }
    }
    return null;
  }

  public getEventsInOneDay(){
    return this.eventsInOneDay;
  }

  public getStartIndex(){
    return this.startIndex;
  }

  public updateOriginalEvent(originalEvent, newEventValue, actions){
      originalEvent._id    	 = newEventValue._id,
      originalEvent.type      = newEventValue.type,
      originalEvent.title     = newEventValue.title,
      originalEvent.start     = newEventValue.start,
      originalEvent.end       = newEventValue.end,
      originalEvent.color     = newEventValue.color,
      originalEvent.actions   = actions,
      originalEvent.draggable = newEventValue.draggable,
      originalEvent.resizable = newEventValue.resizable,
      originalEvent.username  = newEventValue.username,
      originalEvent.status    = newEventValue.status,
      originalEvent.sender    = newEventValue.sender
  }


  public updateTypeColor(originalEvent, primaryColor, secondaryColor){

    originalEvent.color.primary   = primaryColor;
    originalEvent.color.secondary = secondaryColor;
  }

  public makeEndDateEqualToStartDate(originalEvent){
    originalEvent.end = originalEvent.start;
  }

  public getStartDate(originalEvent){
    return originalEvent.start;
  }

  public getType(originalEvent){
    return originalEvent.type;
  }

  public getStatus(originalEvent){
    return originalEvent.status;
  }

  public setStatus(originalEvent, newStatus){
    originalEvent.status = newStatus;
  }

  public setSender(originalEvent, newSender){
    originalEvent.sender = newSender;
  }

  public isEqual(originalEvent, originalEventId){
    return originalEvent._id == originalEventId;
  }

  public deleteOneSelf(shiftEventsList){
    shiftEventsList.splice(this.startIndex, 1);
  }

  public deleteFromOriginalEventList(originalEventsList){
    let range = this.eventsInOneDay.length;
    let deleteIndex = this.startIndex * range;
    originalEventsList.splice(deleteIndex, range);
  }
}
