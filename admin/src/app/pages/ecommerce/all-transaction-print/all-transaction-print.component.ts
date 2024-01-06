import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import {  EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { CreditLoan } from 'src/app/core/models/creditloan.model';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { SavingsType } from 'src/app/core/models/savingstype.model';
@Component({
  selector: 'app-all-transaction-print',
  templateUrl: './all-transaction-print.component.html',
  styleUrls: ['./all-transaction-print.component.scss']
})
export class AllTransactionPrintComponent implements OnInit, AfterViewChecked{

  

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankAccount;
  @ViewChild('lineNumbers')
  public oLedgerTable : ElementRef ;

  bEmiLoan : boolean = false ;
  bPersonalLoan : boolean = false ;
  bAgriculturalLoan : boolean = false ;
  bGoldLoan : boolean = false ;
  bSilverLoan : boolean = false ;
  bTemporaryLoan : boolean = false ;
  bFirstButton : boolean = false;
  bSecondButton : boolean = false;
  bDaily : boolean =false ;
  bFixed : boolean =false ;
  bRecuring : boolean =false ;
  bMonthly : boolean =false ;
  bPension : boolean =false ;
  bChild : boolean =false ;
  bEducation : boolean =false ;
  sHeaderText : String = 'All Transaction Print';
  bPdf : boolean = false;
  bPrintLine : boolean = true ;
  public bNotFirst : boolean = false;
  public nInputLineFrom1 : number  ;
  public nInputLineTo1 : number ;
  public nInputLineFrom2 : number  ;
  public nInputLineTo2 : number ;
  public lineFrom : number ;
  public lineTo : number
  public aCreditLoan : Array<CreditLoan>;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  public sSelectedAccount: string;
  sAccountNo : string;
  lineDecide : number ;
  
  bIsBtnActive: boolean;
  bIsAccountData: boolean;
  id = null;
  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  aTypeofLoan : Array<
  {
    displayText:string,
    value:string
  }>;
  aInstallmentType : Array<
  {
    displayText:string,
    value:string
  }>;
  aLoanIssueEmployee : Array<
  {
    displayText:string,
    value:string
  }>;

  aTransactions : any;
  

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  aSavingDeposit: any;
  oSelectedAccount: BankAccount;
  user : any ;
  bClosing: boolean;
  
  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanServcie : CreditLoanService,
    private oAccountService: BankAccountService,
    public activatedroute : ActivatedRoute,
    private router: Router,private modalService: NgbModal,
    private oSavingstypeService : SavingstypeService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    
    this.aTypeofLoan = [
      {
        displayText: 'EMI Loan',
        value:'01'
      },
      {
      displayText: 'Personal Loan',
        value:'02'
      },
      {
      displayText: 'Agriculture Loan',
        value:'03'
      },
      {
      displayText: 'Gold Loan',
        value:'04'
      }, 
      {
      displayText: 'Silver Loan',
        value:'05'
      },
      {
      displayText: 'Temporary Loan',
        value:'06'
      }             
    ];
    
    
    this.sButtonText = 'Print';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      this.sButtonText = 'Update';
    }
    if(this.activatedroute.snapshot.data.type === 'statement'){
      this.sHeaderText='Bank Statement';
      this.bPdf =true ;
      this.bClosing = false;
    }
    
    if(this.activatedroute.snapshot.data.type === 'closing'){
      this.sHeaderText='Account Closing';
      this.bPdf =false ;
      this.bClosing = true;
    }
  }

  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.sAccountNo = oSelectedAccount.sAccountNo;
    this.oSelectedAccount = oSelectedAccount ;
    this.oCreditLoanServcie.fngetCreditLoanInfo(oSelectedAccount.sAccountNo).subscribe((loandata)=>{
      this.aCreditLoan = loandata as any;
      this.oAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((savingdata)=>{
        this.aTransactions = savingdata as any;
        console.log(this.aTransactions);
      });
    });
    this.fnGetSavingDepositAccounts(oSelectedAccount);
  }
  fnGetSavingDepositAccounts(oSelectedAccount : BankAccount){
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo(oSelectedAccount.sAccountNo).subscribe((savingdata) => {
      this.aSavingDeposit = savingdata as any;
      console.log(this.aSavingDeposit);
    });
  }


  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;
    this.modalService.open(content, { centered: true });
  }
  
  fnPrintSavingAccount(id): void {
    this.id = id ;
    // this.fnDeactivateSDNgClasses(false,false,false,false,false,false,false);
    // this.fnDeactivateNgClasses(true,false,false,false,false,false,false);
    this.fnConfirmationMessage(this.nInputLineFrom1,this.nInputLineTo1);
  }

  fnPrintLoanAccount(type,id): void {
    this.id = id ;
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
    this.fnConfirmationMessage(this.nInputLineFrom2,this.nInputLineTo2);
  }
  
  fnDeactivateNgClasses(b1,b2,b3,b4,b5,b6,b7){
    this.bFirstButton = b1 ;
    this.bEmiLoan = b2 ;
    this.bPersonalLoan = b3 ;
    this.bAgriculturalLoan = b4 ;
    this.bGoldLoan = b5 ;
    this.bSilverLoan = b6 ;
    this.bTemporaryLoan = b7 ;
  }

  fnPrintSavingDepositAccount(type,id){
    console.log(type);
    this.id = id ;
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
    this.fnConfirmationMessage(this.nInputLineFrom2,this.nInputLineTo2);

  }
  fnDeactivateSDNgClasses(b1,b2,b3,b4,b5,b6,b7){
  this.bDaily  = b1;
  this.bFixed  = b2 ;
  this.bRecuring =  b3;
  this.bMonthly  = b4 ;
  this.bPension  = b5 ;
  this.bChild  = b6 ;
  this.bEducation =  b7;
  }

  fnConfirmationMessage(fromLine: number, toLine: number) {
    fromLine = Number(fromLine);
    toLine = Number(toLine);
    if (fromLine > toLine)
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Please enter proper line numbers.'
      }
      );
    else
      Swal.fire(
        {
          position: 'center',
          icon: 'question',
          title: 'Do you want to print?',
          text: 'From line ' + fromLine + ' to line ' + toLine,
          showConfirmButton: true,
          showCancelButton: true,

        }
      ).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
          this.lineFrom = fromLine ;
          this.lineTo = toLine ;
          this.lineDecide = fromLine % 18 ;
          setTimeout(() => {
            window.print();
            this.id = null;
          }, 300);
        }
      });
  }
  
  fnPrintPdf(type): void {
    
    this.oBankAccountService.proceed = true ;
    this.aCreditLoan.map((loan) => {
      if(loan.sTypeofLoan == type) this.oBankAccountService.sendLoanAccountDetails.next(loan);
    })
    this.aSavingDeposit.map((savings) => {
      if(savings.sTypeofSavings == type) this.oBankAccountService.sendSavingDepositDetails.next(savings);
    })
    //this.oBankAccountService.accountDetails = this.aSavingDeposit[0];
    //this.oBankAccountService.savings = this.oSelectedAccount;
    //localStorage.setItem("savingtype",this.aSavingDeposit[0])
    this.oBankAccountService.pdfGenerationClicked.emit({type : type,Account : this.sAccountNo});
  }

  
  ngAfterViewChecked(): void {
    // let type = 'Daily Deposit';
    // this.oBankAccountService.proceed = true ;
    // this.aCreditLoan.map((loan) => {
    //   if(loan.sTypeofLoan == type) this.oBankAccountService.sendLoanAccountDetails.next(loan);
    // })
    // this.aSavingDeposit.map((savings) => {
    //   if(savings.sTypeofSavings == type) this.oBankAccountService.sendSavingDepositDetails.next(savings);
    // })
    // this.oBankAccountService.pdfGenerationClicked.emit({type : type,Account : this.sAccountNo});
  }
  //deactivating the savingtype
  fnDeactivateSavingType(savingtype : SavingsType){
    savingtype.sStatus = 'InActive'
    this.oSavingstypeService.fnDeactivateSavingType(savingtype.sAccountNo,savingtype.sIsApproved, savingtype.nSavingsId).subscribe((data) =>{
      if(data == 'Success'){
        this.fnSuccessMessage(savingtype.sAccountNo +
          ' - '+savingtype.sTypeofSavings+'( '+savingtype.nMaturityAmount+' )'+' is Closed Successfully.')
          this.fnGetSavingDepositAccounts(this.oSelectedAccount);
      }
      else if(data === 'Pending'){
        this.fnWarningMessage('Withdraw All the Amount in '+savingtype.sAccountNo +
          ' - '+savingtype.sTypeofSavings+'( '+savingtype.nMaturityAmount+' )'+' before Closing it.')
      }
      else if(data === 'Not Exists'){
        this.fnWarningMessage(savingtype.sAccountNo +
          ' - '+savingtype.sTypeofSavings+'( '+savingtype.nMaturityAmount+' )'+' Not Exists.')
      }
    });
  }

