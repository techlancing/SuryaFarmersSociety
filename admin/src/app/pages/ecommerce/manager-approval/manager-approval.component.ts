import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';

@Component({
  selector: 'app-manager-approval',
  templateUrl: './manager-approval.component.html',
  styleUrls: ['./manager-approval.component.scss']
})
export class ManagerApprovalComponent implements OnInit {

  breadCrumbItems : Array<any>;
  aApprovals: any;
  constructor(private oSavingstypeService : SavingstypeService,
    private activatedroute : ActivatedRoute,
    private oCreditLoanService : CreditLoanService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Transactions' }, { label: '', active: true }];

    if (this.activatedroute.snapshot.data.type === 'savings') this.fnGetSavingDepositApprovals();
    else if(this.activatedroute.snapshot.data.type === 'credit') this.fnGetCreditApprovals();
    else this.fnGetCreditApprovals();

  }


  fnGetCreditLoans(oSelectedAccount : any ){//BankAccount
    this.oCreditLoanService.fngetCreditLoanInfo(oSelectedAccount.sAccountNo).subscribe((loandata)=>{
      this.aApprovals = loandata as any;
    });
  }

  fnGetSavingDepositApprovals(){
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo('oSelectedAccount.sAccountNo').subscribe((data) => {
      this.aApprovals = data as any;
      console.log(data);
    });
  }
  
  fnGetCreditApprovals(){

  }
  fnChangeApprovalStatus(approval : any,status : string){
    
  }

}
