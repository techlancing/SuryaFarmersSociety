import { apiPath, apiPost } from '../client'

const base = apiPath('/intratransaction')

export interface IntraAccountTransactionPayload {
  sSenderAccountNumber: string
  nSenderAccountId: number
  sSenderAccountType: 'savings' | 'savingtype'
  sRecieverAccountNumber: string
  nReceiverAccountId: number
  sRecieverAccountType: 'savings' | 'loan' | 'savingtype'
  nLoanId?: number
  nAmount: number
  sDate: string
  sNarration: string
  sTransactionEmployee: string
}

export function intraaccounttransaction(body: IntraAccountTransactionPayload): Promise<{ status: string; id?: string }> {
  return apiPost<{ status: string; id?: string }>(`${base}/intraaccounttransaction`, body)
}
