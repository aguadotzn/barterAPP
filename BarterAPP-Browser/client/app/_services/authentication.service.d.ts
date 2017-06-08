import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';
export declare class AuthenticationService {
    private http;
    private config;
    constructor(http: Http, config: AppConfig);
    login(email: string, password: string): any;
    logout(): void;
}
