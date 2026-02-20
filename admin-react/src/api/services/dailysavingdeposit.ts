import { apiPath, apiPost } from '../client'

const base = apiPath('/dailysavingdeposit')

export interface AddDailyDepositPayload {
  sAccountNo: string
  nAccountId: number
  nDayAmount: number
  nTotaldays: number
  sStartDate: string
  sNarration: string
  sReceiverName: string
}

export function addDailydeposittransaction(body: AddDailyDepositPayload): Promise<{ status: string; id?: string }> {
  return apiPost<{ status: string; id?: string }>(`${base}/add_dailydeposittransaction`, body)
}

export interface WithdrawDailyDepositPayload {
  sAccountNo: string
  nAccountId: number
  nAmount: number
  sEndDate: string
  sNarration: string
  sReceiverName: string
}

export function withdrawDailyDeposit(body: WithdrawDailyDepositPayload): Promise<{ status: string; id?: number }> {
  return apiPost<{ status: string; id?: number }>(`${base}/withdraw_dailydeposittransaction`, body)
}

export interface WithdrawSavingsAccountPayload {
  sAccountNo: string
  nAccountId: number
  nAmount: number
  sStartDate: string
  sNarration: string
  sReceiverName: string
}

export function withdrawSavingsAccount(body: WithdrawSavingsAccountPayload): Promise<{ status: string; id?: number }> {
  return apiPost<{ status: string; id?: number }>(`${base}/withdrawl_savingstransaction`, body)
}
