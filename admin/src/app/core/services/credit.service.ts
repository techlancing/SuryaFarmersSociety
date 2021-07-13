import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credit } from '../models/credit.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CreditService {

    sRootUrl: string = environment.apiUrl + "nodejs/credit";

    constructor(private http: HttpClient) { }

    fnAddCreditInfo(oCredit: Credit) {
        const sMethodUrl = `${this.sRootUrl}/add_credit`;
        return this.http.post(sMethodUrl, oCredit);
    }

    fngetCreditInfo(){
      const sMethodUrl = `${this.sRootUrl}/credit_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditCreditInfo(oCredit: Credit) {
      const sMethodUrl = `${this.sRootUrl}/edit_credit`;
      return this.http.post(sMethodUrl, oCredit);
  }

  fnDeleteCreditInfo(oCredit: Credit) {
      const sMethodUrl = `${this.sRootUrl}/delete_credit`;
      return this.http.post(sMethodUrl, oCredit);
  }
}
