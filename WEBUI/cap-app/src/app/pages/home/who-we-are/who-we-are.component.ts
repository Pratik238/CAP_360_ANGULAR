import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-who-we-are',
  templateUrl: './who-we-are.component.html',
  styleUrls: ['./who-we-are.component.scss']
})
export class WhoWeAreComponent implements OnInit {

  constructor() {
   }

  ngOnInit() {
  }

  loadScript() {
   
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "assets/home/js/core.min.js";
      }
       
      window.document.body.appendChild(s);

      if(!window.document.getElementById('new-script')) {
        var slick = window.document.createElement("script");
        slick.id = "new-script";
        slick.type = "text/javascript";
        slick.src = "assets/home/js/slick.min.js";
        }
        window.document.body.appendChild(slick);
         

      if(!window.document.getElementById('ui-script')) {
        var ui = window.document.createElement("script");
        ui.id = "ui-script";
        ui.type = "text/javascript";
        ui.src = "assets/home/js/script.js";
        }
         
        window.document.body.appendChild(ui);

        
        

    }
}
