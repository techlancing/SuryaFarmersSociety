import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Village } from './../models/village.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class VillageService {

    sRootUrl: string = environment.apiUrl + "nodejs/village";

    constructor(private http: HttpClient) { }

    fnAddVillageInfo(oVillage: Village) {
        const sMethodUrl = `${this.sRootUrl}/add_village`;
        return this.http.post(sMethodUrl, oVillage);
    }

    fngetVillageInfo(){
      const sMethodUrl = `${this.sRootUrl}/village_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditVillageInfo(oVillage: Village) {
      const sMethodUrl = `${this.sRootUrl}/edit_village`;
      return this.http.post(sMethodUrl, oVillage);
  }

    fnDeleteVillageInfo(oVillage: Village) {
      const sMethodUrl = `${this.sRootUrl}/delete_village`;
      return this.http.post(sMethodUrl, oVillage);
  }
}
