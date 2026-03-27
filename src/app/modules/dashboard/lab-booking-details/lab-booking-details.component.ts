import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { TimeConverterPipe } from '../../../pipes/time-converter.pipe';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-lab-booking-details',
  templateUrl: './lab-booking-details.component.html',
  styleUrl: './lab-booking-details.component.scss'
})
export class LabBookingDetailsComponent implements OnInit {

  isloading: boolean = false;
  bookingDetails : any = '';
  serviceItems : any = [];
  packageDetails: any = [];
  selectedPkg: any = '';
  AppointmentSlot: any = [];
  selectedReason: any = '';
  reschedule_categoryList : any = [];
  respMsg : any = '';
  doctorDetails: any = [];
  phleboDetails: any = [];

  isCancelled: boolean = false;

  @ViewChild('pckgDtls') pckgDtls: any;
  @ViewChild('respActBtn') respActBtn!: ElementRef;
  @ViewChild('closeCancel') closeCancel !: ElementRef;
  @ViewChild('focusbtn') focusbtn: any;
    

  constructor( private router: Router, private activatedRoute : ActivatedRoute, private orderService : OrderService, private spinner: NgxSpinnerService, public CommonService: CommonService, private webengageService: WebEngageService){}

  ngOnInit(): void {
    this.isCancelled = false;
    let bookingID = this.activatedRoute.snapshot.params['bookingID'];

    if(bookingID != undefined && bookingID != ''){
      let fd = new FormData();
      // fd.append('orderId', atob(orderId));
      fd.append('BookingNo', bookingID);
      this.bookingDetailById(fd);
    }  
  }

  bookingDetailById(param: any){
    this.spinner.show();
    this.isloading = true;
    // this.orderService.getOrderDetailById('customers/order/viewOrder', param).subscribe((res: any) => {
    this.orderService.getOrderDetailById('webapi/lab/order_view', param).subscribe((res: any) => {
      // console.log(res)
      if(res && res['status']==200){
        let slotsArr: any = []
        if(res['data']['Details']['Services'].length >0){
          res['data']['Details']['Services'].sort((a: any, b: any) => a.SlotStartTime.localeCompare(b.SlotStartTime));
          res['data']['Details']['Services'].forEach((sr: any)=>{
            const TimeConverter = new TimeConverterPipe();
            let str = `${TimeConverter.transform(sr.SlotStartTime)} - ${TimeConverter.transform(sr.SlotEndTime)}`;
            slotsArr.push(str)
          })          
          this.AppointmentSlot = [...new Set(slotsArr)];
          // console.log(this.AppointmentSlot);
        }
        if(res['data']['Details']['PhleboId'] != undefined && res['data']['Details']['PhleboId'] != null && res['data']['Details']['PhleboId'] != ''){
          let PhleboId = res['data']['Details']['PhleboId'];
          this.getPhleboDetails(PhleboId);
        }

        if(res['data']['Details']['AppointmentDetails'] != undefined && res['data']['Details']['AppointmentDetails'] != null && res['data']['Details']['AppointmentDetails'] != ''){
          let docID = res['data']['Details']['AppointmentDetails'][0]['DoctorId'];
          // let bkngID = res['data']['Details']['AppointmentDetails'][0]['BookingId'];
          if(docID != undefined && docID != null && docID != ''){
            this.getDoctorDetails(docID)
          }
        }
        this.bookingDetails = res['data']['Details'];
        this.serviceItems = res['data']['Details']['Services'];
        this.spinner.hide();
        this.isloading = false;
        this.getResheduleReasons();
        this.labDetailsWebEngage(this.bookingDetails);
      }else{
        this.spinner.hide();
        this.isloading = false;
      }
    })
  }

  getDoctorDetails(doctorId: any) {
    let fd = new FormData();
    fd.append('doctorId', doctorId);
    // fd.append('bookingId', bkngID);
    // fd.append('doctorId', '51382');
    this.orderService.getDoctorDetails('webapi/consultation/doctor_details', fd).subscribe((docRes: any) => {
      if (docRes && docRes['status'] == 200) {
        if(docRes['data'] && docRes['data'].length > 0){
          this.doctorDetails = docRes['data'];
        }else{
          this.doctorDetails = [];
        }
      }else{
        this.doctorDetails = [];
      }
    })
  }

  getPhleboDetails(PhleboId: any) {
    this.orderService.getPhleboDetails(`phlebo/getPhleboDetails?PhleboId=${PhleboId}`).subscribe((res: any) => {      
      if (res && res['status'] == 2000) {
        if(res['data'] && res['data']['Details'].length > 0){
          this.phleboDetails = res['data']['Details'];
        }else{
          this.phleboDetails = [];
        }
      }else{
        this.phleboDetails = [];
      }
      // console.log(this.phleboDetails)
    })
  }

