import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { CalendarhomePage } from '../calendarhome/calendarhome';

import { AppConfig } from '../config/app.config';

import { Http } from '@angular/http';
import 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  date;

  constructor(private http:Http, public navCtrl: NavController, public alertCtrl: AlertController) {
    this.date = new Date();
  }

  ionViewWillEnter() {
    this.http.get(AppConfig.apiUrl + '/app/users/user')
      .map(res => res.json())
      .subscribe(
        data => {
      },
        err => console.log("error is "+err),
      () => console.log('' )
    );
  }



//Login
  onLoadLogin(){
    this.navCtrl.push(LoginPage);
  }

//Register
  onLoadRegister(){
    this.navCtrl.push(RegisterPage);
  }
//Mostar Calendario
  showCalendar(){
    this.navCtrl.push(CalendarhomePage);
  }



}
