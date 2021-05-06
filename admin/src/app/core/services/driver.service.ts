import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Driver } from './../models/driver.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class DriverService {

    sRootUrl: string = environment.apiUrl + "nodejs/Driver";

    constructor(private http: HttpClient) { }

    fnAddDriverInfo(oDriver: Driver) {
        const sMethodUrl = `${this.sRootUrl}/add_Driver`;
        return this.http.post(sMethodUrl, oDriver);
    }

    fngetDriverInfo(){
      const sMethodUrl = `${this.sRootUrl}/Driver_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditDriverInfo(oDriver: Driver) {
      const sMethodUrl = `${this.sRootUrl}/edit_Driver`;
      return this.http.post(sMethodUrl, oDriver);
  }

    fnDeleteDriverInfo(oDriver: Driver) {
      const sMethodUrl = `${this.sRootUrl}/delete_Driver`;
      return this.http.post(sMethodUrl, oDriver);
  }
}
