import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { BankAccountService } from '../../../core/services/account.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-ledger-table',
  templateUrl: './account-ledger-table.component.html',
  styleUrls: ['./account-ledger-table.component.scss']
})
export class AccountLedgerTableComponent implements OnInit {
@Input() aTransactions : any;
@Input() bShowAccNum : boolean ;
@Input() bPrintLine : boolean ;
@Input() lineFrom : number ;
@Input() lineTo : number ;
@Input() lineDecide : number ;
@Input() bShowEmployee : boolean ;
@Input() bNotPrintHead : boolean ;
@Input() type : string;
  bVisiblePdf: boolean;
  accountDetails : any;
  oAlltransactionprintmodel: any;
  sImageRootPath : string;
  bVisibleLoan: boolean;
  oCreditLoanmodel: any;
  nLineFrom: number;
  nOutstandingAmount: any;
  bVisibleSavings : boolean ;
  oSavingDepositmodel : any ;
  
  constructor(private oBankAccountService : BankAccountService) { }

  ngOnInit(): void {
    this.bVisiblePdf = false;
    this.bVisibleLoan = false;
    this.bVisibleSavings = false ;
    this.sImageRootPath = environment.imagePath;
    // this.nLineFrom = this.lineFrom % 18;
    console.log("outstanding",this.nOutstandingAmount)
    this.nOutstandingAmount = this.aTransactions[this.aTransactions.length-1].nBalanceAmount ;
    this.oBankAccountService.pdfGenerationClicked.subscribe((data) => {
      if(this.oBankAccountService.proceed == true){
        if(data.type === this.type){
          this.oBankAccountService.sendBankAccountDetails.subscribe((cdata) => {
           this.oAlltransactionprintmodel = cdata as any;
           if(this.oAlltransactionprintmodel !== null){
             this.bVisiblePdf = true ;
             if(this.type.split(' ')[1]== 'Loan'){
              this.oBankAccountService.sendLoanAccountDetails.subscribe((kdata) => {
                if(kdata !== null){
                  this.bVisibleLoan = true;
                  this.bVisibleSavings = false;
                  this.oSavingDepositmodel = null;
                  this.oCreditLoanmodel = kdata as any;
                }
               });
             }else if(this.type.split(' ')[1]== 'Deposit'){
              this.oBankAccountService.sendSavingDepositDetails.subscribe((kdata) => {
                if(kdata !== null){
                  this.bVisibleLoan = false;
                  this.bVisibleSavings = true;
                  this.oCreditLoanmodel = null;
                  this.oSavingDepositmodel = kdata as any;
                }
               });
             }
             console.log(this.bVisibleLoan, this.bVisibleSavings,this.oSavingDepositmodel,this.oCreditLoanmodel);
             setTimeout(() => {
              this.fnPrintPdfSavingsAccount(data.Account,data.type);
             },100)
                 
           }
          this.oBankAccountService.proceed= false;
          });   
        } 
      }
    })
  }
  fnPrintPdfSavingsAccount(Account,type): void {
    let data = document.getElementById(type);
    data.classList.add("pdfstyle");
    this.bVisibleLoan = false;
    this.bVisiblePdf = false;
    this.bVisibleSavings = false ;
      let pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',  
        putOnlyUsedFonts:false
       });
      pdf.setFontSize(1);
      pdf.html(data,{
        callback: function (doc) {
          doc.save(Account+"-"+type+'.pdf');
          data.classList.remove("pdfstyle");
        },
        margin:[10,0,10,0],
        autoPaging:'text',
        width:450,
        windowWidth:450
      });
      this.oSavingDepositmodel = null;
      this.oCreditLoanmodel = null ;
      this.ngOnInit();
  }

}
