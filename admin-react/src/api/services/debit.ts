import { apiPath, apiPost } from '../client'

const base = apiPath('/debit')

export interface AddDebitPayload {
  sAccountNo: string
  nLoanId: number
  nAmount: number
  sDate: string
  sNarration: string
  sReceiverName: string
}

export function addDebit(body: AddDebitPayload): Promise<{ status: string; id?: number }> {
  return apiPost<{ status: string; id?: number }>(`${base}/add_debit`, body)
}
