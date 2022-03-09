import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome-message',
  templateUrl: './welcome-message.component.html',
  styleUrls: ['./welcome-message.component.scss']
})
export class WelcomeMessageComponent implements OnInit {
  employee: boolean;
  aOption : any = [];

  constructor(private activatedroute : ActivatedRoute,private router : Router) { }

  ngOnInit(): void {
    if(this.activatedroute.snapshot.data.type === 'employee'){
      this.employee = true ;
      this.aOption.push({
        optionName : 'Add New Account',
        optionLink : '/newaccountform'
      });
      this.aOption.push({
        optionName : 'Add New Loan',
        optionLink : '/creditloan'
      });
      this.aOption.push({
        optionName : 'Add Type Of Savings',
        optionLink : '/savingstype'
      });
      this.aOption.push({
        optionName : 'Passbook Print',
        optionLink : '/passbookprint'
      });
      this.aOption.push({
        optionName : 'Passbook Transaction Print',
        optionLink : '/alltranactionprint'
      });
      this.aOption.push({
        optionName : 'Balance Enquiry',
        optionLink : '/accountBalanceEnquiry'
      });
      this.aOption.push({
        optionName : 'Bank Account Statement',
        optionLink : '/accountStatement'
      });
      this.aOption.push({
        optionName : 'Approval Status',
        optionLink : '/approvaldetails'
      });
      this.aOption.push({
        optionName : 'Loan Debit',
        optionLink : '/debit'
      });
      this.aOption.push({
        optionName : 'Debit',
        optionLink : '/dailysavingsdeposit'
      });
      this.aOption.push({
        optionName : 'Credit',
        optionLink : '/withdrawal'
      });
    
      this.aOption.push({
        optionName : 'Loan Credit',
        optionLink : '/credit'
      });
      this.aOption.push({
        optionName : 'Intra Transaction',
        optionLink : '/intratransaction'
      });
      this.aOption.push({
        optionName : 'Day Wise Transaction',
        optionLink : '/DayWiseTransaction'
      });
      this.aOption.push({
        optionName : ' Day Wise Cumulative',
        optionLink : '/DayWiseCumulative'
      });
      this.aOption.push({
        optionName : 'Account Cumulative',
        optionLink : '/DayWiseCumulativeAccount'
      });
      this.aOption.push({
        optionName : 'Monthly Cumulative',
        optionLink : '/Last12MonthsTransaction'
      });
      this.aOption.push({
        optionName : 'Category Balance Summary',
        optionLink : '/CategoryBalanceSummary'
      });
    } 
    else{
      this.employee = false;
      this.aOption.push({
        optionName : 'Add Employee',
        optionLink : '/addemployee'
      });
      this.aOption.push({
        optionName : 'Loan Approval',
        optionLink : '/loanapproval'
      });
      this.aOption.push({
        optionName : 'Credit Approval',
        optionLink : '/creditapproval'
      });
      this.aOption.push({
        optionName : 'Savings Approval',
        optionLink : '/savingsapproval'
      });
      this.aOption.push({
        optionName : 'Day Wise Transaction',
        optionLink : '/DayWiseTransaction'
      });
      this.aOption.push({
        optionName : ' Day Wise Cumulative',
        optionLink : '/DayWiseCumulative'
      });
      this.aOption.push({
        optionName : 'Account Cumulative',
        optionLink : '/DayWiseCumulativeAccount'
      });
      this.aOption.push({
        optionName : 'Monthly Cumulative',
        optionLink : '/Last12MonthsTransaction'
      });
      this.aOption.push({
        optionName : 'Category Balance Summary',
        optionLink : '/CategoryBalanceSummary'
      });
      this.aOption.push({
        optionName : 'Account Update',
        optionLink : '/allaccounts'
      });
    } 
  }
 
}
