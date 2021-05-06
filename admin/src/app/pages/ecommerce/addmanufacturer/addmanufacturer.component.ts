import { Component, OnInit, Input, EventEmitter, ViewChild, Output} from '@angular/core';
import { Manufacturer } from '../../../core/models/manufacturer.model';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addmanufacturer',
  templateUrl: './addmanufacturer.component.html',
  styleUrls: ['./addmanufacturer.component.scss']
})
export class AddmanufacturerComponent implements OnInit {
    
  public oManufacturerModel: Manufacturer;
    public aManufacturers: Array<{
      nManufacturerId?: number;
      sManufacturerName?: string,
      sManufacturerURL?: string
    }>;
  
    @Output() updateClicked = new EventEmitter();
    @Output() addClicked = new EventEmitter();
    @Input() oEditManufacturer: Manufacturer;
  
    @Input() nSelectedEditIndex: number;
    bIsAddActive: boolean;
    bIsEditActive: boolean;
  
    @ViewChild('_ManufacturerFormElem')
    public oManufacturerfoFormElem: any;
  
    breadCrumbItems: Array<{}>;
    @Input() bHideBreadCrumb: boolean = false;
    @Input() bHideManufacturerList:boolean = false;
  
    public sButtonText: string;
    @Input() bisEditMode: boolean;
    constructor(private oManufacturerService: ManufacturerService,
                private modalService: NgbModal) { }
  
    ngOnInit(): void {
      this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Manufacturer', active: true }];
      this.oManufacturerModel = new Manufacturer();
      this.sButtonText = 'Add';
      this.bIsAddActive = false;
      this.bIsEditActive = false;
      if (this.bisEditMode){
        let tempobj = JSON.parse(JSON.stringify(this.oEditManufacturer));
        this.oManufacturerModel = tempobj;
        this.sButtonText = 'Update';
      }
      this.oManufacturerService.fngetManufacturerInfo().subscribe( (cdata) => {
        this.aManufacturers = [...cdata as any];
      });
  
    }
  
    fnResetManufacturerName(){
      this.oManufacturerModel.sManufacturerName = ''
    }
  
    fnOnManufacturerInfoSubmit(): void {
      this.oManufacturerModel.sManufacturerURL = '/' + this.oManufacturerModel.sManufacturerName;
      if (!this.bisEditMode){
        this.bIsAddActive = true;
        this.oManufacturerService.fnAddManufacturerInfo(this.oManufacturerModel).subscribe( (data) => {
          this.aManufacturers = [];
          this.oManufacturerService.fngetManufacturerInfo().subscribe( (cdata) => {
            this.fnSucessMessage();
            this.aManufacturers = [...cdata as any]; /*optimze*/
            this.oManufacturerModel.sManufacturerName = '';
            this.bIsAddActive = false;
            this.addClicked.emit();
          });
        });
      }else{
        // Edit function from service here
        this.bIsEditActive = true;
        this.oManufacturerService.fnEditManufacturerInfo(this.oManufacturerModel).subscribe( (cdata) => {
          this.updateClicked.emit();
        });
      }
    }
  
    fnUpdateParentAfterEdit(){
      this.oManufacturerService.fngetManufacturerInfo().subscribe( (cdata) => {
        this.fnEditSucessMessage();
        this.aManufacturers = [];
        console.log(this.aManufacturers);
        this.aManufacturers = [...cdata as any];
        console.log(this.aManufacturers);
        this.oManufacturerModel.sManufacturerName = '';
        this.modalService.dismissAll();
      });
    }
  
    fnDeleteManufacturer(nIndex){
      console.log(this.aManufacturers[nIndex] as Manufacturer);
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
          this.oManufacturerService.fnDeleteManufacturerInfo(this.aManufacturers[nIndex] as Manufacturer).subscribe((data) => {
            this.aManufacturers = [];
            this.oManufacturerService.fngetManufacturerInfo().subscribe( (cdata) => {
              Swal.fire((data as Manufacturer).sManufacturerName, 'Manufacturer has been deleted.', 'success');
              this.aManufacturers = [...cdata as any];
              this.oManufacturerModel.sManufacturerName = '';
           });
          });
  
        }
      });
  
    }
  
    fnSucessMessage() {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Manufacturer is saved sucessfully.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  
    fnEditSucessMessage() {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Manufacturer is updated sucessfully.',
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
  