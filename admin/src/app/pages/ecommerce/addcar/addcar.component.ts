import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addcar',
  templateUrl: './addcar.component.html',
  styleUrls: ['./addcar.component.scss']
})
export class AddcarComponent implements OnInit {

  cars: Array<Car>;

  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Input() oEditCar: Car;

  public oCarModel: Car;
  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_CarFormElem')
  public oCarfoFormElem: any;

  @ViewChild('addcardropzoneElem')
  public oDropZone: DropzoneComponent;
  aCarTypes : Array<
  {
    displayText:string,
    value:number
  }>;
  aDistrict : Array<
  {
    displayText:string,
    value:number
  }>;
  aMandal : Array<
  {
    displayText:string,
    value:number
  }>;
  aVillage : Array<
  {
    displayText:string,
    value:number
  }>;
  aBranchCode  : Array<
  {
    displayText:string,
    value:number
  }>;
  public oDropZoneConfig: DropzoneConfigInterface = {
    // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/car/upload_file",//"/nodejs/car/upload_file", 
  maxFilesize: 100,
  maxFiles: 1
  };

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideCateogryList: boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  constructor(private oCarService: CarService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'New Setup' }, { label: 'Add Car', active: true }];
    this.aDistrict = [
      {
        displayText: 'Mahabubabad',
        value:0
      }
    ];
    this.aMandal = [
      {
        displayText: 'Gudur',
        value:0
      }
    ];
    this.aVillage = [
      {
        displayText: 'Gajulagattu',
        value:0
      }
    ];
    this.aCarTypes = [
      {
        displayText: 'Telangana',
        value: 0
      },
      ];
    this.aBranchCode = [
      {
        displayText: '010101',
        value: 0
      },
      {
        displayText: '010102',
        value: 1
      },
      {
        displayText: '010103',
        value: 2
      },
      {
        displayText: '010104',
        value: 3
      }
    ];
    this.oCarModel = new Car();
    this.sButtonText = 'Add';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      const tempobj = JSON.parse(JSON.stringify(this.oEditCar));
      this.oCarModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.oCarService.fngetCarInfo().subscribe((data) => {
      this.cars = [...data as any];

    });
  }

  fnResetCarName() {
    this.oCarModel.sCarName = '';
  }

  fnOnCarInfoSubmit(): void {
    if(this.cars != undefined && this.cars !== null){
      if(this.oCarModel.sCarName.length === 0 || this.oCarModel.sCarName.trim().length === 0)
      {
        this.fnEmptyCarNameMessage();
        return;
      }
      //Verification for Duplicate Car name
        for(var i = 0; i < this.cars.length; i++) {
          if(this.cars[i].sCarName.toLowerCase() === this.oCarModel.sCarName.toLowerCase().trim()) {
            this.fnDuplicateCarNameMessage();
            return;
          }
      }
    }
    

    if (!this.bisEditMode) {
      this.bIsAddActive = true;
      this.oCarService.fnAddCarInfo(this.oCarModel).subscribe((data) => {
        this.cars = [];
        this.oCarService.fngetCarInfo().subscribe((cdata) => {
          this.fnSucessMessage();
          this.cars = [...cdata as any];
          this.oCarModel.sCarName = '';
          this.bIsAddActive = false;
          this.addClicked.emit();
        });
      });
    } else {
      // Edit function from service here
      this.bIsEditActive = true;
      this.oCarService.fnEditCarInfo(this.oCarModel).subscribe((data) => {
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit() {
    this.oCarService.fngetCarInfo().subscribe((cdata) => {
      this.fnEditSucessMessage();
      this.cars = [];
      console.log(this.cars);
      this.cars = [...cdata as any];
      console.log(this.cars);
      this.oCarModel.sCarName = '';
      this.modalService.dismissAll();
    });
  }

  fnonUploadImageSuccess(args: any){
    this.oCarModel.oImageInfo = args[1].oImageRefId;
  }

  fnDeleteCar(nIndex) {
    console.log(this.cars[nIndex] as Car);
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
        this.oCarService.fnDeleteCarInfo(this.cars[nIndex] as Car).subscribe((data) => {
          this.cars = [];
          this.oCarService.fngetCarInfo().subscribe((cdata) => {
            Swal.fire((data as Car).sCarName, 'Car is deleted successfully.', 'success');
            this.cars = [...cdata as any];
            this.oCarModel.sCarName = '';
          });
        });

      }
    });

  }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Car is saved sucessfully.',
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
