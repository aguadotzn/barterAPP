// More important file of Angular2. Be alert.
// @author aaguado


import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule} from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { routing, appRoutingProviders} from './app.routing'; //Esto son las rutas



//Declaraciones propias
import { AppComponent }  from './app.component';
import { UsuariosListComponent} from './components/usuarios-list.component';
import { NavBarComponent} from './components/navbar.component';
import { FooterComponent} from './components/footer.component';
import { UsuarioDetailComponent } from './components/usuario-detail.component';
import {UsuarioAddComponent} from './components/usuario-add.component';





@NgModule({
  imports:      [ BrowserModule,
                    FormsModule,
                    HttpModule,
                    JsonpModule,
                    routing
                  ],
  declarations: [ AppComponent,
                  UsuariosListComponent,
                  NavBarComponent,
                  FooterComponent,
                  UsuarioDetailComponent,
                  UsuarioAddComponent,
                 ],

  providers: [appRoutingProviders],

  bootstrap:    [ AppComponent ]
})

export class AppModule { }
