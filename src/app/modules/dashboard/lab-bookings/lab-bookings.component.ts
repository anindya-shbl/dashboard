import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-lab-bookings',
  templateUrl: './lab-bookings.component.html',
  styleUrl: './lab-bookings.component.scss'
})
export class LabBookingsComponent implements OnInit {

  respOrders : any=[];
  labBookings : any=[];
  currentPage: any = 1;
  loadMoreBtn: boolean = false;
  isloading: boolean = false; 
  reschedule_categoryList: any = [];
  trackdetailsItem : any = '';
  cancelResheduleItem : any = '';
  actionType : any = '';
  selectedReason: any = '';
  showCancelReschedule : boolean = false;
  @ViewChild('actionModal') actionModal!: ElementRef;
  @ViewChild('respBtn') respBtn!: ElementRef;
  @ViewChild('closebutton') closebutton !: ElementRef;
  respMsg : any = '';

  constructor(
    public commonService: CommonService,
    private router: Router, 
    private orderService : OrderService, 
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private dbService: NgxIndexedDBService,
    private webengageService: WebEngageService) { }

  ngOnInit(): void {
    this.labBookingsWebEngage();
    this.getallOrders();
    this.getResheduleReasons();  
  }

  labBookingsWebEngage(){
    this.webengageService.trackEvent('My Lab Booking Clicked', {});
  }

  getallOrders(){
    
    if(this.currentPage == 1){
      this.isloading = true;
      this.spinner.show();
    }
    // this.respOrders = [];
    let curorder: any = [];
    let fd = new FormData();
    fd.append('PageNo',  this.currentPage);
    fd.append('PerPageRecord',  '10');
    this.orderService.getAllOrders('webapi/lab/order_list', fd).subscribe((res: any) => {
      if(res && res['status'] == 200){
        let data = Object.values(res['data']['Items']);
        if(data.length >0){
          data = data.map((booking: any) => {
            return {
              ...booking,
              ServiceNameArray: booking.ServiceName
                ? booking.ServiceName.split(',').map((service: any) => service.trim())
                : []
            };
          });

          if(data.length<10){
            this.loadMoreBtn = true;
          }else{
            this.loadMoreBtn = false;
          }
          // this.respOrders = [...this.respOrders, ...curorder];
          this.respOrders = [...this.respOrders, ...data];
          this.labBookings = this.respOrders;
          this.isloading = false;
          this.spinner.hide();
        }else{
          this.isloading = false;
          this.spinner.hide();
        }
      }else {
        // this.allOrders = [];
        this.isloading = false;
        this.spinner.hide();
      }
      
      // this.allOrders = Object.values(res['data'])
      // console.log('all orders', this.labBookings );
    });
  }

  getResheduleReasons(){
    this.orderService.getcancelReasonList('webapi/lab/reschedule_category').subscribe((res: any) => {
      // console.log(res);
      if(res && res['status']==200){
        this.reschedule_categoryList = res['data']['RescheduleCategory'];
      }
    })
  }

  // webapi/lab/reschedule_category

  loadMore(){
    this.currentPage = this.currentPage + 1;
    // this.tabName = 'All-Orders';
    this.getallOrders();
  }

  showActionType(data: any){
    this.cancelResheduleItem = data;
    this.changeActionType('Cancel');
    this.actionModal.nativeElement.click();
    this.showCancelReschedule = true;
    // console.log(data)
  }

  changeActionType(type: any){
    this.actionType = type;
    this.selectedReason = '';
  }

  setReason(rsn: any){
    // console.log(rsn);
    this.selectedReason = rsn;
  }

  cancelbooking(){
    this.respMsg = '';
    if(this.cancelResheduleItem != '' && this.selectedReason != ''){
      let fd = new FormData();
      fd.append('BookingId',  this.cancelResheduleItem.BookingId);
      fd.append('Comment', this.selectedReason.RescheduleCategoryName);
      this.spinner.show();  
      this.orderService.cancelOrder('webapi/lab/cancel_booking', fd).subscribe((res: any) => {
        // console.log(res)
        if(res && res['status']==200){
          if(res['data']['ReturnStatus']== 1){
            this.cancelBookingWebEngage();
            this.closebutton.nativeElement.click();
            this.respMsg = res['message'];
            this.spinner.hide();
            this.respBtn.nativeElement.click()
            // alert(this.respMsg);
          }else{
            this.closebutton.nativeElement.click();
            this.respMsg = res['message'];
            this.spinner.hide();
            this.respBtn.nativeElement.click()
            // alert(this.respMsg);
          }
        }else{
          this.closebutton.nativeElement.click();
          this.respMsg = res['message'];
          this.spinner.hide();
          this.respBtn.nativeElement.click()
          // alert(this.respMsg);
        }
      })
    }
  }

  settrackDetails(dts: any){
    this.trackdetailsItem = dts;
  }

  hideTracker(){
    this.trackdetailsItem = '';
  }

  viewBookingDetails(id : any) {
    // let orderId = btoa(id)
    let bookingId = id
    this.router.navigate(['customers/dashboard/booking-details', bookingId]);
  }

  getTestReport(fileName: any, BookingNo: any){
    // let fd = new FormData();
    // fd.append('pname',  fileName);
    // fd.append('bookingNo',  BookingNo);
    // this.orderService.viewLabReport('webapi/lab/report_download', fd).subscribe((res: any) => {
    //   // console.log(res)
    // })
    // window.open(`https://stage-serv-catalog.sastasundar.com/lab/prescription/download?pname=SS-F4TUPQ.pdf&BookingNo=SS-F4TUPQ`);
    if(fileName != null && fileName != '' && fileName != undefined){
      window.open(`${this.commonService.catalogUrl}lab/prescription/download?pname=${fileName}&BookingNo=${BookingNo}`);
    }
    
  }

  bookAgain(id : any) {
    // let orderId = btoa(id)
    this.bookAgainWebEngage();
    let bookingId = id;
    this.router.navigate(['customers/dashboard/bookagain', bookingId]);
  }

  bookConsultation(id : any) {
    let bookingId = id;
    this.router.navigate(['customers/dashboard/book-consultation', bookingId]);
  }

  onReset(){
    this.cancelResheduleItem = '';
    this.actionType = '';
    this.selectedReason = '';
    this.cancelResheduleItem = '';
  }

  reseheduleBooking(evnt : any){
    this.onReset();
  }

  msgReset(){
    this.respMsg = '';
    this.respOrders =[];
    this.labBookings =[];
    this.currentPage = 1;
    this.getallOrders();
  }

  cancelBookingWebEngage(){
    let webData = {
      'Booking No' : this.cancelResheduleItem.BookingNo,
      'Reason' : this.selectedReason.RescheduleCategoryName
    }
    this.webengageService.trackEvent('Appointment Cancelled', webData);
  }

  bookAgainWebEngage(){
    this.webengageService.trackEvent('Book Again Clicked', {});
  }

}
