import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable,Subscription, interval  } from 'rxjs';
import { CodeValue, PitCounterInit, PitHistory, PitHistoryReq, PitInitModalReq, PitModel, PitProcess, PitProcessMain, PitStageBody, PitStageReq, PitStageRoot, pitByMccId, pitPayload } from 'src/app/model/pit.model';
import { Header, PitInitModel, SubmitWorkflowPayload, UpdatePitStatusPayload } from 'src/app/model/pitInit.model';
import { ModalService } from 'src/app/service/modal.service';
import { PitService } from 'src/app/service/pit.service';
import { ModalComponent } from 'src/app/superadmin/mcc/pit-view/modal/modal.component';


@Component({
  selector: 'app-pit-view',
  templateUrl: './pit-view.component.html',
  styleUrls: ['../../../common.css', './pit-view.component.css']
})
export class PitViewComponent {

 //All modal status by var
  private updateSubscription: Subscription | undefined;
  pitmodalstatus : any = false;
  public inertMaterialVal:any=0.0;
  public jsonObject: any = {};
  public mapInput = new Map<any,any>();
  public responseforWorkflowstart : any;
  public activityModal : any =false;
  public activeNotification :any = '';
  public actionRequired:any=false;
  public clickedPitId : any=0;
  public clickedPit : any;
  public toPitToMixedUp : any=0;
  public activityMixedUpModal : any = false;
  public yellowPitarr : any[] = [];
  public pitClicked : any='';
  public pitMixStatus : Boolean=false;
  public pitHistoryStatus : Boolean=false;
  public mccId : number = 0;

  public responseBodyT: PitStageBody = {
    filledUpDate: '',
    firstDayMixedUp: '',
    firstTurnDate: '',
    secondTurnDate: '',
    compostingDate: ''
  }
  public allPitStages : PitStageRoot = {
    message: '',
    code: 0,
    responseBody: this.responseBodyT
  };
  public yellowPitModel : any = {
    "pitId":0,
    "pitName":""
  };
  allPitbyMcc : PitModel = {
     code: 0,
     responseBody: []
   }
 
   tabName: string = 'Pit View';
   showPitTabView: boolean = true;
   showTodayTaskView:boolean = false;
   commondialog:boolean =true;
   isEventNeeded :boolean =false;

   displayPopover() {
    const popoverItem = document.querySelector('.popover-item') as HTMLDivElement;
    popoverItem.classList.toggle('show');
  }

  public pitAllStages:PitStageReq =   {
    pitId: 0
  }

  public submitToWorkflowPayload: SubmitWorkflowPayload = {
   payload:{
     wcId: 1,
     mccId: '1',
     pitId: '0',
     pitProcessStatus: '1',
     isFilledup: true
   }
  }
  public updatePitStatusPayload: UpdatePitStatusPayload =   {
    payload: {
      pitId: '',
      pitStatus: '',
      pitFrom: '',
      pitTo: ''
    }
  }

  public pitInitModalReq : PitInitModalReq = {
    pitid: 0,
    segregation: false,
    shreding: false,
    visualinspection: false,
    mixedenzyme: '',
    pitfillupstatus: '',
    filledGarbageWt: '',
    dateOfFirstFilling: '',
    filledgardbagewt: '',
    firstTurnDate: '',
    dateOfFirstMixedup: '',
    inertMaterialMxedQty: '',
    cocopeatMixedQty: '',
    secondTurnDate: '',
    totalCompostGen: '',
    compostDate: ''
  }

  public header : Header ={
    appName: '',
    wfLoginToken: ''
  }
  public pitInitModal : PitInitModel = {
    inertMaterial: 0,
    mixedEnzymeWt: '',
    cocopeat: '',
    filledGarbageWt: '',
    isFilledUp: false,
    mixedEnzyme: false,
    segregation: false,
    shreading: false,
    tranferToPit: false,
    visuaInspection: false,
    totalgarbagewt: '',
    noWorkflow: false
  }
 
 public responsePitenzyme : any;
 
  
  constructor(private pitService: PitService,
    protected modalService: ModalService,
    private toastr: ToastrService,
    private route:Router
   ) {
    this.pitPayload.payload.mccId = this.mccId;  
  }

