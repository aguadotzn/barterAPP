import { Injectable } from '@angular/core';

// Se ha tratado aqui de imitar el patrón SINGLETON. Objetos únicos para todo el sistema que no van a cambiar durante
@Injectable()
export class ShiftUtilsService {

  //Tipo de turno de la empresa
  private shifts =  ["24 Horas", "12 Horas", "8 Horas","6 Horas"];

  private  colors = { red: { primary: '#ad2121', secondary: '#ffcfcf'},
    blue:{ primary: '#1e90ff', secondary: '#cdd5fc'},
    yellow:{ primary: '#e3bc08', secondary: '#FDF1BA'},
    green:{ primary: '#00ff01', secondary: '#cce7cc'}};

  private types = [ 'Assigned shifts', 'Desired free shifts', 'Untouchable free shifts', 'Free Shifts'];
  //private types = [ 'Asignado Conforme', 'Asignado Eliminar', 'Intocable', 'Día libre'];
  /*
   Assigned shifts :  Asignado conforme
   Desired free shifts : Asignado eliminar
   Untouchable free shifts : Intocable
   Free Shifts : Libre
   */

  public static eventStatus = {normal: 'normal', pending: 'pending', declined: 'declined', accepted: 'accepted', required: 'required'};

  public currentUserTurnInDay;

  //Turnos en los que se divide un día en función del tipo de turno de la empresa
  private turnInDay:Map<string, Array<string>> = new Map([
    [this.shifts[0], ["4"]],
    [this.shifts[1], ["1", "2"]],
    [this.shifts[2], ["1", "2", "3"]],
    [this.shifts[3], ["1", "2", "3", "4"]]
  ]);

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

  setCurrentUserTurnInDay(userShift){
    this.currentUserTurnInDay = this.turnInDay.get(userShift);
  }

  getCurrentUserTurnInDay(){
    return this.currentUserTurnInDay;
  }

  getTurnInDay(){
    return this.turnInDay;
  }
}
