import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BankEmployee } from 'src/app/core/models/bankemployee.model';
import { Debit } from 'src/app/core/models/debit.model';
import { SavingsType } from 'src/app/core/models/savingstype.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UtilitydateService } from 'src/app/core/services/utilitydate.service';
import { DebitService } from 'src/app/core/services/debit.service';
import { BankAccountService } from 'src/app/core/services/account.service';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { environment } from 'src/environments/environment';
import { NarrationstringService } from 'src/app/core/services/narrationstring.service';

@Component({
  selector: 'app-savings-type-deposit-transaction',
  templateUrl: './savings-type-deposit-transaction.component.html',
  styleUrls: ['./savings-type-deposit-transaction.component.scss']
})
export class SavingsTypeDepositTransactionComponent implements OnInit {
  aBankEmployees : Array<BankEmployee> ;
  oSavingsDepositModel : Debit;
  breadCrumbItems : Array<any> ;
  sButtonText : string ;
  sSuccessMsg :  string ;
  oAccountprintmodel : BankAccount ;
  bIsAccountData : boolean ;
  @Input() oSavingsDeposit : any;
  sImageRootPath: string;
  sTransactionString: string;
  constructor(private oBankEmployeeService : BankEmployeeService,
    private oSavingstypeService : SavingstypeService,
    private router : Router,
    private oUtilitydateService : UtilitydateService,
    private oDebitService : DebitService,
    private oBankAccountService : BankAccountService,
    private oNarrationstringService : NarrationstringService) { }

  ngOnInit(): void {
    this.sImageRootPath = environment.imagePath;
    this.oSavingstypeService.oSavingsDeposit.subscribe((data) => {
      this.oSavingsDeposit = data as any ;
      this.fnFecthAccountDetails();
     });
    this.breadCrumbItems = [{ label: 'Transactions' }, { label: this.oSavingsDeposit.sTypeofSavings, active: true }];
    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((employees : any)=>{
      console.log('users',employees);
       this.aBankEmployees = employees;
     });
     this.oSavingsDepositModel = new Debit();
     if(this.oSavingsDeposit.transactiontype === 'deposit'){
      this.sButtonText = 'Deposit & Send SMS';
      this.sTransactionString = this.oSavingsDeposit.sTypeofSavings+' - Debit' ;
     }
     if (this.oSavingsDeposit.transactiontype === 'withdraw'){
        this.sButtonText = 'Withdraw & Send SMS';
        this.sTransactionString = this.oSavingsDeposit.sTypeofSavings+' - Crebit' ;
     }
     
  }

  fnOnSavingsDepositInfoSubmit() {
    this.oSavingsDepositModel.sNarration = this.oNarrationstringService.fnNarrationModification(this.oSavingsDepositModel.sNarration);
    this.oSavingsDepositModel.sAccountNo = this.oSavingsDeposit.sAccountNo;
    this.oSavingsDepositModel.nLoanId = this.oSavingsDeposit.nSavingsId;
    //this.oDailySavingsDepositModel.nDayAmount=this.oDailySavingsDepositModel.nAmount;
    if (typeof this.oSavingsDepositModel.sDate === 'object')
      this.oSavingsDepositModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsDepositModel.sDate);
    if (this.oSavingsDepositModel.sDate == '' || this.oSavingsDepositModel.sAccountNo == '' ||
      this.oSavingsDepositModel.nAmount == null || this.oSavingsDepositModel.sNarration == '' ||
      this.oSavingsDepositModel.sReceiverName == '') {
      this.fnEmptyFieldsMessage();
      return;
    }
    if (this.oSavingsDeposit.transactiontype === 'deposit') {
      this.oSavingstypeService.fnAddSavingsDepositTransactionInfo(this.oSavingsDepositModel).subscribe((data) => {
        console.log(data);
        this.sSuccessMsg = 'Amount Successfully Deposited';
        this.fnSucessMessage((data as any).id);
        this.redirectTo('/dailysavingsdeposit');
      });
    }
    if (this.oSavingsDeposit.transactiontype === 'withdraw') {
      this.oSavingstypeService.fnAddSavingsWithdrawTransactionInfo(this.oSavingsDepositModel).subscribe((data) => {
        console.log(data);
        if (data == 'Low Balance') this.fnLowBalanceWarningMessage();
        else {
          this.sSuccessMsg = 'Amount Withdrawl Successfully Completed';
          this.fnSucessMessage((data as any).id);
          this.redirectTo('/withdrawal');
        }
      });
    }
  }

  fnClear(){
    this.oSavingsDepositModel.sDate = '';
    this.oSavingsDepositModel.nAmount = null ;
    this.oSavingsDepositModel.sReceiverName ='';
    this.oSavingsDepositModel.sNarration = '';
  }

  fnFecthAccountDetails(): void{
    this.oBankAccountService.fngetBankAccountInfoByNumber(this.oSavingsDeposit.sAccountNo).subscribe((data) => {
      this.oAccountprintmodel = data as any;
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
fnSucessMessage(transactionid) {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: this.sSuccessMsg + '<br /> Transaction id "'+transactionid+ '" is need to be Approved.',
    showConfirmButton: true,
    //timer: 1500
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

redirectTo(uri:string){
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
  this.router.navigate([uri]));
}


}
