import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { combineLatest, combineLatestWith, forkJoin } from "rxjs";
import { ReportGenerate } from "src/app/model/pit.model";
import { CommonService } from "src/app/service/common.service";
import { ReportService } from "src/app/service/report.service";
import { ToastService } from "src/app/service/toast.service";

@Component({
  selector: "app-dashboard-one",
  templateUrl: "./dashboard-one.component.html",
  styleUrls: ["../../common.css", "./dashboard-one.component.css"],
  providers: [DatePipe]
})
export class DashboardOneComponent {
  chart1: any;
  chart2: any;
  role: any = ''
  zoneList: any = []
  zoneSelectId: any = 0
  wcSelectId: any = 0
  wcList: any
  zoneId: any
  wcId: any
  issueItems: any[] = []
  instockItems: any[] = []
  purchaseItems: any[] = []
  responseData: any = {}
  reportRes: any

  inventoryToDate: string = "";
  inventoryFromDt: string = "";

  form = new FormGroup({
    'wcId': new FormControl('0', [Validators.required]),
    'fromDate': new FormControl((new Date())),
    'toDate': new FormControl((new Date())),
  });

  payloadInventory: ReportGenerate = {
    reportType: "INVENTORY",
    type: "MONTHLY",
    fromDate: this.form.value.fromDate?.toString(),
    toDate: this.form.value.toDate?.toString(),
    wcId: 0,
    reportName: "INVENTORY"
  }

  constructor(private service: CommonService, private toastService: ToastService, private reportService: ReportService,
    private datePipe: DatePipe) {
    this.role = localStorage.getItem('role');
  }

  ngOnInit() {
    this.getZones();
    // this.createChart1();
    // this.createChart2();
  }

  getZones() {
    try {
      this.service.getZoneAllData()
        .subscribe((response) => {
          if (this.role == 'bmcadmin') {
            this.zoneList = response
          } else if (this.role == 'wcuser') {
            let tempArr: any = []
            tempArr = response
            this.zoneList.push(tempArr.filter((temp: any) => temp.zoneId == localStorage.getItem('zoneId'))[0]);
            const e = new Event("change");
            const element = document.querySelector('#zoneId')
            element?.dispatchEvent(e);
          }

        });
    } catch (e) {
      console.error(e)
    }
  }

  getWcListByZoneId() {
    try {
      this.service.getWcListByZoneId(this.zoneSelectId)
        .subscribe((response: any) => {
          if (this.role == 'bmcadmin') {
            this.wcList = response.data
          } else if (this.role == 'wcuser') {
            let tempArr: any = []
            tempArr = response.data
            this.wcList.push(tempArr.filter((temp: any) => temp.wcId == localStorage.getItem('wcId'))[0])
            const e = new Event("change");
            const element = document.querySelector('#wcId')
            element?.dispatchEvent(e);
          }
        });
    } catch (e) {
      console.error(e)
    }
  }

  onZoneSelect(ev: any) {
    if(ev.target.value !== 'undefined'){
      this.zoneSelectId = ev.target.value
    }else{
      this.zoneSelectId = this.zoneList[0].zoneId;
    }
    this.wcList = []
    this.getWcListByZoneId();
  }

  onWcSelect(ev: any) {
    if(ev.target.value !== 'undefined'){
      this.wcSelectId = ev.target.value;
    }else{
      this.wcSelectId = this.wcList[0].wcId;
    }
    this.getInventoryReport();
  }

  getInventoryReport() {
    this.payloadInventory.wcId = this.wcSelectId
    this.payloadInventory.fromDate = this.fromDate
    this.payloadInventory.toDate = this.toDate
    if (this.fromDate != undefined && this.toDate != undefined) {
      try {
        this.reportService.getInventoryReport(this.payloadInventory)
          .subscribe((response) => {
            this.reportRes = response
            this.responseData = this.reportRes.response
            this.createChart2DataSet()
          });
      } catch (e) {
        console.error(e)
      }
    }
  }
  dataSetArr: any[] = []
  dataSetChatArr: any[] = []
  totalQuantityPurchased = 0
  issueItemsMap = new Map<string, number>();
  inStockMap = new Map<string, number>();
  purchaseMap = new Map<string, number>();
  totalIssueQuantity: number = 0;
  totalInStockQuantity: number = 0;

