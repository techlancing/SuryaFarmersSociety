import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Vendor } from '../../../core/models/vendor.model';
import { VendorService } from '../../../core/services/vendor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addvendor',
  templateUrl: './addvendor.component.html',
  styleUrls: ['./addvendor.component.scss']
})
export class AddvendorComponent implements OnInit {

  @Output() updateClicked = new EventEmitter();
  @Input() oEditVendor: Vendor;

  @ViewChild('_vendorInfoElem')
  public oVendorInfoFormElem: any;

  public oVendorModel: Vendor;
  public nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  public aVendors: Array<{
    nVendorId?: number;
    sVendorName?: string,
    sVendorAddress?: string,
    sVendorCityName?: string,
    sVendorGstNumber?: string,
    sVendorPanNumber?: string,
    nVendorMobileNumber? : number,
    sVendorTypeofLicense? : number,
    sVendorLicenseNumber? : string,
    sVendorTypeofSupply?: number
  }>;

  public aTypeofSupply :Array<
    {
      displayText:string,
      value:number
    }>;

  public aTypeofLicense :Array<
    {
      displayText:string,
      value:number
    }>;
    
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideVendorList:boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  constructor(private oVendorService: VendorService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Vendor', active: true }];
    this.oVendorModel = new Vendor();
    this.sButtonText = 'Add';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode){
      let tempobj = JSON.parse(JSON.stringify(this.oEditVendor));
      this.oVendorModel = tempobj;
      this.sButtonText = 'Update';
    }
    console.log(this.oEditVendor);
    this.aTypeofSupply = [
      {
        displayText: 'GST',
        value: 0
      },
      {
        displayText: 'IGST',
        value: 1
      },
      {
        displayText: 'COMP',
        value: 2
      }
    ];
    this.aTypeofLicense = [
      {
        displayText: 'Food License',
        value: 0
      },
      {
        displayText: 'Drug License',
        value: 1
      }
    ];
    this.oVendorService.fngetVendorInfo().subscribe( (cdata) => {
      this.aVendors = [...cdata as any];
    });
  }

  fnResetVendorName(){
    this.oVendorModel.sVendorName = '';
  }

  fnOnVendorInfoSubmit(): void {
    if (!this.bisEditMode){
      this.bIsAddActive = true;
      this.oVendorService.fnAddVendorInfo(this.oVendorModel).subscribe( (data) => {
        this.aVendors = [];
        this.oVendorService.fngetVendorInfo().subscribe( (cdata) => {
          this.fnSucessMessage();
          this.aVendors = [...cdata as any]; /*optimze*/
         // this.oVendorModel = new Vendor();
          this.oVendorModel.sVendorName = '';
          this.bIsAddActive = false;
        });
      });
    }else{
      // Edit function from service here
      this.bIsEditActive = true;
      this.oVendorService.fnEditVendorInfo(this.oVendorModel).subscribe( (cdata) => {
        this.updateClicked.emit();
      });
    }

  }

  fnUpdateParentAfterEdit(){
    this.oVendorService.fngetVendorInfo().subscribe( (cdata) => {
      this.fnEditSucessMessage();
      this.aVendors = [];
      console.log(this.aVendors);
      this.aVendors = [...cdata as any];
      console.log(this.aVendors);
      this.oVendorModel.sVendorName = '';
      this.modalService.dismissAll();
    });
  }

  fnDeleteVendor(nIndex){
    console.log(this.aVendors[nIndex] as Vendor);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value) {
        this.oVendorService.fnDeleteVendorInfo(this.aVendors[nIndex] as Vendor).subscribe((data) => {
          this.aVendors = [];
          this.oVendorService.fngetVendorInfo().subscribe( (cdata) => {
            Swal.fire((data as Vendor).sVendorName, 'Vendor is deleted successfully.', 'success');
            this.aVendors = [...cdata as any];
            this.oVendorModel.sVendorName = '';
         });
        });
        
      }
    });
    
  }


  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Vendor is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Vendor is updated sucessfully.',
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
