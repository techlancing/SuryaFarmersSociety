import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { BankAccountService } from '../../../core/services/account.service';

const compare = (v1: string, v2: string) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTerm :  string;
  pageSize : number = 10 ;
  tableData: any[];
  _tables$ = new BehaviorSubject<BankAccount[]>([]);

  constructor(private pipe: DecimalPipe,
    private oBankAccountService: BankAccountService) {
    this.oBankAccountService.fngetAllBankAccountInfo().subscribe((data) => {
      this.tableData = [...data as any];
      console.log(this.tableData);
      this._tables$.next(this.tableData);
    });
  }

  search($event){
    this.searchTerm = $event.target.value;
    let tables = this.tableData.filter(table => this.matches(table, $event.target.value)); 
    this._tables$.next(tables);
  }

  get tables$() { return this._tables$.asObservable(); }

  matches(tables: BankAccount, term: string) {
    return tables.sAccountNo.toLowerCase().includes(term.toLowerCase())
      || tables.sBranchCode.toLowerCase().includes(term.toLowerCase())
      || tables.sApplicantName.toLowerCase().includes(term.toLowerCase())
      || tables.sCustomerId.toString().toLowerCase().includes(term.toLowerCase())
  }
}
