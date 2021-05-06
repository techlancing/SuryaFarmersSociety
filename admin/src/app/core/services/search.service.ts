import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class SearchService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/Product";

    constructor(private http: HttpClient) { }

    fnGetAutoFillKeywords(sSearchTerm: String) {
        let sMethodUrl = `${this.sRootUrl}/getautofillkeywords`;
        return this.http.post(sMethodUrl, {sSearchTerm:sSearchTerm});
    }

    
}
