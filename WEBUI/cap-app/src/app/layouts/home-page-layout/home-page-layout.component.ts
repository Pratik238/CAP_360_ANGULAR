import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page-layout',
  templateUrl: './home-page-layout.component.html',
  styleUrls: ['./home-page-layout.component.scss']
})
export class HomePageLayoutComponent implements OnInit {

  constructor() { 
    
  }

  ngOnInit() {
    this.loadCSS();
  }

  loadCSS() {
    var link = document.createElement('link');
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", 'assets/home/css/bootstrap.css');
    document.getElementsByTagName("head")[0].appendChild(link);

    var link1 = document.createElement('link');
    link1.setAttribute("rel", "stylesheet");
    link1.setAttribute("type", "text/css");
    link1.setAttribute("href", 'assets/home/css/fonts.css');
    document.getElementsByTagName("head")[0].appendChild(link1);

    var link2 = document.createElement('link');
    link2.setAttribute("rel", "stylesheet");
    link2.setAttribute("type", "text/css");
    link2.setAttribute("href", 'assets/home/css/style.css');
    document.getElementsByTagName("head")[0].appendChild(link2);
  }
}
