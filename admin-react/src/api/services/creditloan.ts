import { apiPath, apiPost } from '../client'

export interface AccountCreditLoanBalance {
  sLoanName: string
  nLoanBalance: number
}

export interface CreditLoanDetail {
  _id?: string
  nLoanId?: number
  sAccountNo?: string
  sTypeofLoan?: string
  nSanctionAmount?: number
  nTotalAmount?: number
  sDate?: string
  sIsApproved?: string
  sLoanStatus?: string
  oTransactionInfo?: Array<{
    nTransactionId?: number
    sDate?: string
    nCreditAmount?: number
    nDebitAmount?: number
    nBalanceAmount?: number
    sNarration?: string
    sEmployeeName?: string
  }>
  [key: string]: unknown
}

const base = apiPath('/creditloan')

export function getAccountCreditLoans(body: { sAccountNo: string }): Promise<AccountCreditLoanBalance[]> {
  return apiPost<AccountCreditLoanBalance[]>(`${base}/getaccountcreditloans`, body)
}

export function getallcreditloansByApproval(body: { sAccountNo: string }): Promise<CreditLoanDetail[]> {
  return apiPost<CreditLoanDetail[]>(`${base}/getallcreditloansByApproval`, body)
}

export function getclosedallcreditloans(body: { sAccountNo: string }): Promise<CreditLoanDetail[]> {
  return apiPost<CreditLoanDetail[]>(`${base}/getclosedallcreditloans`, body)
}

export function needToApproveGetallcreditloans(): Promise<CreditLoanDetail[]> {
  return apiPost<CreditLoanDetail[]>(`${base}/need_to_approve_getallcreditloans`, {})
}

export function setcreditloanapprovalstatus(body: {
  _id?: string
  nLoanId?: number
  sAccountNo?: string
  sIsApproved: 'Approved' | 'Rejected'
}): Promise<{ status: string }> {
  return apiPost<{ status: string }>(`${base}/setcreditloanapprovalstatus`, body)
}

export function deactivateCreditLoan(body: { sAccountNo: string; nLoanId: number }): Promise<string> {
  return apiPost<string>(`${base}/deactivate`, body)
}
