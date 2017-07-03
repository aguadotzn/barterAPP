import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { AppConfig } from '../config/app.config';

import { IonicLocalStorageService } from './ionic-local-storage.service';


@Injectable()
export class AuthenticationService {
    constructor(private http: Http, private ionicLocalStorageService: IonicLocalStorageService) { }

    login(email: string, password: string) {
        return this.http.post(AppConfig.apiUrl+ '/users/authenticate', { email: email, password: password })
            .map((response: Response) => {
                let user = response.json();
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                  this.ionicLocalStorageService.setUser(JSON.stringify(user));
                }
            });
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.ionicLocalStorageService.removeUser();
    }
}
