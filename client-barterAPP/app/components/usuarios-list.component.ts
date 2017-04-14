import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';


//Lo primero que tenemos que hacer para usar un servicio dentro de un componente es importarlo
import {UsuarioService} from '../services/usuario.service';
import {Usuario} from '../models/usuario';


@Component({
    selector: 'usuarios-list',
    templateUrl: 'app/views/usuarios-list.html',
    providers: [UsuarioService]

})

export class UsuariosListComponent implements OnInit{
      public title: string;
      public loading: boolean;


      public usuarios: Usuario[];
      public errorMessage: string;

      constructor(private _usuarioService : UsuarioService){
        this.title = 'Lista de usuarios: ';
        this.loading = true;
      }

      ngOnInit(){
        console.log('UsuariosListComponent cargado correctamente!!')
        this._usuarioService.getUsuarios().subscribe(
          result => {
              console.log(result);
              this.usuarios = result.usuarios;

              if(!this.usuarios){
                alert('Error en el servidor');
              }else{
                this.loading = false;
              }
          },
          error => {
              this.errorMessage = <any>error;
              if(this.errorMessage != null){
                console.log(this.errorMessage);
                alert('Error en la peticion de usuarios a la base de datos.');
              }
          }
        );
      }
}
