import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
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
  
    constructor(private oTransactionService: TransactionService,
                private modalService: NgbModal) { }
  
    ngOnInit(): void {
      
    }
  
    fnGetDayWiseTransactionSubmit(ngform: NgForm){
      this.ntotalCredit =0;
      this.ntotalDebit =0;
      this.nbalanceAmount = 0;
      this.uniqueArr = [];
      this.uniqueTransactions = [];
      let fromdate = ngform.value.fromDate;
      let todate = ngform.value.toDate;
      this.oTransactionService.fngetTransactionInfo(fromdate,todate).subscribe((data) => {
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
      });
    }
  
}