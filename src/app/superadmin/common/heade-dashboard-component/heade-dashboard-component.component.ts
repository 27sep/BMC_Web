import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-heade-dashboard-component',
  templateUrl: './heade-dashboard-component.component.html',
  styleUrls: ['./heade-dashboard-component.component.css']
})

export class HeadeDashboardComponentComponent implements OnInit {
  responseData: any;
  noOfActivetrips: any;
  noOfCompletedTrips: any;
  inProcessPit: any;
  emptyPit: any;
  totalDryWeight: any;
  totalWetWeight: any;
  mrfResponse: any
  constructor(private service: CommonService) {

    this.mrfResponse = this.service.dashboardDetailsV2
    setInterval(()=>{
      this.responseData=this.service.dashboardDetailsV2
      // console.log(this.responseData)
      if (this.responseData) {
        this.noOfActivetrips = this.responseData.numberOfActiveTrips
        this.noOfCompletedTrips = this.responseData.numberOfCompletedTrips
        this.inProcessPit = this.responseData.noOfActivePit
        this.emptyPit = this.responseData.noOfCompletedPit
        this.totalDryWeight = this.responseData.totalDryWeightValue
        this.totalWetWeight = this.responseData.totalWetWeightValue
      }
    },1000)
    // console.log(this.mrfResponse)
    // this.responseData = this.mrfResponse
    // if (this.responseData) {
    //   this.noOfActivetrips = this.responseData.data.numberOfActiveTrips
    //   this.noOfCompletedTrips = this.responseData.data.numberOfCompletedTrips
    //   this.inProcessPit = this.responseData.data.noOfActivePit
    //   this.emptyPit = this.responseData.data.noOfCompletedPit
    //   this.totalDryWeight = this.responseData.data.totalDryWeightValue
    //   this.totalWetWeight = this.responseData.data.totalWetWeightValue
    // }

  }
  ngOnInit() {
    if (localStorage.getItem("role") == "bmcadmin") {
      this.service.getDashboardDetailsForAdmin().subscribe(
        data => {
          this.responseData = data
          this.noOfActivetrips = this.responseData.data.numberOfActiveTrips
          this.noOfCompletedTrips = this.responseData.data.numberOfCompletedTrips
          this.inProcessPit = this.responseData.data.noOfActivePit
          this.emptyPit = this.responseData.data.noOfCompletedPit
          this.totalDryWeight = this.responseData.data.totalDryWeightValue
          this.totalWetWeight = this.responseData.data.totalWetWeightValue
          console.log(this.responseData)
        }
      );
    }
    else {
      this.service.getDashboardDetails().subscribe(
        data => {
          this.responseData = data
          this.noOfActivetrips = this.responseData.data.numberOfActiveTrips
          this.noOfCompletedTrips = this.responseData.data.numberOfCompletedTrips
          this.inProcessPit = this.responseData.data.noOfActivePit
          this.emptyPit = this.responseData.data.noOfCompletedPit
          this.totalDryWeight = this.responseData.data.totalDryWeightValue
          this.totalWetWeight = this.responseData.data.totalWetWeightValue
          console.log(this.responseData)
        }
      );
    }

  }

}
