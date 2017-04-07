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
//Lo primero que tenemos que hacer para usar un servicio dentro de un componente es importarlo
var usuario_service_1 = require("../services/usuario.service");
var UsuariosListComponent = (function () {
    function UsuariosListComponent(_usuarioService) {
        this._usuarioService = _usuarioService;
        this.title = 'Lista de usuarios: ';
    }
    UsuariosListComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('UsuariosListComponent cargado correctamente!!');
        this._usuarioService.getUsuarios().subscribe(function (result) {
            console.log(result);
            _this.usuarios = result.Usuario;
            if (!_this.usuarios) {
                alert('Error en el servidor');
            }
        }, function (error) {
            _this.errorMessage = error;
            if (_this.errorMessage != null) {
                console.log(_this.errorMessage);
                alert('Error en la peticion de usuarios a la base de datos.');
            }
        });
    };
    return UsuariosListComponent;
}());
UsuariosListComponent = __decorate([
    core_1.Component({
        selector: 'usuarios-list',
        templateUrl: 'app/views/usuarios-list.html',
        providers: [usuario_service_1.UsuarioService]
    }),
    __metadata("design:paramtypes", [usuario_service_1.UsuarioService])
], UsuariosListComponent);
exports.UsuariosListComponent = UsuariosListComponent;
//# sourceMappingURL=usuarios-list.component.js.map