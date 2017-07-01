var mongo = require('mongoskin');
var shiftUtils = {};
//Colores para los eventos
shiftUtils.shiftColors = { red: { primary: '#ad2121', secondary: '#ffcfcf' },
    blue: { primary: '#1e90ff', secondary: '#cdd5fc' },
    yellow: { primary: '#e3bc08', secondary: '#FDF1BA' },
    green: { primary: '#00ff01', secondary: '#cce7cc' } };
/*
 Assigned shifts :  Asignado conforme Color: Azul
 Desired free shifts : Asignado eliminar Color: Amarillo
 Untouchable free shifts : Intocable Color: rojo
 Free Shifts : Libre Color: Verde
 */
// tipo de eventos
shiftUtils.shiftTypes = { assigned: 'Assigned shifts', desired: 'Desired free shifts', untouchable: 'Untouchable free shifts', free: 'Free Shifts' };
//shiftUtils.shiftTypes = {assigned: 'Asignado Conforme', desired: 'Asignado Eliminar', untouchable: 'Intocable', free: 'Día libre'};
//prioridades
shiftUtils.eventStatus = { normal: 'normal', pending: 'pending', declined: 'declined', accepted: 'accepted', required: 'required' };
shiftUtils.idsArrayFromReqQueryParam = function (reqQuery) {
    var idsArray = reqQuery.split(",");
    var objectIdsArray = [];
    for (var _i = 0, idsArray_1 = idsArray; _i < idsArray_1.length; _i++) {
        var id = idsArray_1[_i];
        console.log("id :" + id);
        objectIdsArray.push(mongo.ObjectID.createFromHexString(id));
    }
    return objectIdsArray;
};
shiftUtils.idsArrayFromEvents = function (events) {
    var objectIdsArray = [];
    for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
        var event_1 = events_1[_i];
        console.log("id :" + JSON.stringify(event_1._id));
        objectIdsArray.push(mongo.ObjectID.createFromHexString(event_1._id));
    }
    return objectIdsArray;
};
shiftUtils.removeIdsFromEvent = function (events) {
    var eventsWithoutId = [];
    for (var _i = 0, events_2 = events; _i < events_2.length; _i++) {
        var event_2 = events_2[_i];
        delete event_2._id;
        console.log("event after deleting id:" + event_2);
        eventsWithoutId.push(event_2);
    }
    return eventsWithoutId;
};
module.exports = shiftUtils;
//# sourceMappingURL=shift.utils.js.map