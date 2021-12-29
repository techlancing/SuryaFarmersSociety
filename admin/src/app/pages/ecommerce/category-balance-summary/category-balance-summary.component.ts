import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { UtilitydateService } from '../../../core/services/utilitydate.service';

@Component({
  selector: 'app-category-balance-summary',
  templateUrl: './category-balance-summary.component.html',
  styleUrls: ['./category-balance-summary.component.scss']
})
export class CategoryBalanceSummaryComponent implements OnInit {

  public aTransactions: any;
  public ntotalCredit: number = 0;
  public ntotalDebit: number = 0;
  public nbalanceAmount: number = 0;
  public uniqueArr = [];
  public uniqueTransactions = [];
  fromDate: any;
  toDate: any;

  public aGroupName: any;
  public aSavings = [];
  public aEmi = [];
  public aPersonal = [];
  public aAgricultural = [];
  public aGold = [];
  public aSilver = [];
  public aTemporary = [];
  constructor(private oTransactionService: TransactionService,
    private modalService: NgbModal,
    private oUtilitydateService: UtilitydateService) { }

  ngOnInit(): void {

    this.aGroupName = [
      { name: 'Savings Account', group: this.aSavings },
      { name: 'EMI Loan', group: this.aEmi },
      { name: 'Personal Loan', group: this.aPersonal },
      { name: 'Agriculture Loan', group: this.aAgricultural },
      { name: 'Gold Loan', group: this.aGold },
      { name: 'Silver Loan', group: this.aSilver },
      { name: 'Temporary Loan', group: this.aTemporary },
    ];

  }

  fnGetDayWiseTransactionSubmit(ngform: NgForm) {
    this.ntotalCredit = 0;
    this.ntotalDebit = 0;
    this.nbalanceAmount = 0;
    this.uniqueArr = [];
    this.uniqueTransactions = [];

    this.fromDate = this.oUtilitydateService.fnChangeDateFormate(this.fromDate);
    this.toDate = this.oUtilitydateService.fnChangeDateFormate(this.toDate);

    this.oTransactionService.fngetTransactionInfo(this.fromDate, this.toDate).subscribe((data) => {
      console.log(data);
      this.aTransactions = data;
      this.aTransactions.map((transaction) => {
        this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
        this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
      });
      this.aTransactions.map((transaction) => {
        let t = {
          sAccountNo: '',
          nCreditAmount: 0,
          nDebitAmount: 0,
          nBalanceAmount: 0
        };

        if (transaction.sAccountType === 'Savings Account')
          this.fnAddToGroup(transaction, this.aSavings, t);
        else if (transaction.sAccountType === 'EMI Loan')
          this.fnAddToGroup(transaction, this.aEmi, t);
        else if (transaction.sAccountType === 'Personal Loan')
          this.fnAddToGroup(transaction, this.aPersonal, t);
        else if (transaction.sAccountType === 'Agriculture Loan')
          this.fnAddToGroup(transaction, this.aAgricultural, t);
        else if (transaction.sAccountType === 'Gold Loan')
          this.fnAddToGroup(transaction, this.aGold, t);
        else if (transaction.sAccountType === 'Silver Loan')
          this.fnAddToGroup(transaction, this.aSilver, t);
        else this.fnAddToGroup(transaction, this.aTemporary, t);

      });
      this.fnAmountRoundToTwoDigits(this.aSavings);
      this.fnAmountRoundToTwoDigits(this.aEmi);
      this.fnAmountRoundToTwoDigits(this.aPersonal);
      this.fnAmountRoundToTwoDigits(this.aAgricultural);
      this.fnAmountRoundToTwoDigits(this.aGold);
      this.fnAmountRoundToTwoDigits(this.aSilver);
      this.fnAmountRoundToTwoDigits(this.aTemporary);

      /* this.uniqueArr = [...new Set(this.aTransactions.map(item => item.sAccountNo))];
       this.aTransactions.map((transaction)=>{
         this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
         this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
       });
       console.log("unique array",this.uniqueArr);
       this.uniqueArr.map((uniqueAccno)=>{
         let saccno = '';
           let totalcredit = 0;
           let totaldebit =0;
         this.aTransactions.map((transaction)=>{
           
           if(uniqueAccno === transaction.sAccountNo){
             saccno = transaction.sAccountNo;
               totalcredit += transaction.nCreditAmount;
               totaldebit += transaction.nDebitAmount;
           }
         });
           this.uniqueTransactions = [...this.uniqueTransactions,{
             sAccountNo:saccno,
             nCreditAmount: Number((Math.round(totalcredit*100)/100).toFixed(2)),
             nDebitAmount: Number((Math.round(totaldebit*100)/100).toFixed(2)),
             nBalanceAmount:Number((Math.round((totalcredit- totaldebit)*100)/100).toFixed(2))
           }];
       });*/
      console.log("uniqueTransactions ", this.uniqueTransactions);
      console.log(this.uniqueArr);
      this.nbalanceAmount = this.ntotalCredit - this.ntotalDebit;
      this.ntotalCredit = Number((Math.round(this.ntotalCredit * 100) / 100).toFixed(2));
      this.ntotalDebit = Number((Math.round(this.ntotalDebit * 100) / 100).toFixed(2));
      this.nbalanceAmount = Number((Math.round(this.nbalanceAmount * 100) / 100).toFixed(2));
    });
  }
  fnPrintCategorySummary() {
    window.print();
  }
  fnPopulateTransactions(transaction, group, obj) {
    obj.sAccountNo = transaction.sAccountNo;
    obj.nCreditAmount = transaction.nCreditAmount;
    obj.nDebitAmount = transaction.nDebitAmount;
    obj.nBalanceAmount = transaction.nBalanceAmount;
    group.push(obj);
  }
  fnAddToGroup(transaction, group, obj) {
    let found = false;
    if (group.length === 0) this.fnPopulateTransactions(transaction, group, obj);
    else {
      group.map((trans) => {
        if (transaction.sAccountNo === trans.sAccountNo) {
          trans.nCreditAmount += transaction.nCreditAmount;
          trans.nDebitAmount += transaction.nDebitAmount;
          found = true;
        }
      });
      if (!found) this.fnPopulateTransactions(transaction, group, obj);
    }
  }
  fnAmountRoundToTwoDigits(group) {
    group.map((item) => {
      item.nBalanceAmount = Number((Math.round((item.nCreditAmount - item.nDebitAmount) * 100) / 100).toFixed(2));
      item.nCreditAmount = Number((Math.round(item.nCreditAmount * 100) / 100).toFixed(2));
      item.nDebitAmount = Number((Math.round(item.nDebitAmount * 100) / 100).toFixed(2));
    });
  }
}