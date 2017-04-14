"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var usuario_service_1 = require("../services/usuario.service");
var UsuarioDetailComponent = (function () {
    function UsuarioDetailComponent(_usuarioService, _route, _router) {
        this._usuarioService = _usuarioService;
        this._route = _route;
        this._router = _router;
    }
    UsuarioDetailComponent.prototype.ngOninit = function () {
        this.getUsuario();
        console.log('UsuarioDetailComponent cargado correctamente!!');
    };
    //Recogemos los parametros que nos llegan a la url
    UsuarioDetailComponent.prototype.getUsuario = function () {
        var _this = this;
        this._route.params.forEach(function (params) {
            var id = params['id']; //Guardamos en una variable
            _this._usuarioService.getUsuario(id).subscribe(function (response) {
                _this.usuario = response.usuario;
                if (!_this.usuario) {
                    _this._router.navigate(['/']);
                }
            }, function (error) {
                _this.errorMessage = error;
                if (_this.errorMessage != null) {
                    console.log(_this.errorMessage);
                    alert('Error en la peticion del usuario a la base de datos.');
                }
            });
        });
    };
    ;
    return UsuarioDetailComponent;
}()); //getUsuario
UsuarioDetailComponent = __decorate([
    core_1.Component({
        selector: 'usuario-detail',
        templateUrl: 'app/views/usuario-detail.html',
        providers: [usuario_service_1.UsuarioService]
    }),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        router_1.ActivatedRoute,
        router_1.Router])
], UsuarioDetailComponent);
exports.UsuarioDetailComponent = UsuarioDetailComponent;
//# sourceMappingURL=usuario-detail.component.js.map