import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IntraTransaction } from './../models/intratransaction.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class IntraTransactionService {

    sRootUrl: string = environment.apiUrl + "nodejs/IntraTransaction";

    constructor(private http: HttpClient) { }

    fnAddIntraTransactionInfo(oIntraTransaction: IntraTransaction) {
        const sMethodUrl = `${this.sRootUrl}/intraaccounttransaction`;
        return this.http.post(sMethodUrl, oIntraTransaction);
    }

    fngetIntraTransactionInfo(){
      const sMethodUrl = `${this.sRootUrl}/IntraTransaction_list`;
      return this.http.get(sMethodUrl);
    }

    
}
