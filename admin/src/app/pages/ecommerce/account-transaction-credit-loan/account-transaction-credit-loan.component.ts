import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CreditLoanService } from '../../../core/services/creditloan.service';
import { CreditLoan } from '../../../core/models/creditloan.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { BankAccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { textChangeRangeIsUnchanged } from 'typescript';
import {UtilitydateService} from '../../../core/services/utilitydate.service';
@Component({
  selector: 'app-account-transaction-credit-loan',
  templateUrl: './account-transaction-credit-loan.component.html',
  styleUrls: ['./account-transaction-credit-loan.component.scss']
})
export class AccountTransactionCreditLoanComponent implements OnInit {


  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditCreditLoan: CreditLoan;

  public oCreditLoanModel: CreditLoan;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

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
  
  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  public aBankAccounts: Array<BankAccount>;
  public sSelectedAccount: string;
  aUsers: Array<BankEmployee>;


  constructor(private oCreditLoanService: CreditLoanService,
    private oBankAccountService: BankAccountService,
            public router: Router,
              private modalService: NgbModal,
              private oBankEmployeeService: BankEmployeeService,
              private oUtilitydateService : UtilitydateService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add CreditLoan', active: true }];
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
    // this.aState = [
    //   {
    //     displayText: 'Telangana',
    //     value: '01'
    //   },
    //   ];  
    
    this.oCreditLoanModel = new CreditLoan();
    this.sButtonText = 'Send SMS & Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditCreditLoan));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
   this.oBankAccountService.fngetBankAccountInfo().subscribe((data) => {
      this.aBankAccounts = [...data as any];
    });
  }

  fnGetActiveAccount(oActiveAccount: BankAccount){
    this.oCreditLoanModel.sAccountNo = oActiveAccount.sAccountNo;
  }

  fnOnCreditLoanInfoSubmit(): void {
    //this.bIsAddActive = true;

    this.oCreditLoanModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sDate);//new Date(this.oCreditLoanModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
    //this.oCreditLoanModel.sEndofLoanDate = new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");

      this.oCreditLoanService.fnAddCreditLoanInfo(this.oCreditLoanModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
        this.redirectTo('/creditloan');
      });
  }

  fnCalculateTotalAmount() : void {
    if(this.oCreditLoanModel.nSanctionAmount && this.oCreditLoanModel.nIntrest && this.oCreditLoanModel.nLoanDays!==null && this.oCreditLoanModel.nLoanMonths!==null){
      console.log("entered");
      let interest = this.oCreditLoanModel.nSanctionAmount * this.oCreditLoanModel.nIntrest * (this.oCreditLoanModel.nLoanMonths*30+this.oCreditLoanModel.nLoanDays)/(365*100); 
      this.oCreditLoanModel.nTotalAmount=this.oCreditLoanModel.nSanctionAmount+Number((Math.round(interest)).toFixed(0));
      console.log(this.oCreditLoanModel.nTotalAmount);
      this.fnCalculateEMIAmount();
    }
  }

  fnCalculateEMIAmount() : void {
    if(this.oCreditLoanModel.nSanctionAmount && this.oCreditLoanModel.nIntrest && this.oCreditLoanModel.nLoanDays!==null && this.oCreditLoanModel.nLoanMonths!==null){
        let totalDays=this.oCreditLoanModel.nLoanMonths*30+this.oCreditLoanModel.nLoanDays;
        let emiamount = Number((Math.round((this.oCreditLoanModel.nTotalAmount / totalDays)*100)/100).toFixed(2));
    
        if(this.oCreditLoanModel.sInstallmentType==='Daily')
          this.oCreditLoanModel.nInstallmentAmount = emiamount;
        else if(this.oCreditLoanModel.sInstallmentType==='Weekly')
        this.oCreditLoanModel.nInstallmentAmount = emiamount*7;
        else this.oCreditLoanModel.nInstallmentAmount = emiamount*30;
         
      }
  }

  
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
  
  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'CreditLoan is created sucessfully.',
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
