import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction.model';


@Injectable({ providedIn: 'root' })
export class TransactionService {

    sRootUrl: string = environment.apiUrl + "nodejs/transaction";

    constructor(private http: HttpClient) { }


    fngetTransactionInfo(fromdate,todate){
      const sMethodUrl = `${this.sRootUrl}/gettransactionsbetweendates`;
      return this.http.post(sMethodUrl,{from_date:fromdate,to_date: todate});
    }
    fngetNeedToApproveTransactionInfo(){
      const sMethodUrl = `${this.sRootUrl}/Need_to_approve_Transaction_list`;
      return this.http.get(sMethodUrl,{});
    }
    fnChangeApprovedStatus(transaction : Transaction){
      const sMethodUrl = `${this.sRootUrl}/settransactionapprovalstatus`;
      return this.http.post(sMethodUrl, transaction);
    }
    
}