  createChart2DataSet() {
    this.totalQuantityPurchased = 0
    this.totalIssueQuantity = 0
    this.totalInStockQuantity = 0
    this.dataSetChatArr = []
    let chartModel = {
      'label': "",
      'data': [0],
      'backgroundColor': "#175CFF"
    }
    this.issueItems = this.reportRes.itemIssueNames
    this.instockItems = this.reportRes.itemInStockNames
    this.purchaseItems = this.reportRes.itemPurchaseNames
    this.issueItems.forEach(issueItem => {
      let issueStockObj = this.responseData.ISSUESTOCK._1
      for (var key in issueStockObj[issueItem.toString()]) {
        let item = issueStockObj[issueItem.toString()][key]['itemName']
        let quantity = issueStockObj[issueItem.toString()][key]['quantity']
        this.totalIssueQuantity = this.totalIssueQuantity + quantity
        if (this.issueItemsMap.has(item)) {
          this.issueItemsMap.set(item, this.issueItemsMap.get(item) + quantity)
        } else {
          this.issueItemsMap.set(item, quantity)
        }
      }
    })
    chartModel.label = 'Issue Stock Items'
    this.issueItems.forEach(issueItem => {
      this.dataSetArr.push(this.issueItemsMap.get(issueItem) != undefined ? this.issueItemsMap.get(issueItem) : 0)
    });
    chartModel.data = this.dataSetArr
    chartModel.backgroundColor = '#FF0069'
    this.dataSetChatArr.push(chartModel)
    //console.log(issueItemsMap)
    chartModel = {
      'label': "",
      'data': [0],
      'backgroundColor': "#175CFF"
    }
    this.instockItems.forEach(instockItem => {
      let inStockObj = this.responseData.INSTOCK._1
      for (var key in inStockObj[instockItem.toString()]) {
        let item = inStockObj[instockItem.toString()][key]['itemName']
        let quantity = inStockObj[instockItem.toString()][key]['quantity']
        this.totalInStockQuantity = this.totalInStockQuantity + quantity
        if (this.inStockMap.has(item)) {
          this.inStockMap.set(item, this.inStockMap.get(item) + quantity)
        } else {
          this.inStockMap.set(item, quantity)
        }
      }
    })
    this.dataSetArr = []
    chartModel.label = 'InStock Items'
    this.instockItems.forEach(stockItem => {
      this.dataSetArr.push(this.inStockMap.get(stockItem) != undefined ? this.inStockMap.get(stockItem) : 0)
    });
    chartModel.data = this.dataSetArr
    chartModel.backgroundColor = '#E5D05D'
    this.dataSetChatArr.push(chartModel)
    //console.log(inStockMap)
    chartModel = {
      'label': "",
      'data': [0],
      'backgroundColor': "#175CFF"
    }

    this.purchaseItems.forEach(purchaseItem => {
      let purchaseObj = this.responseData.PURCHASE._1
      for (var key in purchaseObj[purchaseItem.toString()]) {
        let item = purchaseObj[purchaseItem.toString()][key]['itemName']
        let quantity = purchaseObj[purchaseItem.toString()][key]['quantity']
        this.totalQuantityPurchased = this.totalQuantityPurchased + quantity
        if (this.purchaseMap.has(item)) {
          this.purchaseMap.set(item, this.purchaseMap.get(item) + quantity)
        } else {
          this.purchaseMap.set(item, quantity)
        }
      }
    })
    //console.log(purchaseMap)
    this.dataSetArr = []
    chartModel.label = 'Purchase Items'
    this.purchaseItems.forEach(purchaseItem => {
      this.dataSetArr.push(this.purchaseMap.get(purchaseItem) != undefined ? this.purchaseMap.get(purchaseItem) : 0)
    });
    chartModel.data = this.dataSetArr
    chartModel.backgroundColor = '#175CFF'
    this.dataSetChatArr.push(chartModel)
    ///console.log(inStockMap)
    chartModel = {
      'label': "",
      'data': [0],
      'backgroundColor': "#175CFF"
    }
    //console.log( this.dataSetChatArr)
    this.createChart2()
  }
  fromDate: any
  toDate: any
  fromDateChange(evt: any) {
    this.fromDate = evt.form.controls.fromDate.value
    this.getInventoryReport()
  }
  toDateChange(evt: any) {
    this.toDate = evt.form.controls.toDate.value
    this.getInventoryReport()
  }
  createChart1() {
    this.chart1 = new Chart("chart1", {
      type: "bar",
      data: {
        labels: ["Package", "Unsold", "Sold"],
        datasets: [
          {
            label: "In Kilograms (KGs)",
            data: [100, 50, 40],
            backgroundColor: ["#11A3F4", "#EC3323", "#15D980"],
            barThickness: 30,
          },
        ],
      },
      // plugins: [ChartDataLabels],
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: "white",
            },
          },
          y: {
            ticks: {
              color: "white",
            },
          },
        },
        color: "white",
        maintainAspectRatio: false
      },
    });
  }

  createChart2() {
    let currDt = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // this.form.controls['fromDate'].setValue(new Date());
    // this.form.controls['toDate'].setValue(new Date());
    this.inventoryFromDt =  this.inventoryToDate = currDt ?? "";
    if (this.chart2 != null && this.chart2 != undefined) {
      this.chart2.destroy()
    }
    this.chart2 = new Chart("chart2", {
      type: "bar",
      data: {
        labels: this.purchaseItems,
        datasets: this.dataSetChatArr
      },
      // plugins: [ChartDataLabels],
      options: {
        indexAxis: "x",
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: "white",
            },
            // stacked: true
          },
          y: {
            ticks: {
              color: "white",
            },
            // stacked: fal se
          },
        },
        color: "white",
        maintainAspectRatio: false,
        skipNull: true
      },
    });
  }
}
