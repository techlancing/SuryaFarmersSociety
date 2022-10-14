import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    sRootUrl: string = environment.apiUrl + "nodejs/account";
    subUser$ = new BehaviorSubject<User>(null);
    private oUser: User = null;
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {
      if(localStorage.getItem('userData') !== undefined &&
        localStorage.getItem('userData') !== null){
            this.oUser = JSON.parse(localStorage.getItem('userData'));
            this.subUser$.next(this.oUser);
        }
     }

    fnGetUserChangeObservable(): Observable<User>{
      return this.subUser$.asObservable();
    }

    fnCreateUserAccount(name: string, email: string, password: string, repeatpassword: string,role: string, mobile: number) {
        let sMethodUrl = `${this.sRootUrl}/createuseraccount`;
        return this.http.post(sMethodUrl,
            {
                sName: name,
                sEmail: email,
                sPassword: password,
                sRepeatpassword: repeatpassword,
                sRole : role,
                nMobile : mobile
            });
    }

    
  //   fnCreateEmployeeUserAccount(name: string, email: string, password: string, repeatpassword: string, mobile: number) {
  //     let sMethodUrl = `${this.sRootUrl}/createuseraccount`;
  //     return this.http.post(sMethodUrl,
  //         {
  //             sName: name,
  //             sEmail: email,
  //             sPassword: password,
  //             sRepeatpassword: repeatpassword,
  //             nMobile : mobile
  //         });
  // }
    fnLogIn(email: string, password: string) {
        let sMethodUrl = `${this.sRootUrl}/login`;
        return this.http.post<User>(sMethodUrl,
            {
                sEmail: email,
                sPassword: password,
            })
            .pipe(
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                }),
                tap((resData : User) => {
                    console.log('reached tap',resData);
                  this.handleAuthentication(resData);
                })
              );
    }






//   login(email: string, password: string) {
//     return this.http
//       .post<AuthResponseData>(
//         'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDb0xTaRAoxyCgvaDF3kk5VYOsTwB_3o7Y',
//         {
//           email: email,
//           password: password,
//           returnSecureToken: true
//         }
//       )
//       .pipe(
//         catchError(this.handleError),
//         tap(resData => {
//           this.handleAuthentication(
//             resData.email,
//             resData.localId,
//             resData.idToken,
//             +resData.expiresIn
//           );
//         })
//       );
//   }

//   autoLogin() {
//     const userData: {
//       email: string;
//       id: string;
//       _token: string;
//       _tokenExpirationDate: string;
//     } = JSON.parse(localStorage.getItem('userData'));
//     if (!userData) {
//       return;
//     }

//     const loadedUser = new User(
//       userData.email,
//       userData.id,
//       userData._token,
//       new Date(userData._tokenExpirationDate)
//     );

//     if (loadedUser.token) {
//       this.user.next(loadedUser);
//       const expirationDuration =
//         new Date(userData._tokenExpirationDate).getTime() -
//         new Date().getTime();
//       this.autoLogout(expirationDuration);
//     }
//   }


//password reset service methods
fnEmailAuthentication(email: string){
  let sMethodUrl = `${this.sRootUrl}/sendotp_for_forgotpassword`;
  return this.http.post<User>(sMethodUrl,{ sUserEmail: email });
}
fnOTPValidation(email: string,otp: string){
  let sMethodUrl = `${this.sRootUrl}/validateotp_for_forgotpassword`;
  return this.http.post<User>(sMethodUrl,{ sUserEmail: email,nOtp: otp });
}
fnSetNewPassword(email: string,password : string,repeatpassword : string){
  let sMethodUrl = `${this.sRootUrl}/saveNewPassword`;
  return this.http.post<User>(sMethodUrl,{ sUserEmail: email, sUserPassword : password,repeatpassword : repeatpassword });
}


  logout() {
    this.oUser = null;
    this.subUser$.next(this.oUser);
    this.router.navigate(['/account/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout() {
     //this.tokenExpirationTimer = setTimeout(() => { expirationDuration: number
       this.logout();
    // }, expirationDuration);
 }

  private handleAuthentication(
    resuser : any
  ) {
    const user = new User(
        resuser.sUserEmail,
        resuser.sUserName,
        resuser._token,
        resuser._expirytokentime,
        resuser.sRole);
    this.subUser$.next(user);
    //this.autoLogout(user.expirytoken);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(error:HttpErrorResponse){
      console.log(error);
  }

//   private handleError(errorRes: HttpErrorResponse) {
//     let errorMessage = 'An unknown error occurred!';
//     if (!errorRes.error || !errorRes.error.error) {
//       return throwError(errorMessage);
//     }
//     switch (errorRes.error.error.message) {
//       case 'EMAIL_EXISTS':
//         errorMessage = 'This email exists already';
//         break;
//       case 'EMAIL_NOT_FOUND':
//         errorMessage = 'This email does not exist.';
//         break;
//       case 'INVALID_PASSWORD':
//         errorMessage = 'This password is not correct.';
//         break;
//     }
//     return throwError(errorMessage);
//   }

}