  form = new FormGroup({
    segregationCrt: new FormControl,
    shreadingCrt: new FormControl,
    visualInspectionCrt: new FormControl,
    transfertoPITCrt: new FormControl,
    pitFillupStatusCrt: new FormControl,
    mixedEnzymeWtCrt: new FormControl,
    filledGarbageWtCrt: new FormControl,
    cocopeatCrt: new FormControl,
    inertMaterialCrt: new FormControl,
    totalCompostGen:new FormControl,
    batchIdVal:new FormControl,
    pitIdVal:new FormControl,
    stageCodeVal:new FormControl
  });

  formhistory = new FormGroup({
    fillingDtId: new FormControl,
    mixingDtId: new FormControl,
    firstTurnDtId: new FormControl,
    secondTurnDtId: new FormControl,
    inertFillingMtFormId: new FormControl,
    inertMixingMtFormId: new FormControl,
    inertFirstTurnMtFormId: new FormControl,
    inertSecondTurnMtFormId: new FormControl,
    mixedEnzymeFillingForm: new FormControl,
    mixedEnzymeMixingForm: new FormControl,
    mixedEnzymeFirstTurnForm: new FormControl,
    mixedEnzymeSecondTurnForm: new FormControl,
    cocopeatFillingForm: new FormControl,
    cocopeatMixingForm: new FormControl,
    cocopeatFirstTurnForm: new FormControl,
    cocopeatSecondTurnForm: new FormControl,
    filledGarbageFillingForm: new FormControl,
    filledGarbageMixingForm: new FormControl,
    filledGarbageFirstTurnForm: new FormControl,
    filledGarbageSecondTurnForm: new FormControl,
    expectedDateOfCompostForm: new FormControl,
    totalCompostForm: new FormControl,
    pitIdForm: new FormControl,
    batchIdForm: new FormControl
  });

  pitByMcc : pitByMccId = {
    mccId: 0
  }

  pitPayload : pitPayload = {
    payload: this.pitByMcc
  }
  subscriptions:Subscription[] = [];
  ngOnInit(): void {
      this.pitService.selectMccId.subscribe( (val) => {
        this.mccId = val;
        this.pitPayload.payload.mccId = this.mccId;
        this.onRefresh();
        this.getPitStageDetails();
      });
    this.updateSubscription = interval(10000).subscribe(
      (val) => { this.onRefresh()});
  }

  ngOnDestroy(){
    this.mccId = 0;
 //   this.updateSubscription?.unsubscribe();
 //   this.pitService.selectMccId?.unsubscribe();
  }
  greaterThan(pit : any){
    if(pit.daysCounter >= 0){
       return true;
    }
    return false;
  }

  onRefresh(){
      this.pitPayload.payload.mccId = this.mccId;
        this.pitService
          .getAllPitsByMcc(this.pitPayload)
          .subscribe((response) => (this.allPitbyMcc = response));

  }

  getPitStageDetails(){
    this.pitService
      .getAllPitStagesStatus(this.pitAllStages)
      .subscribe((response) => (this.allPitStages = response));
  }


  closePitActivityModalstatus(){
    this.pitmodalstatus =false;
    this.yellowPitarr=[];
   this.isEventNeeded = false;
    this.form.reset();
  }

  onAlertClick(){
    this.convertMaptoJson();
    this.modalService.close();
  }

  onSubmitNewModalForViewHistory(pit : any){
    console.log(" PIT ::::    ",pit.pitId );
    this.pitAllStages.pitId = pit.pitId
    this.getPitStageDetails();


  }
  pitName : string = '';
  showPitHistoryModal(pit : any){
    this.pitName = pit.pitName;
    this.pitHistoryStatus=true;
  }

  pitHistoryReq : PitHistoryReq={
    batchId: 0,
    pitId: 0
  }

   pitProcessObj:PitProcess={
     filledUpDate: '',
     firstDayMixedUp: '',
     firstTurnDate: '',
     secondTurnDate: '',
     compostingDate: ''
   } 
   pitHistory: PitHistory[] = [{
    inertMapVal: '',
    code: '',
    mixedEnzyVal: '',
    cocopeatVal: '',
    filledWtGarbageVal: ''
   }]
    public pitProcessMain : PitProcessMain = {
      pitProcess: this.pitProcessObj,
      pitHistory: this.pitHistory
    }
    inertMapFill:CodeValue={
      value: '',
      code: ''
    }
    inertMapMix:CodeValue={
      value: '',
      code: ''
    }
    inertMapFirstTurn:CodeValue={
      value: '',
      code: ''
    }
    inertMapSecond:CodeValue={
      value: '',
      code: ''
    }

