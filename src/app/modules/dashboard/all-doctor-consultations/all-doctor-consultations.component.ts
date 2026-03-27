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

    // this.orderService.getRecentOrders(`webapi/consultation/appointment_list?PageNo${this.currentPage}&PerPageRecord=${this.recordsPerpage}`).subscribe((res: any) => {

      let res : any = {"data":[{"BookingId":447,"BookingNo":"HA-ZEUKY4","CustUserId":588535,"CustomerName":"suman das","AppointmentDate":"2025-11-24","SlotStartTime":null,"SlotEndTime":null,"BookingStatusId":5,"BookingStatus":"Consultation Closed","ApplicationType":"M","BillAmount":250,"PatientId":755103,"PatientName":"suman das","AddressId":null,"Addline":null,"DoctorId":51386,"Salutation":null,"DoctorName":"Prakash  Shaw","DoctorType":null,"FollowUpYN":0,"WaitingSince":"1489 m","RefConsultanionId":null,"DoctorDegree":null,"SpecialityName":null,"MobileNo":8000000009,"Gender":"M","DOB":"2020-10-28","Age":null,"PatientMobileNo":null,"PatientEmailId":null,"MeetingId":"bbb89c59-2249-47be-a4c8-897ac151bdf5","DoctorTokenNo":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImEwMzc2YzFhLTdjZDgtNDhiNy04NTQ4LTI1NDY0OTE2MTI0ZCIsIm1lZXRpbmdJZCI6ImJiYjg5YzU5LTIyNDktNDdiZS1hNGM4LTg5N2FjMTUxYmRmNSIsInBhcnRpY2lwYW50SWQiOiJhYWE3YWEwNS0xZjZiLTQ4MTUtODhkMi1lODAwN2JhMDM3OGIiLCJwcmVzZXRJZCI6ImJlZjE3M2FlLTUxZjYtNDJlMC05MGM0LTQ2YjhlOTJmZWRmMyIsImlhdCI6MTc2Mzk3NzcxOSwiZXhwIjoxNzcyNjE3NzE5fQ.HIvWswLlqRH8qs4Wo9a0GDSSgJpmjnR58gGbMtQhxzSQU0TnAcjtAhQ8ylFiW1-Ue6Qg2EAIeCLv1qQLXS5Z_8bRregA5nwaD7c3Xy5Y-HgPTATDf6wzFE71SfH8LyQtFdtwajwSF8uqZZnBK_m397SoGvTMqIkTBTza52yNiLkR7ApXoy3AtK5cctAGRx6IJCBmjlPmd_3RAlRBNSaKv5Yp440gZWcfzmKEM7JMnRcW58L8bHT4uByFGCo_M9LvbwNdc3yDdjN3xvS14WI9ZE2DDPk52jh2KMTRGo2-ZdgdlCuAJWbGqsdqqyqPsb6IAbcykqvPBxNxklci4pWxHg","PatientTokenNo":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImEwMzc2YzFhLTdjZDgtNDhiNy04NTQ4LTI1NDY0OTE2MTI0ZCIsIm1lZXRpbmdJZCI6ImJiYjg5YzU5LTIyNDktNDdiZS1hNGM4LTg5N2FjMTUxYmRmNSIsInBhcnRpY2lwYW50SWQiOiJhYWFlNjM0ZC1kNDExLTRhMjEtYTQwMC1kY2UwODY0MzMyNDMiLCJwcmVzZXRJZCI6IjI4NWJkYmViLWFlY2ItNGVjOS1hNDk1LWQ3ZDgyN2Q0NmEyYSIsImlhdCI6MTc2Mzk3NzcxOSwiZXhwIjoxNzcyNjE3NzE5fQ.QYY5k5qR-cTJHsVGaGRG1HsC-je56yZblCwMVFcNQjrIWsyxNxOlITEYMTKyXaPinTPg3Xe7vcCArjLyBD-tQKyV8EAB7h1qfZ5pA7DCcx8OIr9zb8muSuVqYFuUCZBGBYGg7GbxQVWyYEIo5ndmvDjLeyG-in3prjlDY2jXZYw_3witOAuZR8nt6ZbZIcnFkkaMrTYBi1VTdN8p1PV6fGALElfLey1ZX1Az7ODZvSjZpKTrXedaTh-39PzpLcHjSplnPzCOhQDH4Q4uMIJ1ycg3NJv6b_o0ncqJMmkQKa9J42GMHx3cuvTPI-czlfyI5ohxY0T_TfS__YDwROz51w","PatientParticipantId":"b8bf03d4-8cdf-483d-931c-ba5ad0530e8c","DoctorParticipantId":"c0334b5c-5fd7-4983-b762-2aa75aa96631","MeetingTitle":"Doctor Appointment HA-YEY4GF--","VCFilePath":"","IsVCJoin":false,"IsNoShow":false,"MeraDocAppointmentId":null,"MeraDocDoctorId":null,"MeraDocSlotType":null,"MeraDocSlotId":null,"MeraDocPatientId":null,"MeraDocPatientNumber":null,"MeetLinkUrl":null,"ChiefComplaints":null,"SourceBookingId":null,"ModeOfConsultation":"V","ReportFilePath":"","SymptomesDetails":"","RefBookingNo":"HA-YEY4GF","BookingAmount":250,"ItemDiscount":0,"CouponDiscount":0,"CouponId":null,"PromoCode":null,"PromoName":null,"PromoDesc":null,"PrescriptionId":995932,"PrescriptionPath":"prescription_41684_HA-YEY4GF_896.pdf","PrescriptionName":"prescription_41684_HA-YEY4GF_896.pdf"}],"status":200,"message":"Appointment list fetched successfully"}


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

    // });
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
