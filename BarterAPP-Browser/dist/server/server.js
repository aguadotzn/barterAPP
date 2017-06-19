require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// JWT auth para el acceso a las rutas (asegurar la app)
app.use(expressJwt({ secret: config.secret }).unless({ path: ['/users/authenticate', '/users/register', /^\/events(\/w*)*/, /^\/company(\/w*)*/, /^\/interchange(\/w*)*/] }));
// rutas
var routesEvent = require('./routes/event.router');
routesEvent(app); // Pasar el objeto app para enlazarse con las  rutas
var routesInterchange = require('./routes/interchange.router');
routesInterchange(app);
app.use('/users', require('./controllers/users.controller'));
// inicio servidor
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
//# sourceMappingURL=server.js.map