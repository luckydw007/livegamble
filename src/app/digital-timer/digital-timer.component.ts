import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-digital-timer',
  templateUrl: './digital-timer.component.html',
  styleUrls: ['./digital-timer.component.css']
})
export class DigitalTimerComponent implements OnInit, OnDestroy {

  @Input('drawDate')
  drawDate = new Date();
  @Input('active')
  active = true;

  inProcess = false;
  isResult = false;
  drawResult: any;
  private subscription: Subscription = new Subscription;
  private milliSecondsInASecond = 1000;
  private hoursInADay = 24;
  private minutesInAnHour = 60;
  private SecondsInAMinute  = 60;

  public timeDifference: number = this.drawDate.getTime() - new  Date().getTime(); ;
  public secondsToDday: any;
  public minutesToDday: any;
  public hoursToDday: any;
  public daysToDday: any;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.drawdate.subscribe((res) => {
      this.drawDate = res;
    });
    this.homeService.drawInProcess.subscribe((res) => {
      this.inProcess = res;
      if (res) {
        this.active = false
      } else {
        this._updateTimer();
          this.active = true}
    });
    this.homeService.drawResult.subscribe((res) => {
      this.isResult = res.isResult;
      this.drawResult = res.result;
    });
    this.subscription = interval(1000)
         .subscribe(x => { this._updateTimer(); });      
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // to update the timer
  private _updateTimer () {
    this.timeDifference = this.drawDate.getTime() - new  Date().getTime();
    this._setTimeUnits(this.timeDifference);
  }

  // to set the timer units
  private _setTimeUnits (timeDifference: number) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.secondsToDday = this.secondsToDday < 10 ? '0' + this.secondsToDday : this.secondsToDday;
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.minutesToDday = this.minutesToDday < 10 ? '0' + this.minutesToDday : this.minutesToDday;
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.hoursToDday = this.hoursToDday < 10 ? '0' + this.hoursToDday : this.hoursToDday;
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
}

}
