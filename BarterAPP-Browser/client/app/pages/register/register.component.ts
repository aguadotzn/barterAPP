import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

import {SelectItem} from 'primeng/primeng';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {

    model: any = {};
    loading = false;
    private shifts = [{'name': '24 Horas'},
                     {'name': '12 Horas'},
                     {'name': '8 Horas'},
                     {'name': '6 Horas'}];

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) {
    }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registro completado', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }
}
