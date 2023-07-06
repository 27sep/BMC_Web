import { Component } from "@angular/core";
import Chart, { scales } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

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

  ngOnInit() {
    this.createChart1();
    this.createChart2();
    this.createChart3();
    this.createChart4();
  }

  randomScalingFactor() {
    return Math.round(Math.random() * 100);
  }

  createChart1() {
    this.chart1 = new Chart("chart-46cfc0cf-8596-47ba-96b0-91a8c671c047", {
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

  createChart3() {
    this.chart3 = new Chart("chart-a4a63e7d-7c9c-4963-a345-4f2c4c1ff19a", {
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
