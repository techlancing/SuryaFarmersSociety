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

  

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankAccount;
  bFristButton : boolean = false;
  bSecondButton : boolean = false;

  
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

  aTransactions : any;
  

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  
  
  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanServcie : CreditLoanService,
    private oAccountService: BankAccountService,
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
    
    this.sButtonText = 'Print';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
    
  }

  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.oCreditLoanServcie.fngetCreditLoanInfo(oSelectedAccount.sAccountNo).subscribe((loandata)=>{
      this.aCreditLoan = loandata as any;
      this.oAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((savingdata)=>{
        this.aTransactions = savingdata as any;
        console.log(this.aTransactions);
      });
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
  
  fnPrintSavingAccount(): void{
    this.bFristButton = true;
    this.bSecondButton = false;
    window.print();
  }

  fnPrintLoanAccount(): void{
    this.bFristButton = false;
    this.bSecondButton = true;
    window.print();
  }

}  
