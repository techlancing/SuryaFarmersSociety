import { Component, OnInit } from '@angular/core';
import { RazorpayService } from '../../../core/services/razorpay.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-allorders',
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss']
})
export class AllordersComponent implements OnInit {
  orders: any;
  constructor(private oRazorpayService: RazorpayService ) { }

  ngOnInit(): void {
    this.oRazorpayService.fngetAdminOrders().subscribe((orders : any)=>{
      console.log('orders',orders);
      this.orders = orders;
  });
  }

}
