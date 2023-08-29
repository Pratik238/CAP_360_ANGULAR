import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-smartsat',
  templateUrl: './smartsat.component.html',
  styleUrls: ['./smartsat.component.scss']
})
export class SmartsatComponent implements OnInit {

  constructor(private router: Router) {
    // this.loadScript();
   }

  ngOnInit() {
  }
  loadScript() {
   
    if(!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "assets/home/js/core.min.js";
      window.document.body.appendChild(s);
      }
       

      if(!window.document.getElementById('new-script')) {
        var slick = window.document.createElement("script");
        slick.id = "new-script";
        slick.type = "text/javascript";
        slick.src = "assets/home/js/slick.min.js";
        window.document.body.appendChild(slick);
        }
         

      if(!window.document.getElementById('ui-script')) {
        var ui = window.document.createElement("script");
        ui.id = "ui-script";
        ui.type = "text/javascript";
        ui.src = "assets/home/js/script.js";
        window.document.body.appendChild(ui);
        }
    }

    enrollsmartsat(event) {
      this.router.navigate(['/admission-form'], { queryParams: { program: 'SMARTSAT'} });
    }
}
