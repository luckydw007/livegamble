import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(NgxWheelComponent, { static: false }) wheel!: NgxWheelComponent;

  seed = [...Array(10).keys()]
  idToLandOn: any;
  items: any[] = [];
  textOrientation: TextOrientation = TextOrientation.CURVED;
  textAlignment: TextAlignment = TextAlignment.OUTER;
  width = 400;
  height = 400;

  drawDate = new Date();
  active = true;

  drawTimeArr1: string[] = [];
  drawTimeArr2: string[] = [];
  drawResultArr1: number[] = [];
  drawResultArr2: number[] = [];

  private drawStartTime = "10:00 AM";
  private drawEndTime = "12:00 AM";
  private Frequency = 15;

  result: any;
  constructor(private homeService: HomeService){}

  ngOnInit(){
    this._getDrawTime();
    this._updateResults();
    this.items = this.seed.map((value) => ({
      fillStyle: 'goldenrod',
      text: ` ${value} `,
      id: value,
      textFillStyle: 'black',
      textFontSize: '50',
    }))
  }

  // To Run Spinner. Spinner is availble to run after ViewInit Only
  ngAfterViewInit(){
    const timeLeft = this.drawDate.getTime() - new Date().getTime();
    this.homeService.getDrawResult();
    if(timeLeft <= 180000 ){
      this.result = this.homeService.getDrawResult();
      setTimeout(() => {
        this._spin();
      }, timeLeft)
    } else {
      setInterval(() => {
        const timeLeft = this.drawDate.getTime() - new Date().getTime();
        if(timeLeft <= 150000 ){
          this.result = this.homeService.getDrawResult();
          setTimeout(() => {
            this._spin();
          }, timeLeft)
        }
      },150000);
    }
    
  }

  // Spin FUnction
  async _spin() {
    this.idToLandOn = this.result;
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait here for one tick
    this.wheel.spin();
  }

  // Just before the Spin
  before(){
    // To change the text in timer
    this.homeService.drawInProcess.next(true);
  }

  // Just after the Spin
  after() {
    this._getDrawTime();
    this._updateResults();
    this.homeService.drawResult.next({isResult: true, result: this.result});
    // To Reset Spin after certain Intervel 
    setTimeout(() =>{
      this.wheel.reset();
      this.homeService.drawResult.next({isResult: false, result: this.result});
      this.homeService.drawInProcess.next(false);}, 10000);
    
  }

  // Update the result Table
  private _updateResults(){
    const drawHistory = this.homeService.getDrawHistory();
    let drawHistoryCount = drawHistory.drawTimeHistory.length;
    while( drawHistoryCount > 0) {
      if(drawHistoryCount <= 5){
        this.drawTimeArr1[drawHistoryCount-1] = drawHistory.drawTimeHistory[drawHistoryCount-1];
        this.drawResultArr1[drawHistoryCount-1] = drawHistory.drawResultHistory[drawHistoryCount-1];
      }else{
        this.drawTimeArr2[drawHistoryCount-6] = drawHistory.drawTimeHistory[drawHistoryCount-1];
        this.drawResultArr2[drawHistoryCount-6] = drawHistory.drawResultHistory[drawHistoryCount-1];
      }
      drawHistoryCount--;
    }
  }

  private _getDrawResult() {
    if(!(this.drawDate.getHours() < 8 && this.drawDate.getHours() >= 0) && ((this.drawDate.getMinutes() % 15) > 12 )){
      this.idToLandOn = this.homeService.getDrawResult();
    }
  }

  // Get Next  Draw Time
  private _getDrawTime() {
    let date = new Date();
    if(date.getHours() < 8 && date.getHours() >= 0 ){
      date.setHours(8,0,0,0);
    }else{
      const min = Math.floor(date.getMinutes() / 15);
      switch(min) {
        case 0:
          date.setMinutes(15,0,0);
          break;
        case 1:
          date.setMinutes(30,0,0);
          break;
        case 2:
          date.setMinutes(45,0,0);
          break;
        case 3:
          date.setHours(date.getHours()+1,0,0,0);
          break;
        default:
          break;
      }
    }
    // date = new Date();
    // date.setMinutes(date.getMinutes()+3,date.getSeconds()+1,0);
    date.setSeconds(date.getSeconds()+1,0)
    this.drawDate = date;
    this.homeService.drawdate.next(date);
  }
}
