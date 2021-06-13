import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { District } from './../models/district.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class DistrictService {

    sRootUrl: string = environment.apiUrl + "nodejs/district";

    constructor(private http: HttpClient) { }

    fnAddDistrictInfo(oDistrict: District) {
        const sMethodUrl = `${this.sRootUrl}/add_district`;
        return this.http.post(sMethodUrl, oDistrict);
    }

    fngetDistrictInfo(){
      const sMethodUrl = `${this.sRootUrl}/district_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditDistrictInfo(oDistrict: District) {
      const sMethodUrl = `${this.sRootUrl}/edit_district`;
      return this.http.post(sMethodUrl, oDistrict);
  }

    fnDeleteDistrictInfo(oDistrict: District) {
      const sMethodUrl = `${this.sRootUrl}/delete_district`;
      return this.http.post(sMethodUrl, oDistrict);
  }
}
