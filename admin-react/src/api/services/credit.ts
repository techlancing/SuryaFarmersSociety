import { apiPath, apiPost } from '../client'

const base = apiPath('/credit')

export interface AddCreditPayload {
  sAccountNo: string
  nLoanId: number
  nAmount: number
  sDate: string
  sNarration: string
  sReceiverName: string
}

export function addCredit(body: AddCreditPayload): Promise<{ status: string; id?: number }> {
  return apiPost<{ status: string; id?: number }>(`${base}/add_credit`, body)
}
