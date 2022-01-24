import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SavingsType} from '../models/savingstype.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavingstypeService {

  sRootUrl: string = environment.apiUrl + "nodejs/creditloan";

  constructor(private http: HttpClient) { }


  fnAddSavingsDepositInfo(oSavinsType: SavingsType) {
      const sMethodUrl = `${this.sRootUrl}/add_savingsdeposit`;
      return this.http.post(sMethodUrl,oSavinsType);
  }
  fngetSavingsDepositInfo(sAccountNo: string){
    const sMethodUrl = `${this.sRootUrl}/savingsdeposit_list`;
    return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
  }
  fnEditSavingsDepositInfo(oSavinsType: SavingsType) {
    const sMethodUrl = `${this.sRootUrl}/edit_savingsdeposit`;
    return this.http.post(sMethodUrl, oSavinsType);
  }
  fnDeleteCreditLoanInfo(oSavinsType: SavingsType) {
    const sMethodUrl = `${this.sRootUrl}/delete_savingsdeposit`;
    return this.http.post(sMethodUrl, oSavinsType);
  }
  fnAccontCreditLoanInfo(sAccountNo : string) {
    const sMethodUrl = `${this.sRootUrl}/getsavingsdeposit`;
    return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
  }
}
