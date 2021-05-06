import { Component, OnInit } from '@angular/core';
import { RazorpayService } from '../../../core/services/razorpay.service';


@Component({
  selector: 'app-invoicelist',
  templateUrl: './invoicelist.component.html',
  styleUrls: ['./invoicelist.component.scss']
})
export class InvoicelistComponent implements OnInit {

  listData: any;

  constructor(private oRazorpayService: RazorpayService) { }

  ngOnInit() {
  
    this.oRazorpayService.fngetAdminOrders().subscribe((listdata : any)=>{
      console.log('orders',listdata);
      this.listData = listdata;
    });
  }

}

