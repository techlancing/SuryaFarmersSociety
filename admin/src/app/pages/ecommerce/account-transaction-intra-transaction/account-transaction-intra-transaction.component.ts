import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { IntraTransaction } from '../../../core/models/intratransaction.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { IntraTransactionService } from 'src/app/core/services/intratransaction.service';
import { CreditLoan } from 'src/app/core/models/creditloan.model';
import { Router } from '@angular/router';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import {UtilitydateService} from '../../../core/services/utilitydate.service';
import { NarrationstringService } from 'src/app/core/services/narrationstring.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { SavingsType } from 'src/app/core/models/savingstype.model';

@Component({
  selector: 'app-account-transaction-intra-transaction',
  templateUrl: './account-transaction-intra-transaction.component.html',
  styleUrls: ['./account-transaction-intra-transaction.component.scss']
})
 export class IntraTransactionComponent implements OnInit {

   bankaccounts: Array<IntraTransaction>;
   @Output() updateClicked = new EventEmitter();
   @Output() addClicked = new EventEmitter();
   @Input() oEditBankAccount: IntraTransaction;
 
   public ointratransactionModel: IntraTransaction;
   nSelectedEditIndex: number;
   bIsAddActive: boolean;
   bIsEditActive: boolean;
   aUsers: Array<BankEmployee>;
   sSelectedSenderSavingType : string = '';
 
   @ViewChild('_BankAccountFormElem')
   public oBankAccountfoFormElem: any;
 
   @ViewChild('addcardropzoneElem')
   public oDropZone: DropzoneComponent;
   aState : Array<
   {
     displayText:string,
     value:string
   }>;
   aDesignation : Array<
   {
     displayText:string,
     value:string
   }>;
   aMandal : Array<
   {
     displayText:string,
     value:string
   }>;
   aVillage : Array<
   {
     displayText:string,
     value:string
   }>;
   aBranchCode  : Array<
   {
     displayText:string,
     value:string
   }>;
   sSendNarration ='';
   sRecieveNarration='';
   public oDropZoneConfig: DropzoneConfigInterface = {
     // Change this to your upload POST address:
   url: environment.apiUrl + "nodejs/BankAccount/upload_file",//"/nodejs/car/upload_file", 
   maxFilesize: 100,
   maxFiles: 1
   };
 
   // bread crumb items
   breadCrumbItems: Array<{}>;
   @Input() bHideBreadCrumb: boolean = false;
   @Input() bHideCateogryList: boolean = false;
 
   public sButtonText: string;
   @Input() bisEditMode: boolean;
   public aCreditLoan : Array<CreditLoan>;
   public sAccountype: string;
   aLoanIssueEmployee : Array<
  {
    displayText:string,
    value:string
  }>;
  aSavingType: any=[];
  bShowReciever: boolean;
  bShowFormDetails: boolean;
  aSavingDeposit = [];
  bIsBtnActive: boolean;
  oSelectedSenderSavingtype: any = null;
  bSenderSavingType: boolean;
  nAccountBalance: any;
  oSelectedSenderAccount: BankAccount;
   
   constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanService: CreditLoanService,
    private oIntraTransactionService: IntraTransactionService,
    private router: Router,
               private modalService: NgbModal,
               private oBankEmployeeService: BankEmployeeService,
               private oUtilitydateService : UtilitydateService,
               private oNarrationstringService : NarrationstringService,
               private oSavingstypeService : SavingstypeService) { }
 
   ngOnInit(): void {
     this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];

     this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
       this.aUsers = users;
     });


     this.aLoanIssueEmployee = [
      {
        displayText: 'Venkanna',
        value:'01'
      },
      {
        displayText: 'Bhaskar',
        value:'02'
      },
      {
        displayText: 'Naresh',
        value:'03'
      }
    ];
     this.aDesignation = [
       {
         displayText: 'Manager',
         value:'01'
       },
       
     ];
     this.aState = [
       {
         displayText: 'Telangana',
         value: '01'
       },
       ];
     
     this.ointratransactionModel = new IntraTransaction();
     this.sButtonText = 'Send SMS & Save & Submit';
     this.bIsAddActive = false;
     this.bIsEditActive = false;
     if (this.bisEditMode) {
       // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
       // this.oBankAccountModel = tempobj;
       this.sButtonText = 'Update';
     }
     this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((data) => {
       //this.aBankAccountTypes = [...data as any];
 
     });
   }

   fnGetSavingDepositAccounts(oSenderAccount : BankAccount){
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo(oSenderAccount.sAccountNo).subscribe((data) => {
      this.aSavingDeposit = data as any ;
      this.aSavingDeposit.push({
        sAccountNo : oSenderAccount,
        sTypeofSavings : 'Savings Account'
      });
      console.log(data);
      
    });
  }
  fnEnableButton(): void{
    if(this.sSelectedSenderSavingType.length > 0 ){
      this.bIsBtnActive = true;
    }
  }

  fnFecthAccountBalance(){    
    this.oBankAccountService.fnGetSingleAccountBalance(this.oSelectedSenderAccount.sAccountNo).subscribe((cdata) => {
    this.nAccountBalance = cdata as any;
    this.bShowReciever = true ;
    });
  }
  fnFetchSavingTypeBalance(oSavingsTpe : SavingsType){
    this.oSavingstypeService.fnGetSingleSavingTypeBalance(oSavingsTpe.sAccountNo, oSavingsTpe.sIsApproved, oSavingsTpe.nSavingsId).subscribe((data) => {
      this.nAccountBalance = data as any;
      this.bShowReciever = true ;
    });
  }

  fnGetSavingsDeposit(){
    if (this.sSelectedSenderSavingType !== 'Savings Account'){
      this.aSavingDeposit.map((savingdeposit) => {
        if(savingdeposit.sTypeofSavings === this.sSelectedSenderSavingType){
          this.ointratransactionModel.nSenderAccountId = savingdeposit.nSavingsId;
          this.ointratransactionModel.sSenderAccountType = 'savingtype';
          this.oSelectedSenderSavingtype = savingdeposit ;
          this.fnFetchSavingTypeBalance(savingdeposit);
        }
      });
    }
    if (this.sSelectedSenderSavingType == 'Savings Account'){
      this.fnFecthAccountBalance();
    }
  }

   fnGetCreditLoans(){
     
    this.sAccountype = 'savings'
    this.oCreditLoanService.fngetCreditLoanInfo(this.ointratransactionModel.sRecieverAccountNumber).subscribe((loandata)=>{
      this.aCreditLoan = loandata as any;
    });
  }


   fnGetSenderAccount(oSelectedAccount : BankAccount){
    this.oSelectedSenderAccount = oSelectedAccount;
    this.ointratransactionModel.sSenderAccountNumber = oSelectedAccount.sAccountNo;
    this.ointratransactionModel.nSenderAccountId = oSelectedAccount.nAccountId;
    this.ointratransactionModel.sSenderAccountType = 'savings';
    this.bSenderSavingType = true;
    this.bShowReciever = false;
    this.bShowFormDetails = false;
    this.sSelectedSenderSavingType = '';
    this.nAccountBalance = null;
    this.fnOnUpdateNarration();
    this.fnGetSavingDepositAccounts(oSelectedAccount);
    //this.ointratransactionModel.sNarration = `From Acc No: ${this.ointratransactionModel.sSenderAccountNumber}`
   }

   fnGetReceiverAccount(oSelectedAccount : BankAccount){
    this.ointratransactionModel.sRecieverAccountNumber = oSelectedAccount.sAccountNo;
    this.ointratransactionModel.nReceiverAccountId = oSelectedAccount.nAccountId;
    this.ointratransactionModel.sRecieverAccountType = '';
    this.fnOnUpdateNarration();
    this.bShowFormDetails = true ;
   // this.ointratransactionModel.sNarration = this.ointratransactionModel.sNarration+`   To Acc No: ${this.ointratransactionModel.sRecieverAccountNumber}`
   }
   fnGetSavingTypes(){
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo(this.ointratransactionModel.sRecieverAccountNumber).subscribe((data) => {
      this.aSavingType = data as any;
    });
   }
 
  fnOnIntraTransactionInfoSubmit() {
    this.ointratransactionModel.sNarration = this.oNarrationstringService.fnNarrationModification(this.ointratransactionModel.sNarration);
    this.ointratransactionModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.ointratransactionModel.sDate);
    // this.oBankAccountService.fnGetSingleAccountBalance(this.ointratransactionModel.sSenderAccountNumber).subscribe((cdata) => {
    //   if (cdata && (cdata >= this.ointratransactionModel.nAmount)) {
    if(this.ointratransactionModel.sDate == '' || this.ointratransactionModel.sRecieverAccountNumber == ''||
     this.ointratransactionModel.sSenderAccountNumber == ''|| this.ointratransactionModel.sTransactionEmployee == ''||
     this.ointratransactionModel.nAmount == null ||this.ointratransactionModel.sNarration == ''||
      this.ointratransactionModel.nSenderAccountId == null||this.ointratransactionModel.nReceiverAccountId == null){
        this.fnEmptyFieldsMessage()
        return;
    }
    this.bIsAddActive =true;
    this.oIntraTransactionService.fnAddIntraTransactionInfo(this.ointratransactionModel).subscribe((data) => {
      console.log(data);
      if ((data as any).status == 'Success'){
        this.fnSucessMessage((data as any).id);
        this.redirectTo('/intratransaction');
      } 
      else if((data as any).status == 'low'){
        this.fnLowBalanceWarningMessage();
      }
      else if((data as any).status == 'A-S-Pending'){
        this.fnWarningMessage(`Transaction "${(data as any).id}" of A/C "${this.ointratransactionModel.sSenderAccountNumber}"-"${this.ointratransactionModel.sSenderAccountType}" is Pending`);
      }
      else if((data as any).status == 'A-R-Pending'){
        this.fnWarningMessage(`Transaction "${(data as any).id}" of A/C "${this.ointratransactionModel.sRecieverAccountNumber}"-"${this.ointratransactionModel.sRecieverAccountType}" is Pending`);
      }
      this.bIsAddActive = false;
    },(error) => {
      this.bIsAddActive = false;
    });
    // }
    //   else
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'info',
    //       title: 'Sender account doesnot have sufficient balance',
    //       showConfirmButton: false,
    //       timer: 3000
    //     });
    // });
  }
  fnWarningMessage(msg : string) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: true
      //timer: 1500
    });
  }
  fnLowBalanceWarningMessage() {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'Sender account doesnot have sufficient balance',
      showConfirmButton: false,
      timer: 3000
    });
  }
   redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
 
 
 
   fnUpdateParentAfterEdit() {
     this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((cdata) => {
       // this.fnEditSucessMessage();
       this.bankaccounts = [];
       console.log(this.bankaccounts);
       this.bankaccounts = [...cdata as any];
       console.log(this.bankaccounts);
       //this.oCreditModel.sState = '';
       this.modalService.dismissAll();
     });
   }
 
 
 
   fnSucessMessage(transactionid) {
     Swal.fire({
       position: 'center',
       icon: 'success',
       title: 'State is saved sucessfully.'+'<br /> Transaction id "'+transactionid+'" are need to be Approved.',
       showConfirmButton: true,
      //  timer: 1500
     });
   }
 
   fnEmptyFieldsMessage() {
     Swal.fire({
       position: 'center',
       icon: 'warning',
       title: 'Please Fill All the Fields',
       showConfirmButton: false,
       timer: 2000
     });
   }

   fnClear(){
    this.redirectTo('/intratransaction');
   }
   fnOnUpdateNarration(){
    this.ointratransactionModel.sNarration=`From Acc No: ${this.ointratransactionModel.sSenderAccountNumber}`+`   To Acc No: ${this.ointratransactionModel.sRecieverAccountNumber}`;
   }
   // fnDuplicateCarNameMessage() {
   //   Swal.fire({
   //     position: 'center',
   //     icon: 'warning',
   //     title: 'Car Name is already exists',
   //     showConfirmButton: false,
   //     timer: 2000
   //   });
   // }
 
   // fnEditSucessMessage() {
   //   Swal.fire({
   //     position: 'center',
   //     icon: 'success',
   //     title: 'Car is updated sucessfully.',
   //     showConfirmButton: false,
   //     timer: 1500
   //   });
   // }
   /**
    * Open modal
    * @param content modal content
    */
   openModal(content: any, index) {
     this.nSelectedEditIndex = index;
 
     this.modalService.open(content, { centered: true });
 
   }
 
 } 

