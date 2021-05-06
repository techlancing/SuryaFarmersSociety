import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configurationvalue } from './../models/configurationvalue.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigurationvalueService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/configurationvalue";

    constructor(private http: HttpClient) { }

    fnAddConfigurationvalueInfo(oConfigurationvalue: Configurationvalue) {
        const sMethodUrl = `${this.sRootUrl}/add_configurationvalue`;
        return this.http.post(sMethodUrl, oConfigurationvalue);
    }

    fngetConfigurationvalueInfo(){
      const sMethodUrl = `${this.sRootUrl}/configurationvalue_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditConfigurationvalueInfo(oConfigurationvalue: Configurationvalue) {
      const sMethodUrl = `${this.sRootUrl}/edit_configurationvalue`;
      return this.http.post(sMethodUrl, oConfigurationvalue);
  }
    fnDeleteConfigurationvalueInfo(oConfigurationvalue: Configurationvalue){
      const sMethodUrl = `${this.sRootUrl}/delete_configurationvalue`;
      return this.http.post(sMethodUrl, oConfigurationvalue);
  }
}
