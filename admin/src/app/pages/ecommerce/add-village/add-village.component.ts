import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Village } from '../../../core/models/village.model';
import { VillageService } from '../../../core/services/village.service';
import { MandalService } from '../../../core/services/mandal.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Mandal } from 'src/app/core/models/mandal.model';

@Component({
  selector: 'app-add-village',
  templateUrl: './add-village.component.html',
  styleUrls: ['./add-village.component.scss']
})
export class AddVillageComponent implements OnInit {

  @Input() oEditVillage: Village;
  @Input() aEditMandals: Array<Mandal>;

  public oVillageModel: Village;
  nSelectedMandalEditIndex: number;
  nSelectedVillageEditIndex: number;
  @Input() bisEditMode: boolean;
  @ViewChild('_VillageFormElem')
  public oVillagefoFormElem: any;

  public nSelectedId: number = 1;
  hideme: boolean[] = [];
  aAllMandals: any;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  aVillages: Array<Village>;

  aMandals: Array<Mandal>;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  bisDeleteMode: boolean;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideSubCateogryList: boolean = false;
  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();

  public sButtonText: string;
  constructor(private oVillageService: VillageService, private oMandalService: MandalService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Village', active: true }];

    this.oVillageModel = new Village();
    console.log("new",this.oVillageModel);
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      //dont need a new object as we dont manipulate it.
      this.aMandals = this.aEditMandals;
      let tempobj = JSON.parse(JSON.stringify(this.oEditVillage));
      this.oVillageModel = tempobj;

      this.sButtonText = 'Update';
      this.oVillageService.fngetVillageInfo().subscribe((data) => {
        this.aVillages = [...data as any];
      });

    } else {
      this.sButtonText = 'Add';
      this.fnFetchDataFromServer(false);
    }
  }

  fnFetchDataFromServer(showmsg: boolean, VillageName?: string) {
    this.oVillageService.fngetVillageInfo().subscribe((data) => {
      this.aVillages = [...data as any];
      this.oMandalService.fngetMandalInfo().subscribe((cdata) => {
        this.aMandals = [...cdata as any];
        
        this.oVillageModel.sVillageName = '';

        if (showmsg && (!this.bisEditMode) && (!this.bisDeleteMode)) {
          this.bIsAddActive = false;
          this.fnSucessMessage();
        }
        else if (showmsg && this.bisEditMode) {
          this.fnEditSucessMessage();
          this.modalService.dismissAll();
          this.bisEditMode = false;
          this.bIsEditActive = false;
        } else if (showmsg && this.bisDeleteMode) {
          Swal.fire(VillageName, 'Village is deleted successfully.', 'success');
          this.bisDeleteMode = false;
        }


        for (let i = 0; i <= this.aMandals.length; i++) {
          this.hideme.push(true);
        }
      });
    });
  }

  fnResetVillageName() {
    this.oVillageModel.sVillageName = '';
  }

  fnOnVillageInfoSubmit(): void {
    if(this.oVillageModel.sVillageName.length === 0 || this.oVillageModel.sVillageName.trim().length === 0)
    {
      this.fnEmptyVillageNameMessage();
      return;
    }
    //Verification for Duplicate Village Name
    
      for (var i = 0; i < this.aVillages.length; i++) {
        if (this.aVillages[i].sVillageName.toLowerCase() === this.oVillageModel.sVillageName.toLowerCase().trim()) {
          this.fnDuplicateVillageNameMessage();
          return;
        }
      }
     
    if (!this.bisEditMode) {
      this.bIsAddActive = true;
      this.oVillageService.fnAddVillageInfo(this.oVillageModel).subscribe((data) => {
        console.log(data);
        this.fnFetchDataFromServer(true);
        this.addClicked.emit();
      });
    } else {
      this.bIsEditActive = true;
      console.log(this.oVillageModel);
      this.oVillageService.fnEditVillageInfo(this.oVillageModel).subscribe((data) => {
        console.log(data);
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit() {
    this.bisEditMode = true;
    this.fnFetchDataFromServer(true);


  }

  fnDeleteVillage(cindex, scindex) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
         this.oVillageService.fnDeleteVillageInfo(this.aVillages[scindex]).subscribe((data) => {
           this.bisDeleteMode = true;
           this.fnFetchDataFromServer(true,(data as Village).sVillageName);
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
      title: 'Village is saved successfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Village is updated successfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyVillageNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Village Name',
      showConfirmButton: false,
      timer: 1500
    })
  }

  fnDuplicateVillageNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Village Name is already exists.',
      showConfirmButton: false,
      timer: 1500
    })
  }


  /**
  * Open modal
  * @param content modal content
  */

  openModal(content: any, catindex, subcatindex) {
    this.nSelectedMandalEditIndex = catindex;
    this.nSelectedVillageEditIndex = subcatindex;
    this.modalService.open(content, { centered: true });
  }
  
}



