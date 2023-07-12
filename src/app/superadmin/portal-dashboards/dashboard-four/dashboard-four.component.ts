import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Chart, { scales } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ReportGenerate } from 'src/app/model/pit.model';
import { CommonService } from 'src/app/service/common.service';
import { ReportService } from 'src/app/service/report.service';

@Component({
  selector: 'app-dashboard-four',
  templateUrl: './dashboard-four.component.html',
  styleUrls: ['../../../common.css', './dashboard-four.component.css']
})
export class DashboardFourComponent implements OnInit {
  
  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  chart5: any;
  role: any = ''
  loginResponse: any
  mrfReportList: any = []
  zoneList: any = []
  zoneSelectId: any = 0
  wcSelectId: any = 0
  wcList: any = []
  zoneId: any
  wcId: any
  zoneName:any
  wcName:any
  dashboardResponseV2:any
  inventoryDate: string = "";
   
  form = new FormGroup({
    zoneId: new FormControl,
    wcId: new FormControl  
  });


  payloadInventory: ReportGenerate = {
    reportType: "INVENTORY",
    type: "MONTHLY",
    fromDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "",
    toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "",
    wcId: 0,
    reportName: "INVENTORY"
  }

  constructor(private datePipe: DatePipe, private service: CommonService, private reportService: ReportService){
    this.role = localStorage.getItem('role');
  }
  ngOnInit() {
    this.getZones();
    this.createChart1();
    this.createChart2();
    this.createChart3();
    this.createChart4();
    this.createChart5([0,0,0]);
    if (localStorage.getItem("role") == "bmcadmin") {
      console.log("hello")
      this.service.getZoneAllData().subscribe(
        data => {
          this.zoneList = data
          this.form.patchValue({zoneId:this.zoneList[0].zoneId})
        }
      );
      this.service.getMrfReportForAdmin().subscribe(
        data=>{
          this.loginResponse=data
          this.mrfReportList=this.loginResponse.data
        }
      );
      
    }
    else {
      // console.log("hii")
      this.service.getAllMrfReports().subscribe(
        data => {
          this.loginResponse = data
          this.mrfReportList = this.loginResponse.data
        }
      );
      this.service.getWcById(localStorage.getItem("wcId")).subscribe(
        data=>{
          this.loginResponse=data
          this.wcList=[{wcId:this.loginResponse.wcId,wcName:this.loginResponse.wcName}]
          this.zoneList=[{zoneId:this.loginResponse.zone.zoneId,zoneName:this.loginResponse.zone.zoneName}]
          setTimeout(()=>{
            this.form.patchValue({wcId:this.wcList[0].wcId,zoneId:this.zoneList[0].zoneId}) 
          },1000)

          
          this.wcName=this.loginResponse.wcName
          this.zoneName=this.loginResponse.zone.zoneName
          console.log(this.zoneName)
        }
      );
    }
    
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
    console.log(ev)
    this.wcList = []
    this.getWcListByZoneId();
  }

  onWcSelect(ev: any) {
    if(ev.target.value !== 'undefined'){
      this.wcSelectId = ev.target.value;
    }else{
      this.wcSelectId = this.wcList[0].wcId;
    }

    this.payloadInventory.fromDate = this.payloadInventory.fromDate ? this.payloadInventory.fromDate : this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    this.payloadInventory.toDate = this.payloadInventory.toDate ? this.payloadInventory.toDate : this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    this.getInventoryRecord();
  }

  onInventoryChange(ev: any){
    console.log(ev.target.value);
    this.payloadInventory.fromDate = ev.target.value
    this.payloadInventory.toDate = ev.target.value
    this.getInventoryRecord();
  }

  getInventoryRecord(){
    this.payloadInventory.wcId = this.wcSelectId
    try {
      this.reportService.getInventoryReport(this.payloadInventory)
        .subscribe((response:any) => {
           let inStock = 0;
           let purchase = 0;
           let issueStock = 0;
      
           //Purchase
           let itemPurchaseArr = response.itemPurchaseNames;
           itemPurchaseArr.forEach((element: string) => {
            purchase = response.response.PURCHASE._1[element].reduce((sum:number, item:any) => sum + item.quantity, 0);
           });

           //Issue 
           let itemIssueArr = response.itemIssueNames;
           itemIssueArr.forEach((element: string) => {
            issueStock = response.response.ISSUESTOCK._1[element].reduce((sum:number, item:any) => sum + item.quantity, 0);
           });


           //In Stock
           let itemStockArr = response.itemInStockNames;
           itemStockArr.forEach((element: string) => {
            inStock = response.response.INSTOCK._1[element].reduce((sum:number, item:any) => sum + item.quantity, 0);
           });

           this.createChart5([purchase, issueStock, inStock]);
        });
    } catch (e) {
      console.error(e)
    }
  }


