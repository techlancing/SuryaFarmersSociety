import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { BankAccountService } from '../../../core/services/account.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTerm :  string;
  pageSize : number = 10 ;
  tableData: any[];
  route = new BehaviorSubject<string>('');
  _tables$ = new BehaviorSubject<any[]>([]);


  constructor(private pipe: DecimalPipe,
    private oBankAccountService: BankAccountService,
    private oSavingstypeService : SavingstypeService,
    private oTransactionService : TransactionService,
    private oCreditLoanService : CreditLoanService) {
    
    this.route.subscribe((data) => {
      if(data == 'savings'){
        this.oSavingstypeService.fnGetAllSavingTypeAccountsInfo().subscribe((savingdata) => {
          this.tableData = [...savingdata as any];
          console.log(savingdata);
        });
      }else if(data == 'credit'){
        this.oTransactionService.fngetNeedToApproveTransactionInfo().subscribe((data) =>{
          this.tableData = [...data as any];
          console.log(data);
         });
      }
      else {
        this.oCreditLoanService.fnGetAllCreditLoanInfo().subscribe((loandata)=>{
          this.tableData = [...loandata as any];
           console.log(loandata);
         });
        
      }
    })
     
    this._tables$.next(this.tableData);

  }

  search(route : string,$event){
    this.searchTerm = $event.target.value;
    let tables = this.tableData.filter(table => this.matches(table,route, $event.target.value)); 
    this._tables$.next(tables);
  }

  get tables$() { return this._tables$.asObservable(); }

  matches(table: any,route:string, term: string) {
    if(route == 'savings'){
      return table.sAccountNo.toLowerCase().includes(term.toLowerCase())
      || table.sTypeofSavings.toLowerCase().includes(term.toLowerCase())
      || table.nDepositAmount.toString().toLowerCase().includes(term.toLowerCase())
      || table.nMaturityAmount.toString().toLowerCase().includes(term.toLowerCase())
    }else if(route == 'credit'){
      return table.sAccountNo.toLowerCase().includes(term.toLowerCase())
      ||table.nTransactionId.toString().includes(term.toLowerCase())
      //|| table.sAccountType.toLowerCase().includes(term.toLowerCase())
      
      || table.nBalanceAmount.toString().toLowerCase().includes(term.toLowerCase())
      || table.nCreditAmount.toString().toLowerCase().includes(term.toLowerCase())
      || table.nDebitAmount.toString().toLowerCase().includes(term.toLowerCase())
      || table.sNarration.toLowerCase().includes(term.toLowerCase())
    }
    else{
      return table.sAccountNo.toLowerCase().includes(term.toLowerCase())
      || table.sTypeofLoan.toLowerCase().includes(term.toLowerCase())
      || table.nSanctionAmount.toString().toLowerCase().includes(term.toLowerCase())
      || table.nTotalAmount.toString().toLowerCase().includes(term.toLowerCase())
    }
  }
}
