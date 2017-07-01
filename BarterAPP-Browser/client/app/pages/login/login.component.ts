//Pages: Login
/*http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, LocalStorageService } from 'app/_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private localStorageService: LocalStorageService) { }

  ngOnInit() {
    // Reiniciar estado del usuario
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if( currentUser ){ this.returnUrl = '/calendarhome'; }
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser && currentUser.token) {
            this.localStorageService.announceLogin(currentUser);
          }
            this.router.navigateByUrl('/calendarhome');
        },
        error => {
          this.alertService.error(error._body);
          this.loading = false;
        });
  }
}
