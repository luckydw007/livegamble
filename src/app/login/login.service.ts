import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

const BACKEND_URL = environment.apiUrl;
interface LoginResponseData {
    idToken: string;
    email: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root'})
export class LoginService {

    private isAuthenticated = false;
    private token!: string;
    private tokenTimer!: NodeJS.Timer;
    private authStatusListener = new Subject<boolean>();

    // user = new BehaviorSubject<User>(null!);
    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }
    
    login(email1: string, password1: string) {

        const loginDetails: {email: string, password: string} = {email: email1, password: password1}
        
        this.http
        .post<{token: string; expiresIn: number}>(`${BACKEND_URL}/login`, loginDetails)
        .subscribe(response => {
            const token = response.token;
            this.token = token;
            if( token ) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.authStatusListener.next(true);
                const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
                this.saveAuthData(token, expirationDate);
                // const user = new User(email1, this.token , true);
                // this.user.next(user);
                this.router.navigate(['/admin']);
            }
            
        });        
    }

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (authInformation){
            const now = new Date();
            const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
            if (expiresIn > 0) {
                this.token = authInformation.token;
                this.isAuthenticated = true;
                this.setAuthTimer(expiresIn / 1000);
                this.authStatusListener.next(true);
            }
        } else {
            return;
        }
    }

    logout(){
        // this.user.next(null!);
        this.token = "";
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer)
        this.clearAuthData();
        this.router.navigate(['/login']);
    }

    private setAuthTimer(duration: number){
        this.tokenTimer =  setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private handleError (errorRes : HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred';
            return throwError(errorMessage);
    }

    private saveAuthData(token: string, expirationDate: Date){
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

}