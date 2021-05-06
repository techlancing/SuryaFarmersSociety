import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car } from './../models/car.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CarService {

    sRootUrl: string = environment.apiUrl + "nodejs/car";

    constructor(private http: HttpClient) { }

    fnAddCarInfo(oCar: Car) {
        const sMethodUrl = `${this.sRootUrl}/add_car`;
        return this.http.post(sMethodUrl, oCar);
    }

    fngetCarInfo(){
      const sMethodUrl = `${this.sRootUrl}/car_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditCarInfo(oCar: Car) {
      const sMethodUrl = `${this.sRootUrl}/edit_car`;
      return this.http.post(sMethodUrl, oCar);
  }

    fnDeleteCarInfo(oCar: Car) {
      const sMethodUrl = `${this.sRootUrl}/delete_car`;
      return this.http.post(sMethodUrl, oCar);
  }
}
