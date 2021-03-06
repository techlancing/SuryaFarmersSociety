import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default/default.component';
import { SaasComponent } from './saas/saas.component';
import { CryptoComponent } from './crypto/crypto.component';
import { AllBankAccountsComponent } from './all-bank-accounts/all-bank-accounts.component';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';

const routes: Routes = [
    {
        path: 'default',
        component: DefaultComponent
    },
    {
        path: 'allaccounts',
        component: AllBankAccountsComponent
    },
    {
        path: 'addemployeeapproval',
        component: AllEmployeesComponent,
        data :{
            type : 'approval', 
        }
    },
    {
        path: 'allemployeesupdate',
        component: AllEmployeesComponent,
        
    },
    {
        path: 'saas',
        component: SaasComponent
    },
    {
        path: 'crypto',
        component: CryptoComponent
    },
    {
        path: 'viewemployee',
        component: ViewEmployeeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardsRoutingModule {}
