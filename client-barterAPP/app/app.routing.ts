// Configuration of all the routes of the webapp
// @author aaguado
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {UsuariosListComponent} from './components/usuarios-list.component';
import {UsuarioDetailComponent} from './components/usuario-detail.component';





//Rutas de la aplicacion
const appRoutes: Routes = [
  {path: '', component: UsuariosListComponent},
  {path: 'usuario/:id', component: UsuarioDetailComponent},
  {path: '**', component: UsuariosListComponent} // Si el usuario introduce

];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
