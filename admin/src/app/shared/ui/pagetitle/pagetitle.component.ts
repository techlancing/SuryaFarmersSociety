import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.scss']
})
export class PagetitleComponent implements OnInit {

  @Input() breadcrumbItems;
  @Input() title: string;
  @Input() bgimageclass: string;
  public imgpath: string;

  constructor() { }

  ngOnInit() {
    switch (this.bgimageclass){
      case 'addcategory_header': {
        this.imgpath = '/assets/images/newsetup/admin_add_header.png';
        break;
      }
      case 'addsubcategory_header': {
        this.imgpath = '/assets/images/newsetup/admin_add_header.png';
        break;
      }
      case 'addproduct_header': {
        this.imgpath = '/assets/images/newsetup/admin_add_header_product.png';
        break;
      }
      case 'addbrand_header': {
        this.imgpath = '/assets/images/newsetup/admin_add_header_brand.png';
        break;
      }
      case 'addvendor_header': {
        this.imgpath = '/assets/images/newsetup/admin_add_header_vendor.png';
        break;
      }
      case 'addconfig_header': {
        this.imgpath = '/assets/images/newsetup/admin_add_header_config.png';
        break;
      }
    }
  }

}
