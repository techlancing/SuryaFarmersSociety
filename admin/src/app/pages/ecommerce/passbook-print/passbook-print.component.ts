import { Component, OnInit , Input} from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-passbook-print',
  templateUrl: './passbook-print.component.html',
  styleUrls: ['./passbook-print.component.scss']
})
export class PassbookPrintComponent implements OnInit {

  public aBankAccounts: Array<BankAccount>;
  public opassbookprintmodel: BankAccount;
  public sSelectedAccount: string;
  
  bIsBtnActive: boolean;
  bIsPassbookData: boolean;
 

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;
  
  constructor(private oBankAccountService: BankAccountService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'PassBook' }, { label: 'Print PassBook', active: true }];
    this.opassbookprintmodel = new BankAccount();
    this.bIsBtnActive = false;
    this.bIsPassbookData = false;
    this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((data) => {
      this.aBankAccounts = [...data as any];
    });
    
  }

  fnGetAccountNumber(): void{
    if(this.sSelectedAccount.length > 0 ){
      this.bIsBtnActive = true;
    }
  }

  fnFecthAccountDetails(): void{
    this.oBankAccountService.fngetBankAccountInfoByNumber(this.sSelectedAccount).subscribe((data) => {
      this.opassbookprintmodel = data as any;
      this.bIsPassbookData = true;
    });
  }

  fnPrintPassBook(): void{
    window.print();
  }



  

}  