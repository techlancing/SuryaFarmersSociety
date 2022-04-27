import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DailySavingsDeposit } from '../../../core/models/dailysavingsdeposit.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { DailySavingDebitService } from '../../../core/services/dailysavingdebit.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { DailySavingDebit } from 'src/app/core/models/dailysavingdebit.model';
import {UtilitydateService} from '../../../core/services/utilitydate.service';
import { DebitService } from 'src/app/core/services/debit.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { SavingsType } from 'src/app/core/models/savingstype.model';
import { NarrationstringService } from 'src/app/core/services/narrationstring.service';
import { Debit } from 'src/app/core/models/debit.model';

@Component({
  selector: 'app-daily-savings-deposit',
  templateUrl: './daily-savings-deposit.component.html',
  styleUrls: ['./daily-savings-deposit.component.scss']
})
export class DailySavingsDepositComponent implements OnInit {

  bankaccounts: Array<DailySavingsDeposit>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: DailySavingsDeposit;
  @Output() savingDepositClicked = new EventEmitter<any>();

  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  public headerText : string;
  public bPdfPrint : boolean = false ;
  aUsers: Array<BankEmployee>;
  aSavingDeposit : any ;
  aSelectTransaction : any ;
  aSavingsAndDailySavingsDeposit : any ;
  sSelectedSavingType : string ;
  bIsBtnActive : boolean ;
  oSelectedBankAccount : BankAccount ;
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
  public oDropZoneConfig: DropzoneConfigInterface = {
    // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/BankAccount/upload_file",//"/nodejs/car/upload_file", 
  maxFilesize: 100,
  maxFiles: 1
  };
  public bShowLoanData :boolean;

  public aTransactionModel : any;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  public sSuccessMsg: string;
  public bIsDeposit : boolean;
 // oDebitModel: Debit;
  oDailySavingsDepositModel : DailySavingDebit;
  
  constructor(private oBankAccountService: BankAccountService,
              private oDailySavingsDepositService :DailySavingDebitService,
              private oDebitService : DebitService,
              private modalService: NgbModal,
              public activatedroute : ActivatedRoute,
              private router: Router,
              private oBankEmployeeService: BankEmployeeService,
              private oUtilitydateService : UtilitydateService,
              private oSavingstypeService : SavingstypeService,
              private oNarrationstringService : NarrationstringService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    
    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
       this.aUsers = users;
     });

    // if(this.bIsDeposit) this.headerText = "Daily Deposit Account";
    // else this.headerText = "Daily WithDrawal Account";
   // this.oDebitModel = new Debit();
    this.oDailySavingsDepositModel = new DailySavingDebit();
    //  this.oDailySavingsDepositModel.nTotaldays=1;
    this.bIsAddActive = false;
    this.bIsEditActive = false;

    if(this.activatedroute.snapshot.data.type === 'deposit'){
      this.sButtonText = 'Deposit & Send SMS';
      this.sSuccessMsg = 'Amount deposited sucessfully.'
      this.bIsDeposit = true;
    }else{
      this.sButtonText = 'Withdraw & Send SMS';
      this.sSuccessMsg = 'Amount withdrawn sucessfully.'
      this.bIsDeposit = false;
    }
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
 fnEnableButton(): void{
  if(this.sSelectedSavingType.length > 0 ){
    this.bIsBtnActive = true;
  }
}

  fnGetSavingsAccountTransactions(oSelectedAccount : BankAccount){
    this.oDailySavingsDepositModel.sAccountNo = oSelectedAccount.sAccountNo;
    this.oDailySavingsDepositModel.nAccountId = oSelectedAccount.nAccountId;
    this.oSelectedBankAccount = oSelectedAccount ;
    this.oBankAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((data) => {
      this.aTransactionModel = data as any;
      //this.bShowLoanData = true;
     
    });
    this.fnGetSavingDepositAccounts(oSelectedAccount);
  }
  fnGetSavingDepositAccounts(oSelectedAccount : BankAccount){
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo(oSelectedAccount.sAccountNo).subscribe((data) => {
      this.aSavingDeposit = data as any ;
      this.aSavingDeposit.push({
        sAccountNo : oSelectedAccount,
        sTypeofSavings : 'Savings Account'
      });
      console.log(data);
      
    });
  }
  fnGetSavingsDeposit(){
    if (this.sSelectedSavingType === 'Savings Account')
      this.bShowLoanData = true;
    else if (this.sSelectedSavingType === 'Daily Deposit'){
      this.aSavingDeposit.map((savingdeposit) => {
        if(savingdeposit.sTypeofSavings === this.sSelectedSavingType){
          savingdeposit.transactiontype = 'deposit' ;
          this.oSavingstypeService.oSavingsDeposit.next(savingdeposit);
          //this.redirectTo("/savingstypedeposittransaction");
          this.oDailySavingsDepositService.oDailySavingDepositAccount.next(this.oSelectedBankAccount);
      this.redirectTo("/dailysavingdebit");
        }
      });
      
    }
    else {
      this.aSavingDeposit.map((savingdeposit) => {
        if(savingdeposit.sTypeofSavings === this.sSelectedSavingType){
          savingdeposit.transactiontype = 'deposit' ;
          this.oSavingstypeService.oSavingsDeposit.next(savingdeposit);
          this.redirectTo("/savingstypedeposittransaction");
        }
      });
    }
  }
  // new Date("dateString") is browser-dependent and discouraged, so we'll write
