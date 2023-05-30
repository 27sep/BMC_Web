export interface PitInitModel {
    inertMaterial: number
    mixedEnzymeWt?: string
    cocopeat?: string
    filledGarbageWt?: string
    totalgarbagewt?: string
    isFilledUp?: boolean
    mixedEnzyme?: boolean
    segregation?: boolean
    shreading?: boolean
    tranferToPit?: boolean
    visuaInspection?: boolean,
    batchId ?: Number,
    pitId ?: Number,
    stageCode ?: string,
    noWorkflow? :boolean
  }

  export interface SubmitWorkflowPayload {
    payload:Payload               
  }

  export interface Payload {
    wcId:number;
    mccId:string;
    pitId: string;
    pitProcessStatus:string;
    isFilledup: Boolean;
  }

  export interface UpdatePitStatusPayload {
    payload:PayloadUpdateStatus               
  }

  export interface PayloadUpdateStatus {
    pitId: string;
    pitStatus:string;
    pitFrom: string;
    pitTo:string;
  }