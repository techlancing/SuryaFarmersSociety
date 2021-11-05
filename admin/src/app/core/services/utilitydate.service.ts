import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitydateService {

  constructor() { }
  fnChangeDateFormate(sDate : any){
    if(sDate!==null && typeof sDate ==='object') return new Date(sDate).toLocaleDateString('en-GB').split("/").join("-");  
    else return sDate;
  }
}
