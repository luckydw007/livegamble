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
        router: RouterStateSnapshot
    ): boolean | UrlTree | Promise< boolean | UrlTree> | Observable< boolean | UrlTree> {
        
        return this.loginService.user.pipe(map(user => {
            const isAuth = !!user;
            if (isAuth){
                return true;
            }
            return this.router.createUrlTree(['/login']);  
        }));

    };
}