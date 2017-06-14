//Utils: Patrón Singleton
import { Injectable } from '@angular/core';

// Un objeto para todo el sistema. Patrón SINGLETON.
@Injectable()
export class ShiftUtilsService {

  //Tipo de turno de la empresa
  private shifts =  ['Turno 24 Horas', 'Turnos 12 Horas', 'Turnos 8 Horas', 'Turnos 6 Horas'];

  // Colores para cada turno
  private  colors = { red: { primary: '#ad2121', secondary: '#ffcfcf'},
                     blue:{ primary: '#1e90ff', secondary: '#cdd5fc'},
                   yellow:{ primary: '#e3bc08', secondary: '#FDF1BA'},
                    green:{ primary: '#00ff01', secondary: '#cce7cc'}};

  // Tipos de eventos/turnos
  private types = [ 'Assigned shifts', 'Desired free shifts', 'Untouchable free shifts', 'Free Shifts'];
/*
Assigned shifts :  Asignado conforme
Desired free shifts : Asignado eliminar
Untouchable free shifts : Intocable
Free Shifts : Libre
*/



  constructor(){}

  getShifts(){
    return this.shifts;
  }

  getColors(){
    return this.colors;
  }

  getTypes(){
    return this.types;
  }
}
