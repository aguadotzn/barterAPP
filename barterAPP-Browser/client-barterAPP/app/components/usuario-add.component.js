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
var usuario_1 = require("../models/usuario");
var UsuarioAddComponent = (function () {
    function UsuarioAddComponent(_usuarioService, _route, _router) {
        this._usuarioService = _usuarioService;
        this._route = _route;
        this._router = _router;
        this.title = "Añadir usuario nuevo";
    }
    UsuarioAddComponent.prototype.ngOnInit = function () {
        this.usuario = new usuario_1.Usuario("", "", "");
        console.log(this.usuario);
    };
    UsuarioAddComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log(this.usuario);
        this._usuarioService.addUsuario(this.usuario).subscribe(function (response) {
            if (!_this.usuario) {
                alert('Error en el servidor');
            }
            else {
                _this.usuario = response.usuario;
                _this._router.navigate(['/']);
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
                alert('Error al añadir el usuario.');
            }
        });
    };
    return UsuarioAddComponent;
}());
UsuarioAddComponent = __decorate([
    core_1.Component({
        selector: 'usuario-add',
        templateUrl: 'app/views/usuario-add.html',
        providers: [usuario_service_1.UsuarioService]
    }),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService,
        router_1.ActivatedRoute,
        router_1.Router])
], UsuarioAddComponent);
exports.UsuarioAddComponent = UsuarioAddComponent;
//# sourceMappingURL=usuario-add.component.js.map