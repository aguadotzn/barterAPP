import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/*App*/
/*services*/
import { AlertService } from '../_services/index';
/*repository*/
import { UserRepository } from '../_repository/index';
/*utils*/
import { ShiftUtilsService } from '../_utils/shift.utils.service';

import { LoginPage } from '../login/login';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

   model: any = {};
   loading = false;
  public shifts;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
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
        this.alertService.success('Registro completado.', false);
          this.navCtrl.push(LoginPage);
      },
        error => {
        this.alertService.error(JSON.stringify(error._body));
        this.loading = false;
      });
  }


  ionViewDidLoad() {
    console.log('');
  }

  moveBack(){
    this.navCtrl.pop();
  }

}
