import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private authFackservice: AuthfakeauthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if (environment.defaultauth === 'firebase') {
        //     const currentUser = this.authenticationService.currentUser();
        //     if (currentUser) {
        //         // logged in so return true
        //         return true;
        //     }
        // } else {
        //     const currentUser = this.authFackservice.currentUserValue;
        //     if (currentUser) {
        //         // logged in so return true
        //         return true;
        //     }
        // }
        if(localStorage.getItem('userData') !== undefined &&
        localStorage.getItem('userData') !== null){
            const currentUser = JSON.parse(localStorage.getItem('userData'));
            if (currentUser) {
                // logged in so return true
                // let truth = false ;  
                // if(currentUser.sRole == 'manager') this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
                // this.router.navigate(['/welcomemanager']));
                // if(currentUser.sRole == 'employee') this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=> {  this.router.navigate(['/welcomeemployee'])
                // return truth;});
               
                // else truth = true ;
                return true;
            }
        }
        // return true;
        
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
