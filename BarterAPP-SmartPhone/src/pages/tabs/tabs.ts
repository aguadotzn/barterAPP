import { Component } from '@angular/core';

import { IonicPage, ToastController, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/*App*/
/*pages*/
import { CalendarhomePage} from '../calendarhome/calendarhome';
import { HelpPage } from '../help/help';
import { PendComponent, DeclinedComponent, AcceptedComponent } from '../events/index';
/*services*/
import { EventAggregatorService, IonicLocalStorageService, LocalStorageService } from '../_services/index';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  calendarTab = CalendarhomePage;
  pendingTab  = PendComponent;
  declinedTab = DeclinedComponent;
  acceptedTab = AcceptedComponent;
  currentUser = {'username': 'temp'};

  specialShiftEventsCounter;

  nagivataionController;
  constructor(public navCtrl: NavController, private eventAggregatorService: EventAggregatorService,
              private ionicLocalStorageService: IonicLocalStorageService,
              private localStorageService: LocalStorageService, private alertCtrl: AlertController) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!this.currentUser){
      this.ionicLocalStorageService.getUser().then(value => this.currentUser = JSON.parse(value));
    }
    this.specialShiftEventsCounter  = this.eventAggregatorService.getSpecialShiftEventsCounter();
    this.nagivataionController = navCtrl;
  }

  showHelp(){
    this.navCtrl.push(HelpPage);
  }

  logOut(){
    this.showLogOutAlert();
  }


  showLogOutAlert() {
    let alert = this.alertCtrl.create();
    alert.setTitle('¿Está seguro? ¿Desea abandonar BarterApp?');
    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.logout();
      }
    });
    alert.present();
  }

  logout() {
    // remove Current User Data from browser storage;
    localStorage.removeItem('currentUser');
    // clear browser local storage for current domain
    localStorage.clear();
    this.ionicLocalStorageService.removeUser();
    // emit event to force to clear logged User Data
    this.localStorageService.announceLogout();
    // window.location.href = './login';
    this.navCtrl.pop();


  }

}
