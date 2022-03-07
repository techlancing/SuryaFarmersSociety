import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountTransactionDebitComponent } from './account-transaction-debit/account-transaction-debit.component';
import { AccountTransactionCreditComponent } from './account-transaction-credit/account-transaction-credit.component';
import { AddBankEmployeeComponent } from './add-bank-employee/add-bank-employee.component';
import { AddaccountComponent } from './addaccount/addaccount.component';
import { PassbookPrintComponent } from './passbook-print/passbook-print.component';
import { AccountTransactionDailysavingdebitComponent } from './account-transaction-dailysavingdebit/account-transaction-dailysavingdebit.component';
import { AccountTransactionCreditLoanComponent } from './account-transaction-credit-loan/account-transaction-credit-loan.component';
import { IntraTransactionComponent } from './account-transaction-intra-transaction/account-transaction-intra-transaction.component';
import { AllTransactionPrintComponent } from './all-transaction-print/all-transaction-print.component';
import { AddDistrictComponent } from './add-district/add-district.component';
import { AddMandalComponent } from './add-mandal/add-mandal.component';
import { AddVillageComponent } from './add-village/add-village.component';
import { DaywiseTransactionComponent } from './daywise-transaction/daywise-transaction.component';
import { DailySavingsDepositComponent } from './daily-savings-deposit/daily-savings-deposit.component';
import { DaywiseCumulativeComponent } from './daywise-cumulative/daywise-cumulative.component';
import { DaywiseCumulativeAccountComponent } from './daywise-cumulative-account/daywise-cumulative-account.component';
import { LastTransactionComponent } from './last-transaction/last-transaction.component';
import { Last12MonthsTransactionComponent } from './last12-months-transaction/last12-months-transaction.component';
import { CategoryBalanceSummaryComponent } from './category-balance-summary/category-balance-summary.component';
import { AllCategoryBalanceSummaryComponent } from './all-category-balance-summary/all-category-balance-summary.component';
import { DayMonthYearWiseComponent } from './day-month-year-wise/day-month-year-wise.component'; 
import { NewPassbookPrintComponent } from './new-passbook-print/new-passbook-print.component';
import { SelectPrintLineComponent } from './select-print-line/select-print-line.component';
import { CategoryWiseBalanceSummaryComponent } from './category-wise-balance-summary/category-wise-balance-summary.component';
import { AllCategoryWiseBalanceSummaryComponent } from './all-category-wise-balance-summary/all-category-wise-balance-summary.component';
import { AccountBalanceEnquiryComponent } from './account-balance-enquiry/account-balance-enquiry.component';
import { SavingsTypesComponent } from './savings-types/savings-types.component';
import { SavingsTypeDepositTransactionComponent } from './savings-type-deposit-transaction/savings-type-deposit-transaction.component';
import { ManagerApprovalComponent } from './manager-approval/manager-approval.component';
import { ApprovalsDisplayComponent } from './approvals-display/approvals-display.component';
import { WelcomeMessageComponent } from './welcome-message/welcome-message.component';
import { LogoutComponent } from './logout/logout.component';



const routes: Routes = [
    
    {
        path: 'newaccountform',
        component: AddaccountComponent
    },
    {
        path: 'adddistrict',
        component: AddDistrictComponent
    },
    {
        path: 'addmandal',
        component: AddMandalComponent
    },
    {
        path: 'addvillage',
        component: AddVillageComponent
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
        path: 'newpassbookprint',
        component: NewPassbookPrintComponent
    },
    {
        path: 'credit',
        component: AccountTransactionDebitComponent,
        data: {
            type: 'credit'
        }
    },
    {
        path: 'debit',
        component: AccountTransactionDebitComponent,
        data: {
            type: 'debit'
        }
    },
    {
        path:'dailysavingdebit',
        component: AccountTransactionDailysavingdebitComponent,
        data: {
            type: 'deposit'
        }
    },
    {
        path:'dailysavingsdeposit',
        component: DailySavingsDepositComponent,
        data: {
            type: 'deposit'
        }
    },
    {
        path:'withdrawal',
        component: AccountTransactionDailysavingdebitComponent,
        data: {
            type: 'withdraw'
        }
    },
    {
        path:'creditloan',
        component: AccountTransactionCreditLoanComponent
    },
    {
        path:'intratransaction',
        component: IntraTransactionComponent
    },
    {
        path:'alltranactionprint',
        component: AllTransactionPrintComponent
    },
    {
        path:'DayWiseTransaction',
        component: DaywiseTransactionComponent
    },
    {
        path:'DayWiseCumulative',
        component: DaywiseCumulativeComponent
    },
    {
        path:'DayWiseCumulativeAccount',
        component: DaywiseCumulativeAccountComponent
    },
    {
        path:'LastTransaction',
        component: LastTransactionComponent
    },
    {
        path:'Last12MonthsTransaction',
        component: Last12MonthsTransactionComponent
    },
    {
        path:'CategoryBalanceSummary',
        component: CategoryBalanceSummaryComponent
    },
    {
        path:'AllCategoryWiseBalanceSummary',
        component: AllCategoryWiseBalanceSummaryComponent
    },
    {
        path:'CategoryWiseBalanceSummary',
        component: CategoryWiseBalanceSummaryComponent
    },
    {
        path:'AllCategoryBalanceSummary',
        component: AllCategoryBalanceSummaryComponent
    },
    {
        path:'DayMonthYearWise',
        component: DayMonthYearWiseComponent
    },
    {
        path: 'accountBalanceEnquiry',
        component: AccountBalanceEnquiryComponent
    },
    {
        path: 'accountStatement',
        component: AllTransactionPrintComponent,
        data: {
            type: 'statement'
        }
    },
    {
        path : 'savingstype',
        component : SavingsTypesComponent
    },
    {
        path : 'savingstypedeposittransaction',
        component : SavingsTypeDepositTransactionComponent
    },
    {
        path : 'savingsapproval',
        component : ManagerApprovalComponent,
        data :{
            type : 'savings',
            tableContent : 'Saving Deposits'
        }
    },
    {
        path : 'loanapproval',
        component : ManagerApprovalComponent,
        data :{
            type : 'loan',
            tableContent : 'Loan'
        }
    },
    {
        path : 'creditapproval',
        component : ManagerApprovalComponent,
        data :{
            type : 'credit',
            tableContent : 'Credit'
        }
    },
    {
        path:'dailysavingdepositwithdrawl',
        component: AccountTransactionDailysavingdebitComponent,
        data: {
            type: 'depositwithdrawl'
        }
    },
    {
        path:'approvaldetails',
        component: ApprovalsDisplayComponent
    }, 
    {
        path: 'welcomemanager',
        component: WelcomeMessageComponent,
        data: {
            type: 'manager'
        }
    },
    {
        path: 'welcomeemployee',
        component: WelcomeMessageComponent,
        data: {
            type: 'employee'
        }
    },
    {
        path: 'logout',
        component: LogoutComponent
    }
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EcommerceRoutingModule {}
