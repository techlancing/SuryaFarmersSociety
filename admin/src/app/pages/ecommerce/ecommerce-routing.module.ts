import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountTransactionDebitComponent } from './account-transaction-debit/account-transaction-debit.component';
import { AccountTransactionCreditComponent } from './account-transaction-credit/account-transaction-credit.component';
import { AddBankEmployeeComponent } from './add-bank-employee/add-bank-employee.component';
import { AddaccountComponent } from './addaccount/addaccount.component';
import { PassbookPrintComponent } from './passbook-print/passbook-print.component';
import { AccountTransactionDailysavingdebitComponent } from './account-transaction-dailysavingdebit/account-transaction-dailysavingdebit.component';
import { AccountTransactionCreditLoanComponent } from './account-transaction-credit-loan/account-transaction-credit-loan.component';
import { AccountTransactionIntraTransitionComponent } from './account-transaction-intra-transition/account-transaction-intra-transition.component';




const routes: Routes = [
    {
        path: 'newaccountform',
        component: AddaccountComponent
    },
    {
        path: 'adddistrict',
        component: AddaccountComponent
    },
    {
        path: 'addmandal',
        component: AddaccountComponent
    },
    {
        path: 'addemployee',
        component: AddBankEmployeeComponent
    },
    {
        path: 'passbookprint',
        component: PassbookPrintComponent
    },
    {
        path: 'credit',
        component: AccountTransactionCreditComponent
    },
    {
        path: 'debit',
        component: AccountTransactionDebitComponent
    },
    {
        path:'dailysavingdebit',
        component: AccountTransactionDailysavingdebitComponent
    },
    {
        path:'creditloan',
        component: AccountTransactionCreditLoanComponent
    },
    {
        path:'intratransaction',
        component: AccountTransactionIntraTransitionComponent
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
