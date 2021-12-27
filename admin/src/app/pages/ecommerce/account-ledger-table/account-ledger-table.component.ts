import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-ledger-table',
  templateUrl: './account-ledger-table.component.html',
  styleUrls: ['./account-ledger-table.component.scss']
})
export class AccountLedgerTableComponent implements OnInit {
@Input() aTransactions : any;
@Input() bShowAccNum : boolean ;
@Input() bPrintLine : boolean ;
@Input() lineFrom : number ;
@Input() lineTo : number ;
  constructor() { }

  ngOnInit(): void {
  }
}
