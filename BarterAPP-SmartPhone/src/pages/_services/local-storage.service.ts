import { Injectable, OnInit } from '@angular/core';
/*RxJS*/
import { Subject } from 'rxjs/Subject';
/*App*/
/*models*/
import { User } from '../models/index';

@Injectable()
export class LocalStorageService {
  private missionAnnouncedSource = new Subject<User>();
  private logoutAnnoucedSource = new Subject<User>();

  loginAnnounced$ = this.missionAnnouncedSource.asObservable();
  logoutAnnounced$ = this.logoutAnnoucedSource.asObservable();

    announceLogin(mission: User) {
    this.missionAnnouncedSource.next(mission);
  }

  announceLogout() {
    this.logoutAnnoucedSource.next(null);
  }
}
