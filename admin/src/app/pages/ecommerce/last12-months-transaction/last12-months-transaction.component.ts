import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { Last12MonthsTransaction } from '../../../core/models/last12monthstransactions.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-last12-months-transaction',
  templateUrl: './last12-months-transaction.component.html',
  styleUrls: ['./last12-months-transaction.component.scss']
})
export class Last12MonthsTransactionComponent implements OnInit {

  bankaccounts: Array<Last12MonthsTransaction>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: Last12MonthsTransaction;

  public olast12monthstransactionsmodel: Last12MonthsTransaction;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  // aState : Array<
  // {
  //   displayText:string,
  //   value:string
  // }>;
   // bread crumb items
   breadCrumbItems: Array<{}>;
   @Input() bHideBreadCrumb: boolean = false;
   @Input() bHideCateogryList: boolean = false;
 
   public sButtonText: string;
   @Input() bisEditMode: boolean;
  aTypeofLoan: { displayText: string; value: string; }[];
   
   constructor(private oBankAccountService: BankAccountService,
               private modalService: NgbModal) { }
 
   ngOnInit(): void {
     this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
     this.aTypeofLoan = [
       {
         displayText: 'EMI Loan',
         value:'01'
       }
     ];
     this.olast12monthstransactionsmodel = new Last12MonthsTransaction();
     this.sButtonText = 'Print';
     this.bIsAddActive = false;
     this.bIsEditActive = false;
     if (this.bisEditMode) {
       // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
       // this.oBankAccountModel = tempobj;
       this.sButtonText = 'Update';
     }
     this.oBankAccountService.fngetBankAccountInfo().subscribe(() => {
       //this.aBankAccountTypes = [...data as any];
 
     });
   }
   fnUpdateParentAfterEdit() {
    this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
      // this.fnEditSucessMessage();
      this.bankaccounts = [];
      console.log(this.bankaccounts);
      this.bankaccounts = [...cdata as any];
      console.log(this.bankaccounts);
      //this.oCreditModel.sState = '';
      this.modalService.dismissAll();
    });
  }



  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'State is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyCarNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Car Name',
      showConfirmButton: false,
      timer: 2000
    });
  }

  // fnDuplicateCarNameMessage() {
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'warning',
  //     title: 'Car Name is already exists',
  //     showConfirmButton: false,
  //     timer: 2000
  //   });
  // }

  // fnEditSucessMessage() {
  //   Swal.fire({
  //     position: 'center',
  //     icon: 'success',
  //     title: 'Car is updated sucessfully.',
  //     showConfirmButton: false,
  //     timer: 1500
  //   });
  // }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index: number) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }

}