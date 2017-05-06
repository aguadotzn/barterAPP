import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params}  from '@angular/router';

import {UsuarioService} from "../services/usuario.service"
import {Usuario} from "../models/usuario";

@Component({
    selector: 'usuario-add',
    templateUrl: 'app/views/usuario-add.html',
    providers: [UsuarioService]

})

export class UsuarioAddComponent implements OnInit{
  public title: string;
  public usuario: Usuario;
  public errorMessage: string;

  constructor(
    private _usuarioService:UsuarioService,
    private _route:ActivatedRoute,
    private _router: Router
  ){
    this.title = "Añadir usuario nuevo";
  }


  ngOnInit(){
    this.usuario = new Usuario("","",""  );
    console.log(this.usuario)
  }

  public onSubmit(){

    console.log(this.usuario);

    this._usuarioService.addUsuario(this.usuario).subscribe(
      response => {
        if(!this.usuario){
          alert('Error en el servidor');
        }else{
          this.usuario =  response.usuario;
          this._router.navigate(['/'])
        }
      },
      error =>{
            this.errorMessage = <any>error;
            if(this.errorMessage != null){
              console.log(this.errorMessage);
              alert('Error al añadir el usuario.');
            }
      }
    );
  }



}