// a simple parse function for U.S. date format (which does no error checking)
fnParseDate(str) {
  var mdy = str.split('-');
  return new Date(mdy[2], mdy[1],mdy[0]-1 );
}

fnDatediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second-first)/(1000*60*60*24));
}

// fnCalculateTotalAmount(): void{
//   if(this.oDailySavingsDepositModel.nDayAmount !== undefined && this.oDailySavingsDepositModel.nTotaldays !== undefined){
//     this.oDailySavingsDepositModel.nAmount = this.oDailySavingsDepositModel.nDayAmount * this.oDailySavingsDepositModel.nTotaldays;
//   }
  
// }

  fnOnDailySavingsDepositInfoSubmit(): void {
    this.oDailySavingsDepositModel.sNarration = this.oNarrationstringService.fnNarrationModification(this.oDailySavingsDepositModel.sNarration);
    // this.oDebitModel.nDayAmount=this.oDailySavingsDepositModel.nAmount;
    if (typeof this.oDailySavingsDepositModel.sStartDate === 'object') {
      this.oDailySavingsDepositModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingsDepositModel.sStartDate);
      // this.oDebitModel.sStartDate=this.oDebitModel.sEndDate;
    }
    if(this.oDailySavingsDepositModel.sStartDate == ''|| this.oDailySavingsDepositModel.nAmount == null 
    ||this.oDailySavingsDepositModel.sAccountNo == ''|| this.oDailySavingsDepositModel.sReceiverName == ''||
    this.oDailySavingsDepositModel.sNarration == ''){
        this.fnEmptyFieldsMessage();
        return;
    }
    if (this.bIsDeposit) {
      this.oDailySavingsDepositService.fnAddSavingsDebitInfo(this.oDailySavingsDepositModel).subscribe((data) => {

        this.fnSucessMessage();
        this.redirectTo('/dailysavingsdeposit');
      });
    }
    /*
    else{
      this.oDebitService.fnWithDrawDailySavingDepositInfo(this.oDailySavingsDepositModel).subscribe((data) => {
        
        this.fnSucessMessage();
        this.redirectTo('/withdrawal');
      });
    }
    */
  }
  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: this.sSuccessMsg,
      showConfirmButton: false,
      timer: 1500
    });
  }
  fnEmptyFieldsMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please Fill All the Fields',
      showConfirmButton: false,
      timer: 1500
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
  fnPrintPassBook(): void{
    window.print();
  }

}
