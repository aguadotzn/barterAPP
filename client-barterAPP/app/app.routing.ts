// Configuration of all the routes of the webapp
// @author aaguado
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import { UsuariosListComponent} from './components/usuarios-list.component';
import {UsuarioDetailComponent} from './components/usuario-detail.component';





//Rutas de la aplicacion
const appRoutes: Routes = [
  {path: '', component: UsuariosListComponent},
  {path: '**', component: UsuariosListComponent},
  {path: 'usuario/:id', component: UsuarioDetailComponent}
];


export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
