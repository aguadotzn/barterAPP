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

  getUsuarios(){
      return this._http.get(this.url+'usuarios').map(res => res.json());
  }


}
