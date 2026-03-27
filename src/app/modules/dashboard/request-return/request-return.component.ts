import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-request-return',
  templateUrl: './request-return.component.html',
  styleUrl: './request-return.component.scss'
})
export class RequestReturnComponent {

  ItemDetails: any = [];
  orderId: any = '';
  invoiceId: any = '';
  // decodedId: any = '';
  orderQty: any = [];
  returnItems: any = [];
  isloading: boolean = false;
  fullOrder: any = '';
  fullReturnReason: any = '';
  allReasonList: any = [];
  individualReasonList: any = [];
  remarks: any = '';
  attachedFile: any = '';
  uploadedFile: any = '';
  preview: any = '';
  IsAllReturn : boolean = false;

  respMsg: any = '';

  RefundToPG: any = 0;
  RefundToWA: any = 0;

  @ViewChild('ReturninfoModal') ReturninfoModal: any;
  @ViewChild('ReturnsucessModal') ReturnsucessModal: any;
  @ViewChild('PreviewModal') PreviewModal: any;
  @ViewChild('allRsn') allRsn: any;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('imageFile') imageFile: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private CommonService: CommonService,
    public authService: AuthService) { }

  ngOnInit(): void {

    let encodedOrderId = this.activatedRoute.snapshot.params['orderID'];
    let encodedInvoiceId = this.activatedRoute.snapshot.params['invoiceID'];

    if((encodedOrderId != undefined || encodedOrderId != '' || encodedOrderId != null) && ((encodedInvoiceId != undefined || encodedInvoiceId != '' || encodedInvoiceId != null))){
    // if (encodedOrderId != undefined || encodedOrderId != '' || encodedOrderId != null) {
      this.spinner.show();

      this.orderId = atob(encodedOrderId);
      this.invoiceId = atob(encodedInvoiceId);

      // console.log(this.orderId, this.invoiceId);

      let fd = new FormData();
      // fd.append('orderId', this.orderId);
      fd.append('OrderId', this.orderId);
      fd.append('InvoiceId', this.invoiceId);
      this.returnRequestById(fd);
    }
  }

  returnRequestById(param: any) {
    this.spinner.show();
    this.isloading = true;
    this.ItemDetails = [];
    // this.orderService.getOrderDetailById('customers/order/viewOrder', param).subscribe((res: any) => {

    this.orderService.getReturnRequest('webapi/orders/customer_sales_return_request', param).subscribe((res: any) => {

      // console.log(res);
      //  let res: any = {"data":{"Invoicedetails":[{"RwNo":1,"DisplayName":"Brozeet LS Exp 100 ml","InvoiceId":2228598,"InvoiceItemId":7668239,"OrderedQuantity":7,"SalesReturnQty":5,"PrevReturnedQty":2,"MRP":60.75,"BatchNo":"AH4269046","ClosedQuantity":0,"ReasonList":"Doctor Stopped The Product","OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":1372,"SourceProductId":10001368,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":2,"DisplayName":"Caroza Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668248,"OrderedQuantity":8,"SalesReturnQty":5,"PrevReturnedQty":3,"MRP":100,"BatchNo":"LP1227","ClosedQuantity":0,"ReasonList":"Doctor Changed the Medicine","OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":76,"SourceProductId":10000150,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":3,"DisplayName":"Irozorb Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668246,"OrderedQuantity":8,"SalesReturnQty":8,"PrevReturnedQty":0,"MRP":90,"BatchNo":3474009,"ClosedQuantity":0,"ReasonList":null,"OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":5959,"SourceProductId":10005968,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":4,"DisplayName":"Rozat 5 mg Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668247,"OrderedQuantity":7,"SalesReturnQty":7,"PrevReturnedQty":0,"MRP":47.5,"BatchNo":"RTA40815","ClosedQuantity":0,"ReasonList":null,"OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":679,"SourceProductId":10000708,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":5,"DisplayName":"Rozavel 10 mg Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668240,"OrderedQuantity":8,"SalesReturnQty":6,"PrevReturnedQty":2,"MRP":112,"BatchNo":"EAM0582","ClosedQuantity":0,"ReasonList":"Product Not Required Anymore","OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":1965,"SourceProductId":10002145,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":6,"DisplayName":"Rozavel EZ Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668241,"OrderedQuantity":9,"SalesReturnQty":8,"PrevReturnedQty":1,"MRP":130,"BatchNo":"EAN0003","ClosedQuantity":0,"ReasonList":"Product Not Required Anymore","OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":2185,"SourceProductId":10002146,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":7,"DisplayName":"Rozucor 20 mg Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668243,"OrderedQuantity":8,"SalesReturnQty":8,"PrevReturnedQty":0,"MRP":245,"BatchNo":"2M76A007","ClosedQuantity":0,"ReasonList":null,"OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":4559,"SourceProductId":10003460,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":8,"DisplayName":"Rozucor F 5 mg Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668244,"OrderedQuantity":8,"SalesReturnQty":8,"PrevReturnedQty":0,"MRP":77,"BatchNo":48813015,"ClosedQuantity":0,"ReasonList":null,"OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":4567,"SourceProductId":10003468,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":9,"DisplayName":"Rozustat 5 mg Tab (10 Tab)","InvoiceId":2228598,"InvoiceItemId":7668245,"OrderedQuantity":8,"SalesReturnQty":8,"PrevReturnedQty":0,"MRP":46.5,"BatchNo":"HRN405A","ClosedQuantity":0,"ReasonList":null,"OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":5849,"SourceProductId":10005858,"CanReturnReason":"","CanReturnReasonShow":0},{"RwNo":10,"DisplayName":"Tacroz Forte Ointment 10 gm","InvoiceId":2228598,"InvoiceItemId":7668242,"OrderedQuantity":8,"SalesReturnQty":8,"PrevReturnedQty":0,"MRP":360.4,"BatchNo":11141320,"ClosedQuantity":0,"ReasonList":null,"OrderId":101002479954,"OrderDate":"2025-02-12 19:13:27.623","OrderStatusId":5,"InvoiceNo":"WB03125MTI000214","OrderAmount":10174.95,"OrderBillAmount":8344.45,"IsNonReturnable":0,"IsNonReturnableForApp":0,"IsIcePacked":0,"SSC":0,"ProductId":3853,"SourceProductId":10004366,"CanReturnReason":"","CanReturnReasonShow":0}],"Comments":[{"SalesReturnItemId":226860,"ReviewAttachUnqId":2025021816117144,"attachpath":" ","ItemReturnHBComment":"","ItemReturnAttachmentComment":"2025021816117144 -- 18-02-2025 04:17:44 -- ","ItemReturnAdminComment":"","ItemReturnReceiptComment":"","SalesReturnStatusId":1,"SalesReturnStatusDesc":"Pending","ItemReturnCustComment":"18-02-2025 04:17:44 -- ","ItemReturnHBAsAdminComment":null},{"SalesReturnItemId":226861,"ReviewAttachUnqId":2025021816117144,"attachpath":" ","ItemReturnHBComment":"","ItemReturnAttachmentComment":"2025021816117144 -- 18-02-2025 04:17:44 -- ","ItemReturnAdminComment":"","ItemReturnReceiptComment":"","SalesReturnStatusId":1,"SalesReturnStatusDesc":"Pending","ItemReturnCustComment":"18-02-2025 04:17:44 -- ","ItemReturnHBAsAdminComment":null},{"SalesReturnItemId":226862,"ReviewAttachUnqId":2025021816117144,"attachpath":" ","ItemReturnHBComment":"","ItemReturnAttachmentComment":"2025021816117144 -- 18-02-2025 04:17:44 -- ","ItemReturnAdminComment":"","ItemReturnReceiptComment":"","SalesReturnStatusId":1,"SalesReturnStatusDesc":"Pending","ItemReturnCustComment":"18-02-2025 04:17:44 -- ","ItemReturnHBAsAdminComment":null},{"SalesReturnItemId":226908,"ReviewAttachUnqId":2025022518126112,"attachpath":" ","ItemReturnHBComment":"","ItemReturnAttachmentComment":"2025022518126112 -- 25-02-2025 06:26:12 -- ","ItemReturnAdminComment":"","ItemReturnReceiptComment":"","SalesReturnStatusId":1,"SalesReturnStatusDesc":"Pending","ItemReturnCustComment":"25-02-2025 06:26:12 -- ","ItemReturnHBAsAdminComment":null}],"AllReasonList":[{"14":"Product Not Required Anymore"},{"15":"Doctor Stopped The Product"},{"16":"Patient Demised"},{"17":"Doctor Changed the Medicine"}],"IndividualReasonList":[{"14":"Product Not Required Anymore"},{"15":"Doctor Stopped The Product"},{"16":"Patient Demised"},{"17":"Doctor Changed the Medicine"}]},"response_code":"0","message":"Successful"}

      if (res && res['response_code'] == 0) {
        let arr: any = [];
        let items = res['data']['Invoicedetails'];

        items.forEach((elm: any) => {
          let qtyArr = [];
          for (let i = 0; i < elm.SalesReturnQty; i++) {
            qtyArr.push(i + 1);
          }
          let obj: any = { ...elm, selected: false, qtylist: qtyArr };
          arr.push(obj);
        });

        this.IsAllReturn = arr.some((el: any) => (el.SalesReturnQty > 0 && el.IsNonReturnable == 0));

        this.ItemDetails = arr;
        this.allReasonList = res['data']['AllReasonList'];
        this.individualReasonList = res['data']['IndividualReasonList'];
        this.spinner.hide();
        this.isloading = false;
      } else {
        this.ItemDetails = [];
        this.spinner.hide();
        this.isloading = false;
      }
    })
  }

  setReturnProductList(evnt: any, item: any) {
    if (item.selected == false && item.IsNonReturnable !=1 && item.SalesReturnQty>0) {
      let obj = {
        "Productid": item.InvoiceItemId,
        "sales_return_reason": '',
        "Order_return_qty": item.SalesReturnQty,
        "order_qty": item.OrderedQuantity,
      }

      this.returnItems.push(obj);

      this.ItemDetails = this.ItemDetails.map((obj: any) => {
        if (obj.InvoiceItemId == item.InvoiceItemId) {
          return { ...obj, selected: true };
        }
        return obj;
      });
    } else {
      this.ItemDetails = this.ItemDetails.map((obj: any) => {
        if (obj.InvoiceItemId == item.InvoiceItemId) {
          return { ...obj, selected: false };
        }
        return obj;
      });
      this.returnItems = this.returnItems.filter((d: any) => d.Productid !== item.InvoiceItemId);
    }
    // console.log(this.returnItems, this.ItemDetails)
  }

  setQty(evnt: any, item: any) {
    let qty = evnt.target.value;
    this.returnItems = this.returnItems.map((obj: any) => {
      if (obj.Productid == item.InvoiceItemId) {
        return { ...obj, Order_return_qty: qty };
      }
      return obj;
    });
    // console.log(qty, this.returnItems)
  }

  setReason(event: any, item: any) {
    let rsn = event.target.value;
    this.returnItems = this.returnItems.map((obj: any) => {
      if (obj.Productid == item.InvoiceItemId) {
        return { ...obj, sales_return_reason: rsn };
      }
      return obj;
    });
    // console.log(rsn, this.returnItems)
  }

  returnAllItems(evnt: any) {
    if (evnt.target.checked == true) {

      this.returnItems = [];

      let arr: any = [];
      this.fullOrder = '1';

      this.ItemDetails.forEach((item: any) => {
        if(item.IsNonReturnable != 1 && item.SalesReturnQty >0){
          let obj = {
            "Productid": item.InvoiceItemId,
            "sales_return_reason": '',
            "Order_return_qty": item.SalesReturnQty,
            "order_qty": item.OrderedQuantity,
          }
          this.returnItems.push(obj);
          let dts = { ...item, selected: true };
          arr.push(dts)
        }else{
          let dts = { ...item, selected: false };
          arr.push(dts)
        }
      });

      this.ItemDetails = arr;

      // console.log('true', this.returnItems, this.ItemDetails);
    } else {
      this.fullOrder = '';
      this.returnItems = [];
      let arr: any = [];
      this.ItemDetails.forEach((item: any) => {
        let dts = { ...item, selected: false };
        arr.push(dts)
      });

      this.ItemDetails = arr;
      this.allRsn.nativeElement.value = '';

      // console.log('true', this.returnItems, this.ItemDetails);
    }
  }

  setAllReason(event: any) {
    // console.log(event.target.value);
    // debugger
    this.fullReturnReason = event.target.value;
    let arr: any = [];
    this.returnItems.forEach((item: any) => {
      let obj = { ...item, sales_return_reason: event.target.value };
      arr.push(obj)
    });

    this.returnItems = arr;
    // console.log('true', this.returnItems);
  }


  onSelectFile(event: any) {
    this.uploadedFile = '';
    this.preview = '';
    const files = event.target.files[0];

    // console.log(files);
    if (files) {
      let totalMb = files.size;
      let checkMb = Math.round(totalMb / (1024 * 1024));

      if (checkMb <= 3) {
        const reader = new FileReader();
        this.uploadedFile = files;

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };
        reader.readAsDataURL(this.uploadedFile);
      } else {
        // alert("you can upload maximum 3Mb file");
        this.respMsg = 'you can upload maximum 3Mb file';
        this.ReturninfoModal.nativeElement.click();
        this.uploadedFile = '';
        this.preview = '';
        event.srcElement.value = null;
      }
    }
    // event.srcElement.value = null;
  }

  uploadFile() {
    let formData = new FormData();
    formData.append("refFiles", this.uploadedFile);
    this.spinner.show();
    // this.CommonService.uploadImage('upload/prescription/v2', formData).subscribe((res: any) => {
    this.CommonService.uploadImage('upload/images', formData).subscribe((res: any) => {
      // console.log(res);
      if (res && (res['msg'] == "success")) {
        this.attachedFile = res['data'][0]['FilePath'];
        this.respMsg = 'File uploaded successfully';
        this.ReturninfoModal.nativeElement.click();
        this.spinner.hide()
      }
    })
  }

  returnPrevew(){
    this.respMsg = '';

    if (this.fullOrder == '1' && this.fullReturnReason == '') {
      this.respMsg = 'Please select return reason';
      this.ReturninfoModal.nativeElement.click();
      return;
    } else {
      const found = this.returnItems.some((el: any) => el.sales_return_reason == '');
      if (found) {
        // alert('Please select reason for selected product .');
        this.respMsg = 'Please select return reason for selected products.';
        this.ReturninfoModal.nativeElement.click();
        return;
      } else {
        this.respMsg = '';
        let newList = this.returnItems.map((ds: any) => {
          let data = this.ItemDetails.find((ls: any) => ls.InvoiceItemId == ds.Productid);
          return { ...ds, Productid: data.ProductId };
        });
        let preViewList = JSON.stringify(newList);
        let fd = new FormData();
        fd.append("OrderId", this.orderId);
        fd.append("InvoiceId", this.invoiceId);
        fd.append("ItemDetails", preViewList);

        // this.spinner.show();

        this.orderService.submitReturnRequest('webapi/orders/customer_sales_return_preview', fd).subscribe((res: any) => {
          // console.log(res);
          if (res && res['status'] == 2000) {
            // this.respMsg = res['data']['message'];
            if(res['data']['RefundToPG'] != null && res['data']['RefundToPG'] != undefined && res['data']['RefundToPG'] != ''){
              this.RefundToPG = res['data']['RefundToPG'];
            }else{
              this.RefundToPG = 0
            };
            if(res['data']['RefundToWA'] != null && res['data']['RefundToWA'] != undefined && res['data']['RefundToWA'] != ''){
              this.RefundToWA = res['data']['RefundToWA'];
            }else{
              this.RefundToWA = 0
            };
            
            this.PreviewModal.nativeElement.click();
            this.spinner.hide();
          } else {
            this.respMsg = res['message'];
            this.ReturninfoModal.nativeElement.click();
            this.spinner.hide();
          }
        })
      }
    }
  }

  submitRequest() {
    this.respMsg = '';

    if (this.fullOrder == '1' && this.fullReturnReason == '') {
      this.respMsg = 'Please select return reason';
      this.ReturninfoModal.nativeElement.click();
      return;
    } else {
      const found = this.returnItems.some((el: any) => el.sales_return_reason == '');
      if (found) {
        // alert('Please select reason for selected product .');
        this.respMsg = 'Please select return reason for selected products.';
        this.ReturninfoModal.nativeElement.click();
        return;
      } else {
        this.respMsg = '';
        let ItemDetails = JSON.stringify(this.returnItems);
        let fd = new FormData();
        fd.append("OrderId", this.orderId);
        fd.append("InvoiceId", this.invoiceId);
        fd.append("ItemDetails", ItemDetails);
        fd.append("Attachedfiles", this.attachedFile);
        fd.append("Full_Order", this.fullOrder);
        fd.append("OrderType", '');
        fd.append("SellerId", '');
        fd.append("DeliveryDate", '');
        fd.append("shipping_date", '');
        fd.append("PlacedBy", 'C');
        fd.append("ReqByType", 'C');
        fd.append("sales_return_reason_full", this.fullReturnReason);
        fd.append("Comment", this.remarks);

        this.spinner.show();

        this.orderService.submitReturnRequest('webapi/orders/customer_sales_return_submit', fd).subscribe((res: any) => {
          // console.log(res);
          if (res && res['response_code'] == 0) {
            this.respMsg = res['data']['message'];
            this.ReturnsucessModal.nativeElement.click();
            this.spinner.hide();
          } else {
            this.respMsg = res['data']['message'];
            this.ReturninfoModal.nativeElement.click();
            this.spinner.hide();
          }
        })
      }
    }

  }

  redirect() {
    this.router.navigate(['customers/dashboard/orderlist']);
  }

  resetMsg(){
    this.respMsg = '';
    this.RefundToPG = 0;
    this.RefundToWA = 0;
  }

}
