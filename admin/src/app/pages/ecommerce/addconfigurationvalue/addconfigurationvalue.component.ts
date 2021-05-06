import { Component, Input, OnInit, ViewChild, EventEmitter, Output} from '@angular/core';
import { Configurationvalue } from '../../../core/models/configurationvalue.model';
import { ConfigurationvalueService } from '../../../core/services/configurationvalue.service';
import { ConfigurationtypeService } from '../../../core/services/configurationtype.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addconfigurationvalue',
  templateUrl: './addconfigurationvalue.component.html',
  styleUrls: ['./addconfigurationvalue.component.scss']
})
export class AddconfigurationvalueComponent implements OnInit {

  @Input() oEditConfigurationvalue: Configurationvalue;
  @Input() aEditConfigurationtypes:  Array<{
    nConfigurationtypeId?: number;
    sConfigurationtypeName?: string,
    aConfigurationvaluesInfo: any

  }>;

  public oConfigurationvalueModel: Configurationvalue;
  public nSelectedConfigurationvalueEditIndex: number;
  public nSelectedConfigurationtypeEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;
  
  @ViewChild('_configurationvalueFormElem')
  public oConfigurationvalueFormElem: any;

  public nSelectedId: number = 1;
  hideme: boolean[] = [];

  aConfigvalues: Array<{
    nConfigurationtypeId?: number;
    sConfigurationvalueName?: string,
    sConfigurationvalueId: number
  }>;

  aConfigtypes: Array<{
    nConfigurationtypeId?: number;
    sConfigurationtypeName?: string,
    aConfigurationvaluesInfo: any
  }>;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideConfigurationvalueList:boolean = false;
  @Output() updateClicked = new EventEmitter();

  public sButtonText: string;
  @Input() bisEditMode: boolean;
  bisDeleteMode: boolean;
  constructor(private oConfigurationvalueService: ConfigurationvalueService,
              private oConfigurationtypeService: ConfigurationtypeService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Configuration Value', active: true }];

    this.oConfigurationvalueModel = new Configurationvalue();
    this.bIsAddActive = false;
    this.bIsEditActive = false;

    if (this.bisEditMode){
      this.aConfigtypes = this.aEditConfigurationtypes;
      let tempobj = JSON.parse(JSON.stringify(this.oEditConfigurationvalue));
        this.oConfigurationvalueModel = tempobj;
      this.sButtonText = 'Update';
    }
    else{
      this.sButtonText = 'Add';
      this.fnFetchDataFromServer(false);
    }
    console.log(this.oEditConfigurationvalue);
  }

  fnFetchDataFromServer(showmsg:boolean, configurationvalueName?:string){
    this.oConfigurationvalueService.fngetConfigurationvalueInfo().subscribe( (data) => {
      this.aConfigvalues = [...data as any];
      console.log(this.aConfigvalues);
        this.oConfigurationtypeService.fngetConfigurationtypeInfo().subscribe( (cdata) => {
        this.aConfigtypes = [...cdata as any];
        this.aConfigtypes.map((configtype) => {
          let alocalconfigval = {};
          alocalconfigval = this.aConfigvalues.filter((configval) => {
            if (configval.nConfigurationtypeId === configtype.nConfigurationtypeId){
              return configval;
            }
          });
          configtype.aConfigurationvaluesInfo = [...alocalconfigval as any];
        });
        this.oConfigurationvalueModel.sConfigurationvalueName = '';

        if(showmsg && (!this.bisEditMode) && (!this.bisDeleteMode)){
          this.bIsAddActive = false;
          this.fnSucessMessage();
        }
        else if(showmsg && this.bisEditMode){      
          this.fnEditSucessMessage();
          this.modalService.dismissAll();
          this.bisEditMode = false;
          this.bIsEditActive = false;
        }else if(showmsg && this.bisDeleteMode){
          Swal.fire(configurationvalueName, 'Configurationvalue is deleted successfully.', 'success');
          this.bisDeleteMode = false;
        }       

        for (let i = 0; i <= this.aConfigtypes.length; i++) {
          this.hideme.push(true);
        }
      });
    });
  }

  fnResetConfigurationvalueName(){
    this.oConfigurationvalueModel.sConfigurationvalueName = '';
  }

  fnOnConfigurationvalueInfoSubmit(): void {
    // console.log(this.oBasicInfoFormElem.value as Product);
    console.log(this.oConfigurationvalueModel.sConfigurationvalueName.length)
    console.log(this.oConfigurationvalueModel.sConfigurationvalueName.trim().length)
    if(this.oConfigurationvalueModel.sConfigurationvalueName.length === 0 || this.oConfigurationvalueModel.sConfigurationvalueName.trim().length === 0) {
      this.fnEmptyConfigValueMessage();
      return;
    }
    for(var i = 0; i < this.aConfigvalues.length; i++) {
      if(this.aConfigvalues[i].sConfigurationvalueName.toLowerCase() === this.oConfigurationvalueModel.sConfigurationvalueName.trim().toLowerCase()) {
        this.fnDuplicateConfigValueMessage();
        return;
      }
    }    
    if (!this.bisEditMode){
      this.bIsAddActive = true;
      this.oConfigurationvalueService.fnAddConfigurationvalueInfo(this.oConfigurationvalueModel).subscribe( (data) => {
        console.log(data);
        this.fnFetchDataFromServer(true);
      });
    }else{
      this.bIsEditActive = true;
      this.oConfigurationvalueService.fnEditConfigurationvalueInfo(this.oConfigurationvalueModel).subscribe( (data) => {
        console.log(data);
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit(){
    this.bisEditMode = true;
      this.fnFetchDataFromServer(true);    
    
  }

  fnDeleteConfigurationvalue(configtypeindex, configvalindex){
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
        this.oConfigurationvalueService.fnDeleteConfigurationvalueInfo(this.aConfigtypes[configtypeindex].aConfigurationvaluesInfo[configvalindex] as Configurationvalue).subscribe((data) => {
          this.bisDeleteMode = true;
          this.fnFetchDataFromServer(true,(data as Configurationvalue).sConfigurationvalueName);
        });
        
      }
    });
    
  }


  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  fnSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Configuration value is saved sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Configuration value is updated sucessfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyConfigValueMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Configuration value',
      showConfirmButton: false,
      timer: 1500
    })
  }

  fnDuplicateConfigValueMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Configuration Value is already exists',
      showConfirmButton: false,
      timer: 1500
    })
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any, configtypeindex, configvalindex) {
    this.nSelectedConfigurationtypeEditIndex = configtypeindex;
    this.nSelectedConfigurationvalueEditIndex = configvalindex;
    this.modalService.open(content, { centered: true });
  }

}