  randomScalingFactor() {
    return Math.round(Math.random() * 100);
  }

  createChart1() {
    this.chart1 = new Chart("chart-df4617c3-18be-4737-9299-849235eb3bae", {
      type: "doughnut",
      data: {
        labels: ["Package", "Unsold", "Sold"],
        // datasets: [
        //   {
        //     data: [100, 60, 40],
        //     backgroundColor: ["#0FA8FC", "#E93228", "#18D87F"],
        //     borderWidth: 0
        //   },
        // ],
        datasets: [
          {
            data: [
              100, 0, 0
            ],
            backgroundColor: [
              "#0FA8FC", "#E93228", "#18D87F"
            ]
          },
          {
            data: [
              60, 40, 0
            ],
            backgroundColor: [
              "#E93228", "#E8E8E8", "#E8E8E8",
            ],
          },
          {
            data: [
              40, 60, 0
            ],
            backgroundColor: [
              "#18D87F", "#E8E8E8", "#E8E8E8"
            ],
          },
        ],
      },
      // plugins: [ChartDataLabels],
      options: {
        responsive: true,
        color: "white",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });
  }

  createChart2() {
    this.chart2 = new Chart("chart-1cdc1de6-f9e7-4552-aab7-9095e7771004", {
      type: "line",
      data: {
        labels: ["2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011"],
        datasets: [
          {
            label: "Dry Garbage",
            data: [10, 20, 55, 65, 55, 40, 50, 20, 20, 30, 40, 30],
            backgroundColor: "rgba(131,55,235, 0.5)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Wet Garbage",
            data: [20, 30, 50, 60, 50, 60, 30, 20, 30, 40, 30, 40],
            backgroundColor: "rgba(247,36,133, 0.5)",
            fill: true,
            tension: 0.4
          },
          {
            label: "Inert Material",
            data: [30, 36, 40, 50, 70, 50, 40, 30, 40, 50, 45, 50],
            backgroundColor: "rgba(255,183,5, 0.5)",
            fill: true,
            tension: 0.4
          }
        ],
      },
      // plugins: [ChartDataLabels],
      options: {
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
        maintainAspectRatio: false,
        plugins: {
          filler: {
            propagate: true
          },
        },
      },
    });
  }

  createChart3() {
    this.chart3 = new Chart("chart-3dd8c851-105e-4d7e-baba-f8c791c531c5", {
      type: "bar",
      data: {
        labels: ["Total Employee", "Present", "Absent"],
        datasets: [
          {
            label: "",
            data: [50, 30, 20],
            backgroundColor: ["#016A3B", "#7DC701", "#FE0000"],
            barThickness: 20,
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: "left",
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });
  }

  createChart4() {
    this.chart4 = new Chart("chart-76208973-b156-4bb3-a474-b6c12f7f5ff7", {
      type: "doughnut",
      data: {
        labels: [
          "Total Vehicle",
          "Vehicle On-field",
          "Maintenance",
          "Available",
        ],
        datasets: [
          {
            // label: "In Percentage",
            data: [450, 220, 120, 110],
            backgroundColor: ["#4E4CFD", "#92CA33", "#EF4BD0", "#0086CE"],
            borderWidth: 0,
          },
        ],
      },
      // plugins: [ChartDataLabels],
      options: {
        responsive: true,
        color: "white",
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });
  }

  createChart5(dataArr: number[]) {
    this.inventoryDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    if (this.chart5 != null && this.chart5 != undefined) {
      this.chart5.destroy()
    }
    this.chart5 = new Chart("chart-029ea4bc-fac1-4296-b731-25bb7c6598ac", {
      type: "bar",
      data: {
        labels: ["Purchase", "Issue Stock", "In Stock"],
        datasets: [
          {
            label: "",
            data: dataArr,
            backgroundColor: ["#14A2F4", "#EE321F", "#12D881"],
            barThickness: 20,
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: "left",
            labels: {
              color: "#fff",
            },
          },
        },
      },
    });
  }
  getAllWcByZoneId() {
    this.service.getWcListByZoneId(this.form.value.zoneId).subscribe(
      data => {
        this.loginResponse=data
        this.wcList = this.loginResponse.data
        this.form.patchValue({wcId:this.wcList[0].wcId})
        // console.log(this.wcList)
      }
    );
  }
  getMrfReportByWc(){
    this.service.getMrfReportByWc(this.form.value.wcId).subscribe(
      data=>{
        this.loginResponse=data
        this.mrfReportList=this.loginResponse.data
      }
    );
    this.service.getDashboardDetailsV2(this.form.value.wcId).subscribe(
      data=>{
        this.loginResponse=data
        this.dashboardResponseV2=this.loginResponse.data
        this.service.dashboardDetailsV2=this.dashboardResponseV2
        console.log(data)
      }
    );
  }
}
