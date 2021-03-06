import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TransactionService } from '../../../core/services/transaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import {UtilitydateService} from '../../../core/services/utilitydate.service';

@Component({
  selector: 'app-daywise-transaction',
  templateUrl: './daywise-transaction.component.html',
  styleUrls: ['./daywise-transaction.component.scss']
})
export class DaywiseTransactionComponent implements OnInit {
public aTransactions : any;
public ntotalCredit : number =0;
public ntotalDebit : number =0;
public nbalanceAmount : number =0;
bShowAccNum : boolean = true;
fromDate : any;
toDate : any;
public bShowEmployee : boolean = true ;


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
   
    
    this.oTransactionService.fngetTransactionInfo(this.fromDate,this.toDate).subscribe((data) => {
      console.log(data);
      this.aTransactions = data;
      this.aTransactions.map((transaction)=>{
        this.ntotalCredit = this.ntotalCredit + transaction.nCreditAmount;
        this.ntotalDebit = this.ntotalDebit + transaction.nDebitAmount;
      });
      this.nbalanceAmount = this.ntotalDebit - this.ntotalCredit;
      this.ntotalCredit = Number((Math.round(this.ntotalCredit*100)/100).toFixed(2)) ;
      this.ntotalDebit = Number((Math.round(this.ntotalDebit*100)/100).toFixed(2));
      this.nbalanceAmount = Number((Math.round(this.nbalanceAmount*100)/100).toFixed(2));  
    });
  }
  fnPrintDayWiseTransactions(): void{
    window.print();
  }


}