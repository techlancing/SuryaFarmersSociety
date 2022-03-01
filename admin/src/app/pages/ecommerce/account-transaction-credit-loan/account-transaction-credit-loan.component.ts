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
    this.oCreditLoanModel = new CreditLoan();
    this.oCreditLoanModel.sIsApproved = 'Pending' ;
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
    this.oCreditLoanModel.sEndofLoanDate = new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");

      this.oCreditLoanService.fnAddCreditLoanInfo(this.oCreditLoanModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
        this.redirectTo('/creditloan');
      });
  }

  fnCalculateTotalAmount() : void {
    if(this.oCreditLoanModel.nSanctionAmount && this.oCreditLoanModel.nIntrest && this.oCreditLoanModel.nLoanDays!==null ){  // && this.oCreditLoanModel.nLoanMonths!==null this.oCreditLoanModel.nLoanMonths*30+
      let interest = (this.oCreditLoanModel.nSanctionAmount * this.oCreditLoanModel.nIntrest * this.oCreditLoanModel.nLoanDays)/(365*100);
      this.oCreditLoanModel.nTotalAmount= Number((Math.round((this.oCreditLoanModel.nSanctionAmount+interest)*100)/100).toFixed(2)); //this.oCreditLoanModel.nSanctionAmount+Number((Math.round(interest*100)/100).toFixed(2));
      console.log(this.oCreditLoanModel.nTotalAmount);
      console.log(interest);
      this.fnCalculateEMIAmount();
    }
  }


  fnCalculateDays(): void{

    if (typeof this.oCreditLoanModel.sDate === 'object' &&
      typeof this.oCreditLoanModel.sEndofLoanDate === 'object') {
      this.oCreditLoanModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sDate);//new Date(this.oCreditLoanModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
      this.oCreditLoanModel.sEndofLoanDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sEndofLoanDate);//new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oCreditLoanModel.sEndofLoanDate.split("-").reverse().join("-"))) - +(new Date(this.oCreditLoanModel.sDate.split("-").reverse().join("-")))
      this.oCreditLoanModel.nLoanDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }
  
    if (typeof this.oCreditLoanModel.sDate === 'object' &&
      this.oCreditLoanModel.sEndofLoanDate.length > 8) {
      this.oCreditLoanModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sDate);//new Date(this.oCreditLoanModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oCreditLoanModel.sEndofLoanDate.split("-").reverse().join("-"))) - +(new Date(this.oCreditLoanModel.sDate.split("-").reverse().join("-")))
      this.oCreditLoanModel.nLoanDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }
  
    if (this.oCreditLoanModel.sDate.length > 8 &&
      typeof this.oCreditLoanModel.sEndofLoanDate === 'object') {
      this.oCreditLoanModel.sEndofLoanDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sEndofLoanDate);//new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oCreditLoanModel.sEndofLoanDate.split("-").reverse().join("-"))) - +(new Date(this.oCreditLoanModel.sDate.split("-").reverse().join("-")))
      this.oCreditLoanModel.nLoanDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }
    this.fnCalculateTotalAmount();
  }

  fnCalculateEMIAmount() : void {
    if(this.oCreditLoanModel.nSanctionAmount && this.oCreditLoanModel.nIntrest && this.oCreditLoanModel.nLoanDays!==null  && this.oCreditLoanModel.sInstallmentType){
        // let totalDays=this.oCreditLoanModel.nLoanMonths*30+this.oCreditLoanModel.nLoanDays;
        let emiamountp=this.oCreditLoanModel.nTotalAmount / this.oCreditLoanModel.nLoanDays;
        let emiamount = Number((Math.round((emiamountp)*100)/100).toFixed(2));
        console.log(emiamount*this.oCreditLoanModel.nLoanDays*100);
        if(this.oCreditLoanModel.sInstallmentType==='Daily')
          this.oCreditLoanModel.nInstallmentAmount = emiamount;
        else if(this.oCreditLoanModel.sInstallmentType==='Weekly') {
          // let remainingDays = this.oCreditLoanModel.nLoanDays % 7;
          // this.oCreditLoanModel.nTotalInstallments = Math.floor(this.oCreditLoanModel.nLoanDays / 7) + 1;
          // this.oCreditLoanModel.nLastInstallmentAmount = Number((Math.round((remainingDays * emiamountp)*100)/100).toFixed(2));
          if(this.oCreditLoanModel.nLoanDays>=7)  this.oCreditLoanModel.nInstallmentAmount = Number((Math.round(emiamountp*7*100)/100).toFixed(2));
          else  this.oCreditLoanModel.nInstallmentAmount = Number((Math.round((emiamountp*this.oCreditLoanModel.nLoanDays*100))/100).toFixed(2));
        }
        else{
          // let remainingDays = this.oCreditLoanModel.nLoanDays % 30;
          // this.oCreditLoanModel.nTotalInstallments = Math.floor(this.oCreditLoanModel.nLoanDays / 30) + 1;
          // this.oCreditLoanModel.nLastInstallmentAmount = Number((Math.round((remainingDays * emiamountp)*100)/100).toFixed(2));
          if(this.oCreditLoanModel.nLoanDays>=30) this.oCreditLoanModel.nInstallmentAmount = Number((Math.round((emiamountp*30*100))/100).toFixed(2));
          else this.oCreditLoanModel.nInstallmentAmount = Number((Math.round((emiamountp*this.oCreditLoanModel.nLoanDays*100))/100).toFixed(2));
        }
         
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
