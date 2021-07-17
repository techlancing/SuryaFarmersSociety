import { Component, OnInit } from '@angular/core';
import {  EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { CreditLoan } from 'src/app/core/models/creditloan.model';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';

@Component({
  selector: 'app-all-transaction-print',
  templateUrl: './all-transaction-print.component.html',
  styleUrls: ['./all-transaction-print.component.scss']
})
export class AllTransactionPrintComponent implements OnInit {

  aBankAccounts: Array<BankAccount>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankAccount;

  public oAlltransactionprintmodel: BankAccount;
  public aCreditLoan : Array<CreditLoan>;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  public sSelectedAccount: string;
  
  bIsBtnActive: boolean;
  bIsAccountData: boolean;
  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  // aState : Array<
  // {
  //   displayText:string,
  //   value:string
  // }>;
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
  
  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanServcie : CreditLoanService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
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
    this.aInstallmentType = [
      {
        displayText: 'Daily',
        value:'01'
      },
      {
        displayText: 'Weekly',
        value:'02'
      },
      {
        displayText: 'Monthly',
        value:'03'
      }
    ];
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
    // this.aState = [
    //   {
    //     displayText: 'Telangana',
    //     value: '01'
    //   },
    //   ];  
    
    this.oAlltransactionprintmodel = new BankAccount();
    this.sButtonText = 'Print';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.fnGetAllAccounts();
  }

  fnCreateAccountDetails(){
    // this.oCreditModel.sBranchCode = this.oCreditModel.sState + 
    // this.oCreditModel.sDesignation + this.oCreditModel.sMandal + 
    // this.oCreditModel.sVillage;
    // this.oCreditModel.sAccountNo = this.oCreditModel.sBranchCode + '0001';
    // this.oCreditModel.sCustomerId = this.oCreditModel.sBranchCode + '0002';
  }

  fnResetState() {
    // this.oCreditModel.sState = '';
  }

  fnGetAccountNumber(): void{
    if(this.sSelectedAccount.length > 0 ){
      this.bIsBtnActive = true;
    }
  }

  fnFecthAccountDetails(): void{
    this.oBankAccountService.fngetBankAccountInfoByNumber(this.sSelectedAccount).subscribe((data) => {
      this.oAlltransactionprintmodel = data as any;
      this.bIsAccountData = true;
      this.oCreditLoanServcie.fngetCreditLoanInfo(this.sSelectedAccount).subscribe((loandata)=>{
        this.aCreditLoan = loandata as any;
      });
    });
  }



  fnGetAllAccounts() {
    this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
      // this.fnEditSucessMessage();
      this.aBankAccounts = [];
      console.log(this.aBankAccounts);
      this.aBankAccounts = [...cdata as any];
      console.log(this.aBankAccounts);
      //this.oCreditModel.sState = '';
      this.modalService.dismissAll();
    });
  }



  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'State is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyCarNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Car Name',
      showConfirmButton: false,
      timer: 2000
    });
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
