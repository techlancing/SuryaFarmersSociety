import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BankAccount } from '../../../core/models/bankaccount.model';
import { District } from '../../../core/models/district.model';
import { Mandal } from '../../../core/models/mandal.model';
import { Village } from '../../../core/models/village.model';
import { BankAccountService } from '../../../core/services/account.service';
import { DistrictService } from '../../../core/services/district.service';
import { MandalService } from '../../../core/services/mandal.service';
import { VillageService } from '../../../core/services/village.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.scss']
})
export class AddaccountComponent implements OnInit {

  bankaccounts: Array<BankAccount>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditBankAccount: BankAccount;


  public oBankAccountModel: BankAccount;
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
  aDistrict : Array<District>;
  aMandal : Array<Mandal>;
  aVillage : Array<Village>;
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
    private oDistrictService: DistrictService,
    private oMandalService: MandalService,
    private oVillageService: VillageService,
    private router : Router,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Account', active: true }];
    
    this.oDistrictService.fngetDistrictInfo().subscribe((data) => {
      this.aDistrict = [...data as any];
      
    });
    
    this.aState = [
      {
        displayText: 'Telangana',
        value: '01'
      },
      ];
    
    this.oBankAccountModel = new BankAccount();
    this.oBankAccountModel.sDate = new Date().toJSON().slice(0,10).replace(/-/g,'-').split('').reverse().join('');
    this.sButtonText = 'Save & Submit';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      const tempobj = JSON.parse(JSON.stringify(this.oEditBankAccount));
      this.oBankAccountModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.oBankAccountService.fngetBankAccountInfo().subscribe((data) => {
      this.bankaccounts = [...data as any];

    });
  }

  fnFetchMandalInfo(event, nDistrictId: number) {
    this.aMandal = [];
    this.oBankAccountModel.nMandalId = null;
    let alocalmandal = {};
    this.oMandalService.fngetMandalInfo().subscribe((data) => {
      this.aMandal = [...data as any];
      alocalmandal = this.aMandal.filter((mandal:any) => {
        if (mandal.nDistrictId === nDistrictId) {
          return mandal;
        }
      });
      this.aMandal = [...alocalmandal as any];
    });
    
  }

  fnFetchVillageInfo(event, nMandalId: number) {
    this.aVillage = [];
    this.oBankAccountModel.nVillageId = null;
    let alocalvillage = {};
    this.oVillageService.fngetVillageInfo().subscribe((data) => {
      this.aVillage = [...data as any];
      alocalvillage = this.aVillage.filter((village:any) => {
        if (village.nMandalId === nMandalId) {
          return village;
        }
      });
      this.aVillage = [...alocalvillage as any];
    });
    
  }

  fnCreateAccountDetails(){
    let statecode = this.oBankAccountModel.sState;
    let selecteddistrict = this.aDistrict.find(item=> item.nDistrictId === this.oBankAccountModel.nDistrictId);
    let selectedmandal = this.aMandal.find(item=> item.nMandalId === this.oBankAccountModel.nMandalId);
    let selectedvillage = this.aVillage.find(item=> item.nVillageId === this.oBankAccountModel.nVillageId);
     this.oBankAccountModel.sBranchCode =  statecode 
     + (selecteddistrict.nDistrictCode.toString().length > 1 ? selecteddistrict.nDistrictCode.toString() : '0'+selecteddistrict.nDistrictCode.toString())
     + (selectedmandal.nMandalCode.toString().length > 1 ? selectedmandal.nMandalCode.toString() : '0'+selectedmandal.nMandalCode.toString())
     + (selectedvillage.nVillageCode.toString().length > 1 ? selectedvillage.nVillageCode.toString() : '0'+selectedvillage.nVillageCode.toString())
      
     
     
    this.oBankAccountService.fngetLastBankAccountInfo(this.oBankAccountModel.nVillageId).subscribe((data:any) => {
      
      if(data.accno.toString().length === 1){
        this.oBankAccountModel.sAccountNo = this.oBankAccountModel.sBranchCode +'000' + data.accno;
      }else{
        
        this.oBankAccountModel.sAccountNo = (parseInt(data.accno) + 1).toString();
      }
      
      //this.oBankAccountModel.sCustomerId = this.oBankAccountModel.sBranchCode + '0002';
    });
  }

  fnResetState() {
    this.oBankAccountModel.sState = '';
  }

  fnOnBankAccountInfoSubmit(): void {
    if(this.oBankAccountModel.sState === '' || 
    this.oBankAccountModel.nDistrictId === null || 
    this.oBankAccountModel.nMandalId === null || 
    this.oBankAccountModel.nVillageId === null || 
    this.oBankAccountModel.sDate === '' || 
    this.oBankAccountModel.sApplicantName === '' ||
    this.oBankAccountModel.sApplicantSurName === '' ||
    this.oBankAccountModel.sGender === '' ||
    this.oBankAccountModel.sDOB === '' ||
    this.oBankAccountModel.sAge === '' ||
    this.oBankAccountModel.sAccountType === '' ||
    this.oBankAccountModel.sAccountCategory === '' ||
    this.oBankAccountModel.sShareType === '' ||
    this.oBankAccountModel.sSMSAlert === '' ||
    this.oBankAccountModel.sFatherOrHusbandName === '' ||
    this.oBankAccountModel.sMotherName === '' ||
    this.oBankAccountModel.sNomineeName === '' ||
    this.oBankAccountModel.sVoterIdNo === '' ||
    this.oBankAccountModel.sAadharNo === '' ||
    this.oBankAccountModel.sRationCardNo === '' ||
    this.oBankAccountModel.sFlatNo === '' ||
    this.oBankAccountModel.sStreetName === '' ||
    this.oBankAccountModel.sVillageAddress === '' ||
    this.oBankAccountModel.sMandalAddress === '' ||
    this.oBankAccountModel.sDistrictAddress === '' ||
    this.oBankAccountModel.sPinCode === '' ||
    this.oBankAccountModel.sMobileNumber === '' ||
    this.oBankAccountModel.sEmail === '' ||
    this.oBankAccountModel.nAmount === null ){
      this.fnShowFieldsAreEmpty();
      return;
    }
    if(this.bankaccounts != undefined && this.bankaccounts !== null){
      if(this.oBankAccountModel.sState.length === 0 || this.oBankAccountModel.sState.trim().length === 0)
      {
        // this.fnEmptyStateMessage();
        //return;
      }
      //Verification for Duplicate Car name
        for(var i = 0; i < this.bankaccounts.length; i++) {
          if(this.bankaccounts[i].sState.toLowerCase() === this.oBankAccountModel.sState.toLowerCase().trim()) {
            // this.fnDuplicateCarNameMessage();
            //return;
          }
      }
    }
 
      this.bIsAddActive = true;
       this.oBankAccountService.fnAddBankAccountInfo(this.oBankAccountModel).subscribe((data) => {
        this.bankaccounts = [];
         this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
           this.fnSucessMessage();
           this.bankaccounts = [...cdata as any];
          //this.oBankAccountModel.sState = '';
          this.bIsAddActive = false;
          this.addClicked.emit();
          this.redirectTo('/newaccountform');
        });
      });
  }

  // fnUpdateParentAfterEdit() {
  //   this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
  //     this.fnEditSucessMessage();
  //     this.bankaccounts = [];
  //     console.log(this.bankaccounts);
  //     this.bankaccounts = [...cdata as any];
  //     console.log(this.bankaccounts);
  //     this.oBankAccountModel.sState = '';
  //     this.modalService.dismissAll();
  //   });
  // }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

  fnonUploadPassportImageSuccess(args: any){
    this.oBankAccountModel.oPassportImageInfo = args[1].oImageRefId;
  }

  fnonUploadSignature1ImageSuccess(args: any){
    this.oBankAccountModel.oSignature1Info = args[1].oImageRefId;
  }

  fnonUploadSignature2ImageSuccess(args: any){
    this.oBankAccountModel.oSignature2Info = args[1].oImageRefId;
  }

  fnonUploadDocument1ImageSuccess(args: any){
    this.oBankAccountModel.oDocument1Info = args[1].oImageRefId;
  }

  fnonUploadDocument2ImageSuccess(args: any){
    this.oBankAccountModel.oDocument2Info = args[1].oImageRefId;
  }

  // fnDeleteCar(nIndex) {
  //   console.log(this.bankaccounts[nIndex] as BankAccount);
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#34c38f',
  //     cancelButtonColor: '#f46a6a',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then(result => {
  //     if (result.value) {
  //       this.oBankAccountService.fnDeleteCarInfo(this.bankaccounts[nIndex] as BankAccount).subscribe((data) => {
  //         this.bankaccounts = [];
  //         this.oBankAccountService.fngetBankAccountInfo().subscribe((cdata) => {
  //           Swal.fire((data as BankAccount).sState, 'State is deleted successfully.', 'success');
  //           this.bankaccounts = [...cdata as any];
  //           this.oBankAccountModel.sState = '';
  //         });
  //       });

  //     }
  //   });

  // }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'State is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnShowFieldsAreEmpty(){
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please fill all the fields.',
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

  fnDuplicateCarNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Car Name is already exists',
      showConfirmButton: false,
      timer: 2000
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Car is updated sucessfully.',
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
