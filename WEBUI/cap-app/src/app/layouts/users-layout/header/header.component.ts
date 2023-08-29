import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User;
  userFromApi: User;
  isLoading = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
      this.authenticationService.user.subscribe(x => this.user = x);
      this.user = this.authenticationService.userValue;
  }

  ngOnInit() {
  }

  get isAdmin(): boolean {
      return this.user && this.user.Usertype === rolesEnum.Admin;
  }

  logout() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }

}
