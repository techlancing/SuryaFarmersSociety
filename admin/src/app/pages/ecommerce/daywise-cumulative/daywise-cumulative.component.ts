import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-daywise-cumulative',
  templateUrl: './daywise-cumulative.component.html',
  styleUrls: ['./daywise-cumulative.component.scss']
})
export class DaywiseCumulativeComponent implements OnInit {

  public aTransactions : any;
public ntotalCredit : number =0;
public ntotalDebit : number =0;
public nbalanceAmount : number =0;
public uniqueArr = [];

  constructor(private oTransactionService: TransactionService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    
  }

  fnGetDayWiseTransactionSubmit(ngform: NgForm){
    this.ntotalCredit =0;
    this.ntotalDebit =0;
    this.nbalanceAmount = 0;
    let fromdate = ngform.value.fromDate;
    let todate = ngform.value.toDate;
    const diffInMs   = +(new Date(todate)) - +(new Date(fromdate))
    let nTotaldays  = (diffInMs / (1000 * 60 * 60 * 24)) + 1;

    let today = new Date(fromdate);
    let tomorrow = new Date(today);
    
    // oTransaction.sDate = tomorrow.getFullYear().toString() + "-" + ('0'+ (tomorrow.getMonth()+1)).slice(-2).toString() + "-" + ('0' +tomorrow.getDate()).slice(-2).toString();
    console.log(fromdate,todate);
    this.oTransactionService.fngetTransactionInfo(fromdate,todate).subscribe((data) => {
      console.log(data);
      this.aTransactions = data;
      let tempdate = '';
      this.aTransactions.map((transaction)=>{
        this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
        this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
        if(tempdate !== transaction.sDate){
          tempdate = transaction.sDate;
          this.uniqueArr = [...this.uniqueArr,{
            sDate:transaction.sDate,
            nCreditAmount:transaction.nCreditAmount,
            nDebitAmount:transaction.nDebitAmount,
            nBalanceAmount:transaction.nCreditAmount- transaction.nDebitAmount
          }];
        }else{
          this.uniqueArr[this.uniqueArr.length - 1].nCreditAmount += transaction.nCreditAmount;
          this.uniqueArr[this.uniqueArr.length - 1].nDebitAmount += transaction.nDebitAmount;
          this.uniqueArr[this.uniqueArr.length - 1].nBalanceAmount = this.uniqueArr[this.uniqueArr.length - 1].nCreditAmount - 
          this.uniqueArr[this.uniqueArr.length - 1].nDebitAmount;
          
        }
      });
      console.log(this.uniqueArr);
      this.nbalanceAmount = this.ntotalCredit - this.ntotalDebit;
    });
  }


}
