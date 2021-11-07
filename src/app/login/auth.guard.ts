import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { LoginService } from "./login.service";

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate {

    constructor(private loginService: LoginService, private router: Router){}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Promise< boolean | UrlTree> | Observable< boolean | UrlTree> {

        const isAuth = this.loginService.getIsAuth();

        if (!isAuth) {
            this.router.navigate(['/login']);
        }
        
        return isAuth;

    };
}