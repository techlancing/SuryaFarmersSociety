import { Component, OnInit } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model';

@Component({
  selector: 'app-account-balance-enquiry',
  templateUrl: './account-balance-enquiry.component.html',
  styleUrls: ['./account-balance-enquiry.component.scss']
})
export class AccountBalanceEnquiryComponent implements OnInit {

  //breadcrumbitems
  breadCrumbItems: Array<{}>;
  aBankAccounts: Array<BankAccount>;
  public sSelectedAccount: string;
  bIsBtnActive: boolean;
  bShowBalance : boolean = false;
  constructor(private oBankAccountService: BankAccountService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Bank Account' }, { label: 'Balance Enquiry', active: true }];
    this.fnGetAllAccounts();
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
  fnGetAccountNumber(): void{
    if(this.sSelectedAccount.length > 0 ){
      this.bIsBtnActive = true;
    }
  }
  fnFecthAccountBalance(){
    this.bShowBalance = true ;
  }
}
