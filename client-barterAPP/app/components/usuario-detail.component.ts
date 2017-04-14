import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';



@Component({
    selector: 'usuario-detail',
    templateUrl: 'app/views/usuario-detail.html',
    providers: [UsuarioService]

})

export class UsuarioDetailComponent implements OnInit{
  public usuario: Usuario; //Aqui guardamos el objeto que nos llega del API
  public errorMessage: string;

  constructor(
    private _usuarioService : UsuarioService ,
    private _route: ActivatedRoute,
    private _router: Router
  ){}

  ngOnInit(){
    this.getUsuario();
    console.log('UsuarioDetailComponent cargado correctamente!!')
  }

  //Recogemos los parametros que nos llegan a la url
  getUsuario(){
    this._route.params.forEach((params: Params) => {
    let id = params['id']; //Guardamos en una variable

    this._usuarioService.getUsuario(id).subscribe(
      response=>{
        this.usuario =  response.usuario;

        if(!this.usuario){ //Si no existiera el usuario
        
        }

      },
        error => {
            this.errorMessage = <any>error;
            if(this.errorMessage != null){
              console.log(this.errorMessage);
              alert('Error en la peticion del usuario a la base de datos.');
            }
        }
      );

      }

    )};
} //getUsuario
