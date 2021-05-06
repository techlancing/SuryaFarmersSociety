import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manufacturer } from '../models/manufacturer.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class ManufacturerService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/manufacturer";

    constructor(private http: HttpClient) { }

    fnAddManufacturerInfo(oManufacturer: Manufacturer) {
        let sMethodUrl = `${this.sRootUrl}/add_manufacturer`;
        return this.http.post(sMethodUrl, oManufacturer);
    }

    fngetManufacturerInfo(){
      const sMethodUrl = `${this.sRootUrl}/manufacturer_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditManufacturerInfo(oManufacturer: Manufacturer) {
      let sMethodUrl = `${this.sRootUrl}/edit_manufacturer`;
      return this.http.post(sMethodUrl, oManufacturer);
  }

    fnDeleteManufacturerInfo(oManufacturer: Manufacturer) {
      const sMethodUrl = `${this.sRootUrl}/delete_manufacturer`;
      return this.http.post(sMethodUrl, oManufacturer);
  }
}
