import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { UIModule } from '../../shared/ui/ui.module';
import { WidgetModule } from '../../shared/widget/widget.module';

import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from './saas/shared/shared.module'
import { NgbDropdownModule, NgbTooltipModule, NgbNavModule ,NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap'
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { AllBankAccountsComponent } from './all-bank-accounts/all-bank-accounts.component';
import { EcommerceModule } from '../ecommerce/ecommerce.module';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';

@NgModule({
  declarations: [DefaultComponent, SaasComponent, CryptoComponent, AllBankAccountsComponent, AllEmployeesComponent, ViewEmployeeComponent],
  imports: [
    EcommerceModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardsRoutingModule,
    UIModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbTypeaheadModule,
    WidgetModule,
    NgApexchartsModule,
    SharedModule,
    PerfectScrollbarModule,
    NgSelectModule
  ]
})
export class DashboardsModule { }
