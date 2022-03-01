import { Component, Input, OnInit } from '@angular/core';
import { BankAccount } from 'src/app/core/models/bankaccount.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  @Input() oBankAccount : BankAccount ;
  sImageRootPath: string;
  constructor() { }

  ngOnInit(): void {
    this.sImageRootPath = environment.imagePath;
  }

}