// deactivation creditloan
fnDeactivateCreditLoan(creditloan : CreditLoan){
  creditloan.sLoanStatus = 'InActive'
  this.oCreditLoanServcie.fnDeactivateCreditLoan(creditloan.sAccountNo,creditloan.nLoanId).subscribe((data) =>{
    if(data == 'Success'){
      this.fnSuccessMessage(creditloan.sAccountNo +
        ' - '+creditloan.sTypeofLoan+'( '+creditloan.nSanctionAmount+' )'+' is Closed Successfully.')
        this.fnGetCreditLoans(this.oSelectedAccount);
    }
    else if(data === 'Pending'){
      this.fnWarningMessage('Repay '+creditloan.sAccountNo +
        ' - '+creditloan.sTypeofLoan+'('+creditloan.nSanctionAmount+')'+' before Closing it.')
    }
  });
}
  //confirmation message for closing the savingtype account
  fnConfirmationMessageForDeactive(savingtype : SavingsType){
    Swal.fire(
      {
        position: 'center',
        icon: 'question',
        title: 'Do you want to Close ? ',
        text: savingtype.sAccountNo +
        ' - '+savingtype.sTypeofSavings+'( '+savingtype.nMaturityAmount +' )',
        showConfirmButton: true,
        showCancelButton: true,

      }
    ).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
        this.fnDeactivateSavingType(savingtype);
      }
    });
  }

  //confirmation message for closing the savingtype account
  fnConfirmationForCreditLoanDeactive(creditloan : CreditLoan){
    Swal.fire(
      {
        position: 'center',
        icon: 'question',
        title: 'Do you want to Close ? ',
        text: creditloan.sAccountNo +
        ' - '+creditloan.sTypeofLoan+'( '+creditloan.nSanctionAmount +' )',
        showConfirmButton: true,
        showCancelButton: true,

      }
    ).then((result) => {
      if (result.isConfirmed) {
        Swal.close();
        this.fnDeactivateCreditLoan(creditloan);
      }
    });
  }



  fnSuccessMessage(msg : string){
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Successful',
      text: msg
    });
  }

  fnWarningMessage(msg : string){
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'Information',
      text: msg
    });
  }
}  
