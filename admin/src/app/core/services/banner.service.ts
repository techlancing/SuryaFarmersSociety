import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Banner,BannerSettings } from '../models/homemainbanner.model';
import { BannerType } from './../enums/banner.enum';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class BannerService {
    public arrBannerSettings : BannerSettings[];
    sRootUrl: string = environment.apiUrl + "ANapi_ec/banner";

    constructor(private http: HttpClient) { }

    fnAddBannerInfo(oBanner: Banner) {
        let sMethodUrl = `${this.sRootUrl}/add_banner`;
        return this.http.post(sMethodUrl, oBanner);
    }

    fngetBannerInfo(eBannerType: BannerType){
      let sMethodUrl = `${this.sRootUrl}/banner_list`;
      return this.http.post(sMethodUrl,{'eBannerType' : eBannerType});
    }

    fnEditBannerInfo(oBanner: Banner) {
      let sMethodUrl = `${this.sRootUrl}/edit_banner`;
      return this.http.post(sMethodUrl, oBanner);
  }

  public fnGetBannerSettingsFromStore(eBannerType: BannerType): Observable<BannerSettings> {
    const oBannerSetting = this.arrBannerSettings.find(x => x.eBannerType === eBannerType);
    return of(oBannerSetting);
  }

  fngetBannerSettings(){
    return new Promise( (resolve, reject) =>{
      if(this.arrBannerSettings){
        resolve(this.arrBannerSettings);
        return;
      }
    const sMethodUrl = `${this.sRootUrl}/bannersettings_list`;
    return this.http.get(sMethodUrl).subscribe( (arrBannerSettings) =>{
        this.arrBannerSettings = arrBannerSettings as BannerSettings[];
        resolve(this.arrBannerSettings);
      });
    });
  }

}
