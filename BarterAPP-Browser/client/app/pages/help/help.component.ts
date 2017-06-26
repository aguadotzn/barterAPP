//Pages: Help
import { Component, OnInit } from '@angular/core';

/*models*/
import { User } from 'app/_models/index';
/*repository*/
import { UserRepository } from 'app/repository/index';

@Component({
    moduleId: module.id,
    templateUrl: 'help.component.html'
})
export class HelpComponent implements OnInit {
    currentUser: User;
    users: User[] = [];

    constructor(private userRepository: UserRepository) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        if (this.currentUser.cname == 'ADMIN' )
            this.loadAllUsers();
    }

    deleteUser(_id: string) {
        this.userRepository.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userRepository.getAll().subscribe(users => { this.users = users; });
    }
}
