import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DailySavingDebit } from '../models/dailysavingdebit.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class DailySavingDebitService {

    sRootUrl: string = environment.apiUrl + "nodejs/dailysavingdeposit";

    constructor(private http: HttpClient) { }

    fnAddDailySavingDepositInfo(oDailyDeposit: DailySavingDebit) {
        const sMethodUrl = `${this.sRootUrl}/add_dailydeposittransaction`;
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
}
