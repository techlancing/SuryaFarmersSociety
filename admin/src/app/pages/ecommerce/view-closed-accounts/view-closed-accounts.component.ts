import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { BankAccountService } from 'src/app/core/services/account.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-closed-accounts',
  templateUrl: './view-closed-accounts.component.html',
  styleUrls: ['./view-closed-accounts.component.scss']
})
export class ViewClosedAccountsComponent implements OnInit {
  breadCrumbItems: ({ label: string; active?: undefined; } | { label: string; active: boolean; })[];
  aCreditLoan: any;
  aTransactions: any;
  aSavingDeposit: any;
  nInputLineFrom1 : number;
  nInputLineTo1 : number;
  bEmiLoan : boolean = false ;
  bPersonalLoan : boolean = false ;
  bAgriculturalLoan : boolean = false ;
  bGoldLoan : boolean = false ;
  bSilverLoan : boolean = false ;
  bTemporaryLoan : boolean = false ;
  bDaily : boolean =false ;
  bFixed : boolean =false ;
  bRecuring : boolean =false ;
  bMonthly : boolean =false ;
  bPension : boolean =false ;
  bChild : boolean =false ;
  bEducation : boolean =false ;
  nInputLineFrom2 : number;
  nInputLineTo2 : number;
  public lineFrom : number ;
  public lineTo : number;
  bPdf : boolean = false;
  lineDecide: number;
  bFirstButton : boolean = false;
  bSecondButton : boolean = false;
  bPrintLine : boolean = true ;
  sHeaderText : String = 'View Closed Accounts';
  id = null;

  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanServcie : CreditLoanService,
    private oAccountService: BankAccountService,
    public activatedroute : ActivatedRoute,
    private router: Router,private modalService: NgbModal,
    private oSavingstypeService : SavingstypeService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
  }
  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.oCreditLoanServcie.fnGetClosedCreditLoans(oSelectedAccount.sAccountNo).subscribe((loandata)=>{
      this.aCreditLoan = loandata as any;
      this.oAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((savingdata)=>{
        this.aTransactions = savingdata as any;
        console.log(this.aTransactions);
      });
    });
    this.fnGetSavingDepositAccounts(oSelectedAccount);
  }
  fnGetSavingDepositAccounts(oSelectedAccount : BankAccount){
    this.oSavingstypeService.fnGetClosedSavingDepositAccountsInfo(oSelectedAccount.sAccountNo).subscribe((savingdata) => {
      this.aSavingDeposit = savingdata as any;
      console.log(this.aSavingDeposit);
    });
  }

  fnPrintSavingAccount(id): void {
    this.id = id ;
    // this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    // this.fnDeactivateNgClasses(true,false,false,false,false,false,false);
    this.fnConfirmationMessage();
  }

  // fnDeactivateNgClasses(b1,b2,b3,b4,b5,b6,b7){
  //   this.bFirstButton = b1 ;
  //   this.bEmiLoan = b2 ;
  //   this.bPersonalLoan = b3 ;
  //   this.bAgriculturalLoan = b4 ;
  //   this.bGoldLoan = b5 ;
  //   this.bSilverLoan = b6 ;
  //   this.bTemporaryLoan = b7 ;
  // }

  fnPrintLoanAccount(type, id): void {
    this.id = id;
    console.log(type);
    // if(type === 'EMI Loan'){
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateNgClasses(false,true,false,false,false,false,false);
    // } 
    // else if(type === 'Personal Loan'){
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateNgClasses(false,false,true,false,false,false,false);
    // } 
    // else if(type === 'Agriculture Loan'){
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateNgClasses(false,false,false,true,false,false,false);
    // } 
    // else if(type === 'Gold Loan') {
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateNgClasses(false,false,false,false,true,false,false);
    // }
    // else if(type === 'Silver Loan') {
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateNgClasses(false,false,false,false,false,true,false);
    // } 
    // else {
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,true);
    // }
    this.fnConfirmationMessage();
  }


  fnPrintSavingDepositAccount(type ,id ){
    this.id = id;
    console.log(type);
    // if(type === 'Daily Deposit'){
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false);
    //   this.fnDeactivateSDNgClasses(true,false,false,false,false,false,false);
    // }
    // else if(type === 'Fixed Deposit') {
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false); 
    //   this.fnDeactivateSDNgClasses(false,true,false,false,false,false,false);
    // }
    // else if(type === 'Recuring Deposit'){
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false); 
    //   this.fnDeactivateSDNgClasses(false,false,true,false,false,false,false);
    // } 
    // else if(type === 'Monthly Deposit') {
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false); 
    //   this.fnDeactivateSDNgClasses(false,false,false,true,false,false,false);
    // } 
    // else if(type === 'Pension Deposit') {
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false); 
    //   this.fnDeactivateSDNgClasses(false,false,false,false,true,false,false);
    // } 
    // else if(type === 'Child Deposit') {
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false); 
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,true,false);
    // } 
    // else if(type === 'Education Deposit') {
    //   this.fnDeactivateNgClasses(false,false,false,false,false,false,false); 
    //   this.fnDeactivateSDNgClasses(false,false,false,false,false,false,true);
    // } 
    this.fnConfirmationMessage();

  }
  // fnDeactivateSDNgClasses(b1,b2,b3,b4,b5,b6,b7){
  // this.bDaily  = b1;
  // this.bFixed  = b2 ;
  // this.bRecuring =  b3;
  // this.bMonthly  = b4 ;
  // this.bPension  = b5 ;
  // this.bChild  = b6 ;
  // this.bEducation =  b7;
  // }

  fnConfirmationMessage() {
   
          setTimeout(() => {
             window.print();
            this.id = null;
          }, 300);
      
  }
  



}