  viewPackageDetails(test: any){
    this.selectedPkg = test;
    // console.log(this.selectedPkg);
    let pkArr : any = [];

    if(this.serviceItems.length > 0) {
      this.serviceItems.forEach((elm : any)=>{
        if(elm.PkgServiceId == test.ServiceId){
          pkArr.push(elm);
        }
      });
      this.packageDetails = pkArr;
      // console.log(this.packageDetails);
      this.pckgDtls.nativeElement.click();
    }
   
  }

  resetPkg(){
    this.selectedPkg = '';
    this.packageDetails = [];
  }

  // getTestReport(url: any){
  //   window.open(url, '_blank');
  // }

  getTestReport(fileName: any, BookingNo: any){
    // let fd = new FormData();
    // fd.append('pname',  fileName);
    // fd.append('bookingNo',  BookingNo);
    // this.orderService.viewLabReport('webapi/lab/report_download', fd).subscribe((res: any) => {
    //   console.log(res)
    // })
    if(fileName != null && fileName != '' && fileName != undefined){
      window.open(`${this.CommonService.catalogUrl}lab/prescription/download?pname=${fileName}&BookingNo=${BookingNo}`)
    }
  }

  getResheduleReasons(){
    this.orderService.getcancelReasonList('webapi/lab/reschedule_category').subscribe((res: any) => {
      // console.log(res);
      if(res && res['status']==200){
        this.reschedule_categoryList = res['data']['RescheduleCategory'];
      }
    })
  }


  setReason(rsn: any){
    // console.log(rsn);
    this.selectedReason = rsn;
  }

  cancelbooking(){
    // this.respMsg = '';
    if(this.selectedReason != ''){
      let fd = new FormData();
      fd.append('BookingId',  this.bookingDetails.BookingId);
      fd.append('Comment', this.selectedReason.RescheduleCategoryName);
      this.spinner.show();
  
      this.orderService.cancelOrder('webapi/lab/cancel_booking', fd).subscribe((res: any) => {
        // console.log(res)
        if(res && res['status']==200){
          if(res['data']['ReturnStatus']== 1){
            this.cancelBookingWebEngage();
            this.isCancelled = true;
            this.closeCancel.nativeElement.click();
            this.respMsg = res['message'];
            this.spinner.hide();
            this.respActBtn.nativeElement.click()
            // alert(this.respMsg);
          }else{
            this.isCancelled = false;
            this.closeCancel.nativeElement.click();
            this.respMsg = res['message'];
            this.spinner.hide();
            this.respActBtn.nativeElement.click()
            // alert(this.respMsg);
          }
        }else{
          this.isCancelled = false;
          this.closeCancel.nativeElement.click();
          this.respMsg = res['message'];
          this.spinner.hide();
          this.respActBtn.nativeElement.click()
          // alert(this.respMsg);
        }
      })
    }
  }

  onReset(){
    this.selectedReason = '';
    // this.isCancelled = false;
  }

  msgReset(){
    this.respMsg = '';
    this.focusbtn.nativeElement.click();
    if(this.isCancelled == true){
      // this.ngOnInit();
      this.router.navigate(['customers/dashboard/lab-bookings'])
    }
  }

  labDetailsWebEngage(dtls: any){
    let bookingDt = (new Date(dtls.BookingDate)).toUTCString().substring(0,16);
    let apmntDt = new Date(dtls.AppointmentDate).toUTCString().substring(0,16);
    let ptnt = [];
    ptnt.push(dtls.PatientName);

    let webData = {
      'Booking No' : dtls.BookingNo.toString(),
      'Collection Type' : dtls.IsHomeCollection == 1 ? 'Home Collection' : 'Lab Collection',
      'Booking Date' : bookingDt,
      'Appointment Date' : apmntDt,
      'Total Amount' : dtls.BookingAmount,
      'Payment Method' : dtls.TypeofPayment,
      'Payment Status' : dtls.PaymentStatus,
      'Booking Status' : dtls.BookingStatusDesc,
      'Patient Details' : ptnt,
      'Lab Name' : dtls.LabName
    }
    this.webengageService.trackEvent('My Lab Booking Details Viewed', webData);
  }

  cancelBookingWebEngage(){
    let webData = {
      'Booking No' : this.bookingDetails.BookingNo.toString(),
      'Reason' : this.selectedReason.RescheduleCategoryName
    }
    this.webengageService.trackEvent('Appointment Cancelled', webData);
  }

  bookConsultation(id : any) {
    let bookingId = id;
    this.router.navigate(['customers/dashboard/book-consultation', bookingId]);
  }

  // openRouteInNewTab(token: string) {
  //   // const url = this.router.serializeUrl(this.router.createUrlTree([route]));
  //   const url = this.router.serializeUrl(this.router.createUrlTree(['/video-consultation'], { queryParams: { authToken: token } }));
  //   window.open(url, '_blank');
  // }
  
  openRouteInNewTab(details: any) {
    const url = `${this.CommonService.baseurl}video-consultation?authToken=${details.PatientTokenNo}&meetingTitle=${details.MeetingTitle}`;
    window.open(url, '_blank');
  }

}
