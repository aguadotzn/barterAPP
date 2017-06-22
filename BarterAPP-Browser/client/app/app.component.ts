//App.component: fichero obligatorio en angular
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
/*RxJS*/
import { Subscription } from 'rxjs/Subscription';
/*models*/
import { User } from './_models/index';
/*services*/
import { LocalStorageService } from './_services/index';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  //Log in/ Log out
    logInSubscription: Subscription;
    logOutSubscription: Subscription;
    currentUser: User;
  //Constructor
    constructor(private router: Router,  private localStorageService: LocalStorageService) {
      //Comprueba si un usuario hace log in
      //El metodo localStorageService tiene dos observables que emiten eventos
      this.logInSubscription = localStorageService.loginAnnounced$.subscribe(
        currentUser => {
          this.currentUser = currentUser;
        });
      //Comprueba si un usuario hace log out
      //El metodo localStorageService tiene dos observables que emiten eventos
      //Se fuerza a borrar al usuario
      this.logOutSubscription = localStorageService.logoutAnnounced$.subscribe(
        empty => {
          this.currentUser = null;
        });
      //Cuando la aplicacion se inicia o reinicia
      //El metodo JSON.parse crea un JSON del usuario actual
      //https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/JSON/parse
      //localStorage es HTML 5 Local storage https://www.w3schools.com/html/html5_webstorage.asp
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    logout() {
      // elimina los datos del usuario del navegador
      localStorage.removeItem('currentUser');
      localStorage.clear();
      this.localStorageService.announceLogout();
      // Navega a la pantalla principal
      this.router.navigate(['/']);


    }
    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
}
