import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { rolesEnum } from 'src/app/models/Enum/roles';
import { User } from 'src/app/models/interfaces';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  isShowSuperAdminSubMenu = false;
  isShowReportsSubMenu = false;
  isShowTutorReportsSubMenu = false;
  user: User;
  roles = rolesEnum;

  constructor(private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.user = this.authenticationService.userValue;
    if (this.user.UserId === rolesEnum.SuperAdmin) {
      this.isShowSuperAdminSubMenu = true;
    }
    if (this.user.UserId === rolesEnum.CenterAdmin) {
      this.showSubSubMenu = true;
    }
    if (this.user.UserId === rolesEnum.Tutor) {
      this.showSubmenu = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    } else {
      this.isShowing = true;
    }
  }

  showSubMenu() {
    this.showSubmenu = !this.showSubmenu;
    this.isShowReportsSubMenu =  false;
    this.showSubSubMenu = false;
    this.isShowSuperAdminSubMenu =  false;
    this.isShowTutorReportsSubMenu = false;
  }

  showCenterAdminSubMenu() {
    this.showSubSubMenu = !this.showSubSubMenu;
    this.isShowReportsSubMenu =  false;
    this.isShowSuperAdminSubMenu =  false;
    this.isShowTutorReportsSubMenu = false;
  }

  showSuperAdminSubMenu() {
    this.isShowSuperAdminSubMenu = !this.isShowSuperAdminSubMenu;
    this.isShowReportsSubMenu =  false;
    this.showSubSubMenu = false;
    this.isShowTutorReportsSubMenu = false;
  }

  showReportsMenu() {
    this.isShowReportsSubMenu = !this.isShowReportsSubMenu;
    this.isShowSuperAdminSubMenu =  false;
    this.showSubSubMenu = false;
    this.isShowTutorReportsSubMenu = false;
  }

  showTutorReportsMenu() {
    this.isShowTutorReportsSubMenu = !this.isShowTutorReportsSubMenu;
    this.isShowReportsSubMenu = false;
    this.isShowSuperAdminSubMenu =  false;
    this.showSubSubMenu = false;
  }

  getValidRoutePermission(id) {
    switch (id) {
      case rolesEnum.Admin:
        return true;
      case rolesEnum.User:
        return true;
      case rolesEnum.Tutor:
        return true;
      case rolesEnum.SuperAdmin:
        return true;
      case rolesEnum.CenterAdmin:
        return true;
      default:
        return false;
    }
  }

}
