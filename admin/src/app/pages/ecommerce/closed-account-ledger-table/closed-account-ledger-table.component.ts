
import { Component, Input, OnInit } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-closed-account-ledger-table',
  templateUrl: './closed-account-ledger-table.component.html',
  styleUrls: ['./closed-account-ledger-table.component.scss']
})
export class ClosedAccountLedgerTableComponent implements OnInit {

  @Input() aTransactions : any;
  @Input() bShowAccNum : boolean ;
  @Input() bPrintLine : boolean ;
  @Input() bShowEmployee : boolean ;
  @Input() bNotPrintHead : boolean ;
 
   
  nOutstandingAmount : any;
    
    

   
  constructor() { }

  ngOnInit(): void {
    
   
    // this.nLineFrom = this.lineFrom % 18;
    console.log("outstanding",this.nOutstandingAmount)
    this.nOutstandingAmount = this.aTransactions[this.aTransactions.length-1].nBalanceAmount ;
  }

}



