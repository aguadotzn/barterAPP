"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var usuarios_list_component_1 = require("./components/usuarios-list.component");
var usuario_detail_component_1 = require("./components/usuario-detail.component");
//Rutas de la aplicacion
var appRoutes = [
    { path: '', component: usuarios_list_component_1.UsuariosListComponent },
    { path: 'usuario/:id', component: usuario_detail_component_1.UsuarioDetailComponent },
    { path: '**', component: usuarios_list_component_1.UsuariosListComponent } // Si el usuario introduce 
];
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map