import { apiPath, apiPost } from '../client'

export interface LoginPayload {
  sEmail: string
  sPassword: string
}

export interface LoginResponse {
  sUserEmail: string
  sUserName: string
  sRole: string
  _token: string
  _expirytokentime?: number
}

const base = apiPath('/account')

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiPost<LoginResponse>(`${base}/login`, payload)
}

export async function createUserAccount(payload: {
  sName: string
  sEmail: string
  sPassword: string
  sRole: string
  nMobile: number | string
}): Promise<string | { error: string }> {
  const res = await apiPost< string | { error: string }>(`${base}/createuseraccount`, payload)
  return res
}
