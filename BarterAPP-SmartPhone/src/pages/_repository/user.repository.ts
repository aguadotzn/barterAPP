import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

/*App*/
/*models*/
import { User } from '../models/index';
import { AppConfig} from '../config/app.config';
/*services*/
import { IonicLocalStorageService } from '../_services/index';

@Injectable()
export class UserRepository {
    constructor(private http: Http, private ionicLocalStorageService: IonicLocalStorageService) { }

    getAll() {
        return this.http.get( AppConfig.apiUrl+  '/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get( AppConfig.apiUrl+ '/users/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(AppConfig.apiUrl+ '/users/register', user);
    }

    update(user: User) {
        return this.http.put( AppConfig.apiUrl+ '/users/' + user._id, user, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(AppConfig.apiUrl+  '/users/' + _id, this.jwt());
    }

    private jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.ionicLocalStorageService.getUser().then(value => currentUser = JSON.parse(value));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
