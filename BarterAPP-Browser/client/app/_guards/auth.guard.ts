//Guards: controla el acceso a las diferentes rutas
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
          // Usuario logeado, devuelve true
            return true;
        }

      // Usuario no logeado, le devuelve a la pagina de login de nuevo
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
