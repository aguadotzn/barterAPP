import {Injectable} from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {Usuario} from '../models/usuario';


@Injectable()
export class UsuarioService{
  public url: string;

  constructor(private _http: Http){
      this.url = 'http://localhost:3002/api/';
  }

  //Primero se define previamente aqui, despues en el component que sea
  getUsuarios(){
      return this._http.get(this.url+'usuarios').map(res => res.json());
  }


  //Informacion de un usuario
  getUsuario(id: string){
      return this._http.get(this.url+'usuario/'+id ).map(res => res.json());
  }

  //Añadir un usuario a la db
  addUsuario(usuario: Usuario){
    let json = JSON.stringify(usuario);
    let params = json;
    let headers = new Headers({'Content-type' : 'application/json'});

    return this._http.post(this.url+'usuario', params, {headers: headers})
    .map(res => res.json())
  }


}
