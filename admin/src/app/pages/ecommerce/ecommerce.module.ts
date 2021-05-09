import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EcommerceRoutingModule } from './ecommerce-routing.module';
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
import { AddcarComponent } from './addcar/addcar.component';
import { AdddriverComponent } from './adddriver/adddriver.component';
import { AddaccountComponent } from './addaccount/addaccount.component';

const config: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/car/upload_file", //'https://httpbin.org/post',
  maxFilesize: 100,
};

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [  AddcarComponent, AdddriverComponent, AddaccountComponent, ],
  imports: [
    CommonModule,
    EcommerceRoutingModule,
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
export class EcommerceModule { }
