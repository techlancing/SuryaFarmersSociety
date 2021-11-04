import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitydateService {

  constructor() { }
  fnChangeDateFormate(sDate : any){
    if(sDate!=='') return new Date(sDate).toLocaleDateString('en-GB').split("/").join("-");  

  }
}
