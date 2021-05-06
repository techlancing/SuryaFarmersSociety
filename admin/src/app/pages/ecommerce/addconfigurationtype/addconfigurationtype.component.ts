import { Component, Input, OnInit, ViewChild,EventEmitter, Output } from '@angular/core';
import { Configurationtype } from '../../../core/models/configurationtype.model';
import { ConfigurationtypeService } from '../../../core/services/configurationtype.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addconfigurationtype',
  templateUrl: './addconfigurationtype.component.html',
  styleUrls: ['./addconfigurationtype.component.scss']
})
export class AddconfigurationtypeComponent implements OnInit {

  aConfigurationtypes: Array<{
    nConfigurationtypeId?: number;
    sConfigurationtypeName?: string,
  }>;

  @Output() updateClicked = new EventEmitter();
  @Input() oEditConfigurationtype: Configurationtype;

  public oConfigurationtypeModel: Configurationtype;
  public nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  @ViewChild('_configurationtypeFormElem')
  public oConfigurationtypeFormElem: any;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideConfigurationtypeList:boolean = false;

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  constructor(private oConfigurationtypeService: ConfigurationtypeService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Configuration Type', active: true }];

    this.oConfigurationtypeModel = new Configurationtype();
    this.sButtonText = 'Add';
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode){
      let tempobj = JSON.parse(JSON.stringify(this.oEditConfigurationtype));
      this.oConfigurationtypeModel = tempobj;
      this.sButtonText = 'Update';
    }
    this.oConfigurationtypeService.fngetConfigurationtypeInfo().subscribe( (data) => {
      this.aConfigurationtypes = [...data as any];
    });
  }

  fnResetConfigurationtypeName(){
    this.oConfigurationtypeModel.sConfigurationtypeName = ''
  }

  fnOnConfigurationtypeInfoSubmit(): void {
    // console.log(this.oBasicInfoFormElem.value as Product);
    console.log(this.oConfigurationtypeModel.sConfigurationtypeName.length)
    console.log(this.oConfigurationtypeModel.sConfigurationtypeName.trim().length)
    if(this.oConfigurationtypeModel.sConfigurationtypeName.length === 0 || this.oConfigurationtypeModel.sConfigurationtypeName.trim().length === 0) {
      this.fnEmptyConfigNameMessage();
      return;
    }
    for(var i = 0; i < this.aConfigurationtypes.length; i++) {
      if(this.aConfigurationtypes[i].sConfigurationtypeName.toLowerCase() === this.oConfigurationtypeModel.sConfigurationtypeName.toLowerCase().trim()) {
        this.fnDuplicateConfigNameMessage();
        return;
      }
    }
    if (!this.bisEditMode){
      this.bIsAddActive = true;
      this.oConfigurationtypeService.fnAddConfigurationtypeInfo(this.oConfigurationtypeModel).subscribe( (data) => {
        this.aConfigurationtypes = [];
        this.oConfigurationtypeService.fngetConfigurationtypeInfo().subscribe( (cdata) => {
          this.fnSucessMessage();
          this.aConfigurationtypes = [...cdata as any];
          this.oConfigurationtypeModel.sConfigurationtypeName = '';
          this.bIsAddActive = false;
        });
      });
    }else{
      // Edit function from service here
      this.bIsEditActive = true;
      this.oConfigurationtypeService.fnEditConfigurationtypeInfo(this.oConfigurationtypeModel).subscribe( (cdata) => {
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit(){
    this.oConfigurationtypeService.fngetConfigurationtypeInfo().subscribe( (cdata) => {
      this.fnEditSucessMessage();
      this.aConfigurationtypes = [];
      console.log(this.aConfigurationtypes);
      this.aConfigurationtypes = [...cdata as any];
      console.log(this.aConfigurationtypes);
      this.oConfigurationtypeModel.sConfigurationtypeName = '';
      this.modalService.dismissAll();
    });
  }

  fnDeleteConfigurationtype(nIndex){
    console.log(this.aConfigurationtypes[nIndex] as Configurationtype);
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
        this.oConfigurationtypeService.fnDeleteConfigurationtypeInfo(this.aConfigurationtypes[nIndex] as Configurationtype).subscribe((data) => {
          this.aConfigurationtypes = [];
          this.oConfigurationtypeService.fngetConfigurationtypeInfo().subscribe( (cdata) => {
            Swal.fire((data as Configurationtype).sConfigurationtypeName, 'Configurationtype is deleted successfully.', 'success');
            this.aConfigurationtypes = [...cdata as any];
            this.oConfigurationtypeModel.sConfigurationtypeName = '';
         });
        });
        
      }
    });
    
  }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Configuration type is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Configuration type is updated sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyConfigNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Configuration type',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  fnDuplicateConfigNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Configuration type is already exists.',
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
