//app.module: fichero de declaracion de todos los componentes. Fichero obligatorio en angular.
import { Routes, RouterModule } from '@angular/router';

/*App*/

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/index';
import { HelpComponent } from './pages/help/index';
import { RegisterComponent } from './pages/register/index';
import { AboutComponent } from './pages/about/index';
import { AngularCalendarComponent } from './pages/angular_calendar/index';

/*Guards*/  // AuthGuard Limita el acceso por parte del usuario
import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'about', component: AboutComponent },
    { path: 'help', component: HelpComponent, canActivate: [AuthGuard]  },
    //, canActivate: [AuthGuard]
    { path: 'calendarhome', component: AngularCalendarComponent, canActivate: [AuthGuard]  },
    { path: 'register', component: RegisterComponent },

  // Si no hay nada que coincida, va a la pagina principal
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
