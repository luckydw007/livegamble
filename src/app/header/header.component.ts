import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  headerName = "Lucky777";
  headerTagline = "Win your Prediction";
  constructor() { }

  ngOnInit(): void {
  }

}
