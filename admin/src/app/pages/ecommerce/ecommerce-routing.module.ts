import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBankEmployeeComponent } from './add-bank-employee/add-bank-employee.component';
import { AddaccountComponent } from './addaccount/addaccount.component';


const routes: Routes = [
    {
        path: 'newaccountform',
        component: AddaccountComponent
    },
    {
        path: 'adddistrict',
        component: AddBankEmployeeComponent
    },
    {
        path: 'addmandal',
        component: AddaccountComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
