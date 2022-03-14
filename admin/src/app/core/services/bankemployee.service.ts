import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankEmployee } from '../models/bankemployee.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class BankEmployeeService {

    sRootUrl: string = environment.apiUrl + "nodejs/bankemployee";

    constructor(private http: HttpClient) { }

    fnAddBankEmployeeInfo(oBankEmployee: BankEmployee) {
        const sMethodUrl = `${this.sRootUrl}/add_bankemployee`;
        return this.http.post(sMethodUrl, oBankEmployee);
    }

    fngetPendingBankEmployeeInfo(){
      const sMethodUrl = `${this.sRootUrl}/pending_bankemployee_list`;
      return this.http.get(sMethodUrl);
    }

    fngetApprovedBankEmployeeInfo(){
      const sMethodUrl = `${this.sRootUrl}/approved_bankemployee_list`;
      return this.http.get(sMethodUrl);
    }
    fngetBankEmployeeInfoByNumber(sAccountNo: string) {
      const sMethodUrl = `${this.sRootUrl}/getemployeebynumber`;
      return this.http.post(sMethodUrl, {sAccountNo:sAccountNo});
  }

    fnEditBankEmployeeInfo(oBankEmployee: BankEmployee) {
      const sMethodUrl = `${this.sRootUrl}/edit_bankemployee`;
      return this.http.post(sMethodUrl, oBankEmployee);
  }

  fnDeleteBankEmployeeInfo(oBankEmployee: BankEmployee) {
      const sMethodUrl = `${this.sRootUrl}/delete_bankemployee`;
      return this.http.post(sMethodUrl, oBankEmployee);
  }
  fnBankEmployeeApprovalStatusInfo(oBankEmployee : BankEmployee) {
    const sMethodUrl = `${this.sRootUrl}/set_bankemployee_status`;
    return this.http.post(sMethodUrl, oBankEmployee);
  }
}
