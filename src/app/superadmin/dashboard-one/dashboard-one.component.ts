import { Component } from "@angular/core";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { combineLatest, combineLatestWith, forkJoin } from "rxjs";
import { CommonService } from "src/app/service/common.service";
import { ToastService } from "src/app/service/toast.service";

@Component({
  selector: "app-dashboard-one",
  templateUrl: "./dashboard-one.component.html",
  styleUrls: ["../../common.css", "./dashboard-one.component.css"],
})
export class DashboardOneComponent {
  chart1: any;
  chart2: any;
  role: any = ''
  zoneList: any[] = []
  zoneSelectId: any = 0
  wcList: any[] = []



constructor(private service: CommonService, private toastService: ToastService) {
    this.role =  localStorage.getItem('role');
    this.getZones()
}

  ngOnInit() {
    this.createChart1();
    this.createChart2();
  }

  getDataForGraph(){
    

  }

  getZones() {
    try {
        this.zoneList = this.service.get(`/zone/getAllZone`)
    } catch (e) {
        console.error(e)
    }
  }

  getWcListByZoneId() {
    try {
            this.wcList = this.service.get(`/zone/getAllWc/`+ this.zoneSelectId)
    } catch (e) {
            console.error(e)
    }
}

 

  onZoneSelect(ev: any) {
    console.log(' Response Data :   ' ,ev.target.value);
    this.zoneSelectId = ev.target.value;
    this.getWcListByZoneId();
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
    this.chart2 = new Chart("chart2", {
      type: "bar",
      data: {
        labels: ["Plastic", "Paper", "Glass", "Leather", "Cloth", "Metal"],
        datasets: [
          {
            label: "Black Polythene",
            data: [70, null, null, null, null, null],
            backgroundColor: "#175CFF",
          },
          {
            label: "HD Plastics",
            data: [90, null, null, null, null, null],
            backgroundColor: "#E5D05D",
          },
          {
            label: "Fiber",
            data: [50, null, null, null, null, null],
            backgroundColor: "#FF0069",
          },
          {
            label: "Cardboard",
            data: [null, 70, null, null, null ,null],
            backgroundColor: "#15D97C",
          },
          {
            label: "Nix Books",
            data: [null, 90, null, null, null ,null],
            backgroundColor: "#FFC605",
          },
          {
            label: "News Paper",
            data: [null, 50, null, null, null, null],
            backgroundColor: "#FF0069",
          },
          {
            label: "LED Bulb",
            data: [null, null, 70, null, null ,null],
            backgroundColor: "#3530C2",
          },
          {
            label: "Glass",
            data: [null, null, 90, null, null, null],
            backgroundColor: "#F30F01",
          },
          {
            label: "Shoes",
            data: [null, null, null, 70, null, null],
            backgroundColor: "#0099FE",
          },
          {
            label: "Duplex",
            data: [null, null, null, 90, null, null],
            backgroundColor: "#F45250",
          },
          {
            label: "PET",
            data: [null, null, null, null, 70, null],
            backgroundColor: "#103A70",
          },
          {
            label: "SUP",
            data: [null, null, null, null, 90, null],
            backgroundColor: "#0BA33E",
          },
          {
            label: "Copie",
            data: [null, null, null, null, 50, null],
            backgroundColor: "#FF006A",
          },
          {
            label: "Steel",
            data: [null, null, null, null, null, 70],
            backgroundColor: "#135DFF",
          },
          {
            label: "Iron",
            data: [null, null, null, null, null, 90],
            backgroundColor: "#13C9C9",
          },
          {
            label: "Wire",
            data: [null, null, null, null, null, 50],
            backgroundColor: "#FE006A",
          },
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
        skipNull: true
      },
    });
  }
}
