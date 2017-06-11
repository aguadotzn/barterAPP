//Utils: Patrón Singleton
import { Injectable } from '@angular/core';

// Un objeto para todo el sistema. Patro SINGLETON.
@Injectable()
export class ShiftUtilsService {

  //Tipo de turno de la empresa
  private shifts =  ['24 Hours', '12 Hours', '8 Hours','6 Hours'];

  // Colores para cada turno
  private  colors = { red: { primary: '#ad2121', secondary: '#ffcfcf'},
                     blue:{ primary: '#1e90ff', secondary: '#cdd5fc'},
                   yellow:{ primary: '#e3bc08', secondary: '#FDF1BA'},
                    green:{ primary: '#00ff01', secondary: '#cce7cc'}};

  // Tipos de eventos/turnos
  private types = [ 'Assigned shifts', 'Desired free shifts', 'Untouchable free shifts', 'Free Shifts'];




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
