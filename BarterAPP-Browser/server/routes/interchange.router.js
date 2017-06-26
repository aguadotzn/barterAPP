'use strict';
module.exports = function(app) {
  var interchange = require('../controllers/interchange.controller');


  app.route('/interchange/accept')
  	.post(interchange.accept_shift);

  app.route('/interchange/activate')
  	.post(interchange.activate_shift);

  app.route('/interchange/:acknowledger/:idAcknowledgerEvent')
 //   .get(interchange.get_interchange)
  	.delete(interchange.decline);

};
