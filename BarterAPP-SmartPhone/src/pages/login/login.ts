import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/*App*/
/*services*/
import { AlertService, AuthenticationService, LocalStorageService, IonicLocalStorageService } from '../_services/index';
/*pages*/
//import { CalendarhomePage } from '../calendarhome/calendarhome';
import { TabsPage } from '../tabs/tabs';

import { RegisterPage } from '../register/register';



@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userModel = {"email": "", "password":""};
  loading = false;
  returnUrl: string;
  currentUser;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private localStorageService: LocalStorageService,
  private ionicLocalStorageService: IonicLocalStorageService, public alertCtrl: AlertController) { }



  ngOnInit() {
    // reset login status

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser){
      this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));
    }

    console.log("currentUser :" + JSON.stringify(this.currentUser));
  }

  ionViewWillEnter() {
    // reset login status
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!this.currentUser){
      this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));
    }
    console.log("currentUser :" + JSON.stringify(this.currentUser));
  }

  ionViewDidLoad() {
    if(!this.currentUser){
      this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));
    }console.log("currentUser :" + JSON.stringify(this.currentUser));
  }


  login() {
    this.loading = true;
    console.log("Users data before send: " + this.userModel);
    this.authenticationService.login(this.userModel.email, this.userModel.password)
      .subscribe(
        data => {
          if (this.currentUser && this.currentUser.token) {
          this.localStorageService.announceLogin(this.currentUser);
        }
         // this.navCtrl.push(CalendarhomePage);
          this.navCtrl.push(TabsPage);
      },
        error => {
          this.alertService.error('Email o contraseña no válidos. Si el problema persiste compruebe su conexión a internet.' , false);
        this.loading = false;
      });
  }

  Register(){
    this.navCtrl.push(RegisterPage);
  }
}
