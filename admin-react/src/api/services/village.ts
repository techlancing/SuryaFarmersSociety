import { apiPath, apiGet, apiPost } from '../client'

export interface Village {
  _id?: string
  nVillageId?: number
  nMandalId: number
  sVillageName: string
  nVillageCode?: number
}

const base = apiPath('/village')

export function getVillageList(): Promise<Village[]> {
  return apiGet<Village[]>(`${base}/village_list`)
}

export function addVillage(body: { nMandalId: number; sVillageName: string }): Promise<string> {
  return apiPost<string>(`${base}/add_village`, body)
}

export function editVillage(body: Village & { _id: string }): Promise<string> {
  return apiPost<string>(`${base}/edit_village`, body)
}

export function deleteVillage(body: { _id: string }): Promise<unknown> {
  return apiPost(`${base}/delete_village`, body)
}
