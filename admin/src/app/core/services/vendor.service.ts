import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vendor } from './../models/vendor.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class VendorService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/vendor";

    constructor(private http: HttpClient) { }

    fnAddVendorInfo(oVendor: Vendor) {
        let sMethodUrl = `${this.sRootUrl}/add_vendor`;
        return this.http.post(sMethodUrl, oVendor);
    }

    fngetVendorInfo(){
      const sMethodUrl = `${this.sRootUrl}/vendor_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditVendorInfo(oVendor: Vendor) {
      let sMethodUrl = `${this.sRootUrl}/edit_vendor`;
      return this.http.post(sMethodUrl, oVendor);
  }
    fnDeleteVendorInfo(oVendor: Vendor) {
      const sMethodUrl = `${this.sRootUrl}/delete_vendor`;
      return this.http.post(sMethodUrl, oVendor);
  }
}
