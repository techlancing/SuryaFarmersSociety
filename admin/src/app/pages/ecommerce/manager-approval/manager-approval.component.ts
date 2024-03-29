import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import {TransactionService} from 'src/app/core/services/transaction.service';
import {Transaction} from 'src/app/core/models/transaction.model';
import { SavingsType } from 'src/app/core/models/savingstype.model';
import Swal from 'sweetalert2';
import { SearchService } from './search.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manager-approval',
  templateUrl: './manager-approval.component.html',
  styleUrls: ['./manager-approval.component.scss'],
  providers: [ DecimalPipe,SearchService]
})
export class ManagerApprovalComponent implements OnInit {
  bDisableButton : boolean;
  breadCrumbItems : Array<any>;
  aApprovals: Observable<any> ;
  sTableContent : string ;
  oTransactionModel : Transaction ;
  
  constructor(private oSavingstypeService : SavingstypeService,
    public activatedroute : ActivatedRoute,
    private oCreditLoanService : CreditLoanService,
    private router : Router, private oTransactionService : TransactionService,
    public service: SearchService,) {
      this.aApprovals = this.service._tables$;
      console.log(this.aApprovals);
     }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Approvals' }, { label: 'transactions', active: true }];

    if (this.activatedroute.snapshot.data.type === 'savings') this.fnGetSavingDepositApprovals();
    else if(this.activatedroute.snapshot.data.type === 'credit') this.fnGetCreditApprovals();
    else this.fnGetCreditLoanApprovals();
    this.sTableContent = this.activatedroute.snapshot.data.tableContent ;
    this.service.route.next(this.activatedroute.snapshot.data.type);
    this.service._tables$.subscribe((data) => {
      this.aApprovals = data as any;
    })
  }


  fnGetCreditLoanApprovals(){//BankAccount
    this.oCreditLoanService.fnGetAllCreditLoanInfo().subscribe((loandata)=>{
     // let  aApproval= loandata as any;
      this.aApprovals = loandata as any;
      console.log(loandata);
      //this.fnSortApprovals(aApproval);
    });
  }

  fnGetSavingDepositApprovals(){
    this.oSavingstypeService.fnGetAllSavingTypeAccountsInfo().subscribe((savingdata) => {
      //let aApproval = savingdata as any;
      this.aApprovals = savingdata as any;
      console.log(savingdata);
     // this.fnSortApprovals(aApproval);
    });
  }
  // fnSortApprovals(aApproval){
  //   debugger
  //   aApproval.map((approval) => {
  //     if(approval.sIsApproved === 'Pending') this.aApprovals.push(approval);
  //   });
  // }

  fnRefresh(){
    // this.ngOnInit();
    if (this.activatedroute.snapshot.data.type === 'savings') this.redirectTo('/savingsapproval');
    else if(this.activatedroute.snapshot.data.type === 'credit') this.redirectTo('/creditapproval');
    else this.redirectTo('/loanapproval');
  }
  fnGetCreditApprovals(){
    this.oTransactionService.fngetNeedToApproveTransactionInfo().subscribe((data) =>{
      this.aApprovals = data as any;
      this.oTransactionModel = new Transaction()
      console.log(data);
    });

  }
  fnChangeApprovalStatus(approval: any, status: string) {
    if (this.activatedroute.snapshot.data.type === 'savings') {
      if (status == 'Approved') approval.sStatus = 'Active';
      approval.sIsApproved = status;

      let msg = '';
     // if (approval.oTransactionInfo[0].sIsApproved == 'Pending') msg = '<br /> Transaction id "' + approval.oTransactionInfo[0].nTransactionId + '" is need to be Approved';
      this.oSavingstypeService.fnChangeSavingTypeStatus(approval).subscribe((data) => {
        if ((data as any).status == "Success") {
          this.fnSuccessMessage(approval.sTypeofSavings + ' is ' + status + ' Successfully' + msg);
          this.redirectTo('/savingsapproval');
        } else{
          approval.sIsApproved = 'Pending';
          approval.sStatus = 'InActive';
          this.fnWarningMessage((data as any).message);
        } 
        this.bDisableButton = false;
      }, (error) => {
        approval.sIsApproved = 'Pending';
        approval.sStatus = 'InActive';
        this.bDisableButton = false;
      });
    }
    else if (this.activatedroute.snapshot.data.type === 'credit') {
      approval.sIsApproved = status;
      let amount = approval.nDebitAmount !== 0 ? approval.nDebitAmount : approval.nCreditAmount;
      this.oTransactionService.fnChangeApprovedStatus(approval).subscribe((data) => {
        if ((data as any).status == "Success") {
          this.fnSuccessMessage('Transaction : ' + approval.sAccountType + '-' + amount + ' is ' + status + ' Successfully.');
          this.redirectTo('/creditapproval');
        }else if((data as any).status == "A-P-Pending"){
          approval.sIsApproved = 'Pending';
          this.fnWarningMessage((data as any).message);
        } 
        else{
          approval.sIsApproved = 'Pending';
          this.fnWarningMessage((data as any).message);
        }
        this.bDisableButton = false;
      }, (error) => {
        approval.sIsApproved = 'Pending';
        this.bDisableButton = false;
      });
    }
    else {
      if (status == 'Approved') approval.sLoanStatus = 'Active';
      else approval.sLoanStatus = 'InActive';
      approval.sIsApproved = status;
      let msg = '';
      //if (approval.oTransactionInfo[0].sIsApproved == 'Pending') msg = '<br /> Transaction id "' + approval.oTransactionInfo[0].nTransactionId + '" is need to be Approved';
      this.oCreditLoanService.fnChangeCreditLoanStatus(approval).subscribe((data) => {
        if ((data as any).status == "Success") {
          this.fnSuccessMessage(approval.sTypeofLoan + ' is ' + status + ' Successfully' + msg);
          this.redirectTo('/loanapproval');
        } else{
          approval.sIsApproved = 'Pending';
          approval.sLoanStatus = 'InActive';
          this.fnWarningMessage((data as any).message);
        } 
        this.bDisableButton = false;
      }, (error) => {
        approval.sIsApproved = 'Pending';
        approval.sLoanStatus = 'InActive';
        this.bDisableButton = false;
      });
    }
  }

  fnSuccessMessage(msg : string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: msg,
      showConfirmButton: true,
     // timer: 3500
    });
  }

  fnWarningMessage(msg : string){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: true,
     // timer: 3500
    });
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
 fnConfirmationMessage(approval : any,status: string){
   this.bDisableButton = true ;
   let name='';
   let amount = '' ;
   if(this.activatedroute.snapshot.data.type === 'savings'){
      name = approval.sTypeofSavings;
      amount = approval.nMaturityAmount;
   }
   else if(this.activatedroute.snapshot.data.type === 'credit'){
    name = approval.sAccountType;
    if(approval.nDebitAmount !== 0) amount = approval.nDebitAmount;
    else amount = approval.nCreditAmount;
   }
   else {
    name = approval.sTypeofLoan;
    amount = approval.nSanctionAmount;
   }
  Swal.fire(
    {
      position: 'center',
      icon: 'question',
      title: 'Do you want to change the present status('+approval.sIsApproved+') of "'+name+'" as "'+status+'"?',
      text: 'A/C : '+approval.sAccountNo + '  Name: "'+name+'" Amount: "'+amount+'"',
      showConfirmButton: true,
      confirmButtonColor : '#00FF00',
      cancelButtonColor : '#FF0000',
      confirmButtonText : 'Yes',
      cancelButtonText : 'No',
      showCancelButton: true
    }
  ).then((result) => {
    if (result.isConfirmed) {
      Swal.close();
      this.fnChangeApprovalStatus(approval,status);
    }else this.bDisableButton = false ;
  });
 }
}
