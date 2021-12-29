import { Component, ElementRef, OnInit } from '@angular/core';
import {  EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BankAccountService } from '../../../core/services/account.service';
import { BankAccount } from '../../../core/models/bankaccount.model'
import { CreditLoan } from 'src/app/core/models/creditloan.model';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CreditLoanService } from 'src/app/core/services/creditloan.service';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-all-transaction-print',
  templateUrl: './all-transaction-print.component.html',
  styleUrls: ['./all-transaction-print.component.scss']
})
export class AllTransactionPrintComponent implements OnInit {

  

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankAccount;
  @ViewChild('lineNumbers')
  public oLedgerTable : ElementRef ;

  bEmiLoan : boolean = false ;
  bPersonalLoan : boolean = false ;
  bAgriculturalLoan : boolean = false ;
  bGoldLoan : boolean = false ;
  bSilverLoan : boolean = false ;
  bTemporaryLoan : boolean = false ;
  bFirstButton : boolean = false;
  bSecondButton : boolean = false;
  sHeaderText : String = 'All Transaction Print';
  bPdf : boolean = false;
  bPrintLine : boolean = true ;
  public nInputLineFrom1 : number  ;
  public nInputLineTo1 : number ;
  public nInputLineFrom2 : number  ;
  public nInputLineTo2 : number ;
  public lineFrom : number ;
  public lineTo : number
  public aCreditLoan : Array<CreditLoan>;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  public sSelectedAccount: string;
  
  bIsBtnActive: boolean;
  bIsAccountData: boolean;
  @ViewChild('_BankAccountFormElem')
  public oBankAccountfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  // aState : Array<
  // {
  //   displayText:string,
  //   value:string
  // }>;
  aTypeofLoan : Array<
  {
    displayText:string,
    value:string
  }>;
  aInstallmentType : Array<
  {
    displayText:string,
    value:string
  }>;
  aLoanIssueEmployee : Array<
  {
    displayText:string,
    value:string
  }>;

  aTransactions : any;
  

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  
  
  constructor(private oBankAccountService: BankAccountService,
    private oCreditLoanServcie : CreditLoanService,
    private oAccountService: BankAccountService,
    public activatedroute : ActivatedRoute,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    
    this.aTypeofLoan = [
      {
        displayText: 'EMI Loan',
        value:'01'
      },
      {
      displayText: 'Personal Loan',
        value:'02'
      },
      {
      displayText: 'Agriculture Loan',
        value:'03'
      },
      {
      displayText: 'Gold Loan',
        value:'04'
      }, 
      {
      displayText: 'Silver Loan',
        value:'05'
      },
      {
      displayText: 'Temporary Loan',
        value:'06'
      }             
    ];
    this.aInstallmentType = [
      {
        displayText: 'Daily',
        value:'01'
      },
      {
        displayText: 'Weekly',
        value:'02'
      },
      {
        displayText: 'Monthly',
        value:'03'
      }
    ];
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
    
    this.sButtonText = 'Print';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      // const tempobj = JSON.parse(JSON.stringify(this.oEditBankaccount));
      // this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
    if(this.activatedroute.snapshot.data.type === 'statement'){
      this.sHeaderText='Bank Statement';
      this.bPdf =true ;
    }
  }

  fnGetCreditLoans(oSelectedAccount : BankAccount){
    this.oCreditLoanServcie.fngetCreditLoanInfo(oSelectedAccount.sAccountNo).subscribe((loandata)=>{
      this.aCreditLoan = loandata as any;
      this.oAccountService.fngetBankAccountSavingsTransactions(oSelectedAccount.nAccountId).subscribe((savingdata)=>{
        this.aTransactions = savingdata as any;
        console.log(this.aTransactions);
      });
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
  
  fnPrintSavingAccount(): void {
    this.fnDeactivateNgClasses(true,false,false,false,false,false,false);
    this.fnConfirmationMessage(this.nInputLineFrom1,this.nInputLineTo1);
  }

  fnPrintLoanAccount(type): void {
    console.log(type);
    if(type === 'EMI Loan') this.fnDeactivateNgClasses(false,true,false,false,false,false,false);
    else if(type === 'Personal Loan') this.fnDeactivateNgClasses(false,false,true,false,false,false,false);
    else if(type === 'Agriculture Loan') this.fnDeactivateNgClasses(false,false,false,true,false,false,false);
    else if(type === 'Gold Loan')  this.fnDeactivateNgClasses(false,false,false,false,true,false,false);
    else if(type === 'Silver Loan')  this.fnDeactivateNgClasses(false,false,false,false,false,true,false);
    else  this.fnDeactivateNgClasses(false,false,false,false,false,false,true);
    this.fnConfirmationMessage(this.nInputLineFrom2,this.nInputLineTo2);
  }
  fnDeactivateNgClasses(b1,b2,b3,b4,b5,b6,b7){
    this.bFirstButton = b1 ;
    this.bEmiLoan = b2 ;
    this.bPersonalLoan = b3 ;
    this.bAgriculturalLoan = b4 ;
    this.bGoldLoan = b5 ;
    this.bSilverLoan = b6 ;
    this.bTemporaryLoan = b7 ;
  }

  fnConfirmationMessage(fromLine: number, toLine: number) {
    if (fromLine > toLine)
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Please enter proper line numbers.'
      }
      );
    else
      Swal.fire(
        {
          position: 'center',
          icon: 'question',
          title: 'Do you want to print?',
          text: 'From line ' + fromLine + ' to line ' + toLine,
          showConfirmButton: true,
          showCancelButton: true,

        }
      ).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
          this.lineFrom = fromLine ;
          this.lineTo = toLine ;
          setTimeout(() => {
            window.print();
          }, 300);
        }
      });
  }

  fnPrinPdfSavingsAccount(): void {
    let data = document.getElementById('ledger');
    html2canvas(data,{
      allowTaint : true,
      useCORS : true ,
      scale : 2
    }).then(canvas => {
      let pdf = new jsPDF('p', 'pt', 'letter');
      //pdf.canvas.height = 72 * 60;
      //pdf.canvas.width = 72 * 70;

      pdf.addImage(canvas.toDataURL('image/png,1.0'),'PNG',7,13, 195,105)  
      pdf.text(data.innerHTML,20,20);   
      pdf.save('SavingsAccount.pdf');
    });
  }

  fnPrinPdfLoanAccount(): void{
  
    let pdf = new jsPDF('p', 'pt', 'letter');
    pdf.canvas.height = 72 * 11;
    pdf.canvas.width = 72 * 8.5;
    
    //pdf.fromHTML(document.body);
    //pdf.html()
    pdf.text("hai this is ameen",20,20);
    pdf.save('LoanAccount.pdf');  
  }

}  