    onCloseOfHistory(){
      this.pitHistoryStatus=false;
      this.expectedTrMix=false;
      this.expectedTrFirstTurn=false;
      this.expectedTrSecondTurn=false;
      this.formhistory.reset();
    }

    expectedTrMix:Boolean=false;
    expectedTrFirstTurn:Boolean=false;
    expectedTrSecondTurn:Boolean=false;

  onFetchPitHistoryDetails(pit :any){
    this.pitName = pit.pitName;
    this.pitHistoryReq.pitId = pit.pitId;
    this.pitHistoryReq.batchId = pit.batch;
    console.log( pitNoActionStatusEnum.PIT_EMPTY_GARBAGE_COL_NOT_STARTED.toString()+" *****  PIT ******** :: {} ",pit.pitStatus.pitConfigCode.toString() );
    if( pit.pitStatus.pitConfigCode.toString() == pitNoActionStatusEnum.PIT_EMPTY_GARBAGE_COL_NOT_STARTED.toString() || 
        pit.pitStatus.pitConfigCode.toString() == pitNoActionStatusEnum.PIT_EMPTY_AFTER_MIXED_UP.toString() ||
        pit.pitStatus.pitConfigCode.toString() == pitNoActionStatusEnum.PIT_UNDER_MAINTENANCE.toString() ||
        pit.pitStatus.pitConfigCode.toString() == pitNoActionStatusEnum.PIT_GARBAGE_COLLECT.toString() ){
        this.toastr.success('','   No information available in this stage. ' , {positionClass:'toast-center-center'});
       return;
    }

    this.pitService
        .onFetchPitHistoryDetails(this.pitHistoryReq)
        .subscribe((response) => {
        //  console.log('Main pit process {} ',response);
          this.pitProcessMain = response;
        //  this.formhistory.controls.expectedDateOfCompostForm.setValue('hiiiiiiiiiiiii');
          this.formhistory.controls.fillingDtId.setValue(this.pitProcessMain.pitProcess.filledUpDate);
         
         if(this.pitProcessMain.pitProcess.firstDayMixedUp.toString().includes('E.D:')){
          this.expectedTrMix=true;
          this.formhistory.controls.mixingDtId.setValue(this.pitProcessMain.pitProcess.firstDayMixedUp.toString().replace('E.D:',''));
         }else{
          this.formhistory.controls.mixingDtId.setValue(this.pitProcessMain.pitProcess.firstDayMixedUp.toString());
         }
         if(this.pitProcessMain.pitProcess.firstTurnDate.toString().includes('E.D:')){
          this.expectedTrFirstTurn = true;
          this.formhistory.controls.firstTurnDtId.setValue(this.pitProcessMain.pitProcess.firstTurnDate.toString().replace('E.D:',''));
         }else{
          this.formhistory.controls.firstTurnDtId.setValue(this.pitProcessMain.pitProcess.firstTurnDate.toString());
         }
         if(this.pitProcessMain.pitProcess.secondTurnDate.toString().includes('E.D:')){
          this.expectedTrSecondTurn = true;
          this.formhistory.controls.secondTurnDtId.setValue(this.pitProcessMain.pitProcess.secondTurnDate.toString().replace('E.D:',''));
         }else{
          this.formhistory.controls.secondTurnDtId.setValue(this.pitProcessMain.pitProcess.secondTurnDate.toString());
         }
          
        // console.log('  Final Compost Date {} : ', this.pitProcessMain.pitProcess.compostingDate);
         if(this.pitProcessMain.pitProcess.compostingDate.toString().includes('E.D:')){
          this.formhistory.controls.expectedDateOfCompostForm.setValue(this.pitProcessMain.pitProcess.compostingDate.toString().replace('E.D:',''));
         }else{
          this.formhistory.controls.expectedDateOfCompostForm.setValue(this.pitProcessMain.pitProcess.compostingDate.toString());
         }
         

         this.pitProcessMain.pitHistory.forEach((pitHis) =>{
            if(pitHis.code == 'PIT_STATUS_FILL_UP_1_2D'){
              if(pitHis.inertMapVal != undefined){
                this.formhistory.controls.inertFillingMtFormId.setValue(pitHis.inertMapVal);
              }
              if(pitHis.mixedEnzyVal != undefined){
                this.formhistory.controls.mixedEnzymeFillingForm.setValue(pitHis.mixedEnzyVal);
              }
              if(pitHis.cocopeatVal != undefined){
                this.formhistory.controls.cocopeatFillingForm.setValue(pitHis.cocopeatVal);
              }
              if(pitHis.filledWtGarbageVal != undefined){
                this.formhistory.controls.filledGarbageFillingForm.setValue(pitHis.filledWtGarbageVal);
              }
            
            }else if(pitHis.code == 'PIT_STATUS_MIXUP_6_8D_COMPLETE'){

              if(pitHis.inertMapVal != undefined){
                this.formhistory.controls.inertMixingMtFormId.setValue(pitHis.inertMapVal);
              }
              if(pitHis.mixedEnzyVal != undefined){
                this.formhistory.controls.mixedEnzymeMixingForm.setValue(pitHis.mixedEnzyVal);
              }
              if(pitHis.cocopeatVal != undefined){
                this.formhistory.controls.cocopeatMixingForm.setValue(pitHis.cocopeatVal);
              }
              if(pitHis.filledWtGarbageVal != undefined){
                this.formhistory.controls.filledGarbageMixingForm.setValue(pitHis.filledWtGarbageVal);
              }

            }else if(pitHis.code == 'PIT_MIXUP_14_16D_COMPLETE'){

              if(pitHis.inertMapVal != undefined){
                this.formhistory.controls.inertFirstTurnMtFormId.setValue(pitHis.inertMapVal);
              }
              if(pitHis.mixedEnzyVal != undefined){
                this.formhistory.controls.mixedEnzymeFirstTurnForm.setValue(pitHis.mixedEnzyVal);
              }
              if(pitHis.cocopeatVal != undefined){
                this.formhistory.controls.cocopeatFirstTurnForm.setValue(pitHis.cocopeatVal);
              }
              if(pitHis.filledWtGarbageVal != undefined){
                this.formhistory.controls.filledGarbageFirstTurnForm.setValue(pitHis.filledWtGarbageVal);
              }

            }else if(pitHis.code == 'PIT_MIXUP_21_22D_COMPLETE'){

              if(pitHis.inertMapVal != undefined){
                this.formhistory.controls.inertSecondTurnMtFormId.setValue(pitHis.inertMapVal);
              }
              if(pitHis.mixedEnzyVal != undefined){
                this.formhistory.controls.mixedEnzymeSecondTurnForm.setValue(pitHis.mixedEnzyVal);
              }
              if(pitHis.cocopeatVal != undefined){
                this.formhistory.controls.cocopeatSecondTurnForm.setValue(pitHis.cocopeatVal);
              }
              if(pitHis.filledWtGarbageVal != undefined){
                this.formhistory.controls.filledGarbageSecondTurnForm.setValue(pitHis.filledWtGarbageVal);
              }


              }

           });

           this.pitHistoryStatus=true;

        });
  }

