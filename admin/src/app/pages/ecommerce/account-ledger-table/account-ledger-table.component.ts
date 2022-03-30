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
@Input() bShowEmployee : boolean ;
@Input() bNotPrintHead : boolean ;
@Input() type : string;
  bVisiblePdf: boolean;
  accountDetails : any;
  oAlltransactionprintmodel: any;
  sImageRootPath : string;
  bVisibleLoan: boolean;
  oCreditLoanmodel: any;
  constructor(private oBankAccountService : BankAccountService) { }

  ngOnInit(): void {
    this.sImageRootPath = environment.imagePath;
    this.oBankAccountService.pdfGenerationClicked.subscribe((data) => {
      if(this.oBankAccountService.proceed == true){
        if(data.type === this.type){
          this.oBankAccountService.sendBankAccountDetails.subscribe((cdata) => {
           this.oAlltransactionprintmodel = cdata as any;
           if(this.oAlltransactionprintmodel !== null){
             this.bVisiblePdf = true ;
             this.oBankAccountService.sendLoanAccountDetails.subscribe((kdata) => {
              if(kdata !== null){
                this.bVisibleLoan = true;
                this.oCreditLoanmodel = kdata as any;
              }
             });
             setTimeout(() => {
              this.fnPrintPdfSavingsAccount(data.Account,data.type);
             },1)
                 
           }
          this.oBankAccountService.proceed= false;
          });
          
        } 
      }
     
    })
    // setTimeout(() => {
     
    //  },3000)
  }
  fnPrintPdfSavingsAccount(Account,type): void {
    let data = document.getElementById(type);
    this.bVisiblePdf = false;
    this.bVisibleLoan = false;
      let pdf = new jsPDF({
        orientation: 'l',
        unit: 'pt',
        format: 'a4',  
        putOnlyUsedFonts:false
       });
       //putOnlyUsedFonts:true
      pdf.setFontSize(5);
      pdf.html(data,{
        callback: function (doc) {
          doc.save(Account+"-"+type+'.pdf');
         
        }
      });
      this.ngOnInit();
  }

  // fnPrinPdfLoanAccount(): void{ 
  //   let data = document.getElementById('savingsPrint');
  //   let pdf = new jsPDF({
  //     orientation: 'p',
  //     unit: 'mm',
  //     format: 'a4',
  //     putOnlyUsedFonts:true
  //    });
  //   pdf.setFontSize(10);
  //   pdf.html(data,{
  //     callback: function (doc) {
  //       doc.save('LoanAccount.pdf');
  //     }
  //   });
  // }
}
