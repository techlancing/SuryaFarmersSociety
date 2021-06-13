import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mandal } from './../models/mandal.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class MandalService {

    sRootUrl: string = environment.apiUrl + "nodejs/mandal";

    constructor(private http: HttpClient) { }

    fnAddMandalInfo(oMandal: Mandal) {
        const sMethodUrl = `${this.sRootUrl}/add_mandal`;
        return this.http.post(sMethodUrl, oMandal);
    }

    fngetMandalInfo(){
      const sMethodUrl = `${this.sRootUrl}/mandal_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditMandalInfo(oMandal: Mandal) {
      const sMethodUrl = `${this.sRootUrl}/edit_mandal`;
      return this.http.post(sMethodUrl, oMandal);
  }

    fnDeleteMandalInfo(oMandal: Mandal) {
      const sMethodUrl = `${this.sRootUrl}/delete_mandal`;
      return this.http.post(sMethodUrl, oMandal);
  }
}