  // aSubmit  for init workflow...............
  onSubmitRequestForInit( statusCode : string , status : boolean){

   this.pitInitModal.cocopeat = this.form.controls.cocopeatCrt.value;
   this.pitInitModal.filledGarbageWt = this.form.controls.filledGarbageWtCrt.value;
   this.pitInitModal.inertMaterial = this.form.controls.inertMaterialCrt.value;
   this.pitInitModal.mixedEnzymeWt = this.form.controls.mixedEnzymeWtCrt.value;
   this.pitInitModal.batchId = this.form.controls.batchIdVal.value;
   this.pitInitModal.pitId = this.form.controls.pitIdVal.value;
   if (!this.pitInitModal.header) {
    this.pitInitModal.header = {appName: '', wfLoginToken: ''};
   }
   this.pitInitModal.header.appName='BMC-APP';
   this.pitInitModal.header.wfLoginToken = '';
   this.pitInitModal.isFilledUp = this.form.controls.filledGarbageWtCrt.value;
   this.pitInitModal.segregation = this.form.controls.segregationCrt.value;
   this.pitInitModal.shreading = this.form.controls.shreadingCrt.value;
   this.pitInitModal.tranferToPit = this.form.controls.transfertoPITCrt.value;
   this.pitInitModal.visuaInspection = this.form.controls.visualInspectionCrt.value;
  

   if(this.pitInitModal.isFilledUp == true){
      this.pitInitModal.stageCode = pitNoActionStatusEnum.PIT_STATUS_FILL_UP_1_2D.toString();
      this.pitInitModal.stageCode = statusCode;
   }
  // console.log('onSubmitRequestForInit ###########   {} ',this.form.controls.pitIdVal.value);
  // console.log( this.form.controls.transfertoPITCrt.value+'    onSubmitRequestForInit ###########   {} ',this.form.controls.pitIdVal.value);
  // console.log('onSubmitRequestForInit ###########   {} ',this.pitInitModal);
 
   if(!status){
    this.pitInitModal.noWorkflow = true;
   }else{
    this.pitInitModal.noWorkflow = false;
   }
  

    if(this.pitInitModal.filledGarbageWt == undefined || this.pitInitModal.filledGarbageWt == ''){
         this.toastr.error('Error!','   Please fill garbage wt.... ' , {positionClass:'toast-center-center'});
         return;
    }

    const headerDict = {
      'appName': 'BMC-APP',
      'wfToken': localStorage.getItem('access_token')
    }

      this.pitService
        .savePitInitForCompost(this.pitInitModal , headerDict)
        .subscribe((response) => {
          this.responsePitenzyme = response;
          this.toastr.success('Success!','Successsfully Saved.. Now Composting process started' , {positionClass:'toast-center-center'});
          this.closePitmodalstatus();
          this.form.reset();
          this.onRefresh();
         }, 
          error => {
            console.log(error);
            if(error.error.code == HttpStatusCode.BadRequest){
              this.toastr.error('Error!',error.error.message , {positionClass:'toast-center-center'});
              this.form.reset();
            };
          });
   //     console.log('Successs Saved Enzyme process.  {} ', this.responsePitenzyme);
     
  }



