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
