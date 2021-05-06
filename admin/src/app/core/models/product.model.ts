import { Brand } from './brand.model';
import { Configurationtype } from './configurationtype.model';
import { Configurationvalue } from './configurationvalue.model';
import { ImageInfo } from './image.model';

export class SubCategoryFilter {
  public nSubcategoryId: number;
  public nParentId: number;
  public nLevel: number;
}

// export class ProductFilter{
//   public bCategory: boolean = false;
//   public categoryFilter: Array<number> = null;
//   public subCategoryFilter: Array<SubCategoryFilter> = null;
//   public nCategoryId: number = -1;
//   public bSubCategory: boolean = false;
//   public nSubCategoryId: number = -1;
//   public nSubCategoryLevel: number = -1;
//   public bBrand: boolean = false;
// }

export class subCategoryFilter {
  public nSubcategoryId: number;
  public nParentId: number;
  public nLevel: number;
}

/*FilterOption:
0 - All Products
1  - Products by filters
        Subcategory /Subsub category
        Brand
        Config
        Latest Products
        Featured Products
        Best Sellers
        Related Products
        Search  */

export class productFilter {
  public nFilterOption: number = -1;
  public categoryFilter: Array<number> = null;
  public subCategoryFilter: Array<subCategoryFilter> = null;
  public nCategoryId: number = -1;
  public nSubCategoryId: number = -1;
  public nSubCategoryLevel: number = -1;
  public arrBrands: Brand[] = null;
  public aConfigVals: string[] = null;
  public sSearchTerm: string = null;

}

export class ProductsList {
  constructor(
    public docs: Product[] = [],
    public limit: number = null,
    public page: number = null,
    public pages: number = null,
    public total: number = null
  ) {
  }
}

export class Product {
  constructor(
    public nProductId: number = null,
    public nDefaultItemId: number = null,
    public sPublishedDate: string = '',
    public bIsPublished: boolean = false,
    public sAccessType: string = '',
    public oBasicInfo: ProductBasicInfo = new ProductBasicInfo(),
    public oItemInfo: ProductItemInfo[] = Array(new ProductItemInfo())
  ) {
  }
}

export class ProductBasicInfo {

  constructor(
    public nProductId: number = null,
    public sProductName: string = '',
    public nManufacturerBrandId: number = null,
    public nManufacturerId: number = null,
    public sWarrentyInformation: string = '',
    public nProductCategoryId: number = null,
    public nProductSubCategoryId: number = null,
    public nProductSubSubCategoryId: number = null,
    public aSearchKeywords: string[] = [],
    public sProductDescription: string = '',
    public sProductFeatures: string[] = [],
    public sProductSpecifications: string[] = [],
    public oImageInfo: ImageInfo[] = null,
  ) {

  }
}

export class ItemConfigInfo {

  constructor(
    public nItemId: number = null,
    public oConfigtypeInfo = new Configurationtype(),
    public oConfigvalueInfo = new Configurationvalue()
  ) {

  }
}

export class ProductItemInfo {

  constructor(
    public nProductId: number = null,
    public nItemId: number = null,
    public nSkuId: number = null,
    public sDeliveryTime: string = '',
    public sWarrentyInfo: string = '',
    public nUnitsPerCase: number = null,
    public nVendorId: number = null,
    public nAvailability: number = null,
    public bNotSellable: boolean = false,
    public nCasePrice: number = null,
    public nCaseCount: number = null,
    public nTotalQuantity: number = null,
    public nTotalPrice: number = null,
    public nUnitPrice: number = null,
    public nMaxRetailPrice: number = null,
    public sExpiryDate: string = '',
    public nRetailerMarginPercentage: number = null,
    public nRetailerMarginPrice: number = null,
    public nRetailerDiscountPercentage: number = null,
    public nRetailerDiscountPrice: number = null,
    public nRetailerMarginPercentageTotal: number = null,
    public nRetailerDiscountPriceTotal: number = null,
    public nRetailerMinQuantity: number = null,
    public nRetailerMaxQuantity: number = null,
    public nRetailerStepQuantity: number = null,
    public nEndUserDiscountPercentage: number = null,
    public nEndUserDiscountPrice: number = null,
    public nEndUserDiscountPriceDelta: number = null,
    public nGST: number = null,
    public nTotalMargin: number = null,
    public nRetailerMargin: number = null,
    public nCustomerMargin: number = null,
    public sProductDescription: string = '',
    public sProductFeatures: string[] = [],
    public sProductSpecifications: string[] = [],
    public oImageInfo: ImageInfo[] = null,
    public oConfigInfo: ItemConfigInfo[] = Array(new ItemConfigInfo()),
  ) {

  }
}
