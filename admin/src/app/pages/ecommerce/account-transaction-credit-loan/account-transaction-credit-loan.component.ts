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
import * as moment from 'moment';
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
  bLoadFrameDetails: boolean;
  nMonths : number ;


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
      },
      {
        displayText: 'Quarterly',
        value:'04'
      },
      {
        displayText: 'Half-Yearly',
        value:'05'
      },
      {
        displayText: 'Yearly',
        value:'06'
      }
    ];

    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users : any)=>{
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
   this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((data) => {
      this.aBankAccounts = [...data as any];
    });
  }

  fnGetActiveAccount(oActiveAccount: BankAccount){
    this.oCreditLoanModel.sAccountNo = oActiveAccount.sAccountNo;
    this.bLoadFrameDetails = true ;
  }

  fnOnCreditLoanInfoSubmit(): void {
    //this.bIsAddActive = true;
    if(
      this.oCreditLoanModel.sAccountNo == '' ||
        this.oCreditLoanModel.nSanctionAmount == null ||
        this.oCreditLoanModel.nIntrest == null ||
        // this.oCreditLoanModel.nLoanMonths == null ||
        this.oCreditLoanModel.nLoanDays == null ||
        this.oCreditLoanModel.nTotalAmount == null ||
        this.oCreditLoanModel.sDate == '' ||        
        this.oCreditLoanModel.sTypeofLoan == '' ||
        this.oCreditLoanModel.sInstallmentType == '' ||
        this.oCreditLoanModel.nInstallmentAmount == null || 
        this.oCreditLoanModel.sEndofLoanDate == '' ||       
        this.oCreditLoanModel.nLetPenaltyPercentage == null ||        
        this.oCreditLoanModel.sEmployeeName == '' 
    ){
      this.fnWarningMessage('Please Fill All the Fields');
      return ;
    }
    this.oCreditLoanModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sDate);//new Date(this.oCreditLoanModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
    this.oCreditLoanModel.sEndofLoanDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sEndofLoanDate);//new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");

      this.oCreditLoanService.fnAddCreditLoanInfo(this.oCreditLoanModel).subscribe((data) => {
        console.log(data);
        if(data == 'Success'){
          this.fnSucessMessage(this.oCreditLoanModel.sTypeofLoan);
          this.redirectTo('/creditloan');
        }else{
          this.fnWarningMessage(this.oCreditLoanModel.sTypeofLoan+' is Already Exists');
        }
        
      });
  }

  fnCalculateMonthsFromDates() {
    if (this.oCreditLoanModel.sDate.length > 8 &&
      this.oCreditLoanModel.sEndofLoanDate.length > 8) {
      const getDate = (date) => moment(date, 'DD/MM/YYYY').startOf('month')
      const diff = Math.abs(getDate(this.oCreditLoanModel.sDate).diff(getDate(this.oCreditLoanModel.sEndofLoanDate), 'months'));
      return diff;
    }
  }

  fnCalculateTotalAmount() : void {
    if(this.oCreditLoanModel.nSanctionAmount && this.oCreditLoanModel.nIntrest && this.oCreditLoanModel.nLoanDays!==null ){  // && this.oCreditLoanModel.nLoanMonths!==null this.oCreditLoanModel.nLoanMonths*30+
      const nprincipalAmt = this.oCreditLoanModel.nSanctionAmount;
      //let nIntrest = this.oCreditLoanModel.nIntrest / 1200;
      let nIntrest = this.oCreditLoanModel.nSanctionAmount*this.oCreditLoanModel.nLoanDays*this.oCreditLoanModel.nIntrest/(365*100)
     // const nMonths = this.fnCalculateMonthsFromDates();
      this.nMonths = this.fnCalculateMonthsFromDates();
      this.oCreditLoanModel.nTotalAmount = Number((Math.round((nIntrest + this.oCreditLoanModel.nSanctionAmount)*100)/100).toFixed(2));
     // this.oCreditLoanModel.nInstallmentAmount = Math.round(nprincipalAmt * nIntrest / (1-(Math.pow(1/(1 + nIntrest), nMonths)))*100)/100; 
      //this.oCreditLoanModel.nTotalAmount = Math.round((this.oCreditLoanModel.nInstallmentAmount * nMonths)*100)/100;
      this.oCreditLoanModel.nInstallmentAmount = Math.round((this.oCreditLoanModel.nTotalAmount / this.nMonths)*100)/100 ;
     // let intrest = Math.round((this.oCreditLoanModel.nTotalAmount*1 - nprincipalAmt*1)*100)/100
      this.fnCalculateEMIAmount();
    }
  }


  fnCalculateDays(): void{

    if (typeof this.oCreditLoanModel.sDate === 'object' &&
      typeof this.oCreditLoanModel.sEndofLoanDate === 'object') {
      this.oCreditLoanModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sDate);//new Date(this.oCreditLoanModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
      this.oCreditLoanModel.sEndofLoanDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sEndofLoanDate);//new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");

      const diffInMs = +(new Date(this.oCreditLoanModel.sEndofLoanDate.split("-").reverse().join("-"))) - +(new Date(this.oCreditLoanModel.sDate.split("-").reverse().join("-")))
      console.log('months',diffInMs);
      this.oCreditLoanModel.nLoanDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }
  
    if (typeof this.oCreditLoanModel.sDate === 'object' &&
      this.oCreditLoanModel.sEndofLoanDate.length > 8) {
      this.oCreditLoanModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sDate);//new Date(this.oCreditLoanModel.sDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oCreditLoanModel.sEndofLoanDate.split("-").reverse().join("-"))) - +(new Date(this.oCreditLoanModel.sDate.split("-").reverse().join("-")))
      console.log('months',diffInMs);
      this.oCreditLoanModel.nLoanDays = (diffInMs / (1000 * 60 * 60 * 24))+ 1;
    }
  
    if (this.oCreditLoanModel.sDate.length > 8 &&
      typeof this.oCreditLoanModel.sEndofLoanDate === 'object') {
      this.oCreditLoanModel.sEndofLoanDate = this.oUtilitydateService.fnChangeDateFormate(this.oCreditLoanModel.sEndofLoanDate);//new Date(this.oCreditLoanModel.sEndofLoanDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oCreditLoanModel.sEndofLoanDate.split("-").reverse().join("-"))) - +(new Date(this.oCreditLoanModel.sDate.split("-").reverse().join("-")))
      console.log('months',diffInMs);
      this.oCreditLoanModel.nLoanDays = (diffInMs / (1000 * 60 * 60 * 24))+ 1;
    }
    this.fnCalculateTotalAmount();
  }

  fnCalculateEMIAmount() : void {
    if(this.oCreditLoanModel.nSanctionAmount && 
      this.oCreditLoanModel.nIntrest && 
      this.oCreditLoanModel.nLoanDays!==null  && 
      this.oCreditLoanModel.sInstallmentType){
        
        if(this.oCreditLoanModel.sInstallmentType==='Daily')
          this.oCreditLoanModel.nInstallmentAmount = Math.round(this.oCreditLoanModel.nTotalAmount/this.oCreditLoanModel.nLoanDays * 100)/100;
        else if(this.oCreditLoanModel.sInstallmentType==='Weekly') {
          this.oCreditLoanModel.nInstallmentAmount = Math.round(this.oCreditLoanModel.nTotalAmount/(this.oCreditLoanModel.nLoanDays/7) * 100)/100;
        }
        else if(this.oCreditLoanModel.sInstallmentType==='Quarterly') {
          this.oCreditLoanModel.nInstallmentAmount = Math.round((this.oCreditLoanModel.nTotalAmount / this.nMonths)*3* 100)/100;
        }
        else if(this.oCreditLoanModel.sInstallmentType==='Half-Yearly') {
          this.oCreditLoanModel.nInstallmentAmount = Math.round((this.oCreditLoanModel.nTotalAmount / this.nMonths)*6* 100)/100;
        }
        else if(this.oCreditLoanModel.sInstallmentType==='Yearly') {
          this.oCreditLoanModel.nInstallmentAmount = Math.round((this.oCreditLoanModel.nTotalAmount / this.nMonths)*12* 100)/100;
        }
      }
  }

  
  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }
  
  fnSucessMessage(loan : string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: loan+' is created sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnWarningMessage(msg : string) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnClear(){
   // this.oCreditLoanModel.sAccountNo = '';
    this.oCreditLoanModel.sDate = '';
    this.oCreditLoanModel.sEndofLoanDate = '';
    this.oCreditLoanModel.nSanctionAmount = null;
    this.oCreditLoanModel.nIntrest = null;
    this.oCreditLoanModel.nLoanDays = null;
    this.oCreditLoanModel.nTotalAmount = null;
    this.oCreditLoanModel.sInstallmentType = '';
    this.oCreditLoanModel.sTypeofLoan = '';
    this.oCreditLoanModel.nInstallmentAmount = null;
    this.oCreditLoanModel.nLetPenaltyPercentage = null;
    this.oCreditLoanModel.sEmployeeName = '';
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
