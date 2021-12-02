import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { BankAccountService }from '../../../core/services/account.service';
import { AdvancedService } from './advanced.service';
import { AdvancedSortableDirective, SortEvent } from './advanced-sortable.directive';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2' ;

@Component({
  selector: 'app-all-bank-accounts',
  templateUrl: './all-bank-accounts.component.html',
  styleUrls: ['./all-bank-accounts.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class AllBankAccountsComponent implements OnInit {

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
  aAllBankAccounts : Array<BankAccount> = null;
  oBankAccount : BankAccount =null;
  breadCrumbItems: Array<{}>;
  tables$: Observable<BankAccount[]>;
  total$: Observable<number>;
  @Input() bHideBreadCrumb: boolean = false;
  nSelectedProductIndex : number;
  
  constructor(private oBankAccountService : BankAccountService,
    public service: AdvancedService,
    private modalService: NgbModal) {
      this.tables$ = service.tables$;
      console.log(this.tables$);
    this.total$ = service.total$;
     }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Home' }, { label: 'All Bank Accounts', active: true }];
    this.oBankAccountService.fngetBankAccountInfo().subscribe((data) => {
      this.aAllBankAccounts = [...data as any];

    });
  }

  /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any, selectedindex: number) {
     this.nSelectedProductIndex = selectedindex;
    this.modalService.open(content, { centered: true, size: 'xl' });
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
   onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  fnActivateOrDeactivateBankaccount(oBankAccount: BankAccount) {
    if (oBankAccount) {
      this.oBankAccount = oBankAccount;
      if (this.oBankAccount.bIsDeactivated === false) {
        this.oBankAccount.bIsDeactivated = true ;
        this.oBankAccountService.fnActivateOrDeactivateBankAccount(this.oBankAccount.sAccountNo,this.oBankAccount.bIsDeactivated).subscribe((data) => {
          console.log(data);
          this.fnSucessMessage();
        });
      }
    }

  }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Bank Account Deactivated sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
