import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-balance-enquiry',
  templateUrl: './account-balance-enquiry.component.html',
  styleUrls: ['./account-balance-enquiry.component.scss']
})
export class AccountBalanceEnquiryComponent implements OnInit {

  //breadcrumbitems
  breadCrumbItems: Array<{}>;
  
  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Bank Account' }, { label: 'Balance Enquiry', active: true }];
  }

}
