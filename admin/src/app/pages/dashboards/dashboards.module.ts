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

import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { AllBankAccountsComponent } from './all-bank-accounts/all-bank-accounts.component';
import { EcommerceModule } from '../ecommerce/ecommerce.module';

@NgModule({
  declarations: [DefaultComponent, SaasComponent, CryptoComponent, AllBankAccountsComponent],
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
    PerfectScrollbarModule
  ]
})
export class DashboardsModule { }
