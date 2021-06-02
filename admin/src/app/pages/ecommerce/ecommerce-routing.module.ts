import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountTransactionDebitComponent } from './account-transaction-debit/account-transaction-debit.component';
import { AccountTransactionCreditComponent } from './account-transaction-credit/account-transaction-credit.component';
import { AddBankEmployeeComponent } from './add-bank-employee/add-bank-employee.component';
import { AddaccountComponent } from './addaccount/addaccount.component';


const routes: Routes = [
    {
        path: 'newaccountform',
        component: AddBankEmployeeComponent
    },
    {
        path: 'adddistrict',
        component: AccountTransactionCreditComponent
    },
    {
        path: 'addmandal',
        component: AccountTransactionDebitComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
