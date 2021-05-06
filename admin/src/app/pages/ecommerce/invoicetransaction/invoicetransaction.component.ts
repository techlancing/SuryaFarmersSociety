import { Component, OnInit ,Input} from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoicetransaction',
  templateUrl: './invoicetransaction.component.html',
  styleUrls: ['./invoicetransaction.component.scss']
})
export class InvoicetransactionComponent implements OnInit {

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
  ngOnInit() {
  }

  /**
   * Open modal
   * @param content modal content
   */
  // openModal(content: any,index) {
  //   this.activeindex = index;
  //   this.modalService.open(content, { centered: true });
  // }

}