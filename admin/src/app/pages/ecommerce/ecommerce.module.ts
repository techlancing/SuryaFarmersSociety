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
import { AddaccountComponent } from './addaccount/addaccount.component';
import { AddBankEmployeeComponent } from './add-bank-employee/add-bank-employee.component';
import { AddDistrictComponent } from './add-district/add-district.component';
import { AddMandalComponent } from './add-mandal/add-mandal.component';
import { AccountTransactionDebitComponent } from './account-transaction-debit/account-transaction-debit.component';
import { AccountTransactionCreditComponent } from './account-transaction-credit/account-transaction-credit.component';
import { AccountTransactionCreditLoanComponent } from './account-transaction-credit-loan/account-transaction-credit-loan.component';
import { AccountTransactionDailysavingdebitComponent } from './account-transaction-dailysavingdebit/account-transaction-dailysavingdebit.component';
import { IntraTransactionComponent } from './account-transaction-intra-transaction/account-transaction-intra-transaction.component';
import { PassbookPrintComponent } from './passbook-print/passbook-print.component';
import { AllTransactionPrintComponent } from './all-transaction-print/all-transaction-print.component';
import { DistrictfilterPipe } from '../../pipes/districtfilter.pipe';
import { AddVillageComponent } from './add-village/add-village.component';
import { MandalfilterPipe } from '../../pipes/mandalfilter.pipe';
import { DaywiseTransactionComponent } from './daywise-transaction/daywise-transaction.component';
// import { IntraTransactionComponent } from './intra-transaction/intra-transaction.component';
import { DaywiseCumulativeComponent } from './daywise-cumulative/daywise-cumulative.component';
import { DaywiseCumulativeAccountComponent } from './daywise-cumulative-account/daywise-cumulative-account.component';
import { LastTransactionComponent } from './last-transaction/last-transaction.component';
import { Last12MonthsTransactionComponent } from './last12-months-transaction/last12-months-transaction.component';
import { CategoryBalanceSummaryComponent } from './category-balance-summary/category-balance-summary.component';
import { AllCategoryBalanceSummaryComponent } from './all-category-balance-summary/all-category-balance-summary.component';
import { DayMonthYearWiseComponent } from './day-month-year-wise/day-month-year-wise.component';

const config: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: environment.apiUrl + "nodejs/car/upload_file", //'https://httpbin.org/post',
  maxFilesize: 100,
};

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [   AddaccountComponent, AddBankEmployeeComponent, 
    AddDistrictComponent, AddMandalComponent, 
    AccountTransactionDebitComponent, AccountTransactionCreditComponent, 
    AccountTransactionCreditLoanComponent, AccountTransactionDailysavingdebitComponent,
     IntraTransactionComponent, PassbookPrintComponent, 
     AllTransactionPrintComponent, DistrictfilterPipe, AddVillageComponent ,
     MandalfilterPipe,
     DaywiseTransactionComponent,
     IntraTransactionComponent,
     DaywiseCumulativeComponent,
     DaywiseCumulativeAccountComponent,
     LastTransactionComponent,
     Last12MonthsTransactionComponent,
     CategoryBalanceSummaryComponent,
     AllCategoryBalanceSummaryComponent,
     DayMonthYearWiseComponent],
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
