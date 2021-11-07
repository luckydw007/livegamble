import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class HomeService{

constructor(private http: HttpClient){}

 drawdate = new BehaviorSubject<Date>(new Date());
 drawInProcess = new BehaviorSubject<boolean>(false);
 drawResult = new BehaviorSubject<{isResult: boolean, result: any}>({isResult: false, result: 0});
 drawHistory1 = new BehaviorSubject<{drawTimeHistory: string[], drawResultHistory: number[], currentTime: Date}>({drawTimeHistory: [],
 drawResultHistory: [], currentTime: new Date()});
 drawResultNumber = new BehaviorSubject<number>(0);
 
 currentTimeLoad = new BehaviorSubject<{currentTime: Date, isLoaded: boolean}>({currentTime: new Date(), isLoaded: false}); 

 
 isSubmitDisable = new BehaviorSubject<boolean>(false);
 currentTime = new Date();
 isTimeLoaded = false;

 private getDrawHistorySubscription: Subscription = new Subscription;
 private getDrawResultSubscription: Subscription = new Subscription;
 private setDrawResultSubscription: Subscription = new Subscription;
 private currentTimeLoadSubscription: Subscription = new Subscription;

getDrawHistory(){
    let drawHistory ;
    this.getDrawHistorySubscription = this.http.get(`${BACKEND_URL}/results/drawHistory`, {
        responseType: 'json',
        observe: 'body',
      })
      .subscribe(res => {
         const formatedRes = JSON.parse(JSON.stringify(res));
         drawHistory = formatedRes;
         this.drawHistory1.next(drawHistory);
         this.currentTimeLoad.next({currentTime: drawHistory.currentTime, isLoaded: true});
      });
    return drawHistory;
}

getDrawResult() {
    this.getDrawResultSubscription = this.http
    .get(`${BACKEND_URL}/results/drawResult`, {
        responseType: 'json',
        observe: 'body',
      })
      .subscribe(res => {
        const drawResult = JSON.parse(JSON.stringify(res));
        this.drawResultNumber.next(drawResult.result);
    })
}

abc() {
    const result = this.http.get(`${BACKEND_URL}/results/drawResult`, {
        responseType: 'json',
        observe: 'body',
      });
     return result; 
}

setDrawResult(drawData: { result: number; time: Date; active: boolean; }){
    this.isSubmitDisable.next(true);
    this.setDrawResultSubscription = this.http
    .post<{message: string }>(`${BACKEND_URL}/results/setDrawResult`, drawData)
    .subscribe(res => {
        alert(res.message);
        this.isSubmitDisable.next(false);
    });
}

loadTime(){
    this.currentTimeLoadSubscription = this.currentTimeLoad.subscribe( res => {
        this.currentTime = new Date(res.currentTime);
        this.isTimeLoaded = res.isLoaded
    } );

    setInterval(() => {
        this.currentTime = new Date(this.currentTime.getTime() + 1000);
      }, 1000); 
}

destroy() {
    this.getDrawHistorySubscription.unsubscribe();
    this.getDrawResultSubscription.unsubscribe();
    this.setDrawResultSubscription.unsubscribe();
    this.currentTimeLoadSubscription.unsubscribe();
}

}