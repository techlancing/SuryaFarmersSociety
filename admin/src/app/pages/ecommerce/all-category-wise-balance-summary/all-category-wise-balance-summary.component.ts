import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { AllCategoryWiseBalanceSummary } from '../../../core/models/allcategorywisebalancesummary.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-category-wise-balance-summary',
  templateUrl: './all-category-wise-balance-summary.component.html',
  styleUrls: ['./all-category-wise-balance-summary.component.scss']
})
export class AllCategoryWiseBalanceSummaryComponent implements OnInit {

  bankaccounts: Array<AllCategoryWiseBalanceSummary>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: AllCategoryWiseBalanceSummaryComponent;

  public oallcategorywisebalancesummarymodel: AllCategoryWiseBalanceSummary;
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
     this.oallcategorywisebalancesummarymodel = new AllCategoryWiseBalanceSummary();
     this.sButtonText = 'Print';
     this.bIsAddActive = false;
     this.bIsEditActive = false;
     if (this.bisEditMode) {
       // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
       // this.oBankAccountModel = tempobj;
       this.sButtonText = 'Update';
     }
     this.oBankAccountService.fngetActiveBankAccountInfo().subscribe(() => {
       //this.aBankAccountTypes = [...data as any];
 
     });
   }
   fnUpdateParentAfterEdit() {
    this.oBankAccountService.fngetActiveBankAccountInfo().subscribe((cdata) => {
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
