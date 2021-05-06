import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubCategory } from './../models/subcategory.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/subcategory";

    constructor(private http: HttpClient) { }

    fnAddSubCategoryInfo(oSubCategory: SubCategory) {
        const sMethodUrl = `${this.sRootUrl}/add_subcategory`;
        return this.http.post(sMethodUrl, oSubCategory);
    }

    fngetSubCategoryInfo(){
      const sMethodUrl = `${this.sRootUrl}/subcategory_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditSubCategoryInfo(oSubCategory: SubCategory) {
      const sMethodUrl = `${this.sRootUrl}/edit_subcategory`;
      return this.http.post(sMethodUrl, oSubCategory);
  }
  fnDeleteSubCategoryInfo(oSubCategory: SubCategory) {
    const sMethodUrl = `${this.sRootUrl}/delete_subcategory`;
    return this.http.post(sMethodUrl, oSubCategory);
  }
}
