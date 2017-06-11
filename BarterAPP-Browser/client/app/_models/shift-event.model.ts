//Models: declaracion de un cambio de evento
//es lo mismo que myEvent, creacion de una instancia
import {  MyEvent } from './index';

export class ShiftEventModel {
    originalEvent: MyEvent;  // De donde proviene
    startIndex: number;  // Indice
    range: number;  // Numero

    constructor(originalEvent: MyEvent, startIndex, range){
        this.originalEvent = originalEvent;
        this.startIndex = startIndex;
        this.range = range;
    }

    public getOriginalEvent(){
    	return this.originalEvent;
    }

    public getStartIndex(){
        return this.startIndex;
    }

    public getRange(){
        return this.range;
    }

    public updateOriginalEvent(newEventValue, actions){
    						this.originalEvent._id    	 = newEventValue._id,
                            this.originalEvent.type      = newEventValue.type,
                            this.originalEvent.title     = newEventValue.title,
                            this.originalEvent.start     = newEventValue.start,
                            this.originalEvent.end       = newEventValue.end,
                            this.originalEvent.color     = newEventValue.color,
                            this.originalEvent.actions   = actions,
                            this.originalEvent.draggable = newEventValue.draggable,
                            this.originalEvent.resizable = newEventValue.resizable,
                            this.originalEvent.username  = newEventValue.username,
                            this.originalEvent.status    = newEventValue.status,
                            this.originalEvent.sender    = newEventValue.sender
    }

    //Se utiliza para el numero de circulos que aparecen
    public populateOriginalEventList(originalEventList){
		for(let i = 0; i < this.range; i++){
			originalEventList.push(this.originalEvent);
		  }
    }

    //El color va a ser el mismo
    public updateTypeColor(primaryColor, secondaryColor){
        this.originalEvent.color.primary   = primaryColor;
        this.originalEvent.color.secondary = secondaryColor;
    }

    public makeEndDateEqualToStartDate(){
           this.originalEvent.end = this.originalEvent.start;
    }

    public getStartDate(){
        return this.originalEvent.start;
    }

    public getType(){
        return this.originalEvent.type;
    }

    public getStatus(){
        return this.originalEvent.status;
    }

    public setStatus(newStatus){
       this.originalEvent.status = newStatus;
    }

    public setSender(newSender){
       this.originalEvent.sender = newSender;
    }

    public isEqual(originalEventId){
        return this.originalEvent._id == originalEventId;
    }

    public deleteOneSelf(shiftEventsList, index){
         shiftEventsList.splice(index, 1);
    }

    public deleteFromOriginalEventList(originalEventsList, index){
         let deleteIndex = index * this.range;
         originalEventsList.splice(deleteIndex, this.range);
    }
}
