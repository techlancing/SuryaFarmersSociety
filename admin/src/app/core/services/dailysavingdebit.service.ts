import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DailySavingDebit } from '../models/dailysavingdebit.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class DailySavingDebitService {

    sRootUrl: string = environment.apiUrl + "nodejs/dailysavingdeposit";
    public oDailySavingDepositAccount = new BehaviorSubject<any>(null);    

    constructor(private http: HttpClient) { }

    fnAddDailySavingDepositInfo(oDailyDeposit: DailySavingDebit) {
        const sMethodUrl = `${this.sRootUrl}/add_dailydeposittransaction`;
        return this.http.post(sMethodUrl, oDailyDeposit);
    }

    fnWithDrawDailySavingDepositInfo(oDailyDeposit: DailySavingDebit) {
      const sMethodUrl = `${this.sRootUrl}/withdraw_dailydeposittransaction`;
      return this.http.post(sMethodUrl, oDailyDeposit);
  }

    fngetDailySavingDepositInfo(sAccountNo: string){
      const sMethodUrl = `${this.sRootUrl}/dailydeposittransaction_list`;
      return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
    }

    fnEditDailySavingDepositInfo(oDailyDeposit: DailySavingDebit) {
      const sMethodUrl = `${this.sRootUrl}/edit_dailydeposittransaction`;
      return this.http.post(sMethodUrl, oDailyDeposit);
  }

  fnDeleteDailySavingDepositInfo(oDailyDeposit: DailySavingDebit) {
      const sMethodUrl = `${this.sRootUrl}/delete_dailydeposittransaction`;
      return this.http.post(sMethodUrl, oDailyDeposit);
  }

  // savings account deposit and withdrawl 
  fnAddSavingsDebitInfo(oDailyDeposit: DailySavingDebit) {
    const sMethodUrl = `${this.sRootUrl}/add_savingstransaction`;
    return this.http.post(sMethodUrl, oDailyDeposit);
}

fnWithDrawSavingsInfo(oDailyDeposit: DailySavingDebit) {
  const sMethodUrl = `${this.sRootUrl}/withdrawl_savingstransaction`;
  return this.http.post(sMethodUrl, oDailyDeposit);
}
}
