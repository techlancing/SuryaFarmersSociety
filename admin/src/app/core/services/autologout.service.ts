import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AutologoutService {
  isLogin = false;

  constructor( private ngZone: NgZone,private router: Router,private oAuthenticationService : AuthenticationService) {
    if(this.isUserLoggedIn()){
      this.isLogin=true;
    }
    this.lastAction(Date.now());
    this.check();
    this.initListener();
    this.initInterval();
    console.log("hi ameen this is created")
   }
   /**
   * last action
   */
  getLastAction() {
    return localStorage.getItem('lastAction');
  }

  /**
   * set last action
   * @param value
   */
  lastAction(value) {
    localStorage.setItem('lastAction', JSON.stringify(value))
  }

  /**
   * start event listener
   */
  initListener() {
    this.ngZone.runOutsideAngular(() => {
      document.body.addEventListener('click', () => this.reset());
      document.body.addEventListener('keyup', () => this.reset());
      document.body.addEventListener('mousemove', () => this.reset());
    });
  }

  /**
   * time interval
   */
  initInterval() {
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        this.check();
      }, 1000);
    })
  }

  /**
   * reset timer
   */
  reset() {
    this.lastAction(Date.now());
  }

  /**
   * check timer
   */
  check() {
    const now = Date.now();
    const timeLeft = parseInt(this.getLastAction()) + (10) * 60 * 1000;
    const diff = timeLeft - now;
    const isTimeout = diff < 0;
    //this.isLoggedIn.subscribe(event => this.isLogin = event);
    this.ngZone.run(() => {
      if (isTimeout && this.isLogin) {
        localStorage.removeItem('userData');
        localStorage.removeItem('lastAction');
        setTimeout(()=>{
          console.log("Your Session Expired due to longer Inactivity, Login Again To Continue");
        },10000);
        this.oAuthenticationService.logout();
      }
    });
  }

  /**
   *check if a user is logged in
   */
  isUserLoggedIn():string{
    return localStorage.getItem("userData");
  }
}

