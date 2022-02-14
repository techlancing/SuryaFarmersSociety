import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {SavingsType} from '../models/savingstype.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Debit } from '../models/debit.model';

@Injectable({
  providedIn: 'root'
})
export class SavingstypeService {

  sRootUrl: string = environment.apiUrl + "nodejs/savingstype";

  public oSavingsDeposit = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient) { }


  fnAddSavingsDepositInfo(oSavinsType: SavingsType) {
      const sMethodUrl = `${this.sRootUrl}/add_savingstype`;
      return this.http.post(sMethodUrl,oSavinsType);
  }
  fnEditSavingsDepositInfo(oSavinsType: SavingsType) {
    const sMethodUrl = `${this.sRootUrl}/edit_savingstype`;
    return this.http.post(sMethodUrl, oSavinsType);
  }
  fnDeleteCreditLoanInfo(oSavinsType: SavingsType) {
    const sMethodUrl = `${this.sRootUrl}/delete_savingstype`;
    return this.http.post(sMethodUrl, oSavinsType);
  }
  fnGetAllSavingDepositAccountsInfo(sAccountNo : string) {
    const sMethodUrl = `${this.sRootUrl}/savingstype_list`;
    return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
  }
  fnAddSavingsDepositTransactionInfo(oSavingsDeposit : Debit){
    const sMethodUrl = `${this.sRootUrl}/addsavingsdeposit_transaction`;
    return this.http.post(sMethodUrl, oSavingsDeposit);
  }
  fnAddSavingsWithdrawTransactionInfo(oSavingsDeposit : Debit){
    const sMethodUrl = `${this.sRootUrl}/withdrawsavingsdeposit_transaction`;
    return this.http.post(sMethodUrl, oSavingsDeposit);
  }

  fnGetAllSavingTypeAccountsInfo(){
    const sMethodUrl = `${this.sRootUrl}/getallsavingtypes`;
    return this.http.post(sMethodUrl, null);
  }
  fnChangeSavingTypeStatus(oSavinsType: SavingsType){
    const sMethodUrl = `${this.sRootUrl}/setsavingstypeapprovalstatus`;
    return this.http.post(sMethodUrl, oSavinsType);
  }

  fnGetAllSavingTypesRelatedAccountInfo(sAccountNo : number){
    const sMethodUrl = `${this.sRootUrl}/getaccountsavingstypes`;
    return this.http.post(sMethodUrl, {sAccountNo : sAccountNo});
  }
}
