import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxWheelComponent, TextAlignment, TextOrientation } from 'ngx-wheel';
import { HomeService } from './home.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(NgxWheelComponent, { static: false }) wheel!: NgxWheelComponent;

  seed = [...Array(10).keys()]
  idToLandOn: any;
  items: any[] = [];
  textOrientation: TextOrientation = TextOrientation.CURVED;
  textAlignment: TextAlignment = TextAlignment.OUTER;
  width = 400;
  height = 400;
  iRadius = 50;

  drawDate = new Date();
  active = true;

  drawTimeArr1: string[] = [];
  drawTimeArr2: string[] = [];
  drawResultArr1: number[] = [];
  drawResultArr2: number[] = [];

  
  private subscription1: Subscription = new Subscription;
  private subscription2: Subscription = new Subscription;
  private subscription3: Subscription = new Subscription;
  private subscription4: Subscription = new Subscription;
  private subscription5: Subscription = new Subscription;

  result: any;
  constructor(private homeService: HomeService, public breakpointObserver: BreakpointObserver){}

  ngOnInit(){
    this._getDrawTime(this.homeService.currentTime);
    this._updateResults();
    setTimeout(() => {
      this._updateResults();
    }, 30000 );
    this.items = this.seed.map((value) => ({
      fillStyle: 'goldenrod',
      text: ` ${value} `,
      id: value,
      textFillStyle: 'black',
      textFontSize: '50',
    }))

    this.subscription1 = this.breakpointObserver
      .observe(['(max-width: 700px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.width = 200;
          this.height = 200;
          this.iRadius = 20;
          this.items = this.seed.map((value) => ({
            fillStyle: 'goldenrod',
            text: ` ${value} `,
            id: value,
            textFillStyle: 'black',
            textFontSize: '20',
          }))
        } else {
          this.width = 400;
          this.height = 400;
          
          this.iRadius = 50;
          this.items = this.seed.map((value) => ({
            fillStyle: 'goldenrod',
            text: ` ${value} `,
            id: value,
            textFillStyle: 'black',
            textFontSize: '50',
          }))
        }
      });
  }

  // To Run Spinner. Spinner is availble to run after ViewInit Only
  ngAfterViewInit(){
    const timeLeft = this.drawDate.getTime() - this.homeService.currentTime.getTime();
    this.homeService.getDrawResult();
    if(timeLeft <= 180000 ){
      this.homeService.getDrawResult();
      this.subscription2 = this.homeService.drawResultNumber.subscribe( res => {
        this.result = res;
      });
      setTimeout(() => {
        this._spin();
      }, timeLeft)
    } else {
      setInterval(() => {
        const timeLeft = this.drawDate.getTime() - this.homeService.currentTime.getTime();
        
        if(timeLeft <= 150000 ){
          this.homeService.getDrawResult();
          this.subscription3 = this.homeService.drawResultNumber.subscribe( res => {
            this.result = res;
          });
          setTimeout(() => {
            this._spin();
          }, timeLeft)
        }
      },60000);
    }

    this.subscription4 = this.breakpointObserver
      .observe(['(max-width: 700px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.width = 200;
          this.height = 200;
          this.iRadius = 20;
          this.items = this.seed.map((value) => ({
            fillStyle: 'goldenrod',
            text: ` ${value} `,
            id: value,
            textFillStyle: 'black',
            textFontSize: '20',
          }))
        } else {
          this.width = 400;
          this.height = 400;
          
          this.iRadius = 50;
          this.items = this.seed.map((value) => ({
            fillStyle: 'goldenrod',
            text: ` ${value} `,
            id: value,
            textFillStyle: 'black',
            textFontSize: '50',
          }))
        }
      });
    
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
    this._getDrawTime(this.homeService.currentTime);
    this.homeService.drawResult.next({isResult: true, result: this.result});
    // To Reset Spin after certain Intervel 
    setTimeout(() =>{
      
      this._updateResults();
      this.wheel.reset();
      this.homeService.drawResult.next({isResult: false, result: this.result});
      this.homeService.drawInProcess.next(false);
    }, 10000);
    
  }

  // Update the result Table
  private _updateResults(){
    this.homeService.getDrawHistory();
    this.subscription5 = this.homeService.drawHistory1.subscribe(res => {
      let drawHistory = res;
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
    });
    
  }

  private _getDrawResult() {
    if(!(this.drawDate.getHours() < 8 && this.drawDate.getHours() >= 0) && ((this.drawDate.getMinutes() % 15) > 12 )){
      this.idToLandOn = this.homeService.getDrawResult();
    }
  }

  // Get Next  Draw Time
  private _getDrawTime(currentDate: Date) {
    let date = new Date(currentDate.getTime());
    if(date.getHours() < 10 && date.getHours() >= 0 ){
      date.setHours(10,0,0,0);
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

  ngOnDestroy(){
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    this.subscription4.unsubscribe();
    this.subscription5.unsubscribe();
  }
}
