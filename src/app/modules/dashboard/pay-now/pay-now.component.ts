import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { PayNowService } from '../../../services/paynow.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-pay-now',
  templateUrl: './pay-now.component.html',
  styleUrl: './pay-now.component.scss'
})
export class PayNowComponent implements OnInit {

  orderDetails: any = '';
  orderItems: any = [];
  orderTracker: any = [];
  orderUrl: any = '';
  totalSavings: any = 0;
  isloading: boolean = false;
  cancelReasonList: any = []
  cancelationReason: any = '';
  cnlsMsg: boolean = false;
  cancelSuccess: boolean = false;

  ItemDiscount: any = 0;
  CouponDiscount: any = 0;
  CouponPromoDesc: any = 0;
  PromoDiscount: any = 0;
  orderInfo: any = '';
  cancelDesc: any = '';
  returnDesc: any = '';
  paymentGateways: any = [];
  totalPayableAmount: any = 0;
  gatewayDetails: any = '';
  msgText: string = '';
  totalItemsOrdered: number = 0;

  respMsg: any = '';
  @ViewChild('cnlsRspModal') cnlsRspModal: any;
  @ViewChild('cnlsOrd') cnlsOrd: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private orderService: OrderService, private paynowService: PayNowService, private spinner: NgxSpinnerService, public CommonService: CommonService, private webengageService: WebEngageService) { }

  ngOnInit(): void {
    let orderId = this.activatedRoute.snapshot.params['orderID'];
    // let orderId = 'AwIHfl5SHgJvFg==';
    // console.log(orderId, typeof('orderId'))
    if (orderId != undefined || orderId != '') {
      let fd = new FormData();
      fd.append('OrderId', atob(orderId));
      // fd.append('OrderId', '101002485118');
      this.getPaymentGatewayList(fd);
      this.orderDetailById(fd);
    }

  }

  orderDetailById(param: any){
    this.spinner.show();
    this.isloading = true;
    this.orderService.getOrderDetailById('webapi/order/viewOrder', param).subscribe((res: any) => {
      // this.orderDetails = res;
      // console.log(res);
      if(res && res['response_code'] == 0){
        this.orderDetails = res['data']['OrderHeaders'];
        this.orderItems = res['data']['OrderItems'];
        this.orderTracker = res['data']['order_track_details'];
        this.orderInfo = res['data']['ShortInfo'];
        // console.log(this.orderDetails, this.orderItems, this.orderTracker);
        // this.totalSavings = res['data']['OrderHeaders']['ItemDiscount'] +  res['data']['OrderHeaders']['PromoDiscount'];
        this.ItemDiscount= res['data']['OrderHeaders']['ItemDiscount'] == null ? 0 : res['data']['OrderHeaders']['ItemDiscount'];
        this.CouponDiscount = res['data']['OrderHeaders']['CouponDiscount']== null ? 0 : res['data']['OrderHeaders']['CouponDiscount'];
        // this.CouponPromoDesc = res['data']['OrderHeaders']['CouponPromoDesc']== null ? 0 : res['data']['OrderHeaders']['CouponPromoDesc'];
        this.PromoDiscount = res['data']['OrderHeaders']['PromoDiscount']== null ? 0 : res['data']['OrderHeaders']['PromoDiscount'];
        if(this.orderInfo['returnButton']['desc'] != undefined && this.orderInfo['returnButton']['desc'] != null && this.orderInfo['returnButton']['desc'] != ''){
          this.returnDesc = this.orderInfo['returnButton']['desc'];
        }
        if(this.orderInfo['cancelButton']['desc'] != undefined && this.orderInfo['cancelButton']['desc'] != null && this.orderInfo['cancelButton']['desc'] != ''){
          this.cancelDesc = this.orderInfo['cancelButton']['desc'];
        }

        this.totalSavings = this.ItemDiscount + this.CouponDiscount + this.PromoDiscount;
        // console.log(this.totalSavings)
        this.spinner.hide();
        this.isloading = false;
        if(this.orderDetails.OrderStatusId != 8 && this.orderDetails.OrderStatusId != 5){
          this.getcancelReasonList();
        }
        this.orderDetailsWebEngage(this.orderDetails, this.orderItems)
      } else {
        this.orderDetails = '';
        this.orderItems = [];
        this.orderTracker = [];
        this.orderInfo = '';
        this.orderUrl = '';
        this.totalSavings = 0;
        this.spinner.hide();
        this.isloading = false;
      }
    })
  }

  getPaymentGatewayList(param: any) {
    // debugger;
    this.spinner.show();
    this.isloading = true;
    this.paynowService.getPgListById('webapi/cartapp/paynow_pg_list', param).subscribe((res: any) => {
      // console.log(res);
      this.spinner.hide();
      
      console.log(res);
      this.orderDetails = res['data']['orderDetails'];
      this.paymentGateways = res['data']['pgList'];
      this.totalPayableAmount = res['data']['totalPayableAmount'];
      let count = 0;
      for(let od of this.orderDetails){
        count += od.total_count;
      }
      this.totalItemsOrdered = count;
      console.log(this.paymentGateways);
      console.log("order details", this.orderDetails);
    })
  }

  getInvoice(invoiceId: any) {
    // console.log(invoiceId)
  }
  getPGlistForCOD(id: any) {
    let orderId = btoa(id)
    this.router.navigate(['customers/dashboard/paynow', orderId]);
  }
  getcancelReasonList() {
    // this.orderService.getcancelReasonList('customers/order/cancelOrderReason').subscribe((res: any) => {
    this.orderService.getcancelReasonList('webapi/order/cancelOrderReason').subscribe((res: any) => {
      // console.log(res);
      // if(res && res['result']['rs']['Success'] == 1){
      //   this.cancelReasonList = res['result']['rs']['order_cancel']
      // }
      if (res && res['status'] == 200) {
        this.cancelReasonList = res['data']['OrderData']
      }
    })
  }

  canceOrder() {
    this.cancelSuccess = false;
    if (this.cancelationReason != '') {
      let fd = new FormData();
      fd.append('orderId', this.orderDetails.OrderId);
      fd.append('cancelReason', this.cancelationReason);
      fd.append('payment_method', this.orderDetails.TypeofPayment);
      this.spinner.show();
      this.isloading = true;
      // this.orderService.cancelOrder('customers/order/cancelOrder', fd).subscribe((res: any) => {
      this.orderService.cancelOrder('webapi/order/cancelOrder', fd).subscribe((res: any) => {
        // this.orderDetails = res;
        // console.log(res);
        if (res && res['status'] == 200) {
          this.respMsg = 'Order cancelled successfully';
          this.cnlsRspModal.nativeElement.click();
          this.spinner.hide();
          this.cancelationReason = '';
          this.cnlsOrd.nativeElement.value = ''
          this.cancelSuccess = true;
          // this.router.navigate(['/Dashboard/MyOrders'])
        } else {
          this.spinner.hide();
          this.respMsg = res.message;
          this.cnlsRspModal.nativeElement.click();
          this.cancelationReason = '';
          this.cnlsOrd.nativeElement.value = ''
          // this.isloading = false;
        }
      })
    } else {
      this.cnlsMsg = true;
    }
  }

  setCancelReason(evnt: any) {
    this.cancelationReason = evnt.target.value;
    if (this.cancelationReason == '') {
      this.cnlsMsg = true;
    } else {
      this.cnlsMsg = false;
    }
  }

  cancelReset() {
    this.cancelationReason = '';
    this.cnlsOrd.nativeElement.value = '';
    if (this.cancelSuccess == true) {
      this.router.navigate(['customers/dashboard/orderlist'])
    }
  }

  returnRequest(orderid: any, invoiceid: any) {
    // console.log(orderid, invoiceid);
    let orderID = btoa(orderid);
    let invoiceID = btoa(invoiceid)

    // let orderID = btoa('101002497677');
    // let invoiceID = btoa('2238332');
    this.router.navigate(['customers/dashboard/returnrequest', orderID, invoiceID]);
  }

  viewTrackDetails(link: any) {
    // let link1 = 'https://sastasundar.com/dabur-chyawanprash-jar-3x-immunity-action-2-kg-dabur-india-limited/p/ra4sqdl'
    // window.open(link1, "_blank");
    window.open(link, "_blank");
    this.trackOrderWebEngage()

  }


  orderDetailsWebEngage(dtls: any, items: any) {
    let webData = {
      'Order ID': dtls.OrderId.toString(),
      'Product Details': items ? items : [],
      'Status': dtls.CustOrderStatusDesc
    }
    this.webengageService.trackEvent('My Order Details Viewed', webData);
  }

  trackOrderWebEngage() {
    this.webengageService.trackEvent('Track Order Status Clicked', {});
  }

  placeOrder(data: any) {
    console.log(data);
    console.log(this.orderDetails);
    this.msgText = '';
    this.spinner.show();
    let fd = new FormData();
    // this.gatewayDetails = pg;
    // console.log(this.gatewayDetails);
    if (data['PgType'] != '' && data['PgType'] != null && data['PgType'] != undefined) {
      fd.append('PayOption', data['PgType']);
    } else {
      fd.append('PayOption', '');
    }
    if (data['Key'] == 'PAYTMPG') {
      fd.append('PaymentGateWay', 'PAYTMPG');
    } else {
      fd.append('PaymentGateWay', data['Key']);
    }
    fd.append('OrderId', this.orderDetails[0].order_id);
    console.log(this.orderDetails[0].order_id);
    this.paynowService.getGatewayInfo('webapi/cartapp/paynow_gatewayinfo', fd).subscribe((response: any) => {
      console.log(response);
      console.log(response['data']['data']['EasebuzzDetails']['PayUrl']);
      if (response && response['status'] == 200) {
        let EZdata = response['data']['data']['EasebuzzDetails'];
        this.EASEBUZZPepayment(EZdata);
        this.spinner.hide();
      }
    });
  }

  EASEBUZZPepayment(data: any) {
    // console.log(data);
    let url = data.PayUrl;
    window.open(url, '_self');
  }

}
