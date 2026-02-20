import { apiPath, apiGet, apiPost } from '../client'

export interface Transaction {
  _id?: string
  nTransactionId?: number
  sAccountNo?: string
  nLoanId?: number
  nCreditAmount?: number
  nDebitAmount?: number
  nBalanceAmount?: number
  sDate?: string
  sNarration?: string
  sAccountType?: string
  sEmployeeName?: string
  sIsApproved?: string
  [key: string]: unknown
}

const base = apiPath('/transaction')

export function getNeedToApproveTransactionList(): Promise<Transaction[]> {
  return apiGet<Transaction[]>(`${base}/Need_to_approve_Transaction_list`)
}

export function getTransactionsBetweenDates(body: {
  from_date: string
  to_date: string
}): Promise<Transaction[]> {
  return apiPost<Transaction[]>(`${base}/gettransactionsbetweendates`, body)
}

export function setTransactionApprovalStatus(body: {
  nTransactionId: number
  sAccountNo: string
  nLoanId: number
  sIsApproved: 'Approved' | 'Rejected'
}): Promise<{ status: string; message?: string }> {
  return apiPost<{ status: string; message?: string }>(`${base}/settransactionapprovalstatus`, body)
}
