import { Component, OnInit, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  @Input() transactions: Array<{
    nOrderId?: string;
    index?: number,
    nUserId?: string,
    createdAt?: string,
    oCartHistory?: any,
    sOrderStatus?: string,
    oPaymentDetail?: any
  }>;

  constructor(private modalService: NgbModal) { }
  activeindex : number;
  order: any;
  ngOnInit() {
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any,index) {
  //   this.activeindex = index;
  //   this.oRazorpayService.fngetAdminOrderDetails(Number(this.transactions[this.activeindex].nOrderId)).subscribe((order : any)=>{
  //     console.log(order);
  //     this.order = order;
  //   this.modalService.open(content, { centered: true });

  // });
  }

}
