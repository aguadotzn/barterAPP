//Repository: Calendario metodos http
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

/*App*/
import { AppConfig } from '../app.config';
/*models*/
import { User } from '../_models/index';

// Metodos HTTP para los usuarios que conectan con el servidor para las peticiones
@Injectable()
export class UserRepository {
  constructor(private http: Http, private config: AppConfig) { }

  getAll() {
    return this.http.get(this.config.apiUrl + '/users', this.jwt()).map((response: Response) => response.json());
  }

  getById(_id: string) {
    return this.http.get(this.config.apiUrl + '/users/' + _id, this.jwt()).map((response: Response) => response.json());
  }

  create(user: User) {
    return this.http.post(this.config.apiUrl + '/users/register', user, this.jwt());
  }

  update(user: User) {
    return this.http.put(this.config.apiUrl + '/users/' + user._id, user, this.jwt());
  }

  delete(_id: string) {
    return this.http.delete(this.config.apiUrl + '/users/' + _id, this.jwt());
  }

  // Metodos  privados
  private jwt() {
    // create authorization header with jwt token
    //https://jwt.io/introduction/
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
      return new RequestOptions({ headers: headers });
    }
  }
}
