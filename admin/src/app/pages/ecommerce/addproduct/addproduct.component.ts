import { Component, Input, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { ItemConfigInfo, Product, ProductItemInfo } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../../core/services/category.service';
import { SubCategoryService } from '../../../core/services/subcategory.service';
import { BrandService } from '../../../core/services/brand.service';
import { ManufacturerService } from '../../../core/services/manufacturer.service';
import { ConfigurationtypeService } from '../../../core/services/configurationtype.service';
import { ConfigurationvalueService } from '../../../core/services/configurationvalue.service';
import { VendorService } from '../../../core/services/vendor.service';
import Swal from 'sweetalert2';
import { Configurationtype } from 'src/app/core/models/configurationtype.model';
import { Configurationvalue } from 'src/app/core/models/configurationvalue.model';
import { Vendor } from 'src/app/core/models/vendor.model';
import { DropzoneComponent, DropzoneConfigInterface, DropzoneDirective } from 'ngx-dropzone-wrapper';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.scss']
})

/**
 * Ecommerce add-product component
 */
export class AddproductComponent implements OnInit {
  @ViewChild('_productInfoFormElem')
  public oProductInfoFormElem: any;

  @ViewChild('_basicinfoform')
  public oBasicInfoFormElem: any;

  @ViewChild('dropzoneElemProd')
  public oDropZone: DropzoneComponent;

  @Output() updateClicked = new EventEmitter();

  public oProductModel: Product;
  public nSelectedConfigtypeId: number;
  public nSelectedConfigvalueId: number;
  public bShowWizard: boolean = true;
  public bHideItemUI: boolean;
  public nActiveItemIndex: number;

  @Input() bHideBreadCrumb: boolean = false;

  @Input() oEditProductModel: Product;

  nSelectedEditIndex: number;
  bIsAddActive: boolean;
  bIsEditActive: boolean;

  public aCategories: Array<{
    nCategoryId?: number;
    sCategoryName?: string,
    sCategoryUrl?: string
  }>;

  public aBrands: Array<{
    nBrandId?: number;
    sBrandName?: string,
    sBrandUrl?: string
  }>;

  public aManufacturers: Array<{
    nManufacturerId?: number;
    sManufacturerName?: string,
    sManufacturerUrl?: string
  }>;

  public aSubCategories: Array<{
    nParentId?: number,
    oCategoryInfo?: any,
    sSubCategoryName?: string,
    sSubCategoryUrl?: string,
    nLevel?: number
  }>;

  public aFilteredSubCategories: Array<{
    oCategoryInfo?: any;
    sSubCategoryName?: string,
    sSubCategoryUrl?: string
  }>;
  public aFilteredSubSubCategories: Array<{
    oSubCategoryInfo?: any;
    sSubCategoryName?: string,
    sSubCategoryUrl?: string
  }>;

  public aConfigvalues: Array<{
    nConfigurationtypeId?: number;
    sConfigurationvalueName?: string,
    nConfigurationvalueId: number
  }>;

  public aConfigtypes: Array<{
    nConfigurationtypeId?: number;
    sConfigurationtypeName?: string,
    aConfigurationvaluesInfo: any
  }>;

  public aFilteredConfigtypes: Array<{
    nConfigurationtypeId?: number;
    sConfigurationtypeName?: string,
    aConfigurationvaluesInfo: any
  }>;

  public aFilteredConfigvalues: Array<{
    oConfigurationtypeInfo?: any;
    sConfigurationvalueName?: string,
    nConfigurationvalueId: number
  }>;

  public aVendors: Array<{
    nVendorId?: number;
    sVendorName?: string,
    sVendorAddress?: string,
    sVendorCityName?: string,
    sVendorGstNumber?: string,
    sVendorPanNumber?: string,
    sVendorTypeofSupply?: number
  }>;

  public oDropZoneConfig: DropzoneConfigInterface = {};

  public sButtonText: string;
  public sItemButtonText: string;
  @Input() bisEditMode: boolean;
  public aAccessValues: Array<string>;
  constructor(private oProductService: ProductService,
    private modalService: NgbModal,
    private oCategoryService: CategoryService,
    private oSubCategoryService: SubCategoryService,
    private oBrandService: BrandService,
    private oManufacturerService: ManufacturerService,
    private oConfigtypeService: ConfigurationtypeService,
    private oConfigvalueService: ConfigurationvalueService,
    private oVendorService: VendorService,
    public formBuilder: FormBuilder,
    private router: Router) { }

