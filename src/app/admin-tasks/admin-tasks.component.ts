import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.css']
})
export class AdminTasksComponent implements OnInit {

  values = [0,1,2,3,4,5,6,7,8,9];
  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  minutes = ['00', '15', '30', '45'];
  isSubmitDisable  = false;
  private is12AM = false;

  private _drawData: { result: number; time: Date; active: boolean; } = {result: 0, time: new Date(), active: true} 
  constructor(private loginService: LoginService, private router: Router, private homeService: HomeService) { }

  // Draw Data Form
  drawDataForm = new FormGroup({
    drawResult: new FormControl(this.values[0]),
    drawHour: new FormControl(this.hours[0]),
    drawMinutes: new FormControl(this.minutes[0]),
    drawAmPm: new FormControl('AM'),
    drawActive: new FormControl("true"),
  });

  ngOnInit(): void {
    this.loginService.autoAuthUser();
    this.homeService.isSubmitDisable.subscribe( res => {
      this.isSubmitDisable = res;
    });
  }

  onSubmit() {
    const selectedtime =this._drawTime();
    const date = new Date();
    if ( ( selectedtime.getTime() - date.getTime() ) > 0 ) {
      this._setDrawData();
      // TODO: Use EventEmitter with form value
      this.homeService.setDrawResult(this._drawData);
    } else if (selectedtime.getHours() == 0 && selectedtime.getMinutes() == 0){
      this._setDrawData();
      this._drawData.time.setDate(this._drawData.time.getDate()+1);
      this.homeService.setDrawResult(this._drawData);
    }
    else {
      alert("Selected draw time entered in past. Select a correct time")
    }
  }

  onLogout(){
    this.loginService.logout();
  }

  private _setDrawData(){
    this._drawData.result = +this.drawDataForm.controls.drawResult.value;
    this._drawData.time = this._drawTime();
    this._drawData.active = this.drawDataForm.controls.drawActive.value === "true" ? true : false ; 
  }
  
  private _drawTime(): Date{
    let date = new Date();
    const AMPM = this.drawDataForm.controls.drawAmPm.value;
    let hours = this.drawDataForm.controls.drawHour.value;
    if (hours == 12 && AMPM !== 'PM') {
      hours = 0;
    } else if ( hours == 12 && AMPM !== 'AM') {
      hours = 12
    } else {
      hours = AMPM !== 'PM' ? +this.drawDataForm.controls.drawHour.value : +this.drawDataForm.controls.drawHour.value + 12 ;
    }
    const minutes = this.drawDataForm.controls.drawMinutes.value;
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

}
