import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class TransactionService {

    sRootUrl: string = environment.apiUrl + "nodejs/transaction";

    constructor(private http: HttpClient) { }


    fngetTransactionInfo(fromdate,todate){
      const sMethodUrl = `${this.sRootUrl}/gettransactionsbetweendates`;
      return this.http.post(sMethodUrl,{from_date:fromdate,to_date: todate});
    }

    
}
