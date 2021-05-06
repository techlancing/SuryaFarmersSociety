import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Configurationtype } from './../models/configurationtype.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class ConfigurationtypeService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/configurationtype";

    constructor(private http: HttpClient) { }

    fnAddConfigurationtypeInfo(oConfigurationtype: Configurationtype) {
        const sMethodUrl = `${this.sRootUrl}/add_configurationtype`;
        return this.http.post(sMethodUrl, oConfigurationtype);
    }

    fngetConfigurationtypeInfo(){
      const sMethodUrl = `${this.sRootUrl}/configurationtype_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditConfigurationtypeInfo(oConfigurationtype: Configurationtype) {
      const sMethodUrl = `${this.sRootUrl}/edit_configurationtype`;
      return this.http.post(sMethodUrl, oConfigurationtype);
  }
     fnDeleteConfigurationtypeInfo(oConfigurationtype: Configurationtype) {
      const sMethodUrl = `${this.sRootUrl}/delete_configurationtype`;
      return this.http.post(sMethodUrl, oConfigurationtype);
  }
}
