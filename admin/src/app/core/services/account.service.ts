import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from '../models/bankaccount.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class BankAccountService {

    sRootUrl: string = environment.apiUrl + "nodejs/bankaccount";

    constructor(private http: HttpClient) { }

    fnAddBankAccountInfo(oBankAccount: BankAccount) {
        const sMethodUrl = `${this.sRootUrl}/add_bankaccount`;
        return this.http.post(sMethodUrl, oBankAccount);
    }

    fngetActiveBankAccountInfo(){
      const sMethodUrl = `${this.sRootUrl}/activebankaccount_list`;
      return this.http.get(sMethodUrl);
    }

    fngetAllBankAccountInfo(){
      const sMethodUrl = `${this.sRootUrl}/allbankaccount_list`;
      return this.http.get(sMethodUrl);
    }

    fngetLastBankAccountInfo(nVillageId:number){
      const sMethodUrl = `${this.sRootUrl}/getlastaccountinvillage`;
      return this.http.post(sMethodUrl,{nVillageId:nVillageId});
    }

    fngetBankAccountInfoByNumber(sAccountNo: string) {
      const sMethodUrl = `${this.sRootUrl}/getaccountbynumber`;
      return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
  }

    fnEditBankAccountInfo(oBankAccount: BankAccount) {
      const sMethodUrl = `${this.sRootUrl}/edit_bankaccount`;
      return this.http.post(sMethodUrl, oBankAccount);
  }

  fngetBankAccountSavingsTransactions(nAccountId: number) {
    const sMethodUrl = `${this.sRootUrl}/getallsavingstransactions`;
    return this.http.post(sMethodUrl, {nAccountId:nAccountId});
}

  fnDeleteBankAccountInfo(oBankAccount: BankAccount) {
      const sMethodUrl = `${this.sRootUrl}/delete_bankaccount`;
      return this.http.post(sMethodUrl, oBankAccount);
  }
  //Savings Accounts
  fngetSavingsBankAccountCountInfo(){
    const sMethodUrl = `${this.sRootUrl}/getallsavingsaccountcount`;
      return this.http.get(sMethodUrl);
  }
  //saving accounts balance
  fnGetAllSavingsAccountBalanceInfo(){
    const sMethodUrl = `${this.sRootUrl}/getallsavingsaccountbalance`;
      return this.http.get(sMethodUrl);
  }
  //single account balance
  fnGetSingleAccountBalance(sAccountNo: string){
    const sMethodUrl = `${this.sRootUrl}/getsingleaccountbalance`;
      return this.http.post(sMethodUrl,{sAccountNo:sAccountNo});
  }
  //deactivate bank account
  fnActivateOrDeactivateBankAccount(sAccountNo: string,bIsDeactivated : boolean){
    const sMethodUrl = `${this.sRootUrl}/activate_or_deactivate_account`;
      return this.http.post(sMethodUrl,{sAccountNo:sAccountNo,bIsDeactivated:bIsDeactivated});
  }
  fnGetEqualAccountsCount(){
    const sMethodUrl = `${this.sRootUrl}/getequalaccountscount`;
    return this.http.get(sMethodUrl);
  }
}
