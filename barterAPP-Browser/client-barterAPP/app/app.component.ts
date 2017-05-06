import {Component} from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/views/home.html'

})

export class AppComponent {
      public title: string;
      public description: string;


      constructor(){
        this.title = 'WELCOME TO BARTERAPP';
        this.description = 'Control to your business time';
      }
}
