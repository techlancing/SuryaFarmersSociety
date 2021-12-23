import { Component, OnInit } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart, transactions, statData } from './data';
import { ChartType } from './dashboard.model';
import { BankAccountService }from '../../../core/services/account.service';
import {CreditLoanService} from '../../../core/services/creditloan.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions;
  statData;
  nSavingsAccountCount : Number;
  nCreditLoanAccountCount : any;
  nAllCreditLoanBalance : any ;
  nAllSavingsBalance : any ;

  constructor(private oBankAccountService : BankAccountService,
    private oCreditLoanService: CreditLoanService) { }

  ngOnInit() {
    this.oBankAccountService.fngetSavingsBankAccountCountInfo().subscribe((data) => {
      this.nSavingsAccountCount = data as Number;
    });

    this.oBankAccountService.fnGetAllSavingsAccountBalanceInfo().subscribe((data) => {
      this.nAllSavingsBalance= data as Number;
      this.nAllSavingsBalance = Number((Math.round(this.nAllSavingsBalance*100)/100).toFixed(2));
    });

    this.oCreditLoanService.fnGetCreditLoanAccountsCountInfo().subscribe((data) => {
      this.nCreditLoanAccountCount = data as Number;
    });

    this.oCreditLoanService.fnGetAllCreditLoanAccountBalanceInfo().subscribe((data) => {
      this.nAllCreditLoanBalance = data as Number;
      this.nAllCreditLoanBalance = Number((Math.round(this.nAllCreditLoanBalance*100)/100).toFixed(2));
    });
   
    this.fetchData();
  }

  /**
   * Fetches the data
   */
  private fetchData() {
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;
    this.transactions = transactions;
    this.statData = statData;
  }

}
