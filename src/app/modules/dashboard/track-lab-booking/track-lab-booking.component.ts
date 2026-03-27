import { Component, Input, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-track-lab-booking',
  templateUrl: './track-lab-booking.component.html',
  styleUrl: './track-lab-booking.component.scss'
})
export class TrackLabBookingComponent {

  @Input() trackOrder: any | undefined;

  labtrackList: any = [];

  constructor(private orderService : OrderService){}

  ngOnChanges(): void {
    // console.log(this.trackOrder, this.trackOrder.BookingNo)
    this.getStatus();
  }

  getStatus(){
    let fd = new FormData();
    fd.append('CustUserId',  this.trackOrder.CustUserId);
    fd.append('LabId',  this.trackOrder.LabId);
    fd.append('BookingNo',  this.trackOrder.BookingNo);

    this.orderService.trackingStatus('webapi/lab/booking_status', fd).subscribe((res: any) => {
      // console.log(res)

      if(res && res['status'] == 200){
        this.labtrackList = res['data']['BookingStatus'];
        this.labtrackList = this.labtrackList.map((obj: any) => {
          if (obj.BookingStatusHistoryDate != null && obj.BookingStatusHistoryDate !='' && obj.BookingStatusHistoryDate != undefined) {
            let ds = `${obj.BookingStatusHistoryDate.substr(5,6)}, ${obj.BookingStatusHistoryDate.substr(18,8)}`
            return { ...obj, BookingStatusHistoryDate: ds };
          }
          return obj;
        });
      }
    })
  }

}
