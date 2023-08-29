import { Component, ElementRef, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  slideConfig = {'slidesToShow': 1, 'autoplay': true, 'autoplayspeed': 400 };

  capProgramInfo: any[] = [
    { titel: 'Increase the odds of acceptance letters with us', header: 'APPLICATION', subHeader: 'BOOT CAMP' },
    { titel: 'CAP360 is the program that transforms the kid into an entrepreneur', header: 'CAP360', subHeader: '' }
  ];

  constructor() {
    // this.loadScript();
    // this.loadJqueryMethod();
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
        //  this.loadJqueryMethod();
        window.document.body.appendChild(ui);

    }

    loadJqueryMethod() {
      $(document).ready(function(){
        $('.multiple-items-c').slick({
           prevArrow:'.prev-c',
              nextArrow:'.next-c',
        infinite: true,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true, 
      
      });  
        })
    }
}
