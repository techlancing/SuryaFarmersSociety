import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { BankEmployee } from 'src/app/core/models/bankemployee.model';
import { SavingsType } from 'src/app/core/models/savingstype.model';
import { BankAccountService } from 'src/app/core/services/account.service';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { UtilitydateService } from 'src/app/core/services/utilitydate.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import Swal from 'sweetalert2';
import { isThisTypeNode } from 'typescript';

@Component({
  selector: 'app-savings-types',
  templateUrl: './savings-types.component.html',
  styleUrls: ['./savings-types.component.scss']
})
export class SavingsTypesComponent implements OnInit {
  public aBankAccounts: Array<BankAccount>;
  public aBankEmployees: Array<BankEmployee>
  public breadCrumbItems: any;
  public aTypeofSavings: Array<any>;
  public oSavingsTypeModel: SavingsType;
  public sButtonText: string;
  public sSavingDepositName : string ;
  public nTotalMonths : number ;
  @Input() bHideBreadCrumb: boolean = false;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  constructor(private oBankAccountService: BankAccountService,
    private oBankEmployeeService: BankEmployeeService,
    private router: Router, private oUtilitydateService: UtilitydateService,
    private oSavingstypeService: SavingstypeService) { }

  ngOnInit(): void {
    this.aTypeofSavings = [
      {
        displayText: 'Daily Deposit Saving',
        value: '01'
      },
      {
        displayText: 'Fixed Deposit Saving',
        value: '02'
      },
      {
        displayText: 'Recuring Deposit Saving',
        value: '03'
      },
      {
        displayText: 'Monthly Deposit Saving',
        value: '04'
      },
      {
        displayText: 'Pension Deposit Saving',
        value: '05'
      },
      {
        displayText: 'Child Deposit Saving',
        value: '06'
      },
      {
        displayText: 'Education Deposit Saving',
        value: '07'
      }
    ];
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add SavingsType', active: true }];
    this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((data) => {
      this.aBankAccounts = [...data as any];
    });

    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users: any) => {
      console.log('users', users);
      this.aBankEmployees = users;
    });
    this.oSavingsTypeModel = new SavingsType();
    this.oSavingsTypeModel.sIsApproved = 'Pending' ;
    this.sButtonText = 'Send SMS & Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    this.sSavingDepositName = 'New Savings Deposit' ;
  }

  fnGetActiveAccount(oActiveAccount: BankAccount) {
    this.oSavingsTypeModel.sAccountNo = oActiveAccount.sAccountNo;
    console.log(this.oSavingsTypeModel.sAccountNo);
  }

  fnOnCreditLoanInfoSubmit(): void {
    //this.bIsAddActive = true;

    this.oSavingsTypeModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sStartDate);
    this.oSavingsTypeModel.sMaturityDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sMaturityDate);
    this.oSavingsTypeModel.sPensionInterestAddDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sPensionInterestAddDate);
    this.oSavingsTypeModel.sMonthInterestAddDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sMonthInterestAddDate);
    this.oSavingstypeService.fnAddSavingsDepositInfo(this.oSavingsTypeModel).subscribe((data) => {
      console.log(data);
      this.fnSucessMessage();
      this.redirectTo('/savingstype');
    });
  }
  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: this.oSavingsTypeModel.sTypeofSavings+' is created sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  fnCalculateTotalAmount() {
    if (this.oSavingsTypeModel.nDepositAmount !== null && this.oSavingsTypeModel.nIntrest !== null && 
      this.oSavingsTypeModel.nSavingDays !== null && this.oSavingsTypeModel.nSavingMonths !== null
      && this.oSavingsTypeModel.sTypeofSavings !== '') {
      if(this.oSavingsTypeModel.sTypeofSavings == 'Pension Deposit Saving') {
        this.oSavingsTypeModel.nMaturityAmount = this.oSavingsTypeModel.nDepositAmount ;
      } 
      else this.fnCalculateInterest(); 
    }

  }

  fnCalculateTotalDays() {
    this.fnCalculateTotalMonthsYearsDays(this.oSavingsTypeModel.sStartDate,this.oSavingsTypeModel.sMaturityDate);
    if (typeof this.oSavingsTypeModel.sStartDate === 'object' &&
      typeof this.oSavingsTypeModel.sMaturityDate === 'object') {
      this.oSavingsTypeModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sStartDate);//new Date(this.oDailySavingDebitModel.sStartDate).toISOString().split('T')[0].split("-").reverse().join("-");
      this.oSavingsTypeModel.sMaturityDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sMaturityDate);//new Date(this.oDailySavingDebitModel.sMaturityDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oSavingsTypeModel.sMaturityDate.split("-").reverse().join("-"))) - +(new Date(this.oSavingsTypeModel.sStartDate.split("-").reverse().join("-")))
      this.oSavingsTypeModel.nSavingTotalDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }

    if (typeof this.oSavingsTypeModel.sStartDate === 'object' &&
      this.oSavingsTypeModel.sMaturityDate.length > 8) {
      this.oSavingsTypeModel.sStartDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sStartDate);//new Date(this.oDailySavingDebitModel.sStartDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oSavingsTypeModel.sMaturityDate.split("-").reverse().join("-"))) - +(new Date(this.oSavingsTypeModel.sStartDate.split("-").reverse().join("-")))
      this.oSavingsTypeModel.nSavingTotalDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }

    if (this.oSavingsTypeModel.sStartDate.length > 8 &&
      typeof this.oSavingsTypeModel.sMaturityDate === 'object') {
      this.oSavingsTypeModel.sMaturityDate = this.oUtilitydateService.fnChangeDateFormate(this.oSavingsTypeModel.sMaturityDate);//new Date(this.oDailySavingDebitModel.sMaturityDate).toISOString().split('T')[0].split("-").reverse().join("-");
      const diffInMs = +(new Date(this.oSavingsTypeModel.sMaturityDate.split("-").reverse().join("-"))) - +(new Date(this.oSavingsTypeModel.sStartDate.split("-").reverse().join("-")))
      this.oSavingsTypeModel.nSavingTotalDays = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
    }
    this.fnCalculateTotalAmount();
  }

  fnCalculateTotalMonthsYearsDays(d1, d2) {
    debugger
    if(typeof d1 === 'object' && typeof d2 === 'object'){
      this.fnCalculateTotalMonths(d1,d2)
    }else if(typeof d1 === 'object' && d2.length > 8){
      this.fnCalculateTotalMonths(d1,new Date(d2.split("-").reverse().join("-")));
    }else if(d1.length > 8 && typeof d2 === 'object'){
      this.fnCalculateTotalMonths(new Date(d1.split("-").reverse().join("-")),d2);
    }else{
      this.fnCalculateTotalMonths(new Date(d1.split("-").reverse().join("-")),new Date(d2.split("-").reverse().join("-")));
    }

  }
  fnCalculateTotalMonths(d1,d2){
    let todate = d2.getDate();
      let fromdate = d1.getDate();
      this.nTotalMonths =  (d2.getFullYear() - d1.getFullYear())*12 - d1.getMonth() + d2.getMonth() ;
      if(todate >= fromdate) this.oSavingsTypeModel.nSavingDays = todate - fromdate ;
      else {
        this.oSavingsTypeModel.nSavingDays = fromdate - todate ;
        this.nTotalMonths -= 1;
      }
      this.oSavingsTypeModel.nSavingTotalYears = Number(Math.floor(this.nTotalMonths/12).toFixed(0)); 
      this.oSavingsTypeModel.nSavingMonths = this.nTotalMonths - this.oSavingsTypeModel.nSavingTotalYears * 12 ;
  }
  fnUpdateSavingsDepositName(){
    this.sSavingDepositName = this.oSavingsTypeModel.sTypeofSavings ;
    this.fnCalculateTotalAmount();
  }
  
  fnCalculateInterest(){
    debugger
    let principalAmount = 0 ;
    for(let i=0 ; i < this.nTotalMonths; i++){
      principalAmount += this.oSavingsTypeModel.nDepositAmount ;
      principalAmount += (principalAmount * 30 * this.oSavingsTypeModel.nIntrest)/(365*100);
    }
    if(this.oSavingsTypeModel.nSavingDays !== 0){
      principalAmount += this.oSavingsTypeModel.nDepositAmount ;
      principalAmount += (principalAmount * this.oSavingsTypeModel.nSavingDays * this.oSavingsTypeModel.nIntrest)/(365*100);
    }
    this.oSavingsTypeModel.nMaturityAmount = Number((Math.round(principalAmount*100)/100).toFixed(2)) ;
  }
}
