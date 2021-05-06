import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Brand } from './../models/brand.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class BrandService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/brand";

    constructor(private http: HttpClient) { }

    fnAddBrandInfo(oBrand: Brand) {
        let sMethodUrl = `${this.sRootUrl}/add_brand`;
        return this.http.post(sMethodUrl, oBrand);
    }

    fngetBrandInfo(){
      const sMethodUrl = `${this.sRootUrl}/brand_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditBrandInfo(oBrand: Brand) {
      let sMethodUrl = `${this.sRootUrl}/edit_brand`;
      return this.http.post(sMethodUrl, oBrand);
  }

    fnDeleteBrandInfo(oBrand: Brand) {
      const sMethodUrl = `${this.sRootUrl}/delete_brand`;
      return this.http.post(sMethodUrl, oBrand);
  }
}
