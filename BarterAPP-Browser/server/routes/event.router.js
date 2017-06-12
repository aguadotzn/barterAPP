// routes: declara acceso a las rutas de los eventos
'use strict'
//   Exportar el objeto app para luego utilizar las rutas (en el fichero server.js)
module.exports = function(app) {
  var events = require('../controllers/event.controller');

  // rutas para eventos (normales)
  app.route('/events')
    .get(events.list_all_events) //Obtener
    .post(events.create_event); //Crear

  app.route('/events/:eventId')
    .put(events.update_event) //Actualizar
    .delete(events.delete_event); //Eliminar

  app.route('/company/:company/events')
  .get(events.list_all_events_by_company); //Obtener

  app.route('/company/:company/events/free/:searchDay/shift/:shift/except/:userName')
  .get(events.list_all_free_events_by_company_by_day_by_shift_except_currentUser); //Obtener

  app.route('/company/:company/:username/events')
    .get(events.list_all_events_by_company_by_worker); //Obtener

  app.route('/company/:company/:username/events/special/:status')
     .get(events.list_all_special_events); //Obtener
}
