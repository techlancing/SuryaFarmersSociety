import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { IntraTransaction } from '../../../core/models/intratransaction.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-transaction-intra-transaction',
  templateUrl: './account-transaction-intra-transaction.component.html',
  styleUrls: ['./account-transaction-intra-transaction.component.scss']
})
 export class IntraTransactionComponent implements OnInit {

   bankaccounts: Array<IntraTransaction>;
   @Output() updateClicked = new EventEmitter();
   @Output() addClicked = new EventEmitter();
   @Input() oEditBankAccount: IntraTransaction;
 
   public ointratransactionModel: IntraTransaction;
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
     this.aDesignation = [
       {
         displayText: 'Manager',
         value:'01'
       },
       
     ];
     this.aState = [
       {
         displayText: 'Telangana',
         value: '01'
       },
       ];
     
     this.ointratransactionModel = new IntraTransaction();
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
 
   fnCreateAccountDetails(){
     // this.oCreditModel.sBranchCode = this.oCreditModel.sState + 
     // this.oCreditModel.sDesignation + this.oCreditModel.sMandal + 
     // this.oCreditModel.sVillage;
     // this.oCreditModel.sAccountNo = this.oCreditModel.sBranchCode + '0001';
     // this.oCreditModel.sCustomerId = this.oCreditModel.sBranchCode + '0002';
   }
 
   fnResetState() {
     // this.oCreditModel.sState = '';
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
   openModal(content: any, index) {
     this.nSelectedEditIndex = index;
 
     this.modalService.open(content, { centered: true });
 
   }
 
 } 
