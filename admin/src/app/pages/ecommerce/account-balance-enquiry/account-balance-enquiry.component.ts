import { Component, OnInit } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { SavingstypeService } from 'src/app/core/services/savingstype.service';

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
  nAccountBalance : number =0;
  public aCreditLoans : any =[];
  public bShowLoanBalance : boolean ;
  aSavingType: any =[];
  bShowSavingTypeBalance: boolean;
  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanService : CreditLoanService,private oSavingstypeService : SavingstypeService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Bank Account' }, { label: 'Balance Enquiry', active: true }];
    this.fnGetAllAccounts();
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
  fnGetAccountNumber(): void{
    if(this.sSelectedAccount.length > 0 ){
      this.bIsBtnActive = true;
    }
  }
  fnFecthAccountBalance(){    
    this.oBankAccountService.fnGetSingleAccountBalance(this.sSelectedAccount).subscribe((cdata) => {
    this.nAccountBalance = cdata as any;
    this.bShowBalance = true ;
    });
    this.fnFetchLoanAccountBalance();
    this.fnFetchSavingTypeBalance();
  }
  fnFetchLoanAccountBalance(){
    this.oCreditLoanService.fnAccontCreditLoanInfo(this.sSelectedAccount).subscribe((data) => {
      this.aCreditLoans = data as any;
      this.bShowLoanBalance = true ;
    });
  }
  fnFetchSavingTypeBalance(){
    this.oSavingstypeService.fnGetAllSavingDepositAccountsInfo(this.sSelectedAccount).subscribe((data) => {
      this.aSavingType = data as any;
      this.bShowSavingTypeBalance = true ;
    });
  }
}
