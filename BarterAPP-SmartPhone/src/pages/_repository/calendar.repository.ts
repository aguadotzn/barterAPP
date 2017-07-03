import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';

/*RxJS*/
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

/*App*/
import { AppConfig } from '../config/app.config';
/*models*/
import { User, EventDTO, MyEvent } from '../models/index';
/*services*/
import { IonicLocalStorageService } from '../_services/index';


@Injectable()
export class CalendarRepository {
  currentUser;

  constructor(private http: Http, private ionicLocalStorageService: IonicLocalStorageService){
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.ionicLocalStorageService.getUser().then(value => this.currentUser = value);
  }

  getEventsByCompanyByWorker(company: string, username : string){
    return this.http.get( AppConfig.apiUrl + '/company/'+company+'/'+username +'/events').map((response : Response) => response.json());
  }

  createEvent( params: EventDTO) {
    params.company = this.currentUser.cname;
    params.username = this.currentUser.username;
    return this.http.post(AppConfig.apiUrl + '/events', params).map(( response: Response ) => response.json());
  }

  createEvents( events) {
    return this.http.put(  AppConfig.apiUrl +  '/events', events).map(( response: Response ) => response.json());
  }


  deleteEvent( eventId: string){
    return this.http.delete(  AppConfig.apiUrl +  '/events/'+ eventId).map(( response ) => response);
  }

  deleteEvents( eventIds){
    return this.http.delete(  AppConfig.apiUrl +  '/events/delete/some?ids='+ eventIds).map(( response ) => response);
  }

  updateEvent( params: MyEvent ){
    return this.http.put( AppConfig.apiUrl +  '/events/'+params._id, {_id: params._id,title: params.title, type: params.type, company: this.currentUser.cname, start: params.start, end: params.end, primary_color: params.color.primary , secondary_color: params.color.secondary, status: params.status, turn_in_day: params.turn_in_day}).map(( response ) => response);
  }

  updateEvents( params: Array<any> ){
    return this.http.put( AppConfig.apiUrl +  '/events/all/update', params).map(( response ) => response);
  }

  findFreeEventsByDayByShift(day, turn_in_day, user){
    return this.http.get( AppConfig.apiUrl +  '/company/'+user.cname+'/events'+'/free/'+day+'/shift/'+user.shift+'/turn/'+turn_in_day+'/except/'+user.username).map((response : Response) => response.json());
  }

  declineShift(params: MyEvent){
    return  this.http.delete( AppConfig.apiUrl +  '/interchange/'+params.username+'/'+params._id).map((response : Response) => response.json());
  }

  acceptShift(params:  EventDTO){
    return this.http.post( AppConfig.apiUrl +  '/interchange/accept', params).map(( response: Response ) => response.json());
  }

  activateShift(params){
    return this.http.post( AppConfig.apiUrl +  '/interchange/activate', params).map((response: Response) => response.json());
  }

  initializePolling(company: string, worker : string, status: string): Observable<any>  {
    return Observable
      .interval(6000)
      .flatMap(() => {
        return this.http.get( AppConfig.apiUrl +  '/company/'+company+'/'+ worker +'/events'+'/special/'+status).map(res => res.json());
      });
  }
}
