import { Component, OnInit } from '@angular/core';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import {TransactionService} from 'src/app/core/services/transaction.service';


@Component({
  selector: 'app-approvals-display',
  templateUrl: './approvals-display.component.html',
  styleUrls: ['./approvals-display.component.scss']
})
export class ApprovalsDisplayComponent implements OnInit {

  breadCrumbItems : Array<any>;
  aCrediloanApprovals: any;
  aSavingDepositApprovals : any;
  aCreditApprovals : any ;
  sTableContent : string ;
  
  constructor(private oSavingstypeService : SavingstypeService,
    private oCreditLoanService : CreditLoanService,
    private oTransactionService : TransactionService,
    ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Approvals' }, { label: 'transactions', active: true }];
    this.oCreditLoanService.fnGetAllCreditLoanInfo().subscribe((loandata)=>{
      this.aCrediloanApprovals = loandata as any;
      console.log(loandata);
    });
    this.oSavingstypeService.fnGetAllSavingTypeAccountsInfo().subscribe((savingdata) => {
      this.aSavingDepositApprovals = savingdata as any;
      console.log(savingdata);
    });
    this.oTransactionService.fngetNeedToApproveTransactionInfo().subscribe((creditdata) => {
      this.aCreditApprovals = creditdata  as any;
      console.log(creditdata);
    });
    this.sTableContent = '' ; 
  }
}
