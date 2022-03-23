import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { BankAccountService } from '../../../core/services/account.service';

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
  bNotVisiblePdf: boolean;
  constructor(private oBankAccountService : BankAccountService) { }

  ngOnInit(): void {
    this.oBankAccountService.pdfGenerationClicked.subscribe((data) => {
      if(this.oBankAccountService.proceed == true){
        if(data.type === this.type){
          //this.bNotVisiblePdf = true;
          this.fnPrintPdfSavingsAccount(data.Account,data.type);    
          this.oBankAccountService.proceed= false;
        } 
      }
     
    })
  }
  fnPrintPdfSavingsAccount(Account,type): void {
    let data = document.getElementById(type);
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
