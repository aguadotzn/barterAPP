var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
//var expressJwt = require('express-jwt');
var config = require('./config.js');
var path = require('path');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Me daba un conflicto
//app.use(expressJwt({ secret: config.secret }).unless({ path: ['/users/authenticate','/users/register',/^\/events(\/w*)*/, /^\/company(\/w*)*/, /^\/interchange(\/w*)*/]}));
// rutas
var routesUser = require('./routes/user.router');
routesUser(app);
var routesEvent = require('./routes/event.router');
routesEvent(app);
var routesInterchange = require('./routes/interchange.router');
routesInterchange(app);
//app.use('/users', require('./controllers/users.controller'));
app.use('/', express.static(path.join(__dirname, '../public')));
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/../public/index.html'));
});
//# sourceMappingURL=server.js.map