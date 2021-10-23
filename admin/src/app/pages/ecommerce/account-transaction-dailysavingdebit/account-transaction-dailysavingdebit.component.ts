import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DailySavingDebit } from '../../../core/models/dailysavingdebit.model';
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

@Component({
  selector: 'app-account-transaction-dailysavingdebit',
  templateUrl: './account-transaction-dailysavingdebit.component.html',
  styleUrls: ['./account-transaction-dailysavingdebit.component.scss']
})
export class AccountTransactionDailysavingdebitComponent implements OnInit {

  bankaccounts: Array<DailySavingDebit>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: DailySavingDebit;

  public oDailySavingDebitModel: DailySavingDebit;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  aUsers: Array<BankEmployee>;

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

  aLoanIssueEmployee : Array<
  {
    displayText:string,
    value:string
  }>;

  public aTransactionModel : any;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  public sSuccessMsg: string;
  public bIsDeposit : boolean;
  
  constructor(private oBankAccountService: BankAccountService,
              private oDailySavingDebitService : DailySavingDebitService,
              private modalService: NgbModal,
              public activatedroute : ActivatedRoute,
              private router: Router,
              private oBankEmployeeService: BankEmployeeService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((users : any)=>{
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
    
    this.oDailySavingDebitModel = new DailySavingDebit();
    
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

  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.oDailySavingDebitModel.sAccountNo = oSelectedAccount.sAccountNo;
    this.oDailySavingDebitModel.nAccountId = oSelectedAccount.nAccountId;
    this.oBankAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((data) => {
      this.aTransactionModel = data as any;
      this.bShowLoanData = true;
    });
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

fnCalculateDays(): void{
  if(this.oDailySavingDebitModel.sStartDate !== undefined && this.oDailySavingDebitModel.sEndDate !== undefined){
    
    const diffInMs   = +(new Date(this.oDailySavingDebitModel.sEndDate)) - +(new Date(this.oDailySavingDebitModel.sStartDate))
    this.oDailySavingDebitModel.nTotaldays  = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
  } 
  
}

fnCalculateTotalAmount(): void{
  if(this.oDailySavingDebitModel.nDayAmount !== undefined && this.oDailySavingDebitModel.nTotaldays !== undefined){
    this.oDailySavingDebitModel.nAmount = this.oDailySavingDebitModel.nDayAmount * this.oDailySavingDebitModel.nTotaldays;
  }
  
}

fnOnDailySavingDebitInfoSubmit(): void {
  //this.bIsAddActive = true;
  if(this.bIsDeposit)
  {
    this.oDailySavingDebitService.fnAddDailySavingDepositInfo(this.oDailySavingDebitModel).subscribe((data) => {
      
      this.fnSucessMessage();
      this.redirectTo('/dailysavingdebit');
    });
  }
  else{
    this.oDailySavingDebitService.fnWithDrawDailySavingDepositInfo(this.oDailySavingDebitModel).subscribe((data) => {
      
      this.fnSucessMessage();
      this.redirectTo('/withdrawal');
    });
  }
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


  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }

}

  