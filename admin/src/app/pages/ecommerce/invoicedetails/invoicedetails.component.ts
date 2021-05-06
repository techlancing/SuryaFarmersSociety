import { Component, OnInit } from '@angular/core';
import { RazorpayService } from '../../../core/services/razorpay.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoicedetails',
  templateUrl: './invoicedetails.component.html',
  styleUrls: ['./invoicedetails.component.scss']
})
export class InvoicedetailsComponent implements OnInit {

  invoiceDetails: any;

  constructor(private oRazorpayService: RazorpayService,
    private activatedroute: ActivatedRoute, private router: Router ) { }

  ngOnInit() {
  
   const orderid = this.activatedroute.snapshot.url[1].path;
    this.oRazorpayService.fngetAdminOrderDetails(Number(orderid)).subscribe((invoicedetails : any)=>{
      console.log('invoiceDetails',invoicedetails);
      this.invoiceDetails = invoicedetails;
    });
  }
}
