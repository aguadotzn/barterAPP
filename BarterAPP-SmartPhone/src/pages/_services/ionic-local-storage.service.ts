import { Injectable } from '@angular/core';
//import { LocalStorage, Storage } from 'ionic-angular';
import { Storage } from  '@ionic/storage';


@Injectable()
export  class IonicLocalStorageService{

    constructor(private storage: Storage){}

    setUser(user){
      this.storage.set('currentUser', user);
    }

    getUser(){
       return this.storage.get('currentUser').then(value => value);
    }

    removeUser(){
      return this.storage.remove('currentUser');
    }
}
