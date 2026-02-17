import type { UserRole } from '../auth/AuthContext'

export type MenuItemId =
  | 'dashboard'
  | 'passbook'
  | 'passbookPrint'
  | 'allTransactionPrint'
  | 'balanceEnquiry'
  | 'accountStatement'
  | 'ecommerce'
  | 'addDistrict'
  | 'addMandal'
  | 'addVillage'
  | 'addAccount'
  | 'addEmployee'
  | 'createEmployeeLogin'
  | 'reports'
  | 'dayWiseTransaction'
  | 'dayWiseCumulative'
  | 'dayWiseCumulativeAccount'
  | 'last12MonthsTransaction'
  | 'categoryBalanceSummary'
  | 'allCategoryBalanceSummary'
  | 'approvals'
  | 'loanApproval'
  | 'creditApproval'
  | 'savingsTypeApproval'
  | 'managerClosing'
  | 'accountClosing'
  | 'viewClosedAccounts'
  | 'accountsUpdate'
  | 'accountTransaction'
  | 'debit'
  | 'dailySavingsDeposit'
  | 'withdrawal'
  | 'credit'
  | 'intraTransaction'
  | 'approvalStatus'
  | 'logout'

export interface MenuItem {
  id: MenuItemId
  label: string
  path?: string
  icon?: string
  children?: MenuItem[]
}

