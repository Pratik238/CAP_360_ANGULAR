import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.scss']
})
export class GoogleMapsComponent implements OnInit {

  lat = 28.704060;
  long = 77.102493;
  googleMapType = 'satellite';

  constructor() { }

  ngOnInit() {
  }

}
