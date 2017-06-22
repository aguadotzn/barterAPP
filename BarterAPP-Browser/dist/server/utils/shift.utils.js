//utils: variables
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
module.exports = shiftUtils;
//# sourceMappingURL=shift.utils.js.map