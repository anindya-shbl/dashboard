import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-my-health-records',
  templateUrl: './my-health-records.component.html',
  styleUrl: './my-health-records.component.scss'
})
export class MyHealthRecordsComponent {

  tabName: any = '';
  savedPrscList : any = [];
  isloading: boolean = false;

  constructor(private CommonService: CommonService, private spinner: NgxSpinnerService, private webengageService: WebEngageService) { }

  ngOnInit(): void {
    this.tabName = 'Prescriptions';
    this.prescriptionsViewedWebEngage();
    this.getSavedPrescription();
  }

  prescriptionsViewedWebEngage(){
    this.webengageService.trackEvent('My Prescriptions Viewed', {});
  }

  getSavedPrescription() {
    // this.savedPrscList = [];
    this.spinner.show();
    this.isloading = true;
    this.CommonService.getSavedPrescription('webapi/cartuserapp/getprescriptionList').subscribe((data: any) => {
      // console.log('saved prsc List', data, data['results']);
      if(data && data['status']=='success'){
        this.savedPrscList = data['results'];
        this.isloading = false;
        this.spinner.hide();
      }else{
        this.savedPrscList = [];
        this.isloading = false;
        this.spinner.hide();
      }
    });
  }

  getData(tab: any){
    this.tabName = tab;
    // console.log(this.tabName);
    if(this.tabName == 'All-Orders'){      
    }

    if(this.tabName == 'LabTestReports'){
    }
  }

  getPdf(filepath: any){
    // console.log(filepath);
    // window.open(this.CommonService.ImageUrl+filepath);
    let linkpath = this.CommonService.catalogUrl + 'customer/dwnpres?pname=' + filepath;
    window.open(linkpath);
  }

}
