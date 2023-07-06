import { Component } from "@angular/core";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: "app-dashboard-one",
  templateUrl: "./dashboard-one.component.html",
  styleUrls: ["../../common.css", "./dashboard-one.component.css"],
})
export class DashboardOneComponent {
  chart1: any;
  chart2: any;

  ngOnInit() {
    this.createChart1();
    this.createChart2();
  }

  createChart1() {
    this.chart1 = new Chart("chart-ee10daf0-be5f-4732-bc57-b50584b7b113", {
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
    this.chart2 = new Chart("chart-83d1d444-889f-48a7-9901-ac8d3a9cd972", {
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
