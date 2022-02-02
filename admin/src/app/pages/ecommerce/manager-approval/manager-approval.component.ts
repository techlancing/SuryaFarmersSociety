import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { SavingsType } from 'src/app/core/models/savingstype.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manager-approval',
  templateUrl: './manager-approval.component.html',
  styleUrls: ['./manager-approval.component.scss']
})
export class ManagerApprovalComponent implements OnInit {

  breadCrumbItems : Array<any>;
  aApprovals: any;
  sTableContent : string ;
  
  constructor(private oSavingstypeService : SavingstypeService,
    public activatedroute : ActivatedRoute,
    private oCreditLoanService : CreditLoanService,
    private router : Router) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Approvals' }, { label: 'transactions', active: true }];

    if (this.activatedroute.snapshot.data.type === 'savings') this.fnGetSavingDepositApprovals();
    else if(this.activatedroute.snapshot.data.type === 'credit') this.fnGetCreditApprovals();
    else this.fnGetCreditLoanApprovals();
    this.sTableContent = this.activatedroute.snapshot.data.tableContent ;
  }


  fnGetCreditLoanApprovals(){//BankAccount
    this.oCreditLoanService.fnGetAllCreditLoanInfo().subscribe((loandata)=>{
      this.aApprovals = loandata as any;
      console.log(loandata);
    });
  }

  fnGetSavingDepositApprovals(){
    this.oSavingstypeService.fnGetAllSavingTypeAccountsInfo().subscribe((savingdata) => {
      this.aApprovals = savingdata as any;
      console.log(savingdata);
    });
  }
  
  fnGetCreditApprovals(){

  }
  fnChangeApprovalStatus(approval : any,status : string){
    if(this.activatedroute.snapshot.data.type === 'savings'){
      approval.sIsApproved = status ;
      this.oSavingstypeService.fnChangeSavingTypeStatus(approval).subscribe((data) => {
        this.fnSuccessMessage('SavingType Status Changed Successfully');
        this.redirectTo('/savingsapproval');
      });
    }
    else if (this.activatedroute.snapshot.data.type === 'credit'){
      this.fnSuccessMessage('Credit Transaction Status Changed Successfully');
      this.redirectTo('/savingsapproval');
    }
    else {
      approval.sIsApproved = status ;
      this.oCreditLoanService.fnChangeCreditLoanStatus(approval).subscribe((data) => {
        this.fnSuccessMessage('CreditLoan Status Changed Successfully');
        this.redirectTo('/loanapproval');
      });
    }
  }

  fnSuccessMessage(msg : string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
}
