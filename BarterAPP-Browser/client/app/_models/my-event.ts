//Models: declaracion de un evento 
import { CalendarEvent } from 'angular-calendar';

export interface MyEvent extends CalendarEvent {
  _id: string;
  type: string;
  username: string;
  status: string;
  sender: string;  //El usuario que ha modificado MyEvent
}
