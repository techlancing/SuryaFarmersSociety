import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DebitService } from '../../../core/services/debit.service';
import { Debit } from '../../../core/models/debit.model'
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { CreditLoan } from 'src/app/core/models/creditloan.model';

@Component({
  selector: 'app-account-transaction-debit',
  templateUrl: './account-transaction-debit.component.html',
  styleUrls: ['./account-transaction-debit.component.scss']
})
export class AccountTransactionDebitComponent implements OnInit {

  
  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditDebit: Debit;
  public aCreditLoan : Array<CreditLoan>;
  public oDebitModel: Debit;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  nActiveLoanIndex : number;
  bShowLoanData : boolean;

  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  
  aLoanIssueEmployee : Array<
  {
    displayText:string,
    value:string
  }>;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  // oDebitModel: any;
  constructor(private oDebitService: DebitService,
    private oCreditLoanService: CreditLoanService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    this.aLoanIssueEmployee = [
      {
        displayText: 'Venkanna',
        value:'01'
      },
      {
        displayText: 'Bhaskar',
        value:'02'
      },
      {
        displayText: 'Naresh',
        value:'03'
      }
    ];
    
    this.oDebitModel = new Debit();
    this.sButtonText = 'Send SMS & Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
   
  }

  fnOnDebitInfoSubmit(): void {
    //this.bIsAddActive = true;
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

      let datetoday = `${yyyy}-${mm}-${dd}`;
    this.oDebitModel.sDate = datetoday.toString();
      this.oDebitService.fnAddDebitInfo(this.oDebitModel).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage();
      });
  }

  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.oDebitModel.sAccountNo = oSelectedAccount.sAccountNo;
    this.oCreditLoanService.fngetCreditLoanInfo(oSelectedAccount.sAccountNo).subscribe((loandata)=>{
      this.aCreditLoan = loandata as any;
    });
  }

  fnFecthLoanData() : void{
    this.aCreditLoan.map((loan : CreditLoan,index)=>{
      if(loan.nLoanId === this.oDebitModel.nLoanId){
        this.nActiveLoanIndex = index;
        this.bShowLoanData = true;
      }
        
    })
    
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

 
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, index) {
    this.nSelectedEditIndex = index;

    this.modalService.open(content, { centered: true });

  }

}
