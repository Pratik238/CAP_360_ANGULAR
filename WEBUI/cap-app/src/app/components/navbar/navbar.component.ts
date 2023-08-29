import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { User } from 'src/app/models/interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public location: Location;
  user: User;
  userFromApi: User;
  isLoading = false;

  constructor(location: Location,  private element: ElementRef, private router: Router,
              private authenticationService: AuthenticationService) {
    this.location = location;
    this.user = this.authenticationService.userValue;
  }

  ngOnInit() {
    this.userFromApi = this.authenticationService.userValue;
    // this.userService.getById(this.user.id).pipe(first()).subscribe(user => {
    this.isLoading = true;
      // this.userFromApi = user;
  // });
  }

  logout() {
    this.authenticationService.logout();
}

}
