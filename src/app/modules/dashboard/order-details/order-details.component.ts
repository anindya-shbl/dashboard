import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { WebEngageService } from '../../../services/web-engage.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit {

  orderDetails : any = '';
  orderItems : any = [];
  orderTracker: any = [];
  orderUrl: any = '';
  totalSavings: any = 0;
  isloading: boolean = false;
  cancelReasonList: any=[]
  cancelationReason: any = '';
  cnlsMsg: boolean = false;
  cancelSuccess: boolean =false;

  ItemDiscount : any = 0;
  CouponDiscount : any = 0;
  CouponPromoDesc : any = 0;
  PromoDiscount : any = 0;
  orderInfo : any = '';
  cancelDesc: any = '';
  returnDesc: any = '';

  respMsg: any = '';
  @ViewChild('cnlsRspModal') cnlsRspModal: any;
  @ViewChild('cnlsOrd') cnlsOrd: any;

  constructor(private router: Router, private activatedRoute : ActivatedRoute, private orderService : OrderService, private spinner: NgxSpinnerService, public CommonService: CommonService, private webengageService: WebEngageService){}

  ngOnInit(): void {
    let orderId = this.activatedRoute.snapshot.params['orderID'];
    // let orderId = 'AwIHfl5SHgJvFg==';
    // console.log(orderId, typeof('orderId'))
    if(orderId != undefined || orderId != ''){
      let fd = new FormData();
      fd.append('orderId', atob(orderId));
      this.orderDetailById(fd);
    }
    
  }

  orderDetailById(param: any){
    this.spinner.show();
    this.isloading = true;
    // let res : any = {"data":{"ShortInfo":{"heading":"Return request received","desc":"Return Request Placed On 09 April 2025, 12:58 PM","colorStatus":"BLUE","color":"#0090DD","bgColor":"#F1F9FE","cancelButton":{"isVisible":false,"heading":"","desc":""},"returnButton":{"isVisible":true,"heading":"Return Items","desc":"(Item(s) Eligible for return until 23 April 2025)"}},"OrderHeaders":{"OrderId":101002481167,"OrderDate":"2025-04-09 12:29:42.920","InvoiceId":2228777,"FullName":"test HB","PatientName":"sumit das","ItemDiscount":14.52,"OrderAmount":96.8,"ShippingCharge":0,"CourierCharge":0,"OrderBillAmount":82,"RoundOfSign":"-","RoundOfVal":0.56,"EwalletVal":0,"DueAmount":0,"TypeofPayment":"COD","PaymentMode":"","Addline":"test add","City":"Kolkata","StateName":"West Bengal","PinCode":700156,"PromoId":null,"PromoCode":null,"PromoDesc":null,"ApplicationType":" ","OrderType":"P","OrderStatusId":5,"CouponPromoId":null,"CouponPromoCode":null,"CouponPromoDesc":null,"PromoDiscount":0,"CouponDiscount":0,"InvoiceNo":"WB03126MB0000003","IsCourierOrder":0,"DocketNo":"","CompanyName":"","CustOrderStatusDesc":"Pending Seller Approval","PaidAmount":82,"IsSalesReturnActive":1,"IsEdited":0,"EditComment":"","PayStatusDesc":"","PGTitle":null,"IsRefundInitiated":0,"RefundAmount":null,"RefundInitiatedDate":null,"SalesReturnStatusId":1,"SalesReturnStatusDesc":"Pending Seller Approval","ReturnUpdatedDate":"2025-04-09 12:58:03.330","IsCancel":"N","SellerMasId":null,"DeliveryDate":"2025-04-09 14:50:42.000","SubscriptionId":null,"SubscriptionDiscount":null,"NickName":"sumit - Home","CustContactNo":6000000110,"Landmark":"land mark","ServiceArea":null,"WarehouseId":1,"IsOutStation":1,"IsPrescriptionUploaded":0,"HBId":11010,"ContactNo":"0332356025844,03325905856\/58,","HBAddLine":"HNBVKOYDXI","HBCity":"Baruipur","HBStateName":"West Bengal","HBPinCode":700144,"ConvienceFee":0.28,"SmallOrderFee":0,"AWBNo":null,"TrackingLink":null,"OnlinePaid":null,"IsTrackReturnAvailable":1,"IsOrderTrackAvailable":0,"IsRatingReviewEnabled":0,"IsReorderActive":1,"InvoiceURL":"http:\/\/serv-customer.sshtms.prv\/index.php\/webapi\/invoice\/generatePDF\/MjIyODc3Nw==\/NTg4ODEy","0":"","DeliveryMsg":"","RefundMessage":""},"OrderItems":[{"ProductId":26982,"DisplayName":"D Cal 500 mg Tab (10 Tab)","MRP":48.4,"ProductImage":null,"PromoId":null,"PromoCode":null,"PromoDesc":null,"SSCurrencyValue":0,"OrderItemVal":82.28,"OfferPrice":41.14,"CustomProductName":"","Rating":0,"ProductName":"D Cal","CouponPromoId":null,"CouponPromoCode":null,"CouponPromoDesc":null,"IsCustomizeProduct":0,"XplorPoint":0,"XplorPointVal":0,"PrescriptionOTC":"P","InteractiveModule":null,"InteractiveHealthProfileId":null,"MfgGroup":"ERIS LIFESCIENCES PVT. LTD","SaltName":"CALCIUM CARBONATE + VITAMIN D3","EncodeProdId":"zmg8hy","IsGiftableProduct":null,"DosageForm":"Tablet","SellerMasId":null,"ItemQuantity":2,"ItemDiscount":14.52,"ProductImageURL":""}],"trackDetails":[{"OrderStatusHistoryId":10944793,"OrderStatusId":1,"OrderStatusDesc":"Pending Approval by HB","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2025-04-09 12:29:42.920","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":null,"OrderStatusId":null,"OrderStatusDesc":"Pharma Verification","Comments":"Auto Verified As HB Placed order","UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2025-04-09 12:29:43.057","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":10944795,"OrderStatusId":2,"OrderStatusDesc":"Order Placed","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2025-04-09 12:29:43.073","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":10944797,"OrderStatusId":3,"OrderStatusDesc":"Invoice Generated","Comments":null,"UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2025-04-09 12:33:03.607","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":null,"OrderStatusId":null,"OrderStatusDesc":"Segregated","Comments":"\n\r04\/09\/2025: ","UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2025-04-09 12:49:05.780","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":10944799,"OrderStatusId":12,"OrderStatusDesc":"Packed","Comments":"\n\r04\/09\/2025: ","UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2025-04-09 12:49:46.360","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":10944801,"OrderStatusId":14,"OrderStatusDesc":"Order Sorted and Dispatched","Comments":null,"UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2025-04-09 12:50:20.457","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":10944802,"OrderStatusId":4,"OrderStatusDesc":"Received By HB","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2025-04-09 12:50:42.230","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":10944803,"OrderStatusId":5,"OrderStatusDesc":"Delivered","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2025-04-09 14:50:42.000","UserType":"B","0":"","4":""}],"returnUrl":"","OriginalItems":[],"order_track_details":[{"DisplaySequence":1,"StatusType":"Order Placed","orderProcessStatus":1,"lastActiveStatus":0,"orderProcessCancelStatus":0,"UpdatedDate":"09 April, 12:29 PM","StatusMessage":""},{"DisplaySequence":2,"StatusType":"Order Confirmed","orderProcessStatus":1,"lastActiveStatus":0,"orderProcessCancelStatus":0,"UpdatedDate":"09 April, 12:33 PM","StatusMessage":""},{"DisplaySequence":4,"StatusType":"Order Shipped","orderProcessStatus":1,"lastActiveStatus":0,"orderProcessCancelStatus":0,"UpdatedDate":"09 April, 12:50 PM","StatusMessage":""},{"DisplaySequence":5,"StatusType":"Order Delivered","orderProcessStatus":1,"lastActiveStatus":1,"orderProcessCancelStatus":0,"UpdatedDate":"09 April, 02:50 PM","StatusMessage":""}]},"message":"success","response_code":"0"}
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

  getInvoice(invoiceId: any){
    // console.log(invoiceId)
  }

  getcancelReasonList(){
    // this.orderService.getcancelReasonList('customers/order/cancelOrderReason').subscribe((res: any) => {
    this.orderService.getcancelReasonList('webapi/order/cancelOrderReason').subscribe((res: any) => {
      // console.log(res);
      // if(res && res['result']['rs']['Success'] == 1){
      //   this.cancelReasonList = res['result']['rs']['order_cancel']
      // }
      if(res && res['status'] == 200){
        this.cancelReasonList = res['data']['OrderData']
      }
    })
  }

  canceOrder() {
    this.cancelSuccess =false;
    if(this.cancelationReason != ''){
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
      if(res && res['status'] == 200){
        this.respMsg = 'Order cancelled successfully';
        this.cnlsRspModal.nativeElement.click();
        this.spinner.hide();
        this.cancelationReason = '';
        this.cnlsOrd.nativeElement.value = ''
        this.cancelSuccess =true;
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
    }else{
      this.cnlsMsg = true;
    }
  }

  setCancelReason(evnt: any){
    this.cancelationReason = evnt.target.value;
    if(this.cancelationReason == ''){
      this.cnlsMsg = true;
    }else{
      this.cnlsMsg = false;
    }
  }

  cancelReset(){
    this.cancelationReason = '';
    this.cnlsOrd.nativeElement.value = '';
    if(this.cancelSuccess == true){
      this.router.navigate(['customers/dashboard/orderlist'])
    }
  }

  returnRequest(orderid: any, invoiceid: any){
    // console.log(orderid, invoiceid);
    let orderID = btoa(orderid);
    let invoiceID = btoa(invoiceid)

    // let orderID = btoa('101002497677');
    // let invoiceID = btoa('2238332');
    this.router.navigate(['customers/dashboard/returnrequest', orderID, invoiceID]);
  }

  viewTrackDetails(link: any){
    // let link1 = 'https://sastasundar.com/dabur-chyawanprash-jar-3x-immunity-action-2-kg-dabur-india-limited/p/ra4sqdl'
    // window.open(link1, "_blank");
    window.open(link, "_blank");
    this.trackOrderWebEngage()

  }


  orderDetailsWebEngage(dtls: any, items: any){
    let webData = {
      'Order ID' : dtls.OrderId.toString(),
      'Product Details' : items ? items : [] ,
      'Status' : dtls.CustOrderStatusDesc
    }
    this.webengageService.trackEvent('My Order Details Viewed', webData);
  }

  trackOrderWebEngage(){
    this.webengageService.trackEvent('Track Order Status Clicked', {});
  }

}
