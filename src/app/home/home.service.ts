import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class HomeService{

constructor(private http: HttpClient){}

 drawdate = new BehaviorSubject<Date>(new Date());
 drawInProcess = new BehaviorSubject<boolean>(false);
 drawResult = new BehaviorSubject<{isResult: boolean, result: any}>({isResult: false, result: 0});

getDrawHistory(){
    
    // TODO: Replace below hardcode with actual endpoint call
    const drawHistory = {
        drawTimeHistory: ["10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM", "12:00 PM", "12:15 PM"],
        drawResultHistory: [2,5,4,7,3,9,8,0,1,6]
    }

    return drawHistory;
}

getDrawResult() {

    const drawResult = 4;
    this.abc().subscribe(res => {
        console.log(res);
    })
    return drawResult;
}

abc() {
    const result = this.http.request('get', `${'http://localhost:8080'}/drawResult`, {
        responseType: 'json',
        observe: 'body',
      });
     return result; 
}

}