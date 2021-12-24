import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { District } from '../../../core/models/district.model';
import { DistrictService } from '../../../core/services/district.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-district',
  templateUrl: './add-district.component.html',
  styleUrls: ['./add-district.component.scss']
})
export class AddDistrictComponent implements OnInit {

  districts: Array<District>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditDistrict: District;

  public oDistrictModel: District;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_DistrictFormElem')
  public oDistrictfoFormElem: any;


  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  constructor(private oDistrictService: DistrictService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add District', active: true }];

    this.oDistrictModel = new District();
    this.sButtonText = 'Add';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      const tempobj = JSON.parse(JSON.stringify(this.oEditDistrict));
      this.oDistrictModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.oDistrictService.fngetDistrictInfo().subscribe((data) => {
      this.districts = [...data as any];

    });
  }

  fnResetDistrictName() {
    this.oDistrictModel.sDistrictName = '';
  }

  fnOnDistrictInfoSubmit(): void {
    
    if(this.oDistrictModel.sDistrictName.length === 0 || this.oDistrictModel.sDistrictName.trim().length === 0)
    {
      this.fnEmptyDistrictNameMessage();
      return;
    }
    //Verification for Duplicate District name
      for(var i = 0; i < this.districts.length; i++) {
        if(this.districts[i].sDistrictName.toLowerCase() === this.oDistrictModel.sDistrictName.toLowerCase().trim()) {
          this.fnDuplicateDistrictNameMessage();
          return;
        }
    }

    if (!this.bisEditMode) {
      this.bIsAddActive = true;
      this.oDistrictService.fnAddDistrictInfo(this.oDistrictModel).subscribe((data) => {
        this.districts = [];
        this.oDistrictService.fngetDistrictInfo().subscribe((cdata) => {
          this.fnSucessMessage();
          this.districts = [...cdata as any];
          this.oDistrictModel.sDistrictName = '';
          this.bIsAddActive = false;
          this.addClicked.emit();
        });
      });
    } else {
      // Edit function from service here
      this.bIsEditActive = true;
      this.oDistrictService.fnEditDistrictInfo(this.oDistrictModel).subscribe((data) => {
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit() {
    this.oDistrictService.fngetDistrictInfo().subscribe((cdata) => {
      this.fnEditSucessMessage();
      this.districts = [];
      console.log(this.districts);
      this.districts = [...cdata as any];
      console.log(this.districts);
      this.oDistrictModel.sDistrictName = '';
      this.modalService.dismissAll();
    });
  }


  fnDeleteDistrict(nIndex) {
    console.log(this.districts[nIndex] as District);
    Swal.fire({
      title: 'Do you want to delete  "'+(this.districts[nIndex] as District).sDistrictName+'" and all Mandals in this District?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.oDistrictService.fnDeleteDistrictInfo(this.districts[nIndex] as District).subscribe((data) => {
          this.districts = [];
          this.oDistrictService.fngetDistrictInfo().subscribe((cdata) => {
            Swal.fire((data as District).sDistrictName, 'District is deleted successfully.', 'success');
            this.districts = [...cdata as any];
            this.oDistrictModel.sDistrictName = '';
          });
        });

      }
    });

  }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'District is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyDistrictNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid District Name',
      showConfirmButton: false,
      timer: 2000
    });
  }

  fnDuplicateDistrictNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'District Name is already exists',
      showConfirmButton: false,
      timer: 2000
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'District is updated sucessfully.',
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




