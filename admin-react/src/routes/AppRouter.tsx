import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { AdminLayout } from '../layout/AdminLayout'
import { NewAccountPage } from '../pages/NewAccountPage'
import { DailySavingsDepositPage } from '../pages/DailySavingsDepositPage'
import { AccountTransactionDebitCreditPage } from '../pages/AccountTransactionDebitCreditPage'
import { WithdrawalPage } from '../pages/WithdrawalPage'
import { IntraTransactionPage } from '../pages/IntraTransactionPage'
import { AddDistrictPage } from '../pages/AddDistrictPage'
import { AddMandalPage } from '../pages/AddMandalPage'
import { AddVillagePage } from '../pages/AddVillagePage'
import { AddEmployeePage } from '../pages/AddEmployeePage'
import { CreateEmployeeLoginPage } from '../pages/CreateEmployeeLoginPage'
import { AccountBalanceEnquiryPage } from '../pages/AccountBalanceEnquiryPage'
import { ManagerApprovalPage } from '../pages/ManagerApprovalPage'
import { PassbookPrintPage } from '../pages/PassbookPrintPage'
import { AccountStatementPage } from '../pages/AccountStatementPage'
import { AllAccountsPage } from '../pages/AllAccountsPage'
import { ClosedAccountsPage } from '../pages/ClosedAccountsPage'
import { AllTransactionPrintPage } from '../pages/AllTransactionPrintPage'
import { AccountClosingPage } from '../pages/AccountClosingPage'
import { DaywiseTransactionPage } from '../pages/DaywiseTransactionPage'
import { ApprovalDetailsPage } from '../pages/ApprovalDetailsPage'
import { DaywiseCumulativePage } from '../pages/DaywiseCumulativePage'
import { DaywiseCumulativeAccountPage } from '../pages/DaywiseCumulativeAccountPage'
import { Last12MonthsTransactionPage } from '../pages/Last12MonthsTransactionPage'
import { CategoryBalanceSummaryPage } from '../pages/CategoryBalanceSummaryPage'
import { AllCategoryBalanceSummaryPage } from '../pages/AllCategoryBalanceSummaryPage'
import { LogoutPage } from '../pages/LogoutPage'

const protectedRoutes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  // Stubs for key Angular routes – can be replaced with real pages incrementally
  { path: '/passbookprint', element: <PassbookPrintPage /> },
  { path: '/alltranactionprint', element: <AllTransactionPrintPage /> },
  { path: '/accountBalanceEnquiry', element: <AccountBalanceEnquiryPage /> },
  { path: '/accountStatement', element: <AccountStatementPage /> },
  { path: '/adddistrict', element: <AddDistrictPage /> },
  { path: '/addmandal', element: <AddMandalPage /> },
  { path: '/addvillage', element: <AddVillagePage /> },
  { path: '/createemployeelogin', element: <CreateEmployeeLoginPage /> },
  { path: '/loanapproval', element: <ManagerApprovalPage type="loan" /> },
  { path: '/creditapproval', element: <ManagerApprovalPage type="credit" /> },
  { path: '/savingsapproval', element: <ManagerApprovalPage type="savings" /> },
  { path: '/accountClosing', element: <AccountClosingPage /> },
  { path: '/closedaccounts', element: <ClosedAccountsPage /> },
  { path: '/addemployee', element: <AddEmployeePage /> },
  { path: '/allaccounts', element: <AllAccountsPage /> },
  { path: '/newaccountform', element: <NewAccountPage /> },
  { path: '/debit', element: <AccountTransactionDebitCreditPage mode="debit" /> },
  { path: '/dailysavingsdeposit', element: <DailySavingsDepositPage /> },
  { path: '/withdrawal', element: <WithdrawalPage /> },
  { path: '/credit', element: <AccountTransactionDebitCreditPage mode="credit" /> },
  { path: '/intratransaction', element: <IntraTransactionPage /> },
  { path: '/approvaldetails', element: <ApprovalDetailsPage /> },
  { path: '/DayWiseTransaction', element: <DaywiseTransactionPage /> },
  { path: '/DayWiseCumulative', element: <DaywiseCumulativePage /> },
  { path: '/DayWiseCumulativeAccount', element: <DaywiseCumulativeAccountPage /> },
  { path: '/Last12MonthsTransaction', element: <Last12MonthsTransactionPage /> },
  { path: '/CategoryBalanceSummary', element: <CategoryBalanceSummaryPage /> },
  { path: '/AllCategoryBalanceSummary', element: <AllCategoryBalanceSummaryPage /> },
  { path: '/logout', element: <LogoutPage /> },
]

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          {protectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminLayout>{element}</AdminLayout>}
            />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

