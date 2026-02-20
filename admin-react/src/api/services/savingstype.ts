import { apiPath, apiPost } from '../client'

export interface AccountSavingTypeBalance {
  sSavingsName: string
  nSavingsBalance: number
}

export interface SavingTypeDetail {
  _id?: string
  nSavingsId?: number
  sAccountNo?: string
  sTypeofSavings?: string
  nDepositAmount?: number
  nMaturityAmount?: number
  sStartDate?: string
  sMaturityDate?: string
  sIsApproved?: string
  sStatus?: string
  oTransactionInfo?: unknown[]
  [key: string]: unknown
}

const base = apiPath('/savingstype')

export function getAccountSavingTypes(body: { sAccountNo: string }): Promise<AccountSavingTypeBalance[]> {
  return apiPost<AccountSavingTypeBalance[]>(`${base}/getaccountsavingstypes`, body)
}

export function savingstypeList(body: { sAccountNo: string }): Promise<SavingTypeDetail[]> {
  return apiPost<SavingTypeDetail[]>(`${base}/savingstype_list`, body)
}

export function needToApproveSavingstypeList(): Promise<SavingTypeDetail[]> {
  return apiPost<SavingTypeDetail[]>(`${base}/need_to_approve_savingstype_list`, {})
}

export function setSavingstypeApprovalStatus(body: {
  nSavingsId: number
  sIsApproved: 'Approved' | 'Rejected'
  sStatus?: string
}): Promise<{ status: string; message?: string }> {
  return apiPost<{ status: string; message?: string }>(`${base}/setsavingstypeapprovalstatus`, body)
}

export function getallclosedsavingstypeByApproval(body: { sAccountNo: string }): Promise<SavingTypeDetail[]> {
  return apiPost<SavingTypeDetail[]>(`${base}/getallclosedsavingstypeByApproval`, body)
}

export function getallsavingstypeByApproval(body: { sAccountNo: string }): Promise<SavingTypeDetail[]> {
  return apiPost<SavingTypeDetail[]>(`${base}/getallsavingstypeByApproval`, body)
}

export function deactivateSavingType(body: { sAccountNo: string; nSavingsId: number; sIsApproved: string }): Promise<string> {
  return apiPost<string>(`${base}/deactivate`, body)
}

export interface WithdrawSavingTypePayload {
  sAccountNo: string
  nLoanId: number
  nAmount: number
  sDate: string
  sNarration: string
  sReceiverName: string
}

export function withdrawSavingType(body: WithdrawSavingTypePayload): Promise<{ status: string; id?: number }> {
  return apiPost<{ status: string; id?: number }>(`${base}/withdrawsavingsdeposit_transaction`, body)
}
