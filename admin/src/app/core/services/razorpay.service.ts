import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class RazorpayService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/razorpay";

    constructor(private http: HttpClient) { }

    fnCreateOrder() {
        let sMethodUrl = `${this.sRootUrl}/createorder`;
        return this.http.get(sMethodUrl);
    }

    fnVerifyOrder(order_id, payment_id, signature) {
      let sMethodUrl = `${this.sRootUrl}/verifyorder`;
      return this.http.post(sMethodUrl,
        {razorpay_order_id : order_id,
          razorpay_payment_id :payment_id,
          razorpay_signature : signature});
  }

  fngetOrders() {
    let sMethodUrl = `${this.sRootUrl}/getOrders`;
    return this.http.get(sMethodUrl);
}

fngetAdminOrders() {
  let sMethodUrl = `${this.sRootUrl}/getAdminOrders`;
  return this.http.get(sMethodUrl);
}

fngetAdminOrderDetails(id: number) {
  let sMethodUrl = `${this.sRootUrl}/getadminorderdetails`;
  return this.http.post(sMethodUrl,{nOrderId:id});
}

}