export const MENU_BY_ROLE: Record<UserRole, MenuItem[]> = {
  chairman: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      id: 'passbook',
      label: 'Passbook',
      icon: 'book',
      children: [
        { id: 'passbookPrint', label: 'Passbook Print', path: '/passbookprint' },
        {
          id: 'allTransactionPrint',
          label: 'All Transaction Print',
          path: '/alltranactionprint',
        },
        { id: 'balanceEnquiry', label: 'Balance Enquiry', path: '/accountBalanceEnquiry' },
        { id: 'accountStatement', label: 'Account Statement', path: '/accountStatement' },
      ],
    },
    {
      id: 'ecommerce',
      label: 'Master Data',
      icon: 'map',
      children: [
        { id: 'addDistrict', label: 'Add District', path: '/adddistrict' },
        { id: 'addMandal', label: 'Add Mandal', path: '/addmandal' },
        { id: 'addVillage', label: 'Add Village', path: '/addvillage' },
        {
          id: 'createEmployeeLogin',
          label: 'Create Employee Login',
          path: '/createemployeelogin',
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'bar_chart',
      children: [
        {
          id: 'dayWiseTransaction',
          label: 'Daywise Transaction',
          path: '/DayWiseTransaction',
        },
        {
          id: 'dayWiseCumulative',
          label: 'Daywise Cumulative',
          path: '/DayWiseCumulative',
        },
        {
          id: 'dayWiseCumulativeAccount',
          label: 'Daywise Cumulative Account',
          path: '/DayWiseCumulativeAccount',
        },
        {
          id: 'last12MonthsTransaction',
          label: 'Last 12 Months Transaction',
          path: '/Last12MonthsTransaction',
        },
        {
          id: 'categoryBalanceSummary',
          label: 'Category Balance Summary',
          path: '/CategoryBalanceSummary',
        },
        {
          id: 'allCategoryBalanceSummary',
          label: 'All Category Balance Summary',
          path: '/AllCategoryBalanceSummary',
        },
      ],
    },
    {
      id: 'logout',
      label: 'Logout',
      path: '/logout',
      icon: 'logout',
    },
  ],
  manager: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: 'verified',
      children: [
        { id: 'loanApproval', label: 'Loan Approval', path: '/loanapproval' },
        { id: 'creditApproval', label: 'Credit Approval', path: '/creditapproval' },
        {
          id: 'savingsTypeApproval',
          label: 'Savings Type Approval',
          path: '/savingsapproval',
        },
      ],
    },
    {
      id: 'managerClosing',
      label: 'Closing',
      icon: 'lock',
      children: [
        { id: 'accountClosing', label: 'Account Closing', path: '/accountClosing' },
        {
          id: 'viewClosedAccounts',
          label: 'View Closed Accounts',
          path: '/closedaccounts',
        },
      ],
    },
    {
      id: 'accountsUpdate',
      label: 'Accounts Update',
      icon: 'people',
      children: [
        {
          id: 'addEmployee',
          label: 'Add Employee',
          path: '/addemployee',
        },
        {
          id: 'addAccount',
          label: 'Update Bank Accounts',
          path: '/allaccounts',
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'bar_chart',
      children: [
        {
          id: 'dayWiseTransaction',
          label: 'Daywise Transaction',
          path: '/DayWiseTransaction',
        },
        {
          id: 'dayWiseCumulative',
          label: 'Daywise Cumulative',
          path: '/DayWiseCumulative',
        },
        {
          id: 'dayWiseCumulativeAccount',
          label: 'Daywise Cumulative Account',
          path: '/DayWiseCumulativeAccount',
        },
        {
          id: 'last12MonthsTransaction',
          label: 'Last 12 Months Transaction',
          path: '/Last12MonthsTransaction',
        },
        {
          id: 'categoryBalanceSummary',
          label: 'Category Balance Summary',
          path: '/CategoryBalanceSummary',
        },
        {
          id: 'allCategoryBalanceSummary',
          label: 'All Category Balance Summary',
          path: '/AllCategoryBalanceSummary',
        },
      ],
    },
    {
      id: 'logout',
      label: 'Logout',
      path: '/logout',
      icon: 'logout',
    },
  ],
  employee: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
    {
      id: 'ecommerce',
      label: 'Accounts',
      icon: 'account_balance',
      children: [
        { id: 'addAccount', label: 'New Account', path: '/newaccountform' },
      ],
    },
    {
      id: 'accountTransaction',
      label: 'Transactions',
      icon: 'swap_horiz',
      children: [
        { id: 'debit', label: 'Debit', path: '/debit' },
        {
          id: 'dailySavingsDeposit',
          label: 'Daily Savings Deposit',
          path: '/dailysavingsdeposit',
        },
        { id: 'withdrawal', label: 'Withdrawal', path: '/withdrawal' },
        { id: 'credit', label: 'Credit', path: '/credit' },
        {
          id: 'intraTransaction',
          label: 'Intra Transaction',
          path: '/intratransaction',
        },
      ],
    },
    {
      id: 'approvalStatus',
      label: 'Approval Status',
      icon: 'check_circle',
      path: '/approvaldetails',
    },
    {
      id: 'passbook',
      label: 'Passbook',
      icon: 'book',
      children: [
        { id: 'passbookPrint', label: 'Passbook Print', path: '/passbookprint' },
        {
          id: 'allTransactionPrint',
          label: 'All Transaction Print',
          path: '/alltranactionprint',
        },
        { id: 'balanceEnquiry', label: 'Balance Enquiry', path: '/accountBalanceEnquiry' },
        { id: 'accountStatement', label: 'Account Statement', path: '/accountStatement' },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'bar_chart',
      children: [
        {
          id: 'dayWiseTransaction',
          label: 'Daywise Transaction',
          path: '/DayWiseTransaction',
        },
        {
          id: 'dayWiseCumulative',
          label: 'Daywise Cumulative',
          path: '/DayWiseCumulative',
        },
        {
          id: 'dayWiseCumulativeAccount',
          label: 'Daywise Cumulative Account',
          path: '/DayWiseCumulativeAccount',
        },
        {
          id: 'last12MonthsTransaction',
          label: 'Last 12 Months Transaction',
          path: '/Last12MonthsTransaction',
        },
        {
          id: 'categoryBalanceSummary',
          label: 'Category Balance Summary',
          path: '/CategoryBalanceSummary',
        },
        {
          id: 'allCategoryBalanceSummary',
          label: 'All Category Balance Summary',
          path: '/AllCategoryBalanceSummary',
        },
      ],
    },
    {
      id: 'logout',
      label: 'Logout',
      path: '/logout',
      icon: 'logout',
    },
  ],
}

