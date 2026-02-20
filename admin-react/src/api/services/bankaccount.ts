import { apiPath, apiGet, apiPost } from '../client'

export interface BankAccount {
  _id?: string
  nAccountId?: number
  sAccountNo?: string
  sBranchCode?: string
  sBranchName?: string
  sMandalBranchName?: string
  sState?: string
  nDistrictId?: number
  nMandalId?: number
  nVillageId?: number
  sCustomerId?: number
  sDate?: string
  sApplicantName?: string
  sApplicantSurName?: string
  sGender?: string
  sDOB?: string
  sAge?: string
  sAccountType?: string
  sAccountCategory?: string
  sShareType?: string
  sSMSAlert?: string
  sFatherOrHusbandName?: string
  sMotherName?: string
  sNomineeName?: string
  sNomineeRelationship?: string
  sVoterIdNo?: string
  sAadharNo?: string
  sRationCardNo?: string
  sFlatNo?: string
  sStreetName?: string
  sVillageAddress?: string
  sMobileNumber?: string
  nAmount?: number
  oPassportImageInfo?: string
  oSignature1Info?: string
  oSignature2Info?: string
  oDocument1Info?: string
  oDocument2Info?: string
  bIsDeactivated?: boolean
  [key: string]: unknown
}

const base = apiPath('/bankaccount')

export function getAllBankAccounts(): Promise<BankAccount[]> {
  return apiGet<BankAccount[]>(`${base}/allbankaccount_list`)
}

export function getActiveBankAccounts(): Promise<BankAccount[]> {
  return apiGet<BankAccount[]>(`${base}/activebankaccount_list`)
}

export function addBankAccount(body: BankAccount): Promise<string> {
  return apiPost<string>(`${base}/add_bankaccount`, body)
}

export function editBankAccount(body: BankAccount & { _id: string }): Promise<string> {
  return apiPost<string>(`${base}/edit_bankaccount`, body)
}

export function deleteBankAccount(body: { _id: string }): Promise<unknown> {
  return apiPost(`${base}/delete_bankaccount`, body)
}

export function getAccountByNumber(body: { sAccountNo: string }): Promise<BankAccount> {
  return apiPost<BankAccount>(`${base}/getaccountbynumber`, body)
}

/** Backend returns the balance as a number directly. */
export function getSingleAccountBalance(body: { sAccountNo: string }): Promise<number> {
  return apiPost<number>(`${base}/getsingleaccountbalance`, body)
}

export function getLastAccountInVillage(body: { nVillageId: number }): Promise<BankAccount | null> {
  return apiPost<BankAccount | null>(`${base}/getlastaccountinvillage`, body)
}

export function activateOrDeactivateAccount(body: {
  sAccountNo: string
  bIsDeactivated: boolean
}): Promise<string> {
  return apiPost<string>(`${base}/activate_or_deactivate_account`, body)
}

export function getAllSavingsTransactions(body: { nAccountId: number }): Promise<unknown[]> {
  return apiPost<unknown[]>(`${base}/getallsavingstransactions`, body)
}
