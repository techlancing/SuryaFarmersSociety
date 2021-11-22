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
      console.log("scount",data,typeof data);
      console.log(this.nSavingsAccountCount);
      statData[2].value=''+this.nSavingsAccountCount;
    });

    this.oBankAccountService.fnGetAllSavingsAccountBalanceInfo().subscribe((data) => {
      this.nAllSavingsBalance= data as Number;
      console.log("sbalance",data,typeof data);
      statData[0].value='Rs.'+this.nAllSavingsBalance;
    });

    this.oCreditLoanService.fnGetCreditLoanAccountsCountInfo().subscribe((data) => {
      this.nCreditLoanAccountCount = data as Number;
      console.log("ccount",data,typeof data);
      statData[3].value=''+this.nCreditLoanAccountCount;
    });

    this.oCreditLoanService.fnGetAllCreditLoanAccountBalanceInfo().subscribe((data) => {
      this.nAllCreditLoanBalance = data as Number;
      console.log("cbalance",data,typeof data);
      statData[1].value='Rs.'+this.nAllCreditLoanBalance;
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
