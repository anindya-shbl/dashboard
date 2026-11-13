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
  RedeemedPoints : any = 0;
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
    console.log(param);
    this.orderService.getOrderDetailById('webapi/order/viewOrder', param).subscribe((res: any) => {
      // this.orderDetails = res;
      // console.log(res);
      res = {"data":{"ShortInfo":{"heading":"Your order has been delivered \ud83c\udf89","desc":"Delivered on 14 November 2026","colorStatus":"GREEN","color":"#039855","bgColor":"#EBFFF6","cancelButton":{"isVisible":true,"heading":"Return Items","desc":""},"returnButton":{"isVisible":false,"heading":"","desc":""}},"OrderHeaders":{"OrderId":101002598913,"OrderDate":"2026-11-13 11:49:22.817","InvoiceId":2230391,"FullName":"test HB","PatientName":"Anindya Acharya","ItemDiscount":7.88,"OrderAmount":52.5,"ShippingCharge":0,"CourierCharge":0,"OrderBillAmount":64,"RoundOfSign":"-","RoundOfVal":0.46,"EwalletVal":0,"DueAmount":0,"TypeofPayment":"COD","PaymentMode":"","Addline":",Sealdah - B.R. Singh Hospital, Sealdah, Raja Bazar, Kolkata, West Bengal 700014, India","City":"Kolkata","StateName":"West Bengal","PinCode":700156,"PromoId":null,"PromoCode":null,"PromoDesc":null,"ApplicationType":" ","OrderType":"P","OrderStatusId":5,"CouponPromoId":null,"CouponPromoCode":null,"CouponPromoDesc":null,"PromoDiscount":0,"CouponDiscount":0,"InvoiceNo":"WB03127MT0000219","IsCourierOrder":0,"DocketNo":"","CompanyName":"","CustOrderStatusDesc":"Delivered","PaidAmount":64,"IsSalesReturnActive":1,"IsEdited":0,"EditComment":"","PayStatusDesc":"","PGTitle":null,"IsRefundInitiated":0,"RefundAmount":null,"RefundInitiatedDate":null,"SalesReturnStatusId":null,"SalesReturnStatusDesc":null,"ReturnUpdatedDate":null,"IsCancel":"N","SellerMasId":null,"DeliveryDate":"2026-11-14 11:49:22.000","SubscriptionId":null,"SubscriptionDiscount":null,"NickName":"sdooooo","CustContactNo":9836370209,"Landmark":"","ServiceArea":null,"WarehouseId":1,"IsOutStation":1,"IsPrescriptionUploaded":1,"HBId":11010,"ContactNo":"0332356025844,03325905856\/58,","HBAddLine":"HNBVKOYDXI","HBCity":"Baruipur","HBStateName":"West Bengal","HBPinCode":700144,"ConvienceFee":2,"SmallOrderFee":29,"AWBNo":null,"TrackingLink":null,"OnlinePaid":null,"ScheduleDeliveryDate":"2026-11-14 11:49:22.000","GiftCardValue":null,"IsJitoCFH":0,"RedeemedPoints":11.16,"RedeemedTransactionId":null,"IsTrackReturnAvailable":0,"GigtCardValue":null,"IsOrderTrackAvailable":1,"IsRatingReviewEnabled":0,"IsReorderActive":1,"InvoiceURL":"https:\/\/sastasundar.com\/index.php\/webapi\/invoice\/generatePDF\/MjIzMDM5MQ==\/NTg4Nzk1","PaymentModeOld":"","TypeofPaymentOld":"COD","IsPaynow":0,"0":"","DeliveryMsg":"","RefundMessage":""},"OrderItems":[{"ProductId":12936,"DisplayName":"Cal 360 Tab (10 Tab)","MRP":52.5,"ProductImage":null,"PromoId":null,"PromoCode":null,"PromoDesc":null,"SSCurrencyValue":11.16,"OrderItemVal":33.46,"OfferPrice":44.62,"CustomProductName":"","Rating":0,"ProductName":"Cal 360","CouponPromoId":null,"CouponPromoCode":null,"CouponPromoDesc":null,"IsCustomizeProduct":0,"XplorPoint":0,"XplorPointVal":0,"PrescriptionOTC":"P","InteractiveModule":null,"InteractiveHealthProfileId":null,"MfgGroup":"CIPLA LTD","SaltName":"CALCIUM CARBONATE + MINERALS","EncodeProdId":"sx6r74","IsGiftableProduct":null,"DosageForm":"Tablet","SellerMasId":null,"ItemQuantity":1,"ItemDiscount":7.88,"IsNonReturnable":0,"RedeemedPoints":11.16,"ProductImageURL":""}],"trackDetails":[{"OrderStatusHistoryId":10965443,"OrderStatusId":1,"OrderStatusDesc":"Pending Approval by HB","Comments":null,"UpdatedBy":588795,"UpdatedByName":"Anindya Acharya","UpdatedDate":"2026-11-13 11:49:22.817","UserType":"C","0":"","4":""},{"OrderStatusHistoryId":null,"OrderStatusId":null,"OrderStatusDesc":"Pharma Verification","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2026-11-13 11:53:41.413","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":10965444,"OrderStatusId":2,"OrderStatusDesc":"Order Placed","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2026-11-13 11:53:41.417","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":10965445,"OrderStatusId":3,"OrderStatusDesc":"Invoice Generated","Comments":null,"UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2026-11-13 11:55:20.893","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":null,"OrderStatusId":null,"OrderStatusDesc":"Segregated","Comments":"\n\r11\/13\/2026: ","UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2026-11-13 11:55:52.337","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":10965446,"OrderStatusId":12,"OrderStatusDesc":"Packed","Comments":"\n\r11\/13\/2026: ","UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2026-11-13 11:56:19.157","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":10965447,"OrderStatusId":14,"OrderStatusDesc":"Order Sorted and Dispatched","Comments":null,"UpdatedBy":10001,"UpdatedByName":"SSPL Super Admin","UpdatedDate":"2026-11-13 11:57:13.107","UserType":"A","0":"","4":""},{"OrderStatusHistoryId":10965448,"OrderStatusId":4,"OrderStatusDesc":"Received By HB","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2026-11-13 11:57:32.793","UserType":"B","0":"","4":""},{"OrderStatusHistoryId":10965449,"OrderStatusId":5,"OrderStatusDesc":"Delivered","Comments":null,"UpdatedBy":11010,"UpdatedByName":"test HB","UpdatedDate":"2026-11-13 13:57:32.000","UserType":"B","0":"","4":""}],"returnUrl":"","OriginalItems":[],"order_track_details":[{"DisplaySequence":1,"StatusType":"Order Placed","orderProcessStatus":1,"lastActiveStatus":0,"orderProcessCancelStatus":0,"UpdatedDate":"Today, 11:49 AM","StatusMessage":""},{"DisplaySequence":2,"StatusType":"Order Confirmed","orderProcessStatus":1,"lastActiveStatus":0,"orderProcessCancelStatus":0,"UpdatedDate":"Today, 11:55 AM","StatusMessage":""},{"DisplaySequence":4,"StatusType":"Order Shipped","orderProcessStatus":1,"lastActiveStatus":0,"orderProcessCancelStatus":0,"UpdatedDate":"Today, 11:57 AM","StatusMessage":""},{"DisplaySequence":5,"StatusType":"Order Delivered","orderProcessStatus":1,"lastActiveStatus":1,"orderProcessCancelStatus":0,"UpdatedDate":"Today, 01:57 PM","StatusMessage":""}],"RefundHygiene":[]},"message":"success","response_code":"0"};
      if(res && res['response_code'] == 0){
        this.orderDetails = res['data']['OrderHeaders'];
        this.orderItems = res['data']['OrderItems'];
        this.orderTracker = res['data']['order_track_details'];
        this.orderInfo = res['data']['ShortInfo'];
        // console.log(this.orderDetails, this.orderItems, this.orderTracker);
        // this.totalSavings = res['data']['OrderHeaders']['ItemDiscount'] +  res['data']['OrderHeaders']['PromoDiscount'];
        this.ItemDiscount= res['data']['OrderHeaders']['ItemDiscount'] == null ? 0 : res['data']['OrderHeaders']['ItemDiscount'];
        this.CouponDiscount = res['data']['OrderHeaders']['CouponDiscount']== null ? 0 : res['data']['OrderHeaders']['CouponDiscount'];
        this.RedeemedPoints = res['data']['OrderHeaders']['RedeemedPoints']== null ? 0 : res['data']['OrderHeaders']['RedeemedPoints'];
        this.PromoDiscount = res['data']['OrderHeaders']['PromoDiscount']== null ? 0 : res['data']['OrderHeaders']['PromoDiscount'];
        if(this.orderInfo['returnButton']['desc'] != undefined && this.orderInfo['returnButton']['desc'] != null && this.orderInfo['returnButton']['desc'] != ''){
          this.returnDesc = this.orderInfo['returnButton']['desc'];
        }
        if(this.orderInfo['cancelButton']['desc'] != undefined && this.orderInfo['cancelButton']['desc'] != null && this.orderInfo['cancelButton']['desc'] != ''){
          this.cancelDesc = this.orderInfo['cancelButton']['desc'];
        }

        this.totalSavings = this.ItemDiscount + this.CouponDiscount + this.PromoDiscount + this.RedeemedPoints;
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
  getPGlistForCOD(id: any){
    let orderId = btoa(id)
    this.router.navigate(['customers/dashboard/paynow', orderId]);
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
