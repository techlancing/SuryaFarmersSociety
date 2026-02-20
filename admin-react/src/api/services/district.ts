import { apiPath, apiGet, apiPost } from '../client'

export interface District {
  _id?: string
  nDistrictId?: number
  sDistrictName: string
  nDistrictCode?: number
  nStateId?: number
}

const base = apiPath('/district')

export function getDistrictList(): Promise<District[]> {
  return apiGet<District[]>(`${base}/district_list`)
}

export function addDistrict(body: { sDistrictName: string }): Promise<string> {
  return apiPost<string>(`${base}/add_district`, body)
}

export function editDistrict(body: District & { _id: string }): Promise<string> {
  return apiPost<string>(`${base}/edit_district`, body)
}

export function deleteDistrict(body: { _id: string }): Promise<unknown> {
  return apiPost(`${base}/delete_district`, body)
}
