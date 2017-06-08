//Servicios: servicio para utilizar el calendario
//Fuente: https://mattlewis92.github.io/angular-calendar/
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { AppConfig } from '../app.config';
import { User } from '../_models/index';
import { UserService } from '../_services/index';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CalendarService {
  currentUser: User;
    users: User[] = [];

  constructor(private http: Http, private config: AppConfig, private userService: UserService){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getEvents( company: String ) {
    return this.http.post(this.config.apiUrl + '/event', {company: this.currentUser.cname, username: this.currentUser.firstName}).map(( response: Response ) => response.json());
  }
  getFreeUsers( searchDay: Date ) {
    return this.http.post(this.config.apiUrl + '/event/frees', {company: this.currentUser.cname, username: this.currentUser.firstName, searchDay: searchDay}).map(( response: Response ) => response.json());
  }
  createEvent( params: CreateEventParams) {
    params.company = this.currentUser.cname;
    params.username = this.currentUser.firstName;
    return this.http.post(this.config.apiUrl + '/event/create', params).map(( response: Response ) => response.json());
  }
  deleteEvent( params: MyEvent): Observable<BackendResult> {
    return this.http.post(this.config.apiUrl + '/event/delete', {title: params.title, index: params.index, company: this.currentUser.cname}).map((response: Response) => response.json());
  }

  moveEvent( params: MyEvent ){
    return this.http.post(this.config.apiUrl + '/event/move', {title: params.title, type: params.type, index: params.index, company: this.currentUser.cname, start: params.start, end: params.end, primary_color: params.color.primary , secondary_color: params.color.secondary}).map(( response ) => response);
  }
}
export interface MyEvent extends CalendarEvent {
  index: number;
  type: string;
  username: string;
}
export interface CreateEventParams {
  id?: string | number;
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
}

export interface BackendResult {
  id: string | number;
  result: string;
  message: string;
}
