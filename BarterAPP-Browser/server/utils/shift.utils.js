var mongo = require('mongoskin');
var shiftUtils = {};

//Colores para los eventos
shiftUtils.shiftColors = { red: { primary: '#ad2121', secondary: '#ffcfcf'},
  blue:{ primary: '#1e90ff', secondary: '#cdd5fc'},
  yellow:{ primary: '#e3bc08', secondary: '#FDF1BA'},
  green:{ primary: '#00ff01', secondary: '#cce7cc'}};
  /*
   Assigned shifts :  Asignado conforme Color: Azul
   Desired free shifts : Asignado eliminar Color: Amarillo
   Untouchable free shifts : Intocable Color: rojo
   Free Shifts : Libre Color: Verde
   */



// tipo de eventos
shiftUtils.shiftTypes = {assigned: 'Assigned shifts', desired: 'Desired free shifts', untouchable: 'Untouchable free shifts', free: 'Free Shifts'};
//shiftUtils.shiftTypes = {assigned: 'Asignado Conforme', desired: 'Asignado Eliminar', untouchable: 'Intocable', free: 'Día libre'};

//prioridades
shiftUtils.eventStatus = {normal: 'normal', pending: 'pending', declined: 'declined', accepted: 'accepted', required: 'required'};

shiftUtils.idsArrayFromReqQueryParam = function(reqQuery){
  var idsArray = reqQuery.split(",");
  var objectIdsArray = [];
  for(let  id of idsArray){
    console.log("id :" +id);
    objectIdsArray.push(mongo.ObjectID.createFromHexString(id));
  }
  return objectIdsArray;
};

shiftUtils.idsArrayFromEvents = function(events){
  var objectIdsArray = [];
  for(let  event of events){
    console.log("id :" +JSON.stringify(event._id));
    objectIdsArray.push(mongo.ObjectID.createFromHexString(event._id));
  }
  return objectIdsArray;
}

shiftUtils.removeIdsFromEvent = function(events){
  var eventsWithoutId = [];
  for(let event of events){
    delete event._id;
    console.log("event after deleting id:" +event);
    eventsWithoutId.push(event);
  }
  return eventsWithoutId;
}

module.exports = shiftUtils;
