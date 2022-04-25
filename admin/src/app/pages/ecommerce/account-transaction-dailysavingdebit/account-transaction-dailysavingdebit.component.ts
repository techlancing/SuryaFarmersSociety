import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DailySavingDebit } from '../../../core/models/dailysavingdebit.model';
import { Credit } from '../../../core/models/credit.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { DailySavingDebitService } from '../../../core/services/dailysavingdebit.service';
import { CreditService } from '../../../core/services/credit.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { UtilitydateService } from '../../../core/services/utilitydate.service';
import { OperationCanceledException } from 'typescript';
import { NarrationstringService } from 'src/app/core/services/narrationstring.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';

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
  public headerText: string;
  aUsers: Array<BankEmployee>;
  nBalance: number;
  sSelectedSavingType: string;
  aSavingDeposit: any;
  bIsBtnActive: boolean;
  oSelectedBankAccount: BankAccount;
  oCreditModel: Credit;
  sLedgerHeading: string;
  oSavingsDeposit: any = [];
  sTransactionString: string;
  public bPdfPrint: boolean = false;
  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  aState: Array<
    {
      displayText: string,
      value: string
    }>;
  aDesignation: Array<
    {
      displayText: string,
      value: string
    }>;
  aMandal: Array<
    {
      displayText: string,
      value: string
    }>;
  aVillage: Array<
    {
      displayText: string,
      value: string
    }>;
  aBranchCode: Array<
    {
      displayText: string,
      value: string
    }>;
  public oDropZoneConfig: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    url: environment.apiUrl + "nodejs/BankAccount/upload_file",//"/nodejs/car/upload_file", 
    maxFilesize: 100,
    maxFiles: 1
  };
  public bShowLoanData: boolean;

  aLoanIssueEmployee: Array<
    {
      displayText: string,
      value: string
    }>;

  public aTransactionModel: any;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  public sSuccessMsg: string;
  public bIsDeposit: boolean;

  constructor(private oBankAccountService: BankAccountService,
    private oDailySavingDebitService: DailySavingDebitService,
    private oCreditService: CreditService,
    private modalService: NgbModal,
    public activatedroute: ActivatedRoute,
    private router: Router,
    private oBankEmployeeService: BankEmployeeService,
    private oUtilitydateService: UtilitydateService,
    private oSavingstypeService: SavingstypeService,
    private oNarrationstringService: NarrationstringService) { }

  ngOnInit(): void {
    debugger
    if (this.bIsDeposit) {
      this.headerText = "Daily Deposit Account";
    } else {
      this.headerText = "Daily Saving WithDrawal Account";
    }

    this.breadCrumbItems = [{ label: 'Transactions' }, { label: this.headerText, active: true }];

    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users: any) => {
      console.log('users', users);
      this.aUsers = users;
    });

    this.oDailySavingDebitModel = new DailySavingDebit();

    this.bIsAddActive = false;
    this.bIsEditActive = false;

    if (this.activatedroute.snapshot.data.type === 'deposit') {
      this.sButtonText = 'Deposit & Send SMS';
      this.sSuccessMsg = 'Amount deposited sucessfully.';
      this.sLedgerHeading = 'Daily Saving ';
      this.sTransactionString = this.sLedgerHeading + ' - Debit';
      this.bIsDeposit = true;
      this.oSavingstypeService.oSavingsDeposit.subscribe((data) => {
        this.oSavingsDeposit = data as any;
      });
      this.oDailySavingDebitService.oDailySavingDepositAccount.subscribe((account) => {
        console.log("account in dailsaving deposit", account);
        this.fnGetAccountDetails(account);
      });

    } else if (this.activatedroute.snapshot.data.type === 'depositwithdrawl') {
      this.sButtonText = 'Withdraw & Send SMS';
      this.sSuccessMsg = 'Amount withdrawn sucessfully.';
      this.sLedgerHeading = 'Daily Saving ';
      this.sTransactionString = this.sLedgerHeading + ' - Credit';
      this.oSavingstypeService.oSavingsDeposit.subscribe((data) => {
        this.oSavingsDeposit = data as any;
        this.fnGetSavingTypeInfo();
      });
      this.oDailySavingDebitService.oDailySavingDepositAccount.subscribe((account) => {
        this.fnGetAccountDetails(account);
      });

    } else {
      this.sLedgerHeading = 'Savings Account';
      this.sTransactionString = this.sLedgerHeading + ' - Credit';
      this.sButtonText = 'Withdraw & Send SMS';
      this.sSuccessMsg = 'Amount withdrawn sucessfully.';
      this.bIsDeposit = false;
      this.oCreditModel = new Credit();
    }

  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  fnGetAccountDetails(oSelectedAccount: BankAccount) {
    debugger
    this.oDailySavingDebitModel.sAccountNo = oSelectedAccount.sAccountNo;

    this.oSelectedBankAccount = oSelectedAccount;
    if (this.activatedroute.snapshot.data.type !== 'deposit' && this.activatedroute.snapshot.data.type !== 'depositwithdrawl')
      this.oBankAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((data) => {
        this.aTransactionModel = data as any;
        this.oDailySavingDebitModel.nAccountId = oSelectedAccount.nAccountId;
        // this.bShowLoanData = true;
      });
    if (this.activatedroute.snapshot.data.type === 'depositwithdrawl' ||
      this.activatedroute.snapshot.data.type === 'deposit') {
      this.bShowLoanData = true;
      this.fnGetSavingTypeInfo();
    }
    if (!(this.activatedroute.snapshot.data.type === 'depositwithdrawl') &&
      !(this.activatedroute.snapshot.data.type === 'deposit'))
      this.fnGetSavingDepositAccounts(oSelectedAccount);
  }


  fnGetSavingDepositAccounts(oSelectedAccount: BankAccount) {
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo(oSelectedAccount.sAccountNo).subscribe((data) => {
      this.aSavingDeposit = data as any;
      this.aSavingDeposit.push({
        sAccountNo: oSelectedAccount,
        sTypeofSavings: 'Savings Account'
      });
      console.log(data);

    });
  }
  // new Date("dateString") is browser-dependent and discouraged, so we'll write
  // a simple parse function for U.S. date format (which does no error checking)
  fnParseDate(str) {
    var mdy = str.split('-');
    return new Date(mdy[2], mdy[1], mdy[0] - 1);
  }

  fnDatediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  fnCalculateDays(): void {

    if (typeof this.oDailySavingDebitModel.sStartDate === 'object' &&
      typeof this.oDailySavingDebitModel.sEndDate === 'object') {
      this.oDailySavingDebitModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingDebitModel.sStartDate);//new Date(this.oDailySavingDebitModel.sStartDate).toISOString().split('T')[0].split("-").reverse().join("-");
      this.oDailySavingDebitModel.sEndDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingDebitModel.sEndDate);//new Date(this.oDailySavingDebitModel.sEndDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oDailySavingDebitModel.sEndDate.split("-").reverse().join("-"))) - +(new Date(this.oDailySavingDebitModel.sStartDate.split("-").reverse().join("-")))
      this.oDailySavingDebitModel.nTotaldays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }

    if (typeof this.oDailySavingDebitModel.sStartDate === 'object' &&
      this.oDailySavingDebitModel.sEndDate.length > 8) {
      this.oDailySavingDebitModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingDebitModel.sStartDate);//new Date(this.oDailySavingDebitModel.sStartDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oDailySavingDebitModel.sEndDate.split("-").reverse().join("-"))) - +(new Date(this.oDailySavingDebitModel.sStartDate.split("-").reverse().join("-")))
      this.oDailySavingDebitModel.nTotaldays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }

    if (this.oDailySavingDebitModel.sStartDate.length > 8 &&
      typeof this.oDailySavingDebitModel.sEndDate === 'object') {
      this.oDailySavingDebitModel.sEndDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingDebitModel.sEndDate);//new Date(this.oDailySavingDebitModel.sEndDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oDailySavingDebitModel.sEndDate.split("-").reverse().join("-"))) - +(new Date(this.oDailySavingDebitModel.sStartDate.split("-").reverse().join("-")))
      this.oDailySavingDebitModel.nTotaldays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }

  }

  fnCalculateTotalAmount(): void {
    if (this.oDailySavingDebitModel.nDayAmount !== undefined && this.oDailySavingDebitModel.nTotaldays !== undefined) {
      this.oDailySavingDebitModel.nAmount = this.oDailySavingDebitModel.nDayAmount * this.oDailySavingDebitModel.nTotaldays;
    }

  }

  fnOnDailySavingDebitInfoSubmit(): void {
    this.oDailySavingDebitModel.sNarration = this.oNarrationstringService.fnNarrationModification(this.oDailySavingDebitModel.sNarration);
    //this.bIsAddActive = true;
    if (typeof this.oDailySavingDebitModel.sStartDate === 'object') {
      this.oDailySavingDebitModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingDebitModel.sStartDate);
    }

    if (typeof this.oDailySavingDebitModel.sEndDate === 'object') {
      this.oDailySavingDebitModel.sEndDate = this.oUtilitydateService.fnChangeDateFormate(this.oDailySavingDebitModel.sEndDate);
    }

    if (this.bIsDeposit) {
      this.oDailySavingDebitService.fnAddDailySavingDepositInfo(this.oDailySavingDebitModel).subscribe((data) => {

        this.fnSucessMessage();
        // this.fnLoadTransactionsAfterSuccess();
        this.redirectTo('/dailysavingdebit');
      });
    }
    else {
      if (this.activatedroute.snapshot.data.type === 'depositwithdrawl') {
        // this.oBankAccountService.fnGetSingleAccountBalance(this.oDailySavingDebitModel.sAccountNo).subscribe((cdata) => {
        //   console.log("cdata", cdata);
        //   this.nBalance = cdata as number;
        //   if (this.nBalance && (this.nBalance >= this.oDailySavingDebitModel.nAmount)) {
        this.oDailySavingDebitService.fnWithDrawDailySavingDepositInfo(this.oDailySavingDebitModel).subscribe((data) => {
          if(data == 'Low Balance') this.fnLowBalanceWarningMessage();
          else {
            this.fnSucessMessage();
            this.redirectTo('/withdrawal');
          }
          // this.fnSucessMessage();
          // this.redirectTo('/withdrawal');
        });
        //   }
        // });
      }
      else {
        // this.oBankAccountService.fnGetSingleAccountBalance(this.oDailySavingDebitModel.sAccountNo).subscribe((cdata) => {
        //   console.log("cdata", cdata);
        //   this.nBalance = cdata as number;
        //   if (this.nBalance && (this.nBalance >= this.oDailySavingDebitModel.nAmount)) {
            this.oDailySavingDebitModel.sStartDate = this.oDailySavingDebitModel.sEndDate;
            this.oDailySavingDebitService.fnWithDrawSavingsInfo(this.oDailySavingDebitModel).subscribe((data) => {
              if(data == 'Low Balance') this.fnLowBalanceWarningMessage();
              else {
                this.fnSucessMessage();
                this.redirectTo('/withdrawal');
              }
            });
        //   }
        // });
      }
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
  fnLowBalanceWarningMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Low balance Amount',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEnableButton(): void {
    if (this.sSelectedSavingType.length > 0) {
      this.bIsBtnActive = true;
    }
  }
  fnGetSavingsDeposit() {
    if (this.sSelectedSavingType === 'Savings Account')
      this.bShowLoanData = true;
    else if (this.sSelectedSavingType === 'Daily Deposit') {
      this.aSavingDeposit.map((savingdeposit) => {
        if (savingdeposit.sTypeofSavings === this.sSelectedSavingType) {
          savingdeposit.transactiontype = 'withdraw';
          this.oSavingstypeService.oSavingsDeposit.next(savingdeposit);
          //this.redirectTo("/savingstypedeposittransaction");
          this.oDailySavingDebitService.oDailySavingDepositAccount.next(this.oSelectedBankAccount);
          this.redirectTo("/dailysavingdepositwithdrawl");
        }
      });

    }
    else {
      this.aSavingDeposit.map((savingdeposit) => {
        if (savingdeposit.sTypeofSavings === this.sSelectedSavingType) {
          savingdeposit.transactiontype = 'withdraw';
          this.oSavingstypeService.oSavingsDeposit.next(savingdeposit);
          this.redirectTo("/savingstypedeposittransaction");
        }
      });
    }
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }
  fnPrintPassBook(): void {
    window.print();
  }

  fnGetSavingTypeInfo() {
    this.oSavingstypeService.fnGetSpecificSavingTypeInfo(this.oSavingsDeposit).subscribe((data) => {
      this.oSavingsDeposit = data as any;
      this.aTransactionModel = this.oSavingsDeposit.oTransactionInfo;
      this.oDailySavingDebitModel.nAccountId = this.oSavingsDeposit.nSavingsId;
    })
  }

}

