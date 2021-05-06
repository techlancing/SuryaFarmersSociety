import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductBasicInfo, ProductsList } from './../models/product.model';
import { ProductItemInfo } from './../models/product.model';
import { productFilter } from './../models/product.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class ProductService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/product";
    public oProductsList: ProductsList = null;

    constructor(private http: HttpClient) { }

    fnAddProductBasicInfo(oProduct: ProductBasicInfo) {
        let sMethodUrl = `${this.sRootUrl}/add_basicinfo`;
        return this.http.post(sMethodUrl, oProduct);
    }

    fnAddProductInfo(oProduct: Product) {
        let sMethodUrl = `${this.sRootUrl}/add_product`;
        return this.http.post(sMethodUrl, oProduct);
    }

    fnGetAllProducts2(productFilter: productFilter): Promise<ProductsList> {
        return new Promise( (resolve, reject) =>{
            let sMethodUrl = `${this.sRootUrl}/products_list`;
            this.http.post(sMethodUrl, {productFilter: productFilter}).subscribe( (arrProducts) =>{
                this.oProductsList = arrProducts as any; // as of now overwritng the exiting varialble
                resolve(this.oProductsList);
            })
        })        
    }
    
    // fnGetAllProducts(oProductFilter: ProductFilter) {
    //     let sMethodUrl = `${this.sRootUrl}/products_list`;
    //     return this.http.post(sMethodUrl, {productFilter: oProductFilter});
    // }

    fnGetNewProductId(){
        let sMethodUrl = `${this.sRootUrl}/getnewproductid`;
        return this.http.get(sMethodUrl);
    }

    fnGetNewItemId(){
        let sMethodUrl = `${this.sRootUrl}/getnewitemid`;
        return this.http.get(sMethodUrl);
    }

    fnAddItemInfo(oProductItemInfo: ProductItemInfo) {
        let sMethodUrl = `${this.sRootUrl}/add_item`;
        return this.http.post(sMethodUrl, oProductItemInfo);
    }

    fnEditProductInfo(oProduct: Product) {
        const sMethodUrl = `${this.sRootUrl}/edit_product`;
        return this.http.post(sMethodUrl, oProduct);
    }

    fnEditProductBasicInfo(oProduct: ProductBasicInfo) {
        let sMethodUrl = `${this.sRootUrl}/edit_basicinfo`;
        return this.http.post(sMethodUrl, oProduct);
    }

    fnEditItemInfo(oProductItemInfo: ProductItemInfo) {
        let sMethodUrl = `${this.sRootUrl}/edit_item`;
        return this.http.post(sMethodUrl, oProductItemInfo);
    }
}
