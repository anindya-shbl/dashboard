import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-reschedule-booking',
  templateUrl: './reschedule-booking.component.html',
  styleUrl: './reschedule-booking.component.scss'
})
export class RescheduleBookingComponent {

  @Input() orderDetails: any | undefined;

  allslotsList: any = [];
  selectedDate: any = '';
  selectedSlot: any = '';
  selectedSlot_two: any = '';
  morningSlots: any = [];
  eveningSlots: any = [];
  showTimeslots: boolean = false;
  showSubmit : boolean = false;

  @Output() reseheduleEvent = new EventEmitter<any>();

  constructor(private orderService : OrderService){}

  ngOnChanges(): void {

    // console.log(this.orderDetails, this.orderDetails.BookingNo)
    this.getStatus();
  }

  getStatus(){
    let fd = new FormData();
    fd.append('BookingNo',  this.orderDetails.BookingNo);

    this.orderService.rescheduledata('webapi/lab/reschedule_slot_dates', fd).subscribe((res: any) => {
      // console.log(res)

      if(res && res['status'] == 200){
        this.allslotsList = res['data']['Items'];
      }
    })
  }

  showSlots(slot: any) {
    // debugger
    // console.log(slot);
    this.showTimeslots = false;
    this.showSubmit = false;
    this.selectedDate = slot.Date;
    this.selectedSlot = '';
    this.selectedSlot_two = '';
    this.morningSlots=[];
    this.eveningSlots = [];
    // this.found = this.srSelectedProd.some((el:any) => el.DamageMode == '');
    if (slot['Slots'].length > 0) {
      slot['Slots'].forEach((dt: any) => {
        if(dt.IsMorningSlot == 1){
          this.morningSlots.push(dt)
        }else{
          this.eveningSlots.push(dt)
        }
      });
      this.showTimeslots = true;
    }
  }

  setSlots(data : any){
    // console.log(data);
    this.selectedSlot = data;
    this.checkSubmit(this.selectedSlot)
  }

  setSlots_two(data : any){
    // console.log(data)
    this.selectedSlot_two = data;
    this.checkSubmit(this.selectedSlot_two)
  }

  checkSubmit(slt: any){
    if(this.morningSlots.length > 0 && this.eveningSlots.length > 0){
      if(this.selectedSlot_two != '' && this.selectedSlot != ''){
        this.showSubmit = true;
      }else{
        this.showSubmit = false;
      }
    }else{
      if(this.selectedSlot_two != '' || this.selectedSlot != ''){
        this.showSubmit = true;
      }else{
        this.showSubmit = false;
      }
    }
  }

  checkLabslotSubmit(slt : any){
    this.selectedSlot = slt;
    this.selectedDate = slt.Date;
    this.selectedSlot_two = '';
    this.showSubmit = true;
  }

  reschedulebooking(){

  }

  onReset(){
    this.allslotsList = [];
    this.selectedDate = '';
    this.selectedSlot = '';
    this.selectedSlot_two = '';
    this.morningSlots = [];
    this.eveningSlots = [];
    this.showTimeslots = false;
    this.showSubmit = false;
    this.reseheduleEvent.emit();
  }

}
