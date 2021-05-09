import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BankAccount } from '../models/bankaccount.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class BankAccountService {

    sRootUrl: string = environment.apiUrl + "nodejs/bankaccount";

    constructor(private http: HttpClient) { }

    fnAddCarInfo(oCar: BankAccountService) {
        const sMethodUrl = `${this.sRootUrl}/add_bankaccount`;
        return this.http.post(sMethodUrl, oCar);
    }

    fngetCarInfo(){
      const sMethodUrl = `${this.sRootUrl}/bankaccount_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditCarInfo(oCar: BankAccountService) {
      const sMethodUrl = `${this.sRootUrl}/edit_bankaccount`;
      return this.http.post(sMethodUrl, oCar);
  }

    fnDeleteCarInfo(oCar: BankAccountService) {
      const sMethodUrl = `${this.sRootUrl}/delete_bankaccount`;
      return this.http.post(sMethodUrl, oCar);
  }
}
