import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { DailySavingDebit } from '../../../core/models/dailysavingdebit.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { BankAccount } from 'src/app/core/models/bankaccount.model';

@Component({
  selector: 'app-account-transaction-dailysavingdebit',
  templateUrl: './account-transaction-dailysavingdebit.component.html',
  styleUrls: ['./account-transaction-dailysavingdebit.component.scss']
})
export class AccountTransactionDailysavingdebitComponent implements OnInit {

  bankaccounts: Array<DailySavingDebit>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: DailySavingDebit;

  public oDailySavingDebitModel: DailySavingDebit;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  aState : Array<
  {
    displayText:string,
    value:string
  }>;
  aDesignation : Array<
  {
    displayText:string,
    value:string
  }>;
  aMandal : Array<
  {
    displayText:string,
    value:string
  }>;
  aVillage : Array<
  {
    displayText:string,
    value:string
  }>;
  aBranchCode  : Array<
  {
    displayText:string,
    value:string
  }>;
  public oDropZoneConfig: DropzoneConfigInterface = {
    // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/BankAccount/upload_file",//"/nodejs/car/upload_file", 
  maxFilesize: 100,
  maxFiles: 1
  };

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  
  constructor(private oBankAccountService: BankAccountService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    // this.aDesignation = [
    //   {
    //     displayText: 'Manager',
    //     value:'01'
    //   },
    //   {
    //   displayText: 'Accountant',
    //     value:'02'
    //   }  
    // ];
    // this.aMandal = [
    //   {
    //     displayText: 'Gudur',
    //     value:'01'
    //   },
    //   {
    //     displayText: 'Kesamudram',
    //     value:'02'
    //   },
    //   {
    //     displayText: 'Kothaguda',
    //     value:'03'
    //   }
    // ];
    // this.aVillage = [
    //   {
    //     displayText: 'Gajulagattu',
    //     value:'01'
    //   },
    //   {
    //     displayText: 'Gundenga',
    //     value:'02'
    //   },
    //   {
    //     displayText: 'Ayodyapuram',
    //     value:'03'
    //   }
    // ];
    // this.aState = [
    //   {
    //     displayText: 'Telangana',
    //     value: '01'
    //   },
    //   ];
    
    this.oDailySavingDebitModel = new DailySavingDebit();
    this.sButtonText = 'Send SMS & Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.oBankAccountService.fngetBankAccountInfo().subscribe((data) => {
      //this.aBankAccountTypes = [...data as any];

    });
  }

  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.oDailySavingDebitModel.sAccountNo = oSelectedAccount.sAccountNo;
    
  }

  // new Date("dateString") is browser-dependent and discouraged, so we'll write
// a simple parse function for U.S. date format (which does no error checking)
fnParseDate(str) {
  var mdy = str.split('-');
  return new Date(mdy[2], mdy[1],mdy[0]-1 );
}

fnDatediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second-first)/(1000*60*60*24));
}

fnCalculateDays(): void{
  if(this.oDailySavingDebitModel.sStartDate !== undefined && this.oDailySavingDebitModel.sEndDate !== undefined){
    
    const diffInMs   = +(new Date(this.oDailySavingDebitModel.sEndDate)) - +(new Date(this.oDailySavingDebitModel.sStartDate))
    this.oDailySavingDebitModel.sTotaldays  = diffInMs / (1000 * 60 * 60 * 24);
  } 
  
}

fnCalculateTotalAmount(): void{
  if(this.oDailySavingDebitModel.nDayAmount !== undefined && this.oDailySavingDebitModel.sTotaldays !== undefined){
    this.oDailySavingDebitModel.nAmount = this.oDailySavingDebitModel.nDayAmount * this.oDailySavingDebitModel.sTotaldays;
  }
  
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
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }

}

  