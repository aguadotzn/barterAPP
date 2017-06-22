//app.module: fichero de declaracion de todos los componentes. Fichero obligatorio en angular.
import { Routes, RouterModule } from '@angular/router';

/*App*/

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/index';
import { HomeComponent } from './pages/home/index';
import { RegisterComponent } from './pages/register/index';
import { AngularCalendarComponent } from './pages/angular_calendar/index';

/*Guards*/  // AuthGuard Limita el acceso por parte del usuario
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'calendarhome', component: AngularCalendarComponent, canActivate: [AuthGuard] },
    { path: 'register', component: RegisterComponent },

  // Si no hay nada que coincida, va a la pagina principal
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
