'use strict'
Object.defineProperty(exports, "__esModule", { value: true })
var router_1 = require("@angular/router")
var welcome_component_1 = require("./pages/welcome/welcome.component")
var index_1 = require("./home/index")
var index_2 = require("./login/index")
var index_3 = require("./register/index")
var index_4 = require("./_guards/index")
var appRoutes = [
  { path: '', component: welcome_component_1.WelcomeComponent },
  { path: 'login', component: index_2.LoginComponent },
  { path: 'home', component: index_1.HomeComponent, canActivate: [index_4.AuthGuard] },
  { path: 'register', component: index_3.RegisterComponent },
  // Si no hay nada que coincida, va a la pagina principal
  { path: '**', redirectTo: '' }
]
exports.routing = router_1.RouterModule.forRoot(appRoutes)
// # sourceMappingURL=app.routing.js.map
