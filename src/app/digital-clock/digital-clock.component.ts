import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.css']
})
export class DigitalClockComponent implements OnInit {

  private _dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  private _date = new Date();

  public hour: any;
  public minute: string = "";
  public second: string = "";
  public ampm: string = "";
  public day: string = "";
  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this._date = this.homeService.currentTime;
    // call updateClockData method every second
    setInterval(() => {
      this._updateClockData(this.homeService.currentTime);
    }, 1000); 

    // to find out the current Day
    this.day = this._dayArray[this._date.getDay()]; 
    
  }

  private _updateClockData(date: Date){
    const hours = date.getHours();
    this.ampm = hours >= 12 ? 'PM' : 'AM' ;

    // format hours
    this.hour = hours % 12;
    this.hour = this.hour ? this.hour : 12;
    this.hour = this.hour < 10 ? '0' + this.hour : this.hour;

    // format minutes
    const minutes = date.getMinutes();
    this.minute = minutes < 10 ? '0' + minutes : minutes.toString();

    // format seconds
    const seconds = date.getSeconds();
    this.second = seconds < 10 ? '0' + seconds : seconds.toString(); 
  }
}
