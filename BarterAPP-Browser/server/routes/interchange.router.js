'use strict';
//   Exportar el objeto app para luego utilizar las rutas (en el fichero server.js)
module.exports = function(app) {
  var interchange = require('../controllers/interchange.controller');
  // rutas para eventos (intercambiar)
  app.route('/interchange/accept')
  	.post(interchange.accept_shift);

  app.route('/interchange/activate')
  	.post(interchange.activate_shift);

  app.route('/interchange/:acknowledger/:idAcknowledgerEvent')
  	.delete(interchange.decline);
};
