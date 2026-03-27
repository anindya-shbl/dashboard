import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-book-consultation',
  templateUrl: './book-consultation.component.html',
  styleUrl: './book-consultation.component.scss'
})
export class BookConsultationComponent {

  isloading: boolean = false;
  docList: any = [];
  slotList: any = [];
  currentDate: any = '';
  currentslotList: any = [];
  selectedSlot: any = '';
  selectedLang: any = 'Hindi';
  labBookingId: any = '';
  @ViewChild('bkApModal') bkApModal: any;
  respMsg: any = '';
  isRequest: boolean = false;
  showHideDoc: boolean = false;
  selectedDoc: any = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    public CommonService: CommonService
  ) { }

  ngOnInit(): void {
    this.labBookingId = this.activatedRoute.snapshot.params['bookingID'];
    // console.log(this.labBookingId)
    if (this.labBookingId != undefined && this.labBookingId != '' && this.labBookingId != null) {
      // let fd = new FormData();
      // fd.append('BookingNo', bookingID);
      this.isloading = true;
      this.getDocList();
      this.getSlotDetail(this.labBookingId);
    }
  }

  getDocList() {
    this.orderService.getdoctorList('webapi/consultation/doctor_list').subscribe((resp: any) => {
      // console.log(resp)
      if (resp && resp['status'] == 200) {
        this.docList = resp.data;
      }
    })
  }

  getSlotDetail(param: any) {
    this.isRequest = false;
    this.spinner.show();
    this.isloading = true;
    let fd = new FormData();
    fd.append('BookingNo', param);
    this.orderService.getdoctorSlot('webapi/consultation/slot_list',fd).subscribe((resp: any) => {
      // console.log(resp)
      if (resp && resp['status'] == 200) {
        if (resp.data && Object.keys(resp.data).length > 0) {
          for (const date in resp.data) {
            if (resp.data[date] && resp.data[date].length > 0) {
              this.slotList.push({
                date: date,
                slots: resp.data[date]
              })
            }
          }
          // console.log("Slot List:", this.slotList);
          this.currentDate = this.slotList[0];
          this.setcurrentslotList(this.currentDate)
        } else {
          // console.log("No slot data available.");
          this.isRequest = true;
          this.respMsg = resp['message'];
          this.slotList = [];
          this.currentDate = '';
          this.currentslotList = [];
          this.spinner.hide();
          this.isloading = false;
        }
      } else {
        this.isRequest = false;
        this.respMsg = resp['message'];
        this.slotList = [];
        this.currentDate = '';
        this.currentslotList = [];
        this.spinner.hide();
        this.isloading = false;
      }
    })
  }

  setcurrentslotList(dt: any){
    this.currentDate = dt.date;
    let List = this.slotList.find((obj: any) => obj.date === this.currentDate);
    this.currentslotList = List.slots;
    this.selectedSlot = '';
    this.spinner.hide();
    this.isloading = false;
  }


  setcurrentSlot(slt: any){
    this.selectedSlot = slt;
  }

  setLang(lng: any){
    this.selectedLang = lng;
  }
  
  bookApointment(){
    this.respMsg = '';
    if(this.currentDate != '' && this.selectedSlot != '' && this.selectedLang !=''){
      this.spinner.show();
      // let data: any = {
      //   "BookingNo": this.labBookingId,
      //   "SlotStartTS": this.selectedSlot.StartTS,
      //   "SlotEndTS": this.selectedSlot.EndTS,
      //   "Lang": this.selectedLang
      // }
      let fd = new FormData();
      fd.append('BookingNo', this.labBookingId);
      fd.append('SlotStartTS', this.selectedSlot.StartTS);
      fd.append('SlotEndTS', this.selectedSlot.EndTS);
      fd.append('Lang', this.selectedLang);

      this.orderService.bookApointment('webapi/consultation/appointment_book', fd).subscribe((resp: any) => {
        if (resp) {
          // alert(resp.message);
          this.respMsg = resp;
          this.bkApModal.nativeElement.click()
          this.spinner.hide();
        }
      })
    }
  }

  redirect(){
    // if(this.respMsg.status == 200){
      this.router.navigate(['/customers/dashboard/lab-bookings'])
    // }
  }

  onMouseEnter(doc: any): void {
    this.showHideDoc = true;
    this.selectedDoc = doc;
  }

  onMouseLeave(): void {
    this.showHideDoc = false;
    this.selectedDoc = '';
  }

}
