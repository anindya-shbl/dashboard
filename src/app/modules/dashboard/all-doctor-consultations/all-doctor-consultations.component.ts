import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-doctor-consultations',
  templateUrl: './all-doctor-consultations.component.html',
  styleUrl: './all-doctor-consultations.component.scss'
})
export class AllDoctorConsultationsComponent implements OnInit {

  // respOrders: any = []
  appointMentList: any = [];
  currentPage: any = 1;
  recordsPerpage: any = 10;
  loadMoreBtn: boolean = false;
  isloading: boolean = false;

  constructor(
    public commonService: CommonService,
    private router: Router,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    // private webengageService: WebEngageService
  ) { }

  ngOnInit(): void {
    this.getAllAppointments()
  }

  getAllAppointments() {

    if (this.currentPage == 1) {
      this.isloading = true;
    }
    this.spinner.show();

    this.orderService.getRecentOrders(`webapi/consultation/appointment_list?PageNo${this.currentPage}&PerPageRecord=${this.recordsPerpage}`).subscribe((res: any) => {

      if (res && res['status'] == 200) {
        let data = res['data'];
        if (data.length > 0) {
          if (data.length < 10) {
            this.loadMoreBtn = true;
          } else {
            this.loadMoreBtn = false;
          }
          this.appointMentList = [...this.appointMentList, ...data];
          this.isloading = false;
          this.spinner.hide();
        } else {
          this.isloading = false;
          this.spinner.hide();
        }
      } else {
        this.isloading = false;
        this.spinner.hide();
      }

    });
  }

  loadMore(){
    this.currentPage = this.currentPage + 1;
    this.getAllAppointments();
  }


  viewBookingDetails(dtls: any){
    let bookingNo = dtls.BookingNo;
    this.router.navigate(['customers/dashboard/consultation-summary', bookingNo]);
  }

  joinVideocall(dtls: any){}

  rateConsult(dtls: any){}
}
