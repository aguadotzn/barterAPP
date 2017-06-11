//Servicios: servicio para acceder al navegador a través de las cookies
//Fuente: https://github.com/grevory/angular-local-storage
import { Injectable, OnInit } from '@angular/core';
/*RxJS*/
import { Subject } from 'rxjs/Subject';

/*models*/
import { User } from '../_models/index';
@Injectable()
export class LocalStorageService {

  private missionAnnouncedSource = new Subject<User>();
  private logoutAnnoucedSource = new Subject<User>();

  loginAnnounced$ = this.missionAnnouncedSource.asObservable();
  logoutAnnounced$ = this.logoutAnnoucedSource.asObservable();

  announceLogin(mission: User) {
    //El metodo next notifica a los usuarios
    this.missionAnnouncedSource.next(mission);
  }

  announceLogout() {
    this.logoutAnnoucedSource.next(null);
  }
}
