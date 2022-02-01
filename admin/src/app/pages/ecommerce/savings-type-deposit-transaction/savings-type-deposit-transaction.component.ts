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
  @Input() oSavingsDeposit : any;
  constructor(private oBankEmployeeService : BankEmployeeService,
    private oSavingstypeService : SavingstypeService,
    private router : Router,
    private oUtilitydateService : UtilitydateService,
    private oDebitService : DebitService) { }

  ngOnInit(): void {
    this.oSavingstypeService.oSavingsDeposit.subscribe((data) => {
      this.oSavingsDeposit = data as any ;
     });
    this.breadCrumbItems = [{ label: 'Transactions' }, { label: this.oSavingsDeposit.sTypeofSavings, active: true }];
    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((employees : any)=>{
      console.log('users',employees);
       this.aBankEmployees = employees;
     });
     this.oSavingsDepositModel = new Debit();
     if(this.oSavingsDeposit.transactiontype === 'deposit'){
      this.sButtonText = 'Deposit & Send SMS';
     }
     if (this.oSavingsDeposit.transactiontype === 'withdraw'){
        this.sButtonText = 'Withdraw & Send SMS'
     }
  }

  fnOnSavingsDepositInfoSubmit() {
    this.oSavingsDepositModel.sAccountNo = this.oSavingsDeposit.sAccountNo;
    this.oSavingsDepositModel.nLoanId = this.oSavingsDeposit.nSavingsId;
    //this.oDailySavingsDepositModel.nDayAmount=this.oDailySavingsDepositModel.nAmount;
    if (typeof this.oSavingsDepositModel.sDate === 'object')
      this.oSavingsDepositModel.sDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsDepositModel.sDate);
    if (this.oSavingsDeposit.transactiontype === 'deposit') {
      this.oSavingstypeService.fnAddSavingsDepositTransactionInfo(this.oSavingsDepositModel).subscribe((data) => {
        console.log(data);
        this.sSuccessMsg = 'Amount Successfully Deposited' ;
        this.fnSucessMessage();
        this.redirectTo('/dailysavingsdeposit');
      });
    }
    if (this.oSavingsDeposit.transactiontype === 'withdraw') {
      this.oSavingstypeService.fnAddSavingsWithdrawTransactionInfo(this.oSavingsDepositModel).subscribe((data) => {
        console.log(data);
        this.sSuccessMsg = 'Amount Withdrawl Successfully Completed';
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

redirectTo(uri:string){
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
  this.router.navigate([uri]));
}


}