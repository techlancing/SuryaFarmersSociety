import { Component, OnInit , Input} from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-passbook-print',
  templateUrl: './passbook-print.component.html',
  styleUrls: ['./passbook-print.component.scss']
})
export class PassbookPrintComponent implements OnInit {


  public opassbookprintmodel: BankAccount;
  
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
  }

  fnGetAccountNumber(accountno): void{
    console.log(accountno);
    if(accountno.length >= 12 ){
      this.bIsBtnActive = true;
    }
  }

  fnFecthAccountDetails(accountno): void{
    this.oBankAccountService.fngetBankAccountInfoByNumber(accountno).subscribe((data) => {
      this.opassbookprintmodel = data as any;
      this.bIsPassbookData = true;
    });
  }



  

}  