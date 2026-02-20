import { apiPath, apiGet, apiPost } from '../client'

export interface Mandal {
  _id?: string
  nMandalId?: number
  nDistrictId: number
  sMandalName: string
  nMandalCode?: number
}

const base = apiPath('/mandal')

export function getMandalList(): Promise<Mandal[]> {
  return apiGet<Mandal[]>(`${base}/mandal_list`)
}

export function addMandal(body: { nDistrictId: number; sMandalName: string }): Promise<string> {
  return apiPost<string>(`${base}/add_mandal`, body)
}

export function editMandal(body: Mandal & { _id: string }): Promise<string> {
  return apiPost<string>(`${base}/edit_mandal`, body)
}

export function deleteMandal(body: { _id: string }): Promise<unknown> {
  return apiPost(`${base}/delete_mandal`, body)
}
