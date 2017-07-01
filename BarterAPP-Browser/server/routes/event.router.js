'use strict';
// routes: declara acceso a las rutas de los eventos
module.exports = function(app) {
  var events = require('../controllers/event.controller');


  app.route('/events')
    .get(events.list_all_events)
    .put(events.create_events)
    .post(events.create_event);

  app.route('/events/:eventId')
    .put(events.update_event)
    .delete(events.delete_event);
	
  app.route('/events/all/update')
    .put(events.update_events);
	
  app.route('/events/delete/some')
    .delete(events.delete_events);

  app.route('/company/:company/events')
  .get(events.list_all_events_by_company);

  app.route('/company/:company/events/free/:searchDay/shift/:shift/turn/:turn/except/:userName')
  .get(events.list_all_free_events_by_company_by_day_by_shift_except_currentUser);

  app.route('/company/:company/:username/events')
    .get(events.list_all_events_by_company_by_worker);

  app.route('/company/:company/:username/events/special/:status')
     .get(events.list_all_special_events);




};
