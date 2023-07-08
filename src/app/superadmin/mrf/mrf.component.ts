import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';
import { ColDef } from 'ag-grid-community';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-mrf',
  templateUrl: './mrf.component.html',
  styleUrls: ['../../common.css', './mrf.component.css']
})
export class MrfComponent implements OnInit{
  isAdd: boolean = true
  isUpdate: boolean = false
  goodList:any=[]
  goodResponse:any
  subGoodResponse:any
  subgoodList:any=[]
  mrfGridList: any = []
  mrfGridResponse: any
  list: any = []
  goodsList: any = []
  goodsName: any
  subGoodsId:any
  mrfTrnsId:any
  mrfResponse:any
  mrfList:any
  responseData:any
  isActive:any
  selectionMode = "multiple";
  wcId : any = 0;
  constructor(private service:CommonService, private formBuilder:FormBuilder, private toastService: ToastService){
    this.wcId = localStorage.getItem('wcId')
    this.getList()
    this.getAllGoods()
     //this.getAllSubGoods() 
  }
  ngOnInit() {
    this.service.getAllMrf(parseInt(this.wcId)).subscribe(
     data => {
          this.mrfGridResponse = data
          this.mrfGridList = this.mrfGridResponse
          const rowDataMrf =   this.mrfGridList.map((item: { goods: any; wcId: any; interMaterial: any; mrfDesc: any; quntaum: any; subGood: any; createdDate: any; updateDate:any; }) => {
           
            return {
              wcName : item.wcId?.wcName,
              goods_name: item.goods.goodsName,
              sub_goods_name: item.subGood.subgoodsName,
              goods: item.goods.goodsPerKg,
              inert_material: item.interMaterial,
              quntaum: item.quntaum,
              description: item.mrfDesc,     
              created_date : item.createdDate
             
            };
          });
         // console.log("MrfGridList",this.mrfGridList)
         // console.log("rowData",rowDataMrf)
         this.rowDataMrf=rowDataMrf;
          
        
                // window.alert("Mrf data updated successfully!!")
                // this.isAdd = true
                // this.isUpdate = false
                // this.getList()
                // this.form.reset()
        

        // console.log(this.mrfList)
      }
    );
    this.getAllGoods()
  }
  form = new FormGroup({
    mrfTrnsId: new FormControl,
    goodsId: new FormControl('', [Validators.required]),
    goodssubId: new FormControl('', [Validators.required]),
    interMaterial: new FormControl('', [Validators.required]),
    mrfDesc: new FormControl(''),
    quntaum: new FormControl('', [Validators.required]),
    goods: new FormControl,
    subGood: new FormControl,
    isActive: new FormControl
  });
  editForm = new FormGroup({
    goodsId: new FormControl,
    subGoodId: new FormControl,
    interMaterial:new FormControl,
    mrfDescription: new FormControl,
    quntaum:new FormControl,
    goods: new FormControl,
    subGood: new FormControl
})
  getAllGoods(){
     this.service.getAllGoods(parseInt(this.wcId)).subscribe(
      data=>{
        // console.log('  goods res ::  ',data)
       this.goodResponse=data
       this.goodList=this.goodResponse
       //console.log(this.goodList)
      }
     );
  }
  getAllSubGoods(){
    this.service.getAllSubGood(parseInt(this.wcId)).subscribe(
      data=>{
        this.subGoodResponse=data
        //console.log(this.subGoodResponse)
        this.subgoodList=this.subGoodResponse
      }
    );
  }
  getAllSubGoodByGoodId(){
    // console.log(this.form.value.goodsId)
    this.service.getAllSubGoodByGoodId(this.form.value.goodsId).subscribe(
            data=>{
                    this.responseData=data
                    this.subgoodList = this.responseData   //this.responseData.data.sort((a: any, b: any) => a.subgoodsName - b.subgoodsName)
                    //this.form.value.goodsId=this.responseData.goods.goodId
                    //this.goodsName=this.responseData.goods.goodsName
                    // console.log(this.subgoodList)
            }
    );
}
  async getList() {
    try {
            let wcId = localStorage.getItem('role') != 'bmcadmin' ? this.wcId : 0
            this.list = await this.service.get(`/zone/getAllMrf/`+ wcId)
           // this.goodsList = await this.service.get(`/zone/getAllGoods`)
            //this.list = this.list.sort((a: any, b: any) => a.zoneName - b.zoneName)

    } catch (e) {
            console.error(e)
    }
}
  saveMrf(){

    if (this.form.status === 'INVALID') {
      if (!this.wcId) {
        this.toastService.showWarning('Wealth center is required. Please login again. ');
        return;
      }
      const goodsName = this.form.value.goodsId?.trim();
      if (!goodsName || goodsName === '') {
        this.toastService.showWarning('Goods name is required.');
        return;
      }
      const subGoodsName = this.form.value.goodssubId?.trim();
      if (!subGoodsName || subGoodsName === '') {
        this.toastService.showWarning('Sub-Goods name is required.');
        return;
      }
      const goodsWeight: any = this.form.value.quntaum;
      if ((goodsWeight != 0 && !goodsWeight) || goodsWeight === '') {
        this.toastService.showWarning('Goods weight is required.');
        return;
      }
      if (+goodsWeight < 0) {
        this.toastService.showWarning('Goods weight must be a valid number.');
        return;
      }
      const inertMaterial: any = this.form.value.interMaterial;
      if ((inertMaterial != 0 && !inertMaterial) || inertMaterial === '') {
        this.toastService.showWarning('Inert material is required.');
        return;
      }
      if (+inertMaterial < 0) {
        this.toastService.showWarning('Inert material must be a valid number.');
        return;
      }
      return;
    }

    const goods = this.goodList[this.goodList.findIndex((e: any) => e.goodsId == this.form.value.goodsId)]
    const subgoods = this.subgoodList[this.subgoodList.findIndex((e: any) => e.goodssubId == this.form.value.goodssubId)]
    const data = {
      "goods": goods,
      "interMaterial": this.form.value.interMaterial,
      "mrfDesc": this.form.value.mrfDesc,
      "quntaum": this.form.value.quntaum,
      "subGood": subgoods,
      "wcId":{
        "wcId":localStorage.getItem("wcId")
      }
   }
   // console.log(data)
   this.service.saveMrfData(data).subscribe(
    data=>{
      this.toastService.showSuccess("Mrf data saved successfully")
        this.mrfGridResponse = data
        this.mrfGridList = this.mrfGridResponse.data
        const rowDataMrf =   this.mrfGridList.map((item: { goods: any; wcId: any; interMaterial: any; mrfDesc: any; quntaum: any; subGood: any; createdDate: any; updateDate:any; }) => {
         
          return {
            goods_name: item.goods.goodsId,
            sub_goods_name: item.subGood.goodssubId,
            goods: item.goods,
            inert_material: item.interMaterial,
            description: item.mrfDesc,
            quntaum:item.quntaum,
            wcName : item.wcId?.wcName

          };
        });
       // console.log("MrfList",this.mrfGridList)
       // console.log("rowData",rowDataMrf)
       this.rowDataMrf=rowDataMrf;
        
      
              // window.alert("Mrf data updated successfully!!")
              // this.isAdd = true
              // this.isUpdate = false
              // this.getList()
              // this.form.reset()
      },
      error => {
        this.toastService.showError("something went wrong")
      }
    
   );   
   this.getList()
   this.form.reset()
  }
  getGoodId() {
    // console.log(this.form.value)
  }
  async remove(id: string) {
    try {
            const res = await this.service.delete(`/zone/deleteMrf/${id}`)
            this.getList()
    } catch (e) {
            console.error(e)
    }
}
onRowClicked(item:any){
  // alert('Grid row selected'+this.rowDataMrf);
}
updateData(item: any) {
 // alert('hi');
  this.isUpdate = true
  this.isAdd = false
  // console.log(item)
  // console.log(item.goodssubId)
  this.goodsName = item.goods.goodsName
  this.form.patchValue({
          goodsId: item.goods.goodsId,
          goodssubId: item.subGood.goodssubId,
          mrfTrnsId:item.mrfTrnsId,
          interMaterial: item.interMaterial,
          mrfDesc: item.mrfDesc,
          quntaum: item.quntaum,
          //goods: item.goods,
          //subGood:item.subGood,
          isActive: true
  })
  this.subGoodsId=item.goodssubId
  // this.service.getZoneAllData().subscribe(
  //         async data => {
  //                 this.goodsList = await this.service.get(`/zone/getAllGoods`)
  //         }
  // );

}
cancel() {
  this.isAdd = true
  this.isUpdate = false
  this.form.reset()
}

updateMrf() {
  // console.log("Form Value"+this.form.value)
  this.service.updateMrf(this.form.value).subscribe(
          data => {
            this.mrfGridResponse = data
            this.mrfGridList = this.mrfGridResponse.data
            const rowDataMrf =   this.mrfGridList.map((item: { goods: any; interMaterial: any; mrfDesc: any; quntaum: any; subGood: any; createdDate: any; updateDate:any; }) => {
             
              return {
                goods_name: item.goods.goodsId,
                sub_goods_name: item.subGood.goodssubId,
                goods: item.goods,
                inert_material: item.interMaterial,
                description: item.mrfDesc, 
                quntaum: item.quntaum    
                
              };
            });
           // console.log("MrfGridList",this.mrfGridList)
           // console.log("rowData",rowDataMrf)
           this.rowDataMrf=rowDataMrf;
            
          
                  // window.alert("Mrf data updated successfully!!")
                  // this.isAdd = true
                  // this.isUpdate = false
                  // this.getList()
                  // this.form.reset()
          },
          error => {
            this.toastService.showError("something went wrong")
          }
  );

}

/**
 * Code for Grid view
 */

columnDefs: ColDef[] = [
  { field: 'wcName', headerName: 'Wc Name', unSortIcon: true,resizable: true},
  { field: 'goods_name', headerName: 'Goods Name', unSortIcon: true,resizable: true},
  { field: 'sub_goods_name', headerName: 'Sub-Goods Name', unSortIcon: true,resizable: true},
  { field: 'quntaum', headerName: 'Goods (Kg)', unSortIcon: true,resizable: true},
  { field: 'inert_material', headerName: 'Inert Material', unSortIcon: true,resizable: true},
  { field: 'description', headerName: 'Description', unSortIcon: true,resizable: true},
  { field: 'created_date', headerName: 'Created Date', unSortIcon: true,resizable: true},
  { headerName: 'Edit', width: 125, sortable: false, filter: false,
    cellRenderer: (data: any) => {
     return `
      <button class="btn btn-primary btn-sm" (click)="this.updateData($event)">
        <i class="fa-solid fa-edit"></i>
      </button>
      <button class="btn btn-danger btn-sm">
        <i class="fa-solid fa-trash-alt"></i>
      </button>
     `; 
    }
  }
];

defaultColDef: ColDef = {
  sortable: true,
  filter: true,
};

gridOptions = {
  defaultColDef: {
    ...this.defaultColDef
  },
  pagination: true,
  paginationPageSize: 10,
  rowStyle: { background: '#e2e8f0' }
}

rowDataMrf = []
  ;
}