  // bread crumb items
  breadCrumbItems: Array<{}>;
  bBasicInfoStep: boolean = false;
  //private isDropzoneRemoveSubscribed: boolean = false;

  // ngAfterViewInit(): void {

  //   const oDZ = this.oDropZone.directiveRef.dropzone();
  //   if (oDZ.options) {

  //     oDZ.options.init = function () {
  //       console.log('init called');

  //       this.options.removedfile = function (file) {
  //         console.log('removed file callled');
  //         console.log(file);
  //       }
  //     }
  //   }
  // }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Add Product', active: true }];
    this.aAccessValues = ['retailer', 'enduser', 'both'];
    this.bHideItemUI = false;
    this.oProductModel = new Product();
    this.bIsAddActive = false;
    this.bIsEditActive = false;
    //this.activeItemIndex = this.nActiveItemIndex;
    console.log(this.oEditProductModel);
    console.log(this.bisEditMode);
    if (this.bisEditMode) {
      const tempobj = JSON.parse(JSON.stringify(this.oEditProductModel));
      this.oProductModel = tempobj;

      //this.oProductModel = this.oEditProductModel;
      console.log(this.oProductModel.oItemInfo);
      if (!this.oProductModel.oItemInfo) {
        this.oProductModel.oItemInfo = Array(new ProductItemInfo());
      }
      this.sButtonText = 'Update';
      this.sItemButtonText = 'Update Item';
    }
    else {
      this.sButtonText = 'Add';
      this.sItemButtonText = 'Save Item';
      this.nActiveItemIndex = this.oProductModel.oItemInfo.length - 1;

      this.oProductModel.oItemInfo[this.nActiveItemIndex].oConfigInfo = [];
    }
    this.fnFetchCategoryInfo();
    this.fnFetchSubCategoryInfo();
    this.fnFetchSubSubCategoryInfo();
    this.fnFetchBrandInfo();
    this.fnFetchManufacturerInfo();
    this.fnFetchConfigurationtypeInfo();
    this.fnFetchConfigurationvalueInfo();
    this.fnFetchVendorInfo();

  }

  fnFetchVendorInfo() {
    this.oVendorService.fngetVendorInfo().subscribe((cdata) => {
      this.aVendors = [...cdata as any];
    });
  }

  fnFetchNewItemId() {
    this.oProductService.fnGetNewItemId().subscribe((data) => {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nItemId = data as number;
      // this.oProductModel.oItemInfo[this.nActiveItemIndex].nProductId = this.oProductModel.nProductId;
      const oItemInfo = new ProductItemInfo();
      this.oProductModel.oItemInfo = [...this.oProductModel.oItemInfo, oItemInfo];
      this.nActiveItemIndex = this.oProductModel.oItemInfo.length - 1;
      this.oProductModel.oItemInfo[this.nActiveItemIndex].oConfigInfo = [];
      this.fnSucessMessage('Item is saved successfully.');
      this.aFilteredConfigtypes = [];
      this.fnFetchConfigurationtypeInfo();
    });
  }

  fnSucessMessage(msg) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    });
  }

  fnSuccessProduct(msg) {
    Swal.fire({
      title: msg,
      text: '',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#34c38f',
      confirmButtonText: 'View All Products',
      cancelButtonText: 'Add New Product'
    }).then(result => {
      if (result.value) {
        this.router.navigate(['../../ecommerce/products']);
      }
      else {
        this.fnredirectTo('/ecommerce/add-product');
      }
    });

  }


  fnFetchNewProductId() {
    this.oProductService.fnGetNewProductId().subscribe((data) => {
      this.oProductModel.nProductId = data as number;
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nProductId = data as number;
      console.log(this.oProductModel.nProductId);
    });
  }

  fnFetchCategoryInfo() {
    this.oCategoryService.fngetCategoryInfo().subscribe((data) => {
      this.aCategories = [...data as any];
    });
  }

  fnCategoryChanged(event, nSelectedcategoryid: number) {
    let alocalsubcat = {};
    alocalsubcat = this.aSubCategories.filter((subcat) => {
      if (subcat.nParentId === nSelectedcategoryid) {
        return subcat;
      }
    });
    this.aFilteredSubCategories = [];
    this.oProductModel.oBasicInfo.nProductSubCategoryId = null;
    this.aFilteredSubSubCategories = [];
    this.oProductModel.oBasicInfo.nProductSubSubCategoryId = null;
    this.aFilteredSubCategories = [...alocalsubcat as any];
  }

  fnSubCategoryChanged(event, nSelectedsubcategoryid: number) {
    let alocalsubcat = {};
    alocalsubcat = this.aSubCategories.filter((subcat) => {
      if (subcat.nParentId === nSelectedsubcategoryid) {
        return subcat;
      }
    });
    this.aFilteredSubSubCategories = [];
    this.oProductModel.oBasicInfo.nProductSubSubCategoryId = null;
    this.aFilteredSubSubCategories = [...alocalsubcat as any];
  }

  fnFetchSubCategoryInfo() {
    this.oSubCategoryService.fngetSubCategoryInfo().subscribe((data) => {
      this.aSubCategories = [...data as any];
      if (this.bisEditMode) {
        let alocalsubcat = {};
        alocalsubcat = this.aSubCategories.filter((subcat) => {
          if (subcat.nParentId === this.oProductModel.oBasicInfo.nProductCategoryId) {
            return subcat;
          }
        });
        this.aFilteredSubCategories = [...alocalsubcat as any];
      }
    });
  }

  fnFetchSubSubCategoryInfo() {
    this.oSubCategoryService.fngetSubCategoryInfo().subscribe((data) => {
      if (this.bisEditMode) {
        let alocalsubsubcat = {};
        alocalsubsubcat = this.aSubCategories.filter((subsubcat) => {
          if (subsubcat.nParentId === this.oProductModel.oBasicInfo.nProductSubCategoryId) {
            return subsubcat;
          }
        });
        this.aFilteredSubSubCategories = [...alocalsubsubcat as any];
      }
    });
  }

  fnFetchBrandInfo() {
    this.oBrandService.fngetBrandInfo().subscribe((cdata) => {
      this.aBrands = [...cdata as any];
    });
  }

  fnFetchManufacturerInfo() {
    this.oManufacturerService.fngetManufacturerInfo().subscribe((cdata) => {
      this.aManufacturers = [...cdata as any];
    });
  }

  fnFetchConfigurationtypeInfo() {
    this.oConfigtypeService.fngetConfigurationtypeInfo().subscribe((data) => {
      this.aConfigtypes = [...data as any];
      this.aFilteredConfigtypes = this.aConfigtypes;
    });
  }

  fnConfigurationtypeChanged(event, nSelectedconfigtypeid: number) {
    console.log(this.aConfigvalues);
    let alocalconfigvals = {};
    alocalconfigvals = this.aConfigvalues.filter((configval) => {
      if (configval.nConfigurationtypeId === nSelectedconfigtypeid) {
        return configval;
      }
    });
    this.aFilteredConfigvalues = [];
    this.nSelectedConfigvalueId = null;
    this.aFilteredConfigvalues = [...alocalconfigvals as any];
  }

  fnAddItemConfigurations() {
    let afilteredtypes = {};
    this.aConfigtypes.filter((configtype) => {
      if (configtype.nConfigurationtypeId === this.nSelectedConfigtypeId) {
        afilteredtypes = configtype;
      }
    });
    let afilteredvalues = {};
    this.aConfigvalues.filter((configvalue) => {
      if (configvalue.nConfigurationvalueId === this.nSelectedConfigvalueId) {
        afilteredvalues = configvalue;
      }
    });
    console.log('check values');
    this.oProductModel.oItemInfo[this.nActiveItemIndex].oConfigInfo =
      [...this.oProductModel.oItemInfo[this.nActiveItemIndex].oConfigInfo,
      new ItemConfigInfo(this.oProductModel.oItemInfo[this.nActiveItemIndex].nItemId, afilteredtypes as Configurationtype, afilteredvalues as Configurationvalue)];
    // Remove the selected configuration from the dropdown
    let alocalconfigtypes = {};
    alocalconfigtypes = this.aConfigtypes.filter((configtype) => {
      if (configtype.nConfigurationtypeId !== this.nSelectedConfigtypeId) {
        return configtype;
      }
    });
    this.aFilteredConfigtypes = [];
    this.aFilteredConfigtypes = [...alocalconfigtypes as any];
    this.aConfigtypes = this.aFilteredConfigtypes;
    this.aFilteredConfigvalues = [];
    this.nSelectedConfigvalueId = null;
    this.nSelectedConfigtypeId = null;
  }

  fnDeleteItemConfigurations(nIndex: number) {
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
        let afilteredtypes = {};
        this.oConfigtypeService.fngetConfigurationtypeInfo().subscribe((data) => {
          this.aConfigtypes = [...data as any];

          afilteredtypes = this.aConfigtypes.filter((configtype) => {
            if (configtype.nConfigurationtypeId === this.oProductModel.oItemInfo[this.nActiveItemIndex].oConfigInfo[nIndex].oConfigtypeInfo.nConfigurationtypeId) {
              return configtype;
            }
          });

          // Delete the selected configuration
          this.oProductModel.oItemInfo[this.nActiveItemIndex].oConfigInfo.splice(nIndex, 1);
          this.aFilteredConfigvalues = [];
          this.aFilteredConfigtypes = [...this.aFilteredConfigtypes, afilteredtypes[0] as any];
          console.log(afilteredtypes);
          console.log(this.aFilteredConfigtypes);
          this.aConfigtypes = this.aFilteredConfigtypes;
        });
      }
    });
  }

  fnFetchConfigurationvalueInfo() {
    this.oConfigvalueService.fngetConfigurationvalueInfo().subscribe((data) => {
      this.aConfigvalues = [...data as any];
    });
  }

  fnToggleItemUI(index) {
    this.bHideItemUI = true;
    this.nActiveItemIndex = index;
  }

  fnOnBasicInfoSubmit(): void {
    // console.log(this.oBasicInfoFormElem.value as Product);
    if (!this.bisEditMode) {
      if (this.oProductModel.nProductId === null) {
        this.oProductService.fnAddProductBasicInfo(this.oProductModel.oBasicInfo).subscribe((data) => {

          this.oProductModel.nProductId = data as number;
          this.oProductModel.oBasicInfo.nProductId = data as number;
          this.oProductModel.oItemInfo[this.nActiveItemIndex].nProductId = data as number;
          this.oDropZoneConfig.headers = { 'bisitem': 'false', 'product_id': this.oProductModel.nProductId };
          this.oDropZoneConfig.addRemoveLinks = true;

        });
      }
    } else {
      this.bIsEditActive = true;
      console.log(this.oProductModel.oBasicInfo);
      this.oProductService.fnEditProductBasicInfo(this.oProductModel.oBasicInfo).subscribe((data) => {
        //this.updateClicked.emit();
      });
    }
  }

  fnOnProductInfoSubmit(): void {
    // console.log(this.oBasicInfoFormElem.value as Product);
    console.log(this.oProductModel);
    if (!this.bisEditMode) {
      this.bIsAddActive = true;
      this.oProductService.fnGetNewProductId().subscribe((data) => {
        this.bShowWizard = false;
        this.oProductModel.nProductId = data as number;
        this.oProductModel.oBasicInfo.nProductId = data as number;
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nProductId = data as number;
        console.log(this.oProductModel.nProductId);
        this.oProductService.fnAddProductInfo(this.oProductModel).subscribe((data) => {
          console.log(data);
          this.fnSuccessProduct('Product is added sucessfully.');
          this.bShowWizard = true;
        });
      });
    } else {
      this.bIsEditActive = true;
      this.oProductService.fnEditProductInfo(this.oProductModel).subscribe((data) => {
        console.log(data);
        this.fnSuccessProduct('Product is updated successfully.');
        this.updateClicked.emit();
      });
    }

  }

  fnOnItemInfoSubmit(): void {
    if (!this.bisEditMode) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nProductId = this.oProductModel.nProductId;
      this.bIsAddActive = true;
      console.log(this.oProductModel.oItemInfo[this.nActiveItemIndex]);
      this.oProductService.fnAddItemInfo(this.oProductModel.oItemInfo[this.nActiveItemIndex]).subscribe((data) => {
        console.log(data);
        this.fnFetchNewItemId();
      });
    } else {
      this.bIsEditActive = true;
      this.oProductService.fnEditItemInfo(this.oProductModel.oItemInfo[this.nActiveItemIndex]).subscribe((data) => {
        console.log(data);
        this.fnSucessMessage('Item is updated successfully.');
        //this.updateClicked.emit();
      });
    }
    this.bHideItemUI = false;
  }

  public onUploadInit(args: any): void {
    console.log('onUploadInit:', args);
    console.log(this.oProductModel.nProductId);
  }

  public onUploadItemImage(args: any): void {

  }

  public fnOnEnterImageWizard() {
    this.fnDisplayExistingImageThumbnail();
    this.oDropZoneConfig.headers = { 'bisitem': 'false', 'product_id': this.oProductModel.nProductId };
  }

  private fnSubscribeForRemoveFile(): void {
    //if(this.isDropzoneRemoveSubscribed) return;

    // if(this.oDropZone){
    //   const oDZ = this.oDropZone.directiveRef.dropzone();
    //   if(oDZ.options){
    //     oDZ.options.addRemoveLinks = true;
    //     //this.isDropzoneRemoveSubscribed = true;
    //     // oDZ.options.removedfile = function (file) {
    //     //   console.log('removed file callled');
    //     //   console.log(file);
    //     // };
    //   }
    // }
  }

  private fnDisplayExistingImageThumbnail(): void {

    setTimeout(() => {

      this.fnSubscribeForRemoveFile();
      if (!this.oEditProductModel) return;

      const oDZ = this.oDropZone.directiveRef.dropzone();
      let oImageInfo = this.oProductModel.oBasicInfo.oImageInfo;
      if (!oImageInfo) return;

      var imgURL = environment.imagePath + oImageInfo[0].sImageURL;
      var mockFile = { name: oImageInfo[0].sImageName, size: 12345, accepted: true, kind: "image", dataURL: imgURL };

      var crossorigin = "anonymous";
      oDZ.displayExistingFile(mockFile, imgURL, function (img) {
        console.log(img);
      });

    }, 500);

  }

  public fnOnEnterItemWizard() {
    this.oDropZoneConfig.headers = { 'bisitem': 'true', 'product_id': this.oProductModel.nProductId };
  }

  public onUploadImageSuccess(args: any): void {

    console.log(args[1]);
    this.oProductModel.oItemInfo[this.nActiveItemIndex].oImageInfo = [];
    this.oProductModel.oItemInfo[this.nActiveItemIndex].oImageInfo =
      [...this.oProductModel.oItemInfo[this.nActiveItemIndex].oImageInfo, args[1].oImageRefId];
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  fnSetActiveTab(verticalNav: any, nActiveIndex: number) {
    verticalNav.activeId = nActiveIndex;
  }

  fnredirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  fnCalculateUnitPrice() {
    if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nCasePrice !== null &&
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitsPerCase !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitPrice =
        +((this.oProductModel.oItemInfo[this.nActiveItemIndex].nCasePrice /
          this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitsPerCase).toFixed(2));
      this.fnCalcluateTotalPrice();
    }

  }

  fnCalculateCasePrice(){
    if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitPrice !== null &&
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitsPerCase !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nCasePrice =
        +((Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitPrice) *
          Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitsPerCase)).toFixed(2));
      this.fnCalcluateTotalPrice();
    }
  }


  fnCalculateRetailerMarginPrice(type: string): void {
    let nmrp = Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice);
    if (type === 'price') {
      if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice !== null) {
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPercentage =
          +((this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice * 100 / nmrp).toFixed(2));
        this.fnCalculateRetailerTotalPercentage();
        this.fnCalculateRetailerDiscountPriceTotal();
      }
    } else if (type === 'percentage') {
      if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPercentage !== null) {
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice =
          +((nmrp * Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPercentage) / 100).toFixed(2));
        this.fnCalculateRetailerDiscountPriceTotal();
        this.fnCalculateRetailerTotalPercentage();
      }
    }
    this.fnCalculateEndUserTotalMarginPercentage();
  }

  fnCalculateTotalPurchasedQuantity(): void {
    const nlocalCaseCount = this.oProductModel.oItemInfo[this.nActiveItemIndex].nCaseCount;
    const nlocalunitspercase = this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitsPerCase;
    if (nlocalCaseCount !== null && nlocalunitspercase !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nTotalQuantity =
        nlocalCaseCount * nlocalunitspercase;
      this.fnCalcluateTotalPrice();
    }

  }

  fnCalcluateTotalPrice(): void {
    const nlocaltotalquantity = this.oProductModel.oItemInfo[this.nActiveItemIndex].nTotalQuantity;
    const nlocalUnitPrice = this.oProductModel.oItemInfo[this.nActiveItemIndex].nUnitPrice;
    if (nlocaltotalquantity !== null &&
      nlocalUnitPrice !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nTotalPrice =
        +((nlocaltotalquantity * nlocalUnitPrice).toFixed(2));
    }
  }

  fnCalculateRetailerTotalPercentage() {
    const nlocalretailermargin = Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPercentage);
    const nlocalretailerdiscount = Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPercentage);
    if (nlocalretailermargin !== null && nlocalretailerdiscount !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPercentageTotal =
        +((nlocalretailermargin + nlocalretailerdiscount).toFixed(2));
    }
  }

  

  fnCalculateRetailerDiscountPrice(type: string): void {
    // let nmrpcalfordiscountprice = this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice;
    // let ngetcalforretailerdiscountprice = nmrpcalfordiscountprice -
    // this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice;
    if (type === 'price') {
      if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPrice !== null) {
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPercentage =
          +((this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice * 100 /
            (this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice -
              this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice)).toFixed(2));
        this.fnCalculateRetailerTotalPercentage();
        this.fnCalculateRetailerDiscountPriceTotal();
      }
    } else if (type === 'percentage') {
      if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPercentage !== null) {
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPrice =
          +(((this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice -
            this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice) *
            this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPercentage / 100).toFixed(2));
        this.fnCalculateRetailerDiscountPriceTotal();
        this.fnCalculateRetailerTotalPercentage();
      }
    }
    this.fnCalculateEndUserTotalMarginPercentage();
  }

  fnCalculateRetailerDiscountPriceTotal() {
    let ncalretailermarginprice = Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPrice);
    let ncalretailerdiscountprice = Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPrice);
    if (ncalretailermarginprice !== null && ncalretailerdiscountprice !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerDiscountPriceTotal =
        +((Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice) - (ncalretailermarginprice + ncalretailerdiscountprice)).toFixed(2));
    }
  }

  fnCalculateEndUserDiscount(type: string) {
    if (type === 'npercentage') {
      if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPercentage !== null) {
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPriceDelta =
          +((this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice *
            this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPercentage / 100).toFixed(2));
      }
    } else if (type === 'nprice') {
      if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPriceDelta !== null) {
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPercentage =
          +((this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPriceDelta /
            this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice * 100).toFixed(2));
        this.fnCalculateEndUserDiscountTotalPrice();
      }
    }
    this.fnCalculateEndUserTotalMarginPercentage();
  }

  fnCalculateEndUserDiscountTotalPrice() {
    this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPrice =
      +((this.oProductModel.oItemInfo[this.nActiveItemIndex].nMaxRetailPrice -
        this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPriceDelta).toFixed(2));
  }

  fnCalculateEndUserTotalMarginPercentage() {
    this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMargin = this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMarginPercentage;
    this.oProductModel.oItemInfo[this.nActiveItemIndex].nCustomerMargin = this.oProductModel.oItemInfo[this.nActiveItemIndex].nEndUserDiscountPercentage;
    if (this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMargin !== null) {
      this.oProductModel.oItemInfo[this.nActiveItemIndex].nTotalMargin =
        +((Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nRetailerMargin) +
          Number(this.oProductModel.oItemInfo[this.nActiveItemIndex].nCustomerMargin)).toFixed(2));
    }
  }

  fnConvertPercentageToPrice(percentage: number, mrp: number) {
    return (percentage * mrp) / 100;
  }

  fnConverPriceToPercentage(price: number, mrp: number) {
    return (price / mrp) * 100;
  }
}
