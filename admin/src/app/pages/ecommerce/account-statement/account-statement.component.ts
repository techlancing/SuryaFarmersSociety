import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  constructor() { }

  ngOnInit(): void {

    this.breadCrumbItems = [{ label: 'Bank Account' }, { label: 'Statement', active: true }];
  }

}
