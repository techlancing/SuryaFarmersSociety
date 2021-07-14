import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Debit } from '../models/debit.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class DebitService {

    sRootUrl: string = environment.apiUrl + "nodejs/debit";

    constructor(private http: HttpClient) { }

    fnAddDebitInfo(oDebit: Debit) {
        const sMethodUrl = `${this.sRootUrl}/add_debit`;
        return this.http.post(sMethodUrl, oDebit);
    }

    fngetDebitInfo(){
      const sMethodUrl = `${this.sRootUrl}/debit_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditDebitInfo(oDebit: Debit) {
      const sMethodUrl = `${this.sRootUrl}/edit_debit`;
      return this.http.post(sMethodUrl, oDebit);
  }

  fnDeleteDebitInfo(oDebit: Debit) {
      const sMethodUrl = `${this.sRootUrl}/delete_debit`;
      return this.http.post(sMethodUrl, oDebit);
  }
}