  // Submit of  init workflow...............
  onSubmitToWorkflow(){
 //   console.log('Request Send before Submit to Workflow process.{} ',this.submitToWorkflowPayload);
 //   console.log('Clicked pit ID  ', this.clickedPitId);
    this.submitToWorkflowPayload.payload.pitId= this.clickedPitId;
    this.pitService
      .submitRequestForBatchBeforeCompost(this.submitToWorkflowPayload)
      .subscribe((response) => (this.responseforWorkflowstart = response));
 //     console.log('Now Workflow process started');
      //this.toastr.success('Success!','Successsfully Saved.. Now Composting process started' , {positionClass:'toast-center-center'});
      this.onRefresh();
  }

    /**
   * Function onActiveStatusChange
   * @param evt 
   */
    public onActiveStatusChange(evt: any,action: any) {
      console.log(evt.target.value);
      evt.target.value == 'on' ? this.mapInput.set(action,true) : this.mapInput.set(action,false);
      console.log('Mapintput for enzyme : {} ',this.mapInput);
    }

    public convertMaptoJson() : String{
      this.mapInput.forEach((value, key) => {
        this.jsonObject[key] = value;
      });
      console.log(JSON.stringify(this.jsonObject));
      let jsonReq = JSON.stringify(this.jsonObject);
      return jsonReq;
    }

    public setterDataToMap(inMap : any, key : String , value :String) : any{
      inMap.set(key , value);
      return inMap;
    }
   
    private getterMap() : any{
         return this.mapInput;
    }

    pitFromId : string = "0";
    pitToPit : string ="0";
    pitidUpdateOnAny : string = "0";
    pitStatusOverwrite : string ="0";

