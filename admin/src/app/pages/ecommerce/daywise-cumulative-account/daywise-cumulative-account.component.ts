import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import {UtilitydateService} from '../../../core/services/utilitydate.service';

@Component({
  selector: 'app-daywise-cumulative-account',
  templateUrl: './daywise-cumulative-account.component.html',
  styleUrls: ['./daywise-cumulative-account.component.scss']
})
export class DaywiseCumulativeAccountComponent implements OnInit {

  public aTransactions : any;
  public ntotalCredit : number =0;
  public ntotalDebit : number =0;
  public nbalanceAmount : number =0;
  public sAccountNumber : string;
  public uniqueArr = [];
  fromDate : any;
  toDate :any;

    constructor(private oTransactionService: TransactionService,
                private modalService: NgbModal,
                private oUtilitydateService : UtilitydateService) { }
  
    ngOnInit(): void {
      
    }

    fnGetCreditLoans(oSelectedAccount : BankAccount){
      this.sAccountNumber = oSelectedAccount.sAccountNo;
    }
  
    fnGetDayWiseTransactionSubmit(ngform: NgForm){
      this.ntotalCredit =0;
      this.ntotalDebit =0;
      this.nbalanceAmount = 0;
      this.uniqueArr = [];
    
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
        let tempdate = '';
        this.aTransactions.map((transaction)=>{
          
          if(this.sAccountNumber === transaction.sAccountNo){
            this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
          this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
            if(tempdate !== transaction.sDate){
              tempdate = transaction.sDate;
              this.uniqueArr = [...this.uniqueArr,{
                sDate:transaction.sDate,
                nCreditAmount:transaction.nCreditAmount,
                nDebitAmount:transaction.nDebitAmount,
                nBalanceAmount:transaction.nDebitAmount- transaction.nCreditAmount
              }];
            }else{
              this.uniqueArr[this.uniqueArr.length - 1].nCreditAmount += transaction.nCreditAmount;
              this.uniqueArr[this.uniqueArr.length - 1].nDebitAmount += transaction.nDebitAmount;
              this.uniqueArr[this.uniqueArr.length - 1].nBalanceAmount = this.uniqueArr[this.uniqueArr.length - 1].nDebitAmount - 
              this.uniqueArr[this.uniqueArr.length - 1].nCreditAmount;
              
            }
          }
          
        });
        console.log(this.uniqueArr);
        this.nbalanceAmount = this.ntotalDebit - this.ntotalCredit;
        this.ntotalCredit = Number((Math.round(this.ntotalCredit*100)/100).toFixed(2)) ;
        this.ntotalDebit = Number((Math.round(this.ntotalDebit*100)/100).toFixed(2));
        this.nbalanceAmount = Number((Math.round(this.nbalanceAmount*100)/100).toFixed(2));
      });
    }
    fnPrintDayWiseAccountCumulative(){
      window.print();
    }
  
}