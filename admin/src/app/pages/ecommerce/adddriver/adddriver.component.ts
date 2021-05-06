import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Driver } from '../../../core/models/driver.model';
import { DriverService } from '../../../core/services/driver.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-adddriver',
  templateUrl: './adddriver.component.html',
  styleUrls: ['./adddriver.component.scss']
})
export class AdddriverComponent implements OnInit {

  drivers: Array<Driver>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditDriver: Driver;

  public oDriverModel: Driver;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_driverFormElem')
  public oDriverfoFormElem: any;

  @ViewChild('dropzoneElem')
  public oDropZone: DropzoneComponent;
  aDriverTypes : Array<
  {
    displayText:string,
    value:number
  }>;
  aDriverSeating  : Array<
  {
    displayText:string,
    value:number
  }>;
  public oDropZoneConfig: DropzoneConfigInterface = {
    // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/driver/upload_file", //'https://httpbin.org/post',
  maxFilesize: 100,
  maxFiles: 1
  };

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  constructor(private oDriverService: DriverService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Driver', active: true }];
    
    this.oDriverModel = new Driver();
    this.sButtonText = 'Add';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      const tempobj = JSON.parse(JSON.stringify(this.oEditDriver));
      this.oDriverModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.oDriverService.fngetDriverInfo().subscribe((data) => {
      this.drivers = [...data as any];

    });
  }

  fnResetDriverName() {
    this.oDriverModel.sDriverName = '';
  }

  fnOnDriverInfoSubmit(): void {
    //console.log(this.oBasicInfoFormElem.value as Product);
    //this.oDriverModel.sDriverName empty or duplicate name
    console.log(this.oDriverModel.sDriverName.length);
    console.log(this.oDriverModel.sDriverName.trim().length);
    console.log(this.drivers);
    if(this.oDriverModel.sDriverName.length === 0 || this.oDriverModel.sDriverName.trim().length === 0)
    {
      this.fnEmptyDriverNameMessage();
      return;
    }
    //Verification for Duplicate Driver name
      for(var i = 0; i < this.drivers.length; i++) {
        if(this.drivers[i].sDriverName.toLowerCase() === this.oDriverModel.sDriverName.toLowerCase().trim()) {
          this.fnDuplicateDriverNameMessage();
          return;
        }
    }

    if (!this.bisEditMode) {
      this.bIsAddActive = true;
      this.oDriverService.fnAddDriverInfo(this.oDriverModel).subscribe((data) => {
        this.drivers = [];
        this.oDriverService.fngetDriverInfo().subscribe((cdata) => {
          this.fnSucessMessage();
          this.drivers = [...cdata as any];
          this.oDriverModel.sDriverName = '';
          this.bIsAddActive = false;
          this.addClicked.emit();
        });
      });
    } else {
      // Edit function from service here
      this.bIsEditActive = true;
      this.oDriverService.fnEditDriverInfo(this.oDriverModel).subscribe((data) => {
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit() {
    this.oDriverService.fngetDriverInfo().subscribe((cdata) => {
      this.fnEditSucessMessage();
      this.drivers = [];
      console.log(this.drivers);
      this.drivers = [...cdata as any];
      console.log(this.drivers);
      this.oDriverModel.sDriverName = '';
      this.modalService.dismissAll();
    });
  }

  fnonUploadImageSuccess(args: any){
    this.oDriverModel.oImageInfo = args[1].oImageRefId;
  }

  fnDeleteDriver(nIndex) {
    console.log(this.drivers[nIndex] as Driver);
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
        this.oDriverService.fnDeleteDriverInfo(this.drivers[nIndex] as Driver).subscribe((data) => {
          this.drivers = [];
          this.oDriverService.fngetDriverInfo().subscribe((cdata) => {
            Swal.fire((data as Driver).sDriverName, 'Driver is deleted successfully.', 'success');
            this.drivers = [...cdata as any];
            this.oDriverModel.sDriverName = '';
          });
        });

      }
    });

  }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Driver is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyDriverNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Driver Name',
      showConfirmButton: false,
      timer: 2000
    });
  }

  fnDuplicateDriverNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Driver Name is already exists',
      showConfirmButton: false,
      timer: 2000
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Driver is updated sucessfully.',
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
