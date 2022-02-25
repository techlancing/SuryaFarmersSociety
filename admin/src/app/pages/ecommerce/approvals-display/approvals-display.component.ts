import { Component, OnInit } from '@angular/core';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';

@Component({
  selector: 'app-approvals-display',
  templateUrl: './approvals-display.component.html',
  styleUrls: ['./approvals-display.component.scss']
})
export class ApprovalsDisplayComponent implements OnInit {

  breadCrumbItems : Array<any>;
  aCrediloanApprovals: any;
  aSavingDepositApprovals : any;
  sTableContent : string ;
  
  constructor(private oSavingstypeService : SavingstypeService,
    private oCreditLoanService : CreditLoanService,
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
    this.sTableContent = '' ;
  }
}
