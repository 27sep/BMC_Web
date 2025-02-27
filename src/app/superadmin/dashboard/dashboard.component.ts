import { Component } from '@angular/core';
import Chart, { scales } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../common.css', './dashboard.component.css']
})
export class DashboardComponent {

  chart1: any;
  chart2: any;
  chart3: any;
  chart4: any;
  chart5: any;

  ngOnInit() {
    this.createChart1();
    this.createChart2();
    this.createChart3();
    this.createChart4();
    this.createChart5();
  }

  createChart1() {
    this.chart1 = new Chart("chart-99e18e69-3e60-4552-9013-95c594d09659", {
      type: "doughnut",
      data: {
        labels: ["Package", "Unsold", "Sold"],
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
    this.chart2 = new Chart("chart-e017e3c3-333c-4ca7-8b20-56d7b361c29b", {
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
    this.chart3 = new Chart("chart-23236985-42b9-4174-9d5a-0a199dd473d9", {
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
    this.chart4 = new Chart("chart-19b8e3bd-bc26-46c8-9ea4-01d6345cb2e2", {
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

  createChart5() {
    this.chart3 = new Chart("chart-23236985-f16855f5-676c-4201-b1d9-ab68c9d8307a", {
      type: "bar",
      data: {
        labels: ["Package", "Unsold", "Sold"],
        datasets: [
          {
            label: "",
            data: [500, 260, 240],
            backgroundColor: ["#11A3F5", "#ED3223", "#15D981"],
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

}

