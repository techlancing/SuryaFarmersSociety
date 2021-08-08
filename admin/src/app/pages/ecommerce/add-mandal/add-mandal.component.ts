import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { Mandal } from '../../../core/models/mandal.model';
import { MandalService } from '../../../core/services/mandal.service';
import { DistrictService } from '../../../core/services/district.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { District } from 'src/app/core/models/district.model';

@Component({
  selector: 'app-add-mandal',
  templateUrl: './add-mandal.component.html',
  styleUrls: ['./add-mandal.component.scss']
})
export class AddMandalComponent implements OnInit {

  @Input() oEditMandal: Mandal;
  @Input() aEditDistricts: Array<District>;

  public oMandalModel: Mandal;
  nSelectedDistrictEditIndex: number;
  nSelectedMandalEditIndex: number;
  @Input() bisEditMode: boolean;
  @ViewChild('_MandalFormElem')
  public oMandalfoFormElem: any;

  public nSelectedId: number = 1;
  hideme: boolean[] = [];
  aAllDistricts: any;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  aMandals: Array<Mandal>;

  aDistricts: Array<District>;

  // bread crumb items
  breadCrumbItems: Array<{}>;
  bisDeleteMode: boolean;
  @Input() bHideBreadCrumb: boolean = false;
  @Input() bHideSubCateogryList: boolean = false;
  @Output() updateClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();

  public sButtonText: string;
  constructor(private oMandalService: MandalService, private oDistrictService: DistrictService,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Mandal', active: true }];

    this.oMandalModel = new Mandal();
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    if (this.bisEditMode) {
      //dont need a new object as we dont manipulate it.
      this.aDistricts = this.aEditDistricts;
      let tempobj = JSON.parse(JSON.stringify(this.oEditMandal));
      this.oMandalModel = tempobj;

      this.sButtonText = 'Update';
    } else {
      this.sButtonText = 'Add';
      this.fnFetchDataFromServer(false);
    }
  }

  fnFetchDataFromServer(showmsg: boolean, MandalName?: string) {
    this.oMandalService.fngetMandalInfo().subscribe((data) => {
      this.aMandals = [...data as any];
      this.oDistrictService.fngetDistrictInfo().subscribe((cdata) => {
        this.aDistricts = [...cdata as any];
        
        this.oMandalModel.sMandalName = '';

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
          Swal.fire(MandalName, 'Mandal is deleted successfully.', 'success');
          this.bisDeleteMode = false;
        }


        for (let i = 0; i <= this.aDistricts.length; i++) {
          this.hideme.push(true);
        }
      });
    });
  }

  fnResetMandalName() {
    this.oMandalModel.sMandalName = '';
  }

  fnOnMandalInfoSubmit(): void {
    console.log(this.oMandalModel.sMandalName.length)
    console.log(this.oMandalModel.sMandalName.trim().length)
    if(this.oMandalModel.sMandalName.length === 0 || this.oMandalModel.sMandalName.trim().length === 0)
    {
      this.fnEmptyMandalNameMessage();
      return;
    }
    //Verification for Duplicate Mandal Name
    for(var i = 0; i < this.aMandals.length; i++) {
      if(this.aMandals[i].sMandalName.toLowerCase() === this.oMandalModel.sMandalName.toLowerCase().trim()) {
        this.fnDuplicateMandalNameMessage();
        return;
      }
    }
      
    if (!this.bisEditMode) {
      this.bIsAddActive = true;
      this.oMandalService.fnAddMandalInfo(this.oMandalModel).subscribe((data) => {
        console.log(data);
        this.fnFetchDataFromServer(true);
        this.addClicked.emit();
      });
    } else {
      this.bIsEditActive = true;
      console.log(this.oMandalModel);
      this.oMandalService.fnEditMandalInfo(this.oMandalModel).subscribe((data) => {
        console.log(data);
        this.updateClicked.emit();
      });
    }
  }

  fnUpdateParentAfterEdit() {
    this.bisEditMode = true;
    this.fnFetchDataFromServer(true);


  }

  fnDeleteMandal(cindex, scindex) {
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
        // this.oMandalService.fnDeleteMandalInfo(this.aDistricts[cindex].aMandalsInfo[scindex] as Mandal).subscribe((data) => {
        //   this.bisDeleteMode = true;
        //   this.fnFetchDataFromServer(true, (data as Mandal).sMandalName);
        // });

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
      title: 'Mandal is saved successfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEditSucessMessage() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Mandal is updated successfully.',
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnEmptyMandalNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Please enter a valid Mandal Name',
      showConfirmButton: false,
      timer: 1500
    })
  }

  fnDuplicateMandalNameMessage() {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Mandal Name is already exists.',
      showConfirmButton: false,
      timer: 1500
    })
  }


  /**
  * Open modal
  * @param content modal content
  */
  openModal(content: any, catindex, subcatindex) {
    this.nSelectedDistrictEditIndex = catindex;
    this.nSelectedMandalEditIndex = subcatindex;
    this.modalService.open(content, { centered: true });
  }

}


