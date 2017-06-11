//Repository: Calendario metodos http
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

/*RxJS*/
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

/*Calendario*/
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
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

/*App*/
import { AppConfig } from '../app.config';
/*models*/
import { User, EventDTO, MyEvent } from '../_models/index';

// Metodos HTTP para el calendario que conectan con el servidor
// Es una práctica de programación mala el tener todos en un mismo fichero
// pero lo descubri tarde y me daba demasiados errores
@Injectable()
export class CalendarRepository {
  // this currentUser is taken from browser storage look in constructor
  currentUser: User;

  constructor(private http: Http, private config: AppConfig){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getEventsByCompanyByWorker(company: string, username : string){
    return this.http.get(this.config.apiUrl + '/company/'+company+'/'+username +'/events').map((response : Response) => response.json());
  }

  createEvent( params: EventDTO) {
    params.company = this.currentUser.cname;
    params.username = this.currentUser.username;
    return this.http.post(this.config.apiUrl + '/events', params).map(( response: Response ) => response.json());
  }

  deleteEvent( eventId: string){
    return this.http.delete(this.config.apiUrl + '/events/'+ eventId).map(( response ) => response);
  }

  updateEvent( params: MyEvent ){
    return this.http.put(this.config.apiUrl + '/events/'+params._id, {_id: params._id,title: params.title, type: params.type, company: this.currentUser.cname, start: params.start, end: params.end, primary_color: params.color.primary , secondary_color: params.color.secondary, status: params.status}).map(( response ) => response);
  }

  findFreeEventsByDayByShift(day, user){
        return this.http.get(this.config.apiUrl + '/company/'+user.cname+'/events'+'/free/'+day+'/shift/'+user.shift+'/except/'+user.username).map((response : Response) => response.json());
  }

  declineShift(params: MyEvent){
     return  this.http.delete(this.config.apiUrl + '/interchange/'+params.username+'/'+params._id).map((response : Response) => response.json());
  }

  acceptShift(params:  EventDTO){
      return this.http.post(this.config.apiUrl + '/interchange/accept', params).map(( response: Response ) => response.json());
  }

  activateShift(params){
       return this.http.post(this.config.apiUrl + '/interchange/activate', params).map((response: Response) => response.json());
  }

 // Utilizado para las peticiones Pendiente, aceptadas o rechazadas
 // https://stackoverflow.com/questions/41658162/how-to-do-polling-with-angular-2-observables
 initializePolling(company: string, worker : string, status: string): Observable<any>  {
      return Observable
     .interval(6000)
     .flatMap(() => {
                 return this.http.get(this.config.apiUrl +'/company/'+company+'/'+ worker +'/events'+'/special/'+status).map(res => res.json());
         });
   }
}
