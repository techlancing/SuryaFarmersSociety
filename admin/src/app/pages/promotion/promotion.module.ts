
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PromotionRoutingModule } from './promotion-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { ArchwizardModule } from 'angular-archwizard';

import { Ng5SliderModule } from 'ng5-slider';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbNavModule, NgbDropdownModule, NgbPaginationModule, NgbAccordionModule,
  NgbCollapseModule,NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from 'src/environments/environment';
import { HomemainbannerComponent } from './homemainbanner/homemainbanner.component';
import { FirstlayoutbannerComponent } from './firstlayoutbanner/firstlayoutbanner.component';
import { SecondlayoutbannerComponent } from './secondlayoutbanner/secondlayoutbanner.component';
import { ThirdlayoutbannerComponent } from './thirdlayoutbanner/thirdlayoutbanner.component';


const config: DropzoneConfigInterface = {
  // Change this to your upload POST addres:s:
  url: environment.apiUrl + "ANapi_ec/banner/upload_file", //'https://httpbin.org/post',
  maxFilesize: 100,
  maxFiles: 1
};

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [HomemainbannerComponent, FirstlayoutbannerComponent, SecondlayoutbannerComponent, ThirdlayoutbannerComponent],
  imports: [
    CommonModule,
    PromotionRoutingModule,
    NgbNavModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    NgbDropdownModule,
    DropzoneModule,
    UIModule,
    WidgetModule,
    Ng5SliderModule,
    NgSelectModule,
    NgbPaginationModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbTooltipModule,
    ArchwizardModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: config
    }
  ]
})
export class PromotionModule { }

