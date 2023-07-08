import { Component, OnInit } from '@angular/core';
import Chart, { scales } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-dashboard-two',
  templateUrl: './dashboard-two.component.html',
  styleUrls: ['../../../common.css', './dashboard-two.component.css']
})
export class DashboardTwoComponent implements OnInit{
  constructor(private service:CommonService){}
  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  loginResponse:any
  mrfReportList:any=[]
  ngOnInit() {
    this.createChart1();
    this.createChart2();
    this.createChart3();
    this.createChart4();
    this.service.getAllMrfReports().subscribe(
      data=>{
        this.loginResponse=data
        this.mrfReportList=this.loginResponse.data
      }
    );
  }

  createChart1() {
    this.chart1 = new Chart("chart-53c326af-8dfc-490a-8c07-080955290a47", {
      type: "doughnut",
      data: {
        labels: ["Plastic", "Paper", "Glass", "Leather", "Cloth", "Metal"],
        datasets: [
          {
            label: "In Percentage",
            data: [21, 35, 12, 5, 11, 16],
            backgroundColor: ["#49DB15", "#2424DE", "#DD5B23", "#721ED4", "#0395EA", "#EE1200"],
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
            position: 'left',
            labels: {
              color: '#fff',
            },
          },
        }
      },
    });
  }

  createChart2() {
    this.chart2 = new Chart("chart-22232410-d78c-4116-9f87-b3bde484cf0b", {
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

  createChart3() {
    this.chart3 = new Chart("chart-36256230-b9eb-4766-861a-a27f69e20511", {
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
            position: 'left',
            labels: {
              color: '#fff',
            },
          },
        }
      },
    });
  }

  createChart4() {
    this.chart4 = new Chart("chart-55e6d679-5e59-4538-9586-1eeba5e4ff87", {
      type: "doughnut",
      data: {
        labels: ["Total Vehicle", "Vehicle On-field", "Maintenance", "Available"],
        datasets: [
          {
            label: "In Percentage",
            data: [450, 220, 120, 110],
            backgroundColor: ["#4E4CFD", "#92CA33", "#EF4BD0", "#0086CE"],
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
            position: 'left',
            labels: {
              color: '#fff',
            },
          },
        }
      },
    });
  }
  
}
