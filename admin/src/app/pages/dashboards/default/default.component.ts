import { Component, OnInit } from '@angular/core';
import { emailSentBarChart, monthlyEarningChart, transactions, statData } from './data';
import { ChartType } from './dashboard.model';
import { BankAccountService }from '../../../core/services/account.service';
import {CreditLoanService} from '../../../core/services/creditloan.service';
import { Router } from '@angular/router';

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
  nSavingsAccountCount : any;
  nCreditLoanAccountCount : any;
  nAllCreditLoanBalance : any ;
  nAllSavingsBalance : any ;
  nTotalBalance : number ;
  nEqualAccountsCount : number ;

  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanService: CreditLoanService,
    private router: Router) {
    if (localStorage.getItem("userData") !== null && localStorage.getItem("userData") !== undefined) {
      const user = JSON.parse(localStorage.getItem("userData"));
      if (user) {
        let uri = '';
        if (user.sRole === 'manager') uri = '/welcomemanager'
        if (user.sRole === 'employee') uri = '/welcomeemployee';
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate([uri]));
      }
    }
  }

  ngOnInit() {
    this.oBankAccountService.fngetSavingsBankAccountCountInfo().subscribe((data) => {
      this.nSavingsAccountCount = data as Number;
    });

    this.oCreditLoanService.fnGetCreditLoanAccountsCountInfo().subscribe((data) => {
      this.nCreditLoanAccountCount = data as Number;
    });

    this.oCreditLoanService.fnGetAllCreditLoanAccountBalanceInfo().subscribe((cdata) => {
      this.nAllCreditLoanBalance = cdata as Number;
      this.nAllCreditLoanBalance = Number((Math.round(this.nAllCreditLoanBalance*100)/100).toFixed(2));
      
      this.oBankAccountService.fnGetAllSavingsAccountBalanceInfo().subscribe((data) => {
        this.nAllSavingsBalance= data as Number;
        this.nAllSavingsBalance = Number((Math.round(this.nAllSavingsBalance*100)/100).toFixed(2));
        this.nTotalBalance = Number((Math.round((this.nAllSavingsBalance-this.nAllCreditLoanBalance)*100)/100).toFixed(2));
      });
      
    });
    
    this.oBankAccountService.fnGetEqualAccountsCount().subscribe((data) => {
      console.log(data);
      this.nEqualAccountsCount = data as any ;
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
