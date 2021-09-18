import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "./user.model";

interface LoginResponseData {
    idToken: string;
    email: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root'})
export class LoginService {

    user = new BehaviorSubject<User>(null!);
    constructor(private http: HttpClient) {}
    login(email: string, password: string) {

        // TODO: Remove this hard Code
        const user = new User("abc@abc.com", "sampleToken", true);
        this.user.next(user);
        const resData = { idToken: "sampleToken", email: email, registered: true}
        const loginObservable = new Observable<LoginResponseData>((observer) => {
            observer.next(resData)
        }).pipe(catchError(this.handleError));

        // TODO : setup end point connection
       this.http.post<LoginResponseData>(
        '', 
        {
            email: email,
            password: password
        }
        )
        .pipe(catchError(this.handleError));

        
        loginObservable.subscribe(resData => {
            const resData1 = resData;
            const user = new User("abc@abc.com", "sampleToken", true);
            this.user.next(user);
        })
        return loginObservable;
        
    }

    logout(){
        this.user.next(null!);
    }

    private handleError (errorRes : HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
            return throwError(errorMessage);
    }

}