    public showPitmodalstatus(pit : any) {
      console.log(" PIT ::::    ",pit);
      this.pitAllStages.pitId = pit.pitId;
      this.form.controls.batchIdVal.setValue(pit.batchId);
      this.form.controls.pitIdVal.setValue(pit.pitId);

      this.getPitStageDetails();
      this.activeNotification = pit.pitStatus.activityMsg;
      this.pitFromId = pit.pitId ;
      this.clickedPitId = pit.pitId;
      this.actionRequired = pit.pitStatus.isEventNeeded;
      this.clickedPit = pit;
      this.pitidUpdateOnAny = pit.pitId;
      this.pitMixStatus = false;
      
     if(pit.pitStatus.pitConfigCode == "PIT_EMPTY_GARBAGE_COL_NOT_STARTED"){
      this.pitmodalstatus = true;

     }else if(pit.pitStatus.pitConfigCode == "PIT_GARBAGE_COLLECT"){
      this.pitmodalstatus = true;
     }else if(pit.pitStatus.pitConfigCode == "PIT_EMPTY_AFTER_MIXED_UP"){
      this.pitmodalstatus = false;
     }else if(pit.pitStatus.pitConfigCode == "PIT_COMPOST_DONE"){
      this.pitmodalstatus = false;
     }else if(pit.pitStatus.pitConfigCode == "PIT_STATUS_MIXUP_6_8D_COMPLETE"){
      this.pitMixStatus =true;
      console.log(" On alett click innnnnn {} {} ",pit , this.pitMixStatus);
      this.collectAllYellowPits();
     }else if(pit.pitStatus.isNotfEnable == 1 ){
      this.pitmodalstatus = false;
     }else if(pit.pitStatus.pitConfigCode == "PIT_MIXUP_14_16D_COMPLETE"){
          this.pitStatusOverwrite="4"
          this.form.controls['stageCodeVal'].setValue("PIT_MIXUP_14_16D_COMPLETE");
     }else if(pit.pitStatus.pitConfigCode == "PIT_MIXUP_21_22D_COMPLETE"){
          this.pitStatusOverwrite= "5";
          this.form.controls['stageCodeVal'].setValue("PIT_MIXUP_21_22D_COMPLETE");
     }else if(pit.pitStatus.pitConfigCode == "PIT_COMPOST_DONE"){
          this.pitStatusOverwrite= "6";
          this.form.controls['stageCodeVal'].setValue("PIT_COMPOST_DONE");
     }else if(pit.pitStatus.pitConfigCode == pitNoActionStatusEnum.PIT_STATUS_FILL_UP_1_2D){
          this.form.controls['stageCodeVal'].setValue(pitNoActionStatusEnum.PIT_STATUS_FILL_UP_1_2D);
    }

    console.log('  MIX STATUS : :::::::::::      ',this.pitMixStatus);
    if(pit.pitStatus.pitConfigCode == "PIT_STATUS_MIXUP_6_8D_COMPLETE" || pit.pitStatus.pitConfigCode == "PIT_MIXUP_14_16D_COMPLETE" 
                              || pit.pitStatus.pitConfigCode == "PIT_MIXUP_21_22D_COMPLETE" ||  pit.pitStatus.pitConfigCode == "PIT_EMPTY_GARBAGE_COL_NOT_STARTED"  
                              || pit.pitStatus.pitConfigCode == "PIT_STATUS_FILL_UP_1_2D" || pit.pitStatus.pitConfigCode == "PIT_COMPOST_DONE"){
                                this.isEventNeeded = true;    
    }
    if(pit.pitStatus.pitConfigCode != pitCheckerEnum.PIT_STATUS_MIXUP_6_8D_INPROCESS.toString() 
       &&  pit.pitStatus.pitConfigCode != pitCheckerEnum.PIT_MIXUP_14_16D_INPROCESS.toString()
       &&  pit.pitStatus.pitConfigCode != pitCheckerEnum.PIT_MIXUP_21_22D_INPROCESS.toString()){
         this.openPitmodalstatus();
    }else{
      this.toastr.success('', ' pit process is in progress ',  {positionClass:'toast-center-center'});
    }

 }
 

    
     
    

   
  
    public closePitmodalstatus() {
      this.pitmodalstatus = false;
      this.yellowPitarr=[];
    }

    
    public openPitmodalstatus() {
      this.pitmodalstatus = true;
    }


    public closePitMixedUpModalstatus() {
      //  this.activityMixedUpModal = false;
      this.yellowPitarr = [];
    }


    public collectAllYellowPits(){
      
      console.log('PIT Clikced   {}  {}  ' + this.clickedPit.pitId ,  this.clickedPitId);
      this.allPitbyMcc.responseBody.forEach( (pit)=> {
        if(pit.pitStatus.pitConfigCode == 'PIT_STATUS_MIXUP_6_8D_COMPLETE'){
          this.yellowPitModel = {
            "pitId":0,
            "pitName":""
          };
          if(this.clickedPit.pitId != pit.pitId){
            this.yellowPitModel.pitId = pit.pitId;
            this.yellowPitModel.pitName = pit.pitName;
            this.yellowPitarr.push(this.yellowPitModel);
          }
          console.log(' mix stag ',this.yellowPitModel)
        } 
      })
    }
    
    originalVal : number = 0;
    comparedselectedVal : number = 0;
    getSelected(ev: any) {
      this.originalVal = ev.target.value;
       this.pitToPit = ev.target.value,true;
      this.getSelectedPit(ev.target.value,true);
      return ev.target.value;
    }


    public getSelectedPit(pit:any,mixedUp :Boolean){
       console.log(" Test Yellow pits : " , this.yellowPitarr);
      if(this.originalVal == 0){
         
          console.log('Either User has not selected any vallue from dropdown or there is one element in dropdown to be selected bydefault');
          pit.pitId =   this.yellowPitarr[0].pitId;
          this.pitToPit = this.yellowPitarr[0].pitId;
      }
      console.log(mixedUp+" Selected pit to mix {} ::   {} ::  {}  :: {} ", this.toPitToMixedUp , pit.pitId,this.clickedPit );
      this.toPitToMixedUp = pit.pitId;
      console.log(this.clickedPit.pitStatus.pitConfigCode);
      if(this.clickedPit.pitStatus.pitConfigCode =='PIT_STATUS_MIXUP_6_8D_COMPLETE'){
        console.log('111111111');
        this.form.controls.pitIdVal.setValue(this.pitToPit);
        this.updatePitStatusPayload.payload.pitTo =  this.pitToPit ;
        this.updatePitStatusPayload.payload.pitFrom = this.pitFromId;
        this.updatePitStatusPayload.payload.pitId = this.clickedPitId;
        this.updatePitStatusPayload.payload.pitStatus= this.clickedPit.pitStatus.pitConfigId;
      }else{
 
      
        this.updatePitStatusPayload.payload.pitTo = '';
        this.updatePitStatusPayload.payload.pitFrom = '';
        this.updatePitStatusPayload.payload.pitId = this.pitidUpdateOnAny;
        this.updatePitStatusPayload.payload.pitStatus=  this.pitStatusOverwrite;
      }
      console.log(" REQ OBJ :: {}  ", this.updatePitStatusPayload.payload);
  }


  //Submit for PIT Status update.................................
  public onSubmitPitUpdateStatusRequest(){
    console.log('onSubmitPitUpdateStatusRequest.{} ', this.updatePitStatusPayload);
    this.pitService
      .updateRequestForStatusUpdate(this.updatePitStatusPayload)
      .subscribe((response) => (this.responseforWorkflowstart = response));
      console.log('PIT Status Update{} ', this.responseforWorkflowstart);
      this.toastr.success('Success!','PIT Status Update Successfully' , {positionClass:'toast-center-center'});
      this.closePitmodalstatus();
      this.onRefresh();

      this.pitToPit="0";
      this.pitFromId="0";
  }


  // hanld esingle button click for different event of action in PIT process...
  public executeUpdateStatusByPitCurrentStatus(){
   console.log("action event  :::  current status of pit{} ",  this.clickedPit , this.clickedPit.pitStatus.pitConfigCode);
     if(this.clickedPit.pitStatus.pitConfigCode == 'PIT_STATUS_MIXUP_6_8D_COMPLETE'){
      this.activityMixedUpModal = true;
      this.onSubmitRequestForInit(this.clickedPit.pitStatus.pitConfigCode,false);
      this.onSubmitPitUpdateStatusRequest();
    }else if(this.clickedPit.pitStatus.pitConfigCode == 'PIT_MIXUP_14_16D_COMPLETE'){
      
      this.pitStatusOverwrite = "4";
      this.updatePitStatusPayload.payload.pitId=this.pitidUpdateOnAny;
      this.updatePitStatusPayload.payload.pitStatus = this.pitStatusOverwrite;
      this.onSubmitRequestForInit(this.clickedPit.pitStatus.pitConfigCode,false);
      this.onSubmitPitUpdateStatusRequest();
    }else if(this.clickedPit.pitStatus.pitConfigCode == 'PIT_MIXUP_21_22D_COMPLETE'){
    
      this.pitStatusOverwrite = "5";
      this.updatePitStatusPayload.payload.pitId=this.pitidUpdateOnAny;
      this.updatePitStatusPayload.payload.pitStatus = this.pitStatusOverwrite;
      this.onSubmitRequestForInit(this.clickedPit.pitStatus.pitConfigCode,false);
      this.onSubmitPitUpdateStatusRequest();
    }else if(this.clickedPit.pitStatus.pitConfigCode == 'PIT_COMPOST_DONE'){
      this.pitStatusOverwrite = "6";
      this.updatePitStatusPayload.payload.pitId=this.pitidUpdateOnAny;
      this.updatePitStatusPayload.payload.pitStatus = this.pitStatusOverwrite;
      this.onSubmitPitUpdateStatusRequest();
    }else if(this.clickedPit.pitStatus.pitConfigCode == 'PIT_EMPTY_GARBAGE_COL_NOT_STARTED'){
        console.log("action event  ");
        this.onSubmitRequestForInit(this.clickedPit.pitStatus.pitConfigCode,true);
    }

    this.closePitmodalstatus();
  }

