import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {UtilitydateService} from '../../../core/services/utilitydate.service';

@Component({
  selector: 'app-category-balance-summary',
  templateUrl: './category-balance-summary.component.html',
  styleUrls: ['./category-balance-summary.component.scss']
})
export class CategoryBalanceSummaryComponent implements OnInit {

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
      this.uniqueArr = [];
      this.uniqueTransactions = [];
     
      this.fromDate = this.oUtilitydateService.fnChangeDateFormate(this.fromDate);
      this.toDate = this.oUtilitydateService.fnChangeDateFormate(this.toDate);

      this.oTransactionService.fngetTransactionInfo(this.fromDate,this.toDate).subscribe((data) => {
        console.log(data);
        this.aTransactions = data;

        this.uniqueArr = [...new Set(this.aTransactions.map(item => item.sAccountNo))];
        this.aTransactions.map((transaction)=>{
          this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
          this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
        });

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
              nCreditAmount:totalcredit,
              nDebitAmount:totaldebit,
              nBalanceAmount:totalcredit- totaldebit
            }];
        });
        
        console.log(this.uniqueArr);
        this.nbalanceAmount = this.ntotalCredit - this.ntotalDebit;
        this.ntotalCredit = Number((Math.round(this.ntotalCredit*100)/100).toFixed(2)) ;
        this.ntotalDebit = Number((Math.round(this.ntotalDebit*100)/100).toFixed(2));
        this.nbalanceAmount = Number((Math.round(this.nbalanceAmount*100)/100).toFixed(2));
      });
    }
    fnPrintCategorySummary(){
      window.print();
    }
}