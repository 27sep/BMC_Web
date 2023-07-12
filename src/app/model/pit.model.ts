export interface PitModel {
  code: number
  responseBody: ResponseBody[]
}

export interface ResponseBody {
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
  pitId: number
  pitUniqueId: string
  pitName: string
  wc: Wc
  mcc: Mcc
  pitStatus: PitStatus
  batch: number
  pitDesc: string
  pitCndSts: boolean
  pitCndStsStDt: string
  pitCndStsEndDt: string
  pitCndRemarks: any
  pitUserConfirm: boolean,
  daysCounter?:number
}

export interface Wc {
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
  wcId: number
  wcName: string
  wcDesc: string
  active: boolean
}

export interface Mcc {
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
  mccId: number
  mccName: string
  mccDesc: string
  wc: Wc2
  zoneId: ZoneId
  active: boolean
}

export interface Wc2 {
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
  wcId: number
  wcName: string
  wcDesc: string
  active: boolean
}

export interface ZoneId {
  createdBy: string
  createdDate: string
  updatedBy: string
  updatedDate: string
  zoneId: number
  zoneName: string
  zoneDesc: string
}

export interface PitStatus {
  pitConfigId: number
  pitConfigCode: string
  activityDesc: string
  minDay: number
  maxDay: number
  activityMsg: string
  activityColr: string
  isNotfEnable: number
  isEventNeeded: boolean
  releaseAction: string
  isHoldForScheduler: boolean
  holdForScheduler: boolean
}

export interface LoginReq {

  email: string;
  hasTermsChecked: boolean;
  password: string;


}

export interface PitInitModalReq {

  pitid: number;
  segregation: boolean;
  shreding: boolean;
  visualinspection: boolean;
  mixedenzyme: string;
  pitfillupstatus: string;
  filledGarbageWt: string;
  dateOfFirstFilling: string;
  filledgardbagewt: string;
  firstTurnDate: string;
  dateOfFirstMixedup: string;
  inertMaterialMxedQty: string;
  cocopeatMixedQty: string;
  secondTurnDate: string;
  totalCompostGen: string;
  compostDate: string;

}

export interface PitStageRoot {
  message: string
  code: number
  responseBody: PitStageBody
}

export interface PitStageBody {
  filledUpDate: string
  firstDayMixedUp: string
  firstTurnDate: string
  secondTurnDate: string
  compostingDate: string
}

  
export interface PitStageReq {
  pitId: Number
}


export interface PitHistoryReq {
  batchId: number
  pitId: number
}


export interface PitProcessMain {
  pitProcess: PitProcess
  pitHistory: PitHistory[]
}

export interface PitProcess {
  filledUpDate: string
  firstDayMixedUp: string
  firstTurnDate: string
  secondTurnDate: string
  compostingDate: string
}

export interface PitHistory {
  inertMapVal?: string
  code?: string
  mixedEnzyVal?: string
  cocopeatVal?: string
  filledWtGarbageVal?: string
}

export interface CodeValue {
  value?: string
  code?: string
}


export interface PitCounterInit {
  pitId: number
  counter: number
}

export interface pitPayload{
  payload : pitByMccId
}

export interface pitByMccId {
  mccId: number
}

export interface ReportGenerate {
  reportType: string
  type: string
  fromDate?: string
  toDate?: string
  wcId: number
  reportName: string
}
