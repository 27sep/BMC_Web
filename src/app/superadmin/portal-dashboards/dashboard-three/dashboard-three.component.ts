import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import Chart, { scales } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ReportGenerate } from "src/app/model/pit.model";
import { CommonService } from "src/app/service/common.service";
import { ReportService } from "src/app/service/report.service";

@Component({
  selector: "app-dashboard-three",
  templateUrl: "./dashboard-three.component.html",
  styleUrls: ["../../../common.css", "./dashboard-three.component.css"],
})
export class DashboardThreeComponent {
  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;

  role: any = ''
  zoneList: any = []
  zoneSelectId: any = 0
  wcSelectId: any = 0
  wcList: any
  zoneId: any
  wcId: any
  garbageFromDate: string = "";
  garbageToDate: string = "";
  totalGrossWeight : number = 0;
  totalDryWeight : number = 0;
  totalWetWeight : number = 0;
  garbageRes : any[] = [];
  totalGarbageWt : any[] = [];

  payloadReport: ReportGenerate = {
    reportType: "GARBAGE",
    type: "MONTHLY",
    fromDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "",
    toDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "",
    wcId: 0,
    reportName: "GARBAGE"
  }

  constructor(private datePipe: DatePipe, private service: CommonService, private reportService: ReportService){
    this.role = localStorage.getItem('role');
  }

  ngOnInit() {
    this.getZones();
    this.createChart1([0,0,0])
    this.createChart2();
    this.createChart3([0,0,0]);
    this.createChart4();
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
    this.payloadReport.wcId = this.wcSelectId;
    this.payloadReport.fromDate = this.payloadReport.fromDate ? this.payloadReport.fromDate : this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    this.payloadReport.toDate = this.payloadReport.toDate ? this.payloadReport.toDate : this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    this.datasetChart1();
  }

  onGarbageFromChange(ev: any){
    console.log(ev.target.value);
    this.payloadReport.fromDate = ev.target.value
    this.payloadReport.toDate = ev.target.value
    this.datasetChart1();
  }

  onGarbageToChange(ev: any){
    console.log(ev.target.value);
    this.payloadReport.fromDate = ev.target.value
    this.payloadReport.toDate = ev.target.value
    this.datasetChart1();
  }

  randomScalingFactor() {
    return Math.round(Math.random() * 100);
  }

  datasetChart1(){
    this.totalGarbageWt = [];
    try {
      this.reportService.getGarbageReport(this.payloadReport)
        .subscribe((response:any) => {
          this.garbageRes = []
        let  garbageRs = response
        let grossWt = 0;
        let dryWt = 0;
        let wetWt = 0;
        //Garbage Wt
        grossWt = garbageRs.response.GARBAGETOTAL._2[0].totalGrossWt;
        dryWt = garbageRs.response.GARBAGETOTAL._2[0].totalDryWt;
        wetWt = garbageRs.response.GARBAGETOTAL._2[0].totalWetWt;
        this.totalGrossWeight = grossWt
        this.totalDryWeight = dryWt
        this.totalWetWeight = wetWt
        console.log(garbageRs);
        garbageRs.response.GARBAGE._1?.Completed?.forEach((item:any)=> {
          this.garbageRes.push(item);
        })
        garbageRs.response.GARBAGE._1?.Created?.forEach((item:any)=> {
          this.garbageRes.push(item);
        })
        garbageRs.response.GARBAGE._1?.Gross_Collected?.forEach((item:any)=> {
          this.garbageRes.push(item);
        })
        garbageRs.response.GARBAGE._1?.Captured_Wet_Weight?.forEach((item:any)=> {
          this.garbageRes.push(item);
        })
        garbageRs.response.GARBAGE._1?.Captured_Dry_Weight?.forEach((item:any)=> {
          this.garbageRes.push(item);
        })
        console.log(this.garbageRes);
        this.totalGarbageWt = [grossWt,dryWt,wetWt];
        this.createChart1([grossWt,dryWt,wetWt])
        this.createChart3([grossWt,dryWt,wetWt]);
        });
    } catch (e) {
      console.error(e)
    }
  }

  

  createChart1(dataArr: number[]) {
    this.garbageFromDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    this.garbageToDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "";
    if (this.chart1 != null && this.chart1 != undefined) {
      this.chart1.destroy()
    }
    this.chart1 = new Chart("chart-46cfc0cf-8596-47ba-96b0-91a8c671c047", {
      type: "doughnut",
      data: {
        labels: ["GrossWeight", "DryWeight", "WetWeight"],
        datasets: [
          {
            data: dataArr,
            backgroundColor: ["#0FA8FC", "#E93228", "#18D87F"],
            borderWidth: 0
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
    this.chart2 = new Chart("chart-dc7f9855-88b4-4a15-9da5-8b73646b1d46", {
      type: "bar",
      data: {
        labels: ["2022", "2021", "2020", "2019", "2018", "2017"],
        datasets: [
          {
            label: "Package",
            data: [100, 90, 80, 85, 50, 100],
            backgroundColor: "#14A2F7",
          },
          {
            label: "Sold",
            data: [90, 50, 20, 50, 30, 70],
            backgroundColor: "#18D880",
          },
          {
            label: "Unsold",
            data: [50, 30, 70, 45, 55, 60],
            backgroundColor: "#F20F00",
          }
        ],
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
        skipNull: true,
      },
    });
  }

  createChart3(dataArr: number[]) {
    this.chart3 = new Chart("chart-a4a63e7d-7c9c-4963-a345-4f2c4c1ff19a", {
      type: "bar",
      data: {
        labels: ["Gross Weight", "Dry Weight", "Wet Weight"],
        datasets: [
          {
            label: "Gross Weight, Dry Weight, Wet Weight",
            data: dataArr,
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
    this.chart4 = new Chart("chart-0b976614-b93d-402a-9605-70803089fe67", {
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
            label: "In Percentage",
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
}
