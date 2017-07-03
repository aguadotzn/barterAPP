import { CalendarEvent } from 'angular-calendar';

export interface MyEvent extends CalendarEvent {
  _id: string;
  type: string;
  username: string;
  status: string;
  sender: string;
  turn_in_day: string;
}
