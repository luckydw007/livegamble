import { Component, OnDestroy, OnInit } from '@angular/core';
import { TextAlignment, TextOrientation } from 'ngx-wheel';
import { Subscription } from 'rxjs';
import { HomeService } from './home/home.service';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Lucky777';
  isLoaded = false;

  private currentTimeLoadSubscription: Subscription = new Subscription;
  constructor(private loginService: LoginService, private homeService: HomeService){}
  
  ngOnInit(){
    this.loginService.autoAuthUser();
    this.homeService.getDrawHistory();
    this.homeService.loadTime();
    this.currentTimeLoadSubscription = this.homeService.currentTimeLoad.subscribe( res => {
      this.isLoaded = res.isLoaded;
    });
  }

  ngOnDestroy() {
    this.currentTimeLoadSubscription.unsubscribe();
    this.homeService.destroy();
  }
  
}