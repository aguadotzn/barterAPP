import { Router } from '@angular/router';
import { Observable } from 'rxjs';
export declare class AlertService {
    private router;
    private subject;
    private keepAfterNavigationChange;
    constructor(router: Router);
    success(message: string, keepAfterNavigationChange?: boolean): void;
    error(message: string, keepAfterNavigationChange?: boolean): void;
    getMessage(): Observable<any>;
}