  public showPitView(){
    this.showPitTabView = true;
    this.showTodayTaskView = false;
    this.tabName = "Pit View"
      }
    
 public showTodayTask(){
        this.showPitTabView = false;
        this.showTodayTaskView = true;
        this.tabName = "Today Task"
  }


}

export enum pitNoActionStatusEnum{
  PIT_STATUS_FILL_UP_1_2D = "PIT_STATUS_FILL_UP_1_2D",
  PIT_EMPTY_GARBAGE_COL_NOT_STARTED = "PIT_EMPTY_GARBAGE_COL_NOT_STARTED",
  PIT_EMPTY_AFTER_MIXED_UP = "PIT_EMPTY_AFTER_MIXED_UP",
  PIT_COMPOST_DONE = "PIT_COMPOST_DONE",
  PIT_GARBAGE_COLLECT = "PIT_GARBAGE_COLLECT",
  PIT_UNDER_MAINTENANCE = "PIT_UNDER_MAINTENANCE"
}

export enum pitInitStatus{
  PIT_EMPTY_GARBAGE_COL_NOT_STARTED = "PIT_EMPTY_GARBAGE_COL_NOT_STARTED",
  PIT_COMPOST_DONE = "PIT_COMPOST_DONE",
  PIT_GARBAGE_COLLECT = "PIT_GARBAGE_COLLECT",
  PIT_UNDER_MAINTENANCE = "PIT_UNDER_MAINTENANCE"
}

export enum pitWorkflowEnum{
  PIT_STATUS_MIXUP_6_8D_COMPLETE = "PIT_STATUS_MIXUP_6_8D_COMPLETE",
  PIT_COMPOST_DONE = "PIT_COMPOST_DONE",
  PIT_MIXUP_14_16D_COMPLETE = "PIT_MIXUP_14_16D_COMPLETE",
  PIT_MIXUP_21_22D_COMPLETE = "PIT_MIXUP_21_22D_COMPLETE"
}

export enum pitCounterNegEnum{
  PIT_EMPTY_GARBAGE_COL_NOT_STARTED = "PIT_EMPTY_GARBAGE_COL_NOT_STARTED",
  PIT_EMPTY_AFTER_MIXED_UP = "PIT_EMPTY_AFTER_MIXED_UP",
  PIT_COMPOST_DONE = "PIT_COMPOST_DONE",
  PIT_GARBAGE_COLLECT = "PIT_GARBAGE_COLLECT"
}

export enum pitCheckerEnum{
  PIT_STATUS_FILL_UP_1_2D = "PIT_STATUS_FILL_UP_1_2D",
  PIT_STATUS_MIXUP_6_8D_COMPLETE = "PIT_STATUS_MIXUP_6_8D_COMPLETE",
  PIT_MIXUP_14_16D_COMPLETE = "PIT_MIXUP_14_16D_COMPLETE",
  PIT_MIXUP_21_22D_COMPLETE = "PIT_MIXUP_21_22D_COMPLETE",
  PIT_STATUS_MIXUP_6_8D_INPROCESS = "PIT_STATUS_MIXUP_6_8D_INPROCESS",
  PIT_MIXUP_14_16D_INPROCESS = "PIT_MIXUP_14_16D_INPROCESS",
  PIT_MIXUP_21_22D_INPROCESS = "PIT_MIXUP_21_22D_INPROCESS"

}