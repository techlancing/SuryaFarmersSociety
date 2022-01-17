import { Component, OnInit } from '@angular/core';
import {  EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bank-account-data',
  templateUrl: './bank-account-data.component.html',
  styleUrls: ['./bank-account-data.component.scss']
})
export class BankAccountDataComponent implements OnInit {
  public oAlltransactionprintmodel: BankAccount;
  public sSelectedAccount: string;
  bIsBtnActive: boolean;
  bIsAccountData: boolean;
  @Input() bShowPrintBtn: boolean;
  sImageRootPath : string;
  aBankAccounts: Array<BankAccount>;
  @Input() headerText: string;
  @Input() bNotFirst : boolean ;
  @Output() accountDataClicked = new EventEmitter<BankAccount>();
  constructor(private oBankAccountService: BankAccountService) { }

  ngOnInit(): void {
    this.oAlltransactionprintmodel = new BankAccount();
    this.sImageRootPath = environment.imagePath;
    this.fnGetAllAccounts();
  }

  fnGetAccountNumber(): void{
    if(this.sSelectedAccount.length > 0 ){
      this.bIsBtnActive = true;
    }
  }

  fnFecthAccountDetails(): void{
    this.oBankAccountService.fngetBankAccountInfoByNumber(this.sSelectedAccount).subscribe((data) => {
      this.oAlltransactionprintmodel = data as any;
      this.bIsAccountData = true;
      this.accountDataClicked.emit(this.oAlltransactionprintmodel);
    });
  }

  fnGetAllAccounts() {
    this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
      // this.fnEditSucessMessage();
      this.aBankAccounts = [];
      console.log(this.aBankAccounts);
      this.aBankAccounts = [...cdata as any];
      console.log(this.aBankAccounts);
      //this.oCreditModel.sState = '';
      
    });
  }

}
