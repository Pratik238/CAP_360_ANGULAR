import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { rolesEnum } from '../../../models/Enum/roles';
import { User } from '../../../models/interfaces';
import { CustomMegaMenuItem } from '../../../models/interfaces/customMegaMenuItem';
import { AuthenticationService } from '../../../services/authentication.service';
import { MegaMenuService } from '../../../services/mega-menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  //items: CustomMenuItem[];
  selectedItem: string;
  visible = true;
  user: User;
  isLoading = false;
  megaMenuItems: CustomMegaMenuItem[];
  loadAPI: any;
  constructor(
    private megaMenuService: MegaMenuService,
    private authenticationService: AuthenticationService,
    private router: Router) {
    this.authenticationService.user.subscribe(x => this.user = x);
    this.user = this.authenticationService.userValue;
    
  }

  get isAdmin(): boolean {
    return this.user && this.user.Usertype === rolesEnum.Admin;
  }

  ngOnInit() {
    this.loadScript();
    // this.megaMenuItems = this.megaMenuService.getMegaMenuList();

    // const activeMenu = this.sessionService.getItem('active-menu');
    // if (activeMenu) {
    //   this.selectedItem = activeMenu;
    // } else {
    //   this.selectedItem = '/user/topics';
    // }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/home/sign-in']).then(() => {
      window.location.reload();
    });
  }

  activeMenu(event) {
    let node;
    if (event.target.classList.contains('p-menuitem-text') === true) {
      node = 'submenu';
    } else if (event.target.tagName === 'SPAN') {
      node = event.target.parentNode.parentNode;
    } else {
      node = event.target.parentNode;
    }
    // console.log(node);
    if (node !== 'submenu') {
      const menuitem = document.getElementsByClassName('p-menuitem');
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < menuitem.length; i++) {
        menuitem[i].classList.remove('active');
      }
      node.classList.add('active');
    }
  }

  loadScript() {

    // if (!window.document.getElementById('stripe-script')) {
    //   var s = window.document.createElement("script");
    //   s.id = "stripe-script";
    //   s.type = "text/javascript";
    //   s.src = "/assets/home/js/core.min.js";

    //   window.document.body.appendChild(s);
    // }

    // if (!window.document.getElementById('new-script')) {
    //   var slick = window.document.createElement("script");
    //   slick.id = "new-script";
    //   slick.type = "text/javascript";
    //   slick.src = "/assets/home/js/slick.min.js";

    //   window.document.body.appendChild(slick);
    // }

    if (!window.document.getElementById('ui-script-1')) {
      var ui = window.document.createElement("script");
      ui.id = "ui-script-1";
      ui.type = "text/javascript";
      ui.src = "/assets/user/js/script.js";

      window.document.body.appendChild(ui);
    }
  }
}