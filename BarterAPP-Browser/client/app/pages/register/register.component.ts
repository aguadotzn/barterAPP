//Pages: Registro
//http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
import { Component } from '@angular/core';
import { Router } from '@angular/router';

/*services*/
import { AlertService } from 'app/_services/index';
/*repository*/
import { UserRepository } from 'app/repository/index';
/*utils*/
import { ShiftUtilsService } from 'app/utils/shift.utils.service';

@Component({
  moduleId: module.id,
  templateUrl: 'register.component.html'
})

export class RegisterComponent {
  model: any = {};
  loading = false;
  // Para el tipo de turnos que tiene la empresa
  shifts;

  constructor(
    private router: Router,
    private userRepository: UserRepository,
    private alertService: AlertService,
    private shiftUtilsService: ShiftUtilsService) {
    this.shifts = shiftUtilsService.getShifts();
  }

  register() {
    this.loading = true;
    this.userRepository.create(this.model)
      .subscribe(
        data => {
          this.alertService.success('Registro completado.', true);
          this.router.navigate(['/login']);
        },
        error => {
          this.alertService.error(error._body);
          this.loading = false;
        });
  }
}
