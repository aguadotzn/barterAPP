//Servicios: Autenticacion de usuario
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { AppConfig } from '../app.config';

@Injectable()
export class AuthenticationService {
  constructor(private http: Http, private config: AppConfig) { }

  login(email: string, password: string) {
    return this.http.post(this.config.apiUrl + '/users/authenticate', { email: email, password: password })
      .map((response: Response) => {
        // login correcto si hay un jwt en la respuesta del metodo post
        let user = response.json();
        if (user && user.token) {
          // guarda al usuario y sus detalles en local por medio de jwt aunque la pagina se refresque
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      });
  }

  logout() {
    // elimina al usuario actual de local para hacer el log out
    localStorage.removeItem('currentUser');
  }
}
