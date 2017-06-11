//Directivas: muestran alertas, mensajes
import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_services/index';

@Component({
    moduleId: module.id,
    selector: 'alert',
    templateUrl: 'alert.component.html'
})
export class AlertComponent {
    // El mensaje se muestra al usuario
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}
