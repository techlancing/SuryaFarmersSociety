import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { AdminLayout } from '../layout/AdminLayout'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { NewAccountPage } from '../pages/NewAccountPage'
import { DailySavingsDepositPage } from '../pages/DailySavingsDepositPage'

const protectedRoutes = [
  { path: '/', element: <DashboardPage /> },
  { path: '/dashboard', element: <DashboardPage /> },
  // Stubs for key Angular routes – can be replaced with real pages incrementally
  { path: '/passbookprint', label: 'Passbook Print' },
  { path: '/alltranactionprint', label: 'All Transaction Print' },
  { path: '/accountBalanceEnquiry', label: 'Balance Enquiry' },
  { path: '/accountStatement', label: 'Account Statement' },
  { path: '/adddistrict', label: 'Add District' },
  { path: '/addmandal', label: 'Add Mandal' },
  { path: '/addvillage', label: 'Add Village' },
  { path: '/createemployeelogin', label: 'Create Employee Login' },
  { path: '/loanapproval', label: 'Loan Approval' },
  { path: '/creditapproval', label: 'Credit Approval' },
  { path: '/savingsapproval', label: 'Savings Type Approval' },
  { path: '/accountClosing', label: 'Account Closing' },
  { path: '/closedaccounts', label: 'Closed Accounts' },
  { path: '/addemployee', label: 'Add Employee' },
  { path: '/allaccounts', label: 'All Accounts' },
  { path: '/newaccountform', element: <NewAccountPage /> },
  { path: '/debit', label: 'Debit' },
  { path: '/dailysavingsdeposit', element: <DailySavingsDepositPage /> },
  { path: '/withdrawal', label: 'Withdrawal' },
  { path: '/credit', label: 'Credit' },
  { path: '/intratransaction', label: 'Intra Transaction' },
  { path: '/approvaldetails', label: 'Approval Details' },
  { path: '/DayWiseTransaction', label: 'Daywise Transaction Report' },
  { path: '/DayWiseCumulative', label: 'Daywise Cumulative Report' },
  { path: '/DayWiseCumulativeAccount', label: 'Daywise Cumulative Account' },
  { path: '/Last12MonthsTransaction', label: 'Last 12 Months Transaction' },
  { path: '/CategoryBalanceSummary', label: 'Category Balance Summary' },
  { path: '/AllCategoryBalanceSummary', label: 'All Category Balance Summary' },
  { path: '/logout', label: 'Logout' },
]

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          {protectedRoutes.map(({ path, element, label }) => (
            <Route
              key={path}
              path={path}
              element={
                <AdminLayout>
                  {element ?? <PlaceholderPage title={label ?? path} />}
                </AdminLayout>
              }
            />
          ))}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

