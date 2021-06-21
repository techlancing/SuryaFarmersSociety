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
//  export class IntraTransactionComponent implements OnInit {

  

