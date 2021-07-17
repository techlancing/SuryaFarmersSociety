import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreditLoan } from '../models/creditloan.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CreditLoanService {

    sRootUrl: string = environment.apiUrl + "nodejs/creditloan";

    constructor(private http: HttpClient) { }

    fnAddCreditLoanInfo(oCreditLoan: CreditLoan) {
        const sMethodUrl = `${this.sRootUrl}/add_creditloan`;
        return this.http.post(sMethodUrl, oCreditLoan);
    }

    fngetCreditLoanInfo(sAccountNo: string){
      const sMethodUrl = `${this.sRootUrl}/creditloan_list`;
      return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
    }

    fnEditCreditLoanInfo(oCreditLoan: CreditLoan) {
      const sMethodUrl = `${this.sRootUrl}/edit_creditloan`;
      return this.http.post(sMethodUrl, oCreditLoan);
  }

  fnDeleteCreditLoanInfo(oCreditLoan: CreditLoan) {
      const sMethodUrl = `${this.sRootUrl}/delete_creditloan`;
      return this.http.post(sMethodUrl, oCreditLoan);
  }
}
