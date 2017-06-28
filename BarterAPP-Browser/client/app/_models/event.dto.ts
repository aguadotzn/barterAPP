export interface EventDTO {
  _id?: string | number;
  start: Date;
  end: Date;
  title: string;
  primary_color: string;
  secondary_color: string;
  draggable: boolean;
  resizable_beforeStart: boolean;
  resizable_afterEnd: boolean;
  company: string;
  type: string;
  username: string;
  status: string;
  sender: string;
  turn_in_day: string;

}
