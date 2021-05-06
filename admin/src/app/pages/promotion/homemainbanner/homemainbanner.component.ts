import { AfterViewInit, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Banner, BannerSettings } from '../../../core/models/homemainbanner.model';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { BannerService } from '../../../core/services/banner.service';
import { ActivatedRoute } from '@angular/router';
import { BannerType } from 'src/app/core/enums/banner.enum';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-homemainbanner',
  templateUrl: './homemainbanner.component.html',
  styleUrls: ['./homemainbanner.component.scss']
})
export class HomemainbannerComponent implements OnInit, AfterViewInit {
  breadCrumbItems: Array<{}>;
  public oBannerModel: Banner;
  public aBannerSettings : BannerSettings[];
  public aBanners: Banner[];
  public eBannerType : BannerType;
  public oBannerSetting : BannerSettings;
  public appPath : string;
  activeItem: number;
  @Input() bHideBreadCrumb: boolean = false;
  bisEditMode: boolean;
  @ViewChild('dropzoneElemDesk')
  public oDropZone: DropzoneComponent;

  @ViewChild('dropzoneElemMob')
  public oDropZoneMob: DropzoneComponent;

  public oDropZoneConfig: DropzoneConfigInterface = {
  };
  constructor(private oBannerService: BannerService,
              private activatedroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.appPath = environment.imagePath;
    //Get the data from the routing data
    this.activatedroute.data.subscribe(data => {
      this.eBannerType = data.type;
    this.oBannerModel = new Banner();
    this.oBannerService.fngetBannerSettings().then((bdata : BannerSettings[])=>{
      this.aBannerSettings = bdata;
      this.oBannerService.fnGetBannerSettingsFromStore(this.eBannerType).subscribe((bannersetting)=>{
        this.oBannerSetting = bannersetting;
        this.oBannerService.fngetBannerInfo(this.eBannerType).subscribe((banners: Banner[])=>{
          this.aBanners = banners;
        });
      });
    });

  });
  }

  ngAfterViewInit(): void {
    this.oDropZoneConfig.headers = { 'eBannerType': this.eBannerType};
    this.oBannerModel.eBannerType = this.eBannerType;
    this.oDropZoneConfig.addRemoveLinks = true;
  }

  private fnDisplayExistingImageThumbnail(): void{

    setTimeout(() => {


      const oDZ = this.oDropZone.directiveRef.dropzone();
      let oImageInfo = this.oBannerModel.oImageInfo_desktop;
      if (!oImageInfo) return;

      var imgURL = environment.imagePath + oImageInfo.sImageURL;
      var mockFile = { name: oImageInfo.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURL };

      var crossorigin = "anonymous";
      oDZ.displayExistingFile(mockFile, imgURL, function (img) {
        console.log(img);
      }, crossorigin);

      const oDZM = this.oDropZoneMob.directiveRef.dropzone();
      let oImageInfoMob = this.oBannerModel.oImageInfo_mobile;
      if (!oImageInfoMob) return;

      var imgURLmob = environment.imagePath + oImageInfoMob.sImageURL;
      var mockFileMob = { name: oImageInfoMob.sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURLmob };

      crossorigin = "anonymous";
      oDZM.displayExistingFile(mockFileMob, imgURLmob, function (img) {
        console.log(img);
      }, crossorigin);

    }, 500);

  }

  fnActiveImageItemClicked(activeindex){
    this.activeItem = activeindex;
    this.oBannerModel = this.aBanners[activeindex];
    this.fnDisplayExistingImageThumbnail();
  }

  fnonUploadImageSuccess_desktop(args: any){
    this.oBannerModel.oImageInfo_desktop = args[1].oImageRefId;
  }

  fnonUploadImageSuccess_mobile(args: any){
    this.oBannerModel.oImageInfo_mobile = args[1].oImageRefId;
  }


  fnOnBannerInfoSubmit(){
    if(this.aBanners && (this.aBanners.length < this.oBannerSetting.nBannerCount) ){
      this.oBannerService.fnAddBannerInfo(this.oBannerModel).subscribe((data)=>{
        console.log(data);
      });
    }else{
      this.oBannerService.fnEditBannerInfo(this.oBannerModel).subscribe((data)=>{
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Banner is updated sucessfully.',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  }
  }
