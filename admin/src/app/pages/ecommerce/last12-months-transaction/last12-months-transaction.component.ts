import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {UtilitydateService} from '../../../core/services/utilitydate.service';

@Component({
  selector: 'app-last12-months-transaction',
  templateUrl: './last12-months-transaction.component.html',
  styleUrls: ['./last12-months-transaction.component.scss']
})
export class Last12MonthsTransactionComponent implements OnInit {

  public aTransactions : any;
  public ntotalCredit : number =0;
  public ntotalDebit : number =0;
  public nbalanceAmount : number =0;
  public uniqueArr = [];
  public uniqueTransactions = [];
  fromDate : any;
  toDate :any;
  
    constructor(private oTransactionService: TransactionService,
                private modalService: NgbModal,
                private oUtilitydateService : UtilitydateService) { }
  
    ngOnInit(): void {
      
    }
  
    fnGetDayWiseTransactionSubmit(ngform: NgForm){
      this.ntotalCredit =0;
      this.ntotalDebit =0;
      this.nbalanceAmount = 0;
      this.fromDate = this.oUtilitydateService.fnChangeDateFormate(this.fromDate);
      this.toDate = this.oUtilitydateService.fnChangeDateFormate(this.toDate);

      const diffInMs   = +(new Date(this.toDate)) - +(new Date(this.fromDate))
      let nTotaldays  = (diffInMs / (1000 * 60 * 60 * 24)) + 1;
  
      let today = new Date(this.fromDate);
      let tomorrow = new Date(today);
      
      // oTransaction.sDate = tomorrow.getFullYear().toString() + "-" + ('0'+ (tomorrow.getMonth()+1)).slice(-2).toString() + "-" + ('0' +tomorrow.getDate()).slice(-2).toString();
      console.log(this.fromDate,this.toDate);
      this.oTransactionService.fngetTransactionInfo(this.fromDate,this.toDate).subscribe((data) => {
        console.log(data);
        this.aTransactions = data;
        this.uniqueArr = [...new Set(this.aTransactions.map(item => 
          new Intl.DateTimeFormat('en-GB', {month: 'long'}).format(new Date(item.sDate))
          ))];
        console.log(this.uniqueArr);
        this.aTransactions.map((transaction)=>{
          this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
          this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
        });

        this.uniqueArr.map((month)=>{
          let saccno = '';
            let totalcredit = 0;
            let totaldebit =0;
          this.aTransactions.map((transaction)=>{
            console.log(new Intl.DateTimeFormat('en-GB', {month: 'long'}).format(new Date(transaction.sDate)));
            if(month === new Intl.DateTimeFormat('en-GB', {month: 'long'}).format(new Date(transaction.sDate))){
              saccno = month;
                totalcredit += transaction.nCreditAmount;
                totaldebit += transaction.nDebitAmount;
            }
          });
            this.uniqueTransactions = [...this.uniqueTransactions,{
              sAccountNo:saccno,
              nCreditAmount:totalcredit,
              nDebitAmount:totaldebit,
              nBalanceAmount:totalcredit- totaldebit
            }];
        });
        this.nbalanceAmount = this.ntotalCredit - this.ntotalDebit;
      });
    }
  
}