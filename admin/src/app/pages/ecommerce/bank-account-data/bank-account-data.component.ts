import { Component, OnInit } from '@angular/core';
import {  EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { environment } from 'src/environments/environment';
import { DailySavingDebitService } from 'src/app/core/services/dailysavingdebit.service';

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
  @Input() bPdfPrint : boolean ;
  @Input() bForDailySavings : boolean ;
 // @Input() Account : BankAccount ;
  @Output() accountDataClicked = new EventEmitter<BankAccount>();
  notfordailysavings: boolean = true;
  constructor(private oBankAccountService: BankAccountService,
    private oDailySavingsDepositService :DailySavingDebitService) { }

  ngOnInit(): void {
    this.oAlltransactionprintmodel = new BankAccount();
    this.sImageRootPath = environment.imagePath;
    if(this.bForDailySavings == true){
      this.bIsAccountData = true;  
      this.notfordailysavings = false;  
      this.oDailySavingsDepositService.oDailySavingDepositAccount.subscribe((account) => {
        let Account = account as any
        this.oBankAccountService.fngetBankAccountInfoByNumber(Account.sAccountNo).subscribe((data) => {
          this.oAlltransactionprintmodel = data as any;      
        });
      });
    }
    else this.fnGetAllAccounts();
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
      this.oBankAccountService.sendBankAccountDetails.next(this.oAlltransactionprintmodel);
      this.accountDataClicked.emit(this.oAlltransactionprintmodel);
    });
  }

  fnGetAllAccounts() {
    this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((cdata) => {
      // this.fnEditSucessMessage();
      this.aBankAccounts = [];
      console.log(this.aBankAccounts);
      this.aBankAccounts = [...cdata as any];
      console.log(this.aBankAccounts);
      //this.oCreditModel.sState = '';
    });
  }

}
