import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.subUser$.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
            headers: req.headers.set(
                'Authorization',
                'Bearer ' + user._token
              )
         // params: new HttpParams().set('auth', user._token)
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
