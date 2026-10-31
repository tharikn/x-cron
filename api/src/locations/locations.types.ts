export type LocationLevel = 'state' | 'district' | 'subdistrict';

export interface LocationSuggestion {
  id: string;
  name: string;
  label: string;
  level: LocationLevel;
  stateCode: string;
  stateName: string;
  districtCode?: string;
  districtName?: string;
}

export interface LgdState {
  code: string;
  name: string;
}

export interface LgdDistrict {
  code: string;
  name: string;
  state_code: string;
}

export interface LgdSearchHit {
  level: string;
  code: string;
  name: string;
  state_code: string;
  district_code?: string;
}
