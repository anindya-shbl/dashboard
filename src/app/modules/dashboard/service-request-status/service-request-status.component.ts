import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-service-request-status',
  templateUrl: './service-request-status.component.html',
  styleUrl: './service-request-status.component.scss'
})
export class ServiceRequestStatusComponent {

  srDetails: any = [];
  orderId :any = '';
  decodedId: any = '';
  link: any = '';
  type: any = '';
  isloading: boolean = false;

  constructor(
    private router: Router, 
    private activatedRoute : ActivatedRoute, 
    private orderService : OrderService,
    private spinner: NgxSpinnerService){}

  ngOnInit(): void {
    this.orderId = this.activatedRoute.snapshot.params['orderID'];
    // let orderId = 'AwIHfl5SHgJvFg==';
    // console.log(orderId, typeof('orderId'))
    if(this.orderId != undefined || this.orderId != ''){
      this.spinner.show();
      this.decodedId = atob(this.orderId);
      let fd = new FormData();
      // fd.append('orderId', this.orderId);
      fd.append('orderId', this.decodedId);
      this.SRstatusById(fd);
    }
  }

  SRstatusById(param: any){
    this.isloading =  true;
    // this.orderService.getSRdetailsById('customers/order/getCustomerServiceFeedback', param).subscribe((res: any) => {
    this.orderService.getSRdetailsById('webapi/order/getCustomerServiceFeedback', param).subscribe((res: any) => {
      // this.srDetails = res;
      // console.log(res)
      // if(res && res['result']['rs']['feedbackservice']['data'].length >0){
      //   this.srDetails = res['result']['rs']['feedbackservice']['data'];
      if(res && res['status']==200){
        this.srDetails = res['data']['OrderData']['data'];
        this.isloading = false;
        this.spinner.hide();
      }else{
        this.srDetails = [];
        this.isloading = false;
        this.spinner.hide();
      }
    })
  }

  openPopup(link: any, type: any){
    this.link = link;
    this.type = type;
  }

}
