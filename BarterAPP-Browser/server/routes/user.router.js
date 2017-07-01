'use strict'
module.exports = function(app) {
  var users = require('../controllers/users.controller');
  app.route('/users/authenticate')
    .post(users.authenticate);

  app.route('/users/register')
    .post(users.register);

  app.route('/users')
    .get(users.getAll);

  app.route('/users/current')
    .get(users.getCurrent);

  app.route('/users/:_id')
    .put(users.update);

  app.route('/users/:_id')
    .delete(users._delete);
};
