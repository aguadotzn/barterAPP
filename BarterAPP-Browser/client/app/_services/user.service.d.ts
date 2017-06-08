import { Http } from '@angular/http';
import { AppConfig } from '../app.config';
import { User } from '../_models/index';
export declare class UserService {
    private http;
    private config;
    constructor(http: Http, config: AppConfig);
    getAll(): any;
    getById(_id: string): any;
    create(user: User): any;
    update(user: User): any;
    delete(_id: string): any;
    private jwt();
}
