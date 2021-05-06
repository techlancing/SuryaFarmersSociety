import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from './../models/category.model';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class CategoryService {

    sRootUrl: string = environment.apiUrl + "ANapi_ec/category";

    constructor(private http: HttpClient) { }

    fnAddCategoryInfo(oCategory: Category) {
        const sMethodUrl = `${this.sRootUrl}/add_category`;
        return this.http.post(sMethodUrl, oCategory);
    }

    fngetCategoryInfo(){
      const sMethodUrl = `${this.sRootUrl}/category_list`;
      return this.http.get(sMethodUrl);
    }

    fnEditCategoryInfo(oCategory: Category) {
      const sMethodUrl = `${this.sRootUrl}/edit_category`;
      return this.http.post(sMethodUrl, oCategory);
  }

    fnDeleteCategoryInfo(oCategory: Category) {
      const sMethodUrl = `${this.sRootUrl}/delete_category`;
      return this.http.post(sMethodUrl, oCategory);
  }
}
