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
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from 'src/app/core/services/credit.service';
import { BankEmployee } from '../../../core/models/bankemployee.model';
import { BankEmployeeService } from 'src/app/core/services/bankemployee.service';
import { UtilitydateService } from 'src/app/core/services/utilitydate.service';
import { NarrationstringService } from 'src/app/core/services/narrationstring.service';

@Component({
  selector: 'app-account-transaction-debit',
  templateUrl: './account-transaction-debit.component.html',
  styleUrls: ['./account-transaction-debit.component.scss']
})
export class AccountTransactionDebitComponent implements OnInit {

  
  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() bIsCredit: boolean;
  public sCaption : string;
  public aCreditLoan : Array<CreditLoan>;
  public oDebitModel: Debit;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  nActiveLoanIndex : number;
  bShowLoanData : boolean;
  aUsers: Array<BankEmployee>;

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
    private oCreditService: CreditService,
    public activatedroute : ActivatedRoute,
    private router: Router,
              private modalService: NgbModal,
              private oBankEmployeeService: BankEmployeeService,
              private oUtilitydateService : UtilitydateService,
              private oNarrationstringService : NarrationstringService) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    console.log(this.activatedroute.snapshot.data.type);
    if(this.activatedroute.snapshot.data.type === 'credit'){
      this.sCaption = 'Credit';
      this.bIsCredit = true;
    }else{
      this.sCaption = 'Debit';
      this.bIsCredit = false;
    }
    this.oBankEmployeeService.fngetApprovedBankEmployeeInfo().subscribe((users : any)=>{
      console.log('users',users);
       this.aUsers = users;
     });
    
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
    if(
      this.oDebitModel.sDate == ''||
      this.oDebitModel.nAmount == null ||
      this.oDebitModel.sNarration == '' ||
      this.oDebitModel.sReceiverName == ''
    ){
      this.fnWarningMessage('Please fill all the fields');
      return;
    }
    this.bIsAddActive = true;
    this.oDebitModel.sNarration = this.oNarrationstringService.fnNarrationModification(this.oDebitModel.sNarration);
    this.oDebitModel.sDate= this.oUtilitydateService.fnChangeDateFormate(this.oDebitModel.sDate);
    if(!this.bIsCredit){
      this.oDebitService.fnAddDebitInfo(this.oDebitModel).subscribe((data) => {
        console.log(data);
        if((data as any).status == 'Success'){
          this.fnSucessMessage((data as any).id);
          this.redirectTo('/debit');
        }
        else this.fnWarningMessage(data);
        this.bIsAddActive = false;
      },(error) => {
        this.bIsAddActive = false;
      });
    }else{
      this.oCreditService.fnAddCreditInfo(this.oDebitModel).subscribe((data) => {
        console.log(data);
        if((data as any).status == 'Success'){  
        this.fnSucessMessage((data as any).id);
        this.redirectTo('/credit');
        }
        this.bIsAddActive = false;
      },(error) => {
        this.bIsAddActive = false;
      });
    }
      
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
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
        if(this.bIsCredit){
          this.oDebitModel.nAmount = Number((Math.round((loan.nInstallmentAmount + (loan.nInstallmentAmount * loan.nLetPenaltyPercentage / 100))*100)/100).toFixed(2));
        }else{
          this.oDebitModel.nAmount = loan.nInstallmentAmount;
        }
        
      }
        
    })
    
  }
  fnSucessMessage(transactionid) {
    let msg = '';
    if(this.bIsCredit){
      msg = 'Amount is credited successfully.';
    }else{
      msg = 'Amount is debited successfully.';
    }
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: msg + '<br /> Transaction id "'+transactionid+ '" is need to be Approved.',
      showConfirmButton: true
    });
  }
  fnWarningMessage(msg){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    });
  }
  fnClear(){
    this.oDebitModel.sDate = '';
    this.oDebitModel.nAmount = null;
    this.oDebitModel.sNarration = '';
    this.oDebitModel.sReceiverName = '';
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
