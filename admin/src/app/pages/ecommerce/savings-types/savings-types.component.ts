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
    this.oBankAccountService.fngetBankAccountInfo().subscribe((data) => {
      this.aBankAccounts = [...data as any];
    });

    this.oBankEmployeeService.fngetBankEmployeeInfo().subscribe((users: any) => {
      console.log('users', users);
      this.aBankEmployees = users;
    });
    this.oSavingsTypeModel = new SavingsType();
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
    if (this.oSavingsTypeModel.nDepositAmount && this.oSavingsTypeModel.nIntrest && this.oSavingsTypeModel.nSavingDays !== null && this.oSavingsTypeModel.nSavingMonths !== null) {
      let interest = this.oSavingsTypeModel.nDepositAmount * this.oSavingsTypeModel.nIntrest * (this.oSavingsTypeModel.nSavingTotalDays) / (365 * 100);
      this.oSavingsTypeModel.nMaturityAmount = this.oSavingsTypeModel.nDepositAmount + Number((Math.round(interest*100) / 100).toFixed(2));
      console.log(this.oSavingsTypeModel.nMaturityAmount);
      console.log(interest);
      // this.fnCalculateEMIAmount();
    }

  }

  fnCalculateTotalDays() {

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
    this.oSavingsTypeModel.nSavingTotalYears = Number(Math.floor(this.oSavingsTypeModel.nSavingTotalDays/365).toFixed(0));
    this.oSavingsTypeModel.nSavingMonths = Number(Math.floor(this.oSavingsTypeModel.nSavingTotalDays/30-this.oSavingsTypeModel.nSavingTotalYears*12).toFixed(0));
    this.oSavingsTypeModel.nSavingDays = this.oSavingsTypeModel.nSavingTotalDays-(this.oSavingsTypeModel.nSavingTotalYears*365+this.oSavingsTypeModel.nSavingMonths*30);
    console.log("Months=",this.oSavingsTypeModel.nSavingMonths,"years= ",this.oSavingsTypeModel.nSavingTotalYears,"days=",this.oSavingsTypeModel.nSavingDays);
  }

  fnUpdateSavingsDepositName(){
    this.sSavingDepositName = this.oSavingsTypeModel.sTypeofSavings ;
  }
}
