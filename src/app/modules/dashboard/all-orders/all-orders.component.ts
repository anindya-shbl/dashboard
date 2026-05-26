import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { CommonService } from '../../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit {

  tabName: any = '';
  respOrders : any=[];
  allOrders : any=[];

  ServiceRequestForm!: FormGroup;
  submitted: boolean = false;

  serviceDetails: any = [];
  subCategoryList: any = [];
  subSubCtgryList: any = [];
  selectedOrder: any = [];
  srProdQty: any = 0;
  srSelectedProd: any = [];
  srImages: any = '';
  preview: any = '';
  attachedFile: any = '';
  damageReason: any = '';
  isloading: boolean = false;
  found: boolean = false;

  respMsg: any = '';
  imgError: any = '';
  currentPage: any = 1;
  loadMoreBtn: boolean = false;

  // ReOrderList: any = [];
  // selectedReorder: any = [];
  // finalReorderList: any = [];

  reorderItems: any = []

  @ViewChild('allorderModal') allorderModal: any;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('imageFile') imageFile: any;
  @ViewChild('ReOrderModal') ReOrderModal: any;

  constructor(
    public commonService: CommonService,
    public authService: AuthService, 
    private router: Router, 
    private orderService : OrderService, 
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private cookieService: CookieService,
    private dbService: NgxIndexedDBService) { }

  ngOnInit(): void {
    this.tabName = 'All-Orders';
    this.getallOrders();
    this.generateform();
    this.getServeiceDetails();
  }

  generateform() {
    this.ServiceRequestForm = this.formBuilder.group({
      Category: ['', Validators.required],
      SubCategory: ['', Validators.required],
      // MobileNo: [''],      
      Comment: ['', Validators.required],      
    })
  }

  get f() { return this.ServiceRequestForm.controls; }

  getallOrders(){
    
    if(this.currentPage == 1){
      this.isloading = true;
      this.spinner.show();
    }
    // this.respOrders = [];
    let curorder: any = [];
    let fd = new FormData();
    fd.append('PageNo',  this.currentPage);
    this.orderService.getAllOrders('webapi/order/myOrderList', fd).subscribe((res: any) => {
      res = {"status":200,"message":"Success","data":{"2026-05-26":{"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","OrderLists":[{"OrderId":101002486474,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":0,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-06-01 00:00:00.000","ScheduleDeliveryDate":"2026-06-01 00:00:00.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"Net Banking","OrderType":"P","OrderBillAmount":120,"OrderTypeDesc":"Medicine","PayStatusDesc":"Paid","OrderItems":[{"ProductId":12936,"DisplayName":"Cal 360 Tab (10 Tab)","ItemBasePrice":52.5,"ItemQuantity":2,"ItemDiscount":15.75,"EncodeProdId":"sx6r74","PrescriptionOTC":"P","SaltName":"CALCIUM CARBONATE + MINERALS","MfgGroup":"CIPLA LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 16:21:05.613","IsPaynow":0},{"OrderId":101002486472,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":68,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-06-01 16:04:37.000","ScheduleDeliveryDate":"2026-06-01 16:04:37.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"COD","OrderType":"P","OrderBillAmount":568,"OrderTypeDesc":"Medicine","PayStatusDesc":"Partially Paid","OrderItems":[{"ProductId":6749,"DisplayName":"Cal Aid Cap (10 Cap)","ItemBasePrice":127,"ItemQuantity":4,"ItemDiscount":76.2,"EncodeProdId":"v8bqh3","PrescriptionOTC":"P","SaltName":"Calcitriol Combinations","MfgGroup":"INDOCO REMEDIES LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]},{"ProductId":12936,"DisplayName":"Cal 360 Tab (10 Tab)","ItemBasePrice":52.5,"ItemQuantity":3,"ItemDiscount":23.63,"EncodeProdId":"sx6r74","PrescriptionOTC":"P","SaltName":"CALCIUM CARBONATE + MINERALS","MfgGroup":"CIPLA LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 16:04:37.093","IsPaynow":1},{"OrderId":101002486468,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":190,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-05-27 15:32:09.000","ScheduleDeliveryDate":"2026-05-27 15:32:09.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"COD","OrderType":"O","OrderBillAmount":190,"OrderTypeDesc":"Household","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":17380,"DisplayName":"Horlicks Chocolate Delight Refill Powder 500 gm","ItemBasePrice":193,"ItemQuantity":1,"ItemDiscount":3.86,"EncodeProdId":"vxu9er","PrescriptionOTC":"O","SaltName":"Horlicks","MfgGroup":"GLAXO (GSK)","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 15:32:09.310","IsPaynow":1},{"OrderId":101002486467,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":109,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-05-27 15:32:09.000","ScheduleDeliveryDate":"2026-05-27 15:32:09.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"COD","OrderType":"P","OrderBillAmount":109,"OrderTypeDesc":"Medicine","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":6749,"DisplayName":"Cal Aid Cap (10 Cap)","ItemBasePrice":127,"ItemQuantity":1,"ItemDiscount":19.05,"EncodeProdId":"v8bqh3","PrescriptionOTC":"P","SaltName":"Calcitriol Combinations","MfgGroup":"INDOCO REMEDIES LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 15:32:09.223","IsPaynow":1},{"OrderId":101002486465,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":76,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-05-27 14:28:16.000","ScheduleDeliveryDate":"2026-05-27 14:28:16.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"COD","OrderType":"P","OrderBillAmount":76,"OrderTypeDesc":"Medicine","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":12936,"DisplayName":"Cal 360 Tab (10 Tab)","ItemBasePrice":52.5,"ItemQuantity":1,"ItemDiscount":7.88,"EncodeProdId":"sx6r74","PrescriptionOTC":"P","SaltName":"CALCIUM CARBONATE + MINERALS","MfgGroup":"CIPLA LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 14:28:16.173","IsPaynow":1},{"OrderId":101002486463,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":120,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-06-01 12:49:02.000","ScheduleDeliveryDate":"2026-06-01 12:49:02.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"COD","OrderType":"P","OrderBillAmount":120,"OrderTypeDesc":"Medicine","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":12936,"DisplayName":"Cal 360 Tab (10 Tab)","ItemBasePrice":52.5,"ItemQuantity":2,"ItemDiscount":15.75,"EncodeProdId":"sx6r74","PrescriptionOTC":"P","SaltName":"CALCIUM CARBONATE + MINERALS","MfgGroup":"CIPLA LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 12:49:02.450","IsPaynow":1},{"OrderId":101002486461,"IsCancel":"Y","PatientName":null,"OrderStatusDesc":"Pending Order Confirmation","OrderStatusId":1,"DueAmount":541,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-06-01 12:08:04.000","ScheduleDeliveryDate":"2026-06-01 12:08:04.000","SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"COD","OrderType":"O","OrderBillAmount":541,"OrderTypeDesc":"Household","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":13140,"DisplayName":"Horlicks Mother Vanilla Refill Powder 500 gm","ItemBasePrice":375,"ItemQuantity":1,"ItemDiscount":7.5,"EncodeProdId":"4z574x","PrescriptionOTC":"O","SaltName":"Horlicks","MfgGroup":"GLAXO (GSK)","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Tuesday, 26th May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-26 12:08:04.453","IsPaynow":1}]},"2026-05-22":{"OrderPlacedOn":"Placed on Friday, 22nd May 2026","OrderLists":[{"OrderId":101002486435,"IsCancel":"N","PatientName":null,"OrderStatusDesc":"Payment Failed","OrderStatusId":9,"DueAmount":541,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-05-28 00:00:00.000","ScheduleDeliveryDate":null,"SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"EASEBUZZ","OrderType":"O","OrderBillAmount":541,"OrderTypeDesc":"Household","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":13140,"DisplayName":"Horlicks Mother Vanilla Refill Powder 500 gm","ItemBasePrice":375,"ItemQuantity":1,"ItemDiscount":7.5,"EncodeProdId":"4z574x","PrescriptionOTC":"O","SaltName":"Horlicks","MfgGroup":"GLAXO (GSK)","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]},{"ProductId":16752,"DisplayName":"Horlicks Classic Malt Refill Powder 500 gm","ItemBasePrice":191,"ItemQuantity":1,"ItemDiscount":19.1,"EncodeProdId":"leepfg","PrescriptionOTC":"O","SaltName":"Horlicks","MfgGroup":"GLAXO (GSK)","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Friday, 22nd May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-22 18:48:46.193","IsPaynow":0},{"OrderId":101002486434,"IsCancel":"N","PatientName":null,"OrderStatusDesc":"Payment Failed","OrderStatusId":9,"DueAmount":153,"IsTrackReturnAvailable":0,"ScheduleDeliveryDate_2":"2026-05-28 00:00:00.000","ScheduleDeliveryDate":null,"SalesReturnStatusId":null,"IsOrderTrackAvailable":1,"ModeofPayment":"EASEBUZZ","OrderType":"P","OrderBillAmount":153,"OrderTypeDesc":"Medicine","PayStatusDesc":"Unpaid","OrderItems":[{"ProductId":6749,"DisplayName":"Cal Aid Cap (10 Cap)","ItemBasePrice":127,"ItemQuantity":1,"ItemDiscount":19.05,"EncodeProdId":"v8bqh3","PrescriptionOTC":"P","SaltName":"Calcitriol Combinations","MfgGroup":"INDOCO REMEDIES LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]},{"ProductId":12936,"DisplayName":"Cal 360 Tab (10 Tab)","ItemBasePrice":52.5,"ItemQuantity":1,"ItemDiscount":7.88,"EncodeProdId":"sx6r74","PrescriptionOTC":"P","SaltName":"CALCIUM CARBONATE + MINERALS","MfgGroup":"CIPLA LTD","IsGiftable":0,"HealthProfileId":0,"CustomProductName":[]}],"OrderPlacedOn":"Placed on Friday, 22nd May 2026","IsReorder":"N","IsSalesReturnActive":0,"InvoiceId":null,"OrderDate":"2026-05-22 18:48:46.163","IsPaynow":0}]}}};
      let data = Object.values(res['data']);
      if(data.length >0){
        console.log("data>"+(res['data']));
        data.forEach((elm: any) =>{
          elm.OrderLists.forEach((order: any) => {
            // this.respOrders.push(order);
            curorder.push(order);            
          });
        });
        if(curorder.length<10){
          this.loadMoreBtn = true;
        }else{
          this.loadMoreBtn = false;
        }
        // this.allOrders = this.respOrders;
        this.respOrders = [...this.respOrders, ...curorder];
        this.allOrders = this.respOrders;
        this.isloading = false;
        this.spinner.hide();
      }else{
        // this.allOrders = [];
        this.isloading = false;
        this.spinner.hide();
      }
      
      // this.allOrders = Object.values(res['data'])
      // console.log('all orders', this.allOrders );
    });
  }

  loadMore(){
    this.currentPage = this.currentPage + 1;
    this.tabName = 'All-Orders';
    this.getallOrders();
  }

  getData(tab: any){
    this.tabName = tab;
    // console.log(this.tabName);
    if(this.tabName == 'All-Orders'){
      this.allOrders = this.respOrders;
    }else{
      this.allOrders = this.respOrders.filter((item: any) => (item['OrderStatusDesc']).includes(this.tabName));
    }
    // console.log(this.allOrders)
  }

  viewOrderDetails(id : any) {
    let orderId = btoa(id)
    this.router.navigate(['customers/dashboard/orderview', orderId]);
  }

  viewSRstatus(id: any){
    let srId = btoa(id)
    this.router.navigate(['customers/dashboard/servicerequest', srId]);
  }

  getServeiceDetails(){
    this.orderService.openServiceRequest('webapi/order/getFeedbackOptions').subscribe((res: any) => {
      if((res['data']['ServiceCategory'] != undefined) && (res['data']['ServiceCategory'] != null)){
        this.serviceDetails = res['data']['ServiceCategory']['record'];
        // console.log('srreq', this.serviceDetails);
      }
      
    })
  }

  ServiceRequest(data: any){
    this.selectedOrder = data;
    this.generateform();
    // console.log(this.selectedOrder);

    this.makeCheck()

  }

  makeCheck(){
    let check: any = [];
    // let items = [...this.selectedOrder.OrderItems, 'selected': false]
    this.selectedOrder.OrderItems.forEach((elm:any)=>{
      let el = {...elm, selected: false, sscId: -1};
      check.push(el)
    });
    this.selectedOrder = {...this.selectedOrder, OrderItems: check}
    // console.log(this.selectedOrder);
  }

  setSubCategory(){
    this.subCategoryList = [];
    this.srSelectedProd = [];
    this.srImages = '';
    this.preview= '';
    this.attachedFile = '';
    this.subSubCtgryList = [];
    this.damageReason = '';
    this.ServiceRequestForm.patchValue({
      SubCategory: ''
    })
    // console.log(this.ServiceRequestForm.value.Category);
    let setsub = this.ServiceRequestForm.value.Category;
    if(setsub != ''){
      this.serviceDetails.forEach((elm: any)=>{
        // console.log(elm.CatId);
        if(elm.CatId == setsub){
          this.subCategoryList= elm.SubCategory
        }
      })
    }
    this.makeCheck()
  }

  setSrProducts(){
    // debugger
    this.srSelectedProd = [];
    this.srImages = '';
    this.preview = '';
    this.attachedFile = '';
    this.subSubCtgryList = [];
    this.respMsg = '';
    this.imgError = '';
    this.found = false;
    if(this.imageFile && this.imageFile.nativeElement.value != undefined){
      this.imageFile.nativeElement.value = '';
    }
    this.damageReason = '';
    let setSubSub = this.ServiceRequestForm.value.SubCategory;
    if(setSubSub == 4){
      this.subCategoryList.forEach((elm: any)=>{
        if(elm.SubCatId == setSubSub){
          this.subSubCtgryList = elm.SubSubCategory;
          // console.log('mmmm', this.subSubCtgryList)
        }
      })
    }
    this.makeCheck()
  }


  setSrProductList(event: any, image: any, itemId: any, qty: any){
    // console.log(event.target.checked, image, itemId, qty, );
    if(event.target.checked == true){
      this.srSelectedProd.push({
        'prdImg' : '',
        'ProductId' : itemId,
        'Qty': qty,
        'DamageMode' : ''
      });
      // console.log(this.srSelectedProd);
      this.setSelect(itemId, 'add');
    }else{
      this.setSelect(itemId, 'del');
      this.srSelectedProd = this.srSelectedProd.filter((item: any) => item.ProductId !== itemId);
      // console.log(this.srSelectedProd);
    }
  }

  updateSrcProductQty(pId: any, qty: any){
    if (this.srSelectedProd.length > 0) {
      let modifiedList = this.srSelectedProd.map((obj: any) => {
        if (obj.ProductId === pId) {
          return { ...obj, Qty: qty };
        }
        return obj;
      });

      this.srSelectedProd = modifiedList;
    }
  }

  onSubmit() {
    // debugger
    this.submitted = true;
    this.found = false;
    // stop here if form is invalid
    if (this.ServiceRequestForm.invalid) {
      return;
    }else if(this.ServiceRequestForm.value.Category == 1){
      if(this.srSelectedProd.length == 0){
        // alert('Minimum one product selection is mandatory.');
        this.respMsg = 'Minimum one product selection is mandatory.';
        // this.allorderModal.nativeElement.click();
        return;
      }else{
        if(this.ServiceRequestForm.value.SubCategory != 2 && this.attachedFile == ''){
          // alert('Upload product image is mandatory.');
          this.imgError = 'Upload product image is mandatory.';
          // this.allorderModal.nativeElement.click();
          return;
        }else if(this.ServiceRequestForm.value.SubCategory == 4){
          this.found = this.srSelectedProd.some((el:any) => el.DamageMode == '');
          // console.log('found...',found);
          if(this.found){
            // alert('Please select reason for selected product .');
            this.respMsg = 'Please select reason for selected product .';
            // this.allorderModal.nativeElement.click();
            return;
          }else{
            this.proceedRequest();
          }
        }else{
          this.proceedRequest();
        }
      }
    }else{
      this.proceedRequest();
    }

  }

  proceedRequest(){
    // console.log('insubmit',this.ServiceRequestForm.value,this.selectedOrder, this.srSelectedProd, this.attachedFile);

      let fd = new FormData();
      fd.append('OrderId', this.selectedOrder.OrderId);      
      fd.append('Comment', this.ServiceRequestForm.value.Comment);
      fd.append('Category', this.ServiceRequestForm.value.Category);
      fd.append('SubCategory', this.ServiceRequestForm.value.SubCategory);
      fd.append('ProductData', JSON.stringify(this.srSelectedProd));
      fd.append('ProductImage', JSON.stringify(this.attachedFile));

      this.orderService.saveServiceRequest('webapi/order/saveCustomerFeedback', fd).subscribe((res: any) => {
        // console.log(res);
        if(res && res['status']==200){
          // this.getAddressList();
          // alert(res.message)
          this.closebutton.nativeElement.click();
          // this.respMsg = res.message;
          this.respMsg = 'Request raiesd successfully';
          this.allorderModal.nativeElement.click();
          this.onReset();
        }else{
          // alert('some thing went wrong. please try again');
          this.closebutton.nativeElement.click();
          this.respMsg = res.message;
          this.allorderModal.nativeElement.click();
          this.onReset();
        }     
      })
  }

  onReset() {
    this.submitted = false;
    this.ServiceRequestForm.reset();
    this.subCategoryList = [];
    this.selectedOrder = [];
    this.srSelectedProd = [];
    this.srProdQty = 0;
    this.srImages = '';
    this.preview = '';
    this.damageReason = '';
    // this.ServiceRequestForm.patchValue({
    //   AddressType: 'H',
    //   AddressName: ''
    // });
  }

  setReason(evnt: any, pId: any){
    // console.log(evnt.target.value);
    this.found = false;

    if (this.srSelectedProd.length > 0) {
      let modifiedList = this.srSelectedProd.map((obj: any) => {
        if (obj.ProductId === pId) {
          return { ...obj, DamageMode: evnt.target.value };
        }
        return obj;
      });

      this.selectedOrder.OrderItems = this.selectedOrder.OrderItems.map((obj: any) => {
        if (obj.ProductId === pId) {
          return { ...obj, sscId: evnt.target.value };
        }
        return obj;
      });

      this.srSelectedProd = modifiedList;
      // console.log(this.srSelectedProd)
    }
  }

  setSelect(pId: any, act: any){
    let check: any = [];
    // let items = [...this.selectedOrder.OrderItems, 'selected': false]
    this.selectedOrder.OrderItems.forEach((elm:any)=>{
      if(elm.ProductId == pId){
        if(act == 'add'){
          let el = {...elm, selected: true, sscId: -1};
          check.push(el)
        }else{
          let el = {...elm, selected: false, sscId: -1};
          check.push(el)
        }        
      }else{
        let el = {...elm};
        check.push(el)
      }
    });
    this.selectedOrder = {...this.selectedOrder, OrderItems: check}
    // console.log(this.selectedOrder);
  }
  
  onSelectFile(event: any) {
    this.srImages = '';
    this.preview = '';
    this.attachedFile = '';
    this.imgError = '';
    const files = event.target.files[0];   

    // console.log(files);
    if (files) {
      let totalMb = files.size;
      let checkMb = Math.round(totalMb / (1024 * 1024));

      if (checkMb <= 3) {
        const reader = new FileReader();
        this.srImages = files;

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.preview = e.target.result;
        };
        reader.readAsDataURL(this.srImages);
      } else {
        // alert("you can upload maximum 3Mb file");
        this.imgError = 'You can upload maximum 3Mb file';
        // this.allorderModal.nativeElement.click();
        this.srImages = '';
        this.preview = '';
        event.srcElement.value = null;
      }
    }
    // event.srcElement.value = null;
  }

  changeFile(){
    this.srImages = '';
    this.preview = '';
    this.attachedFile = '';
    this.imgError = '';
    // this.imageFile.nativeElement.value = '';
  }

  uploadFile() {
    let formData = new FormData();
    formData.append("refFiles", this.srImages);
    this.spinner.show();
    // this.CommonService.uploadImage('upload/prescription/v2', formData).subscribe((res: any) => {
    this.commonService.uploadImage('upload/images', formData).subscribe((res: any) => {
      // console.log(res);
      if (res && (res['msg'] == "success")) {
        this.attachedFile = res['data'][0]['FilePath'];
        this.imgError = '';
        // alert(this.respMsg)
        // this.ReturninfoModal.nativeElement.click();
        this.spinner.hide()
      }else{
        this.attachedFile = '';
        this.imgError = 'Something went wrong, please try again';
        // alert(this.respMsg)
      }
    })
  }

  setReorder_bckp(id: any) {
    // let orderId = btoa(id);
    // this.router.navigate(['dashboard/reorder'], {queryParams:{orderID: orderId}} );
  }

  // setReorder(data: any) {
  //   this.ReOrderList = [];
  //   this.selectedReorder = data;
  //   console.log(data.OrderItems);
  //   let arr: any = [];
  //   data.OrderItems.forEach((elm: any) => {
  //     let obj: any = { ...elm, selected: true, RefOrderId: this.selectedReorder.OrderId};
  //     arr.push(obj);
  //   });

  //   this.ReOrderList = arr;
  //   this.finalReorderList = arr;
  //   console.log(data, data.OrderItems);
  //   if(this.ReOrderList.length>0){
  //     this.ReOrderModal.nativeElement.click();
  //   }
  // }

  // setfinalReorder(event: any, item: any){
  //   if(item.selected == false){
  //     this.finalReorderList.push(item);
  //     this.ReOrderList  = this.ReOrderList .map((obj: any) => {
  //       if (obj.ProductId == item.ProductId) {
  //         return { ...obj, selected: true };
  //       }
  //       return obj;
  //     });      
  //   }else{
  //     this.ReOrderList  = this.ReOrderList .map((obj: any) => {
  //       if (obj.ProductId == item.ProductId) {
  //         return { ...obj, selected: false };
  //       }
  //       return obj;
  //     });
  //     this.finalReorderList = this.finalReorderList.filter((d: any) => d.ProductId !== item.ProductId);
  //   }
  //   console.log(this.finalReorderList);
  // }


  // checkoutCart() {
  //   // this.isLoading = true;
  //   // debugger
  //   this.spinner.show();
  //   let requestData = JSON.stringify(this.finalReorderList);
  //   let fd = new FormData();
  //   fd.append('itemlist', requestData);
  //   fd.append('pincode', this.authService.PinCode.toString());
  //   // debugger
  //   this.orderService.checkoutCart('cartapp/checkoutincart', fd).subscribe( (cartData: any) => {
  //       // console.log('in cart synch', cartData);

  //       if (cartData) {
  //         let d: Date = new Date();
  //         this.cookieService.set('cartsynch', '1', d.getTime() + 86400 * 30, '/');
  //         window.location.href=this.commonService.baseurl+"customercart";
  //       }else{
  //         this.spinner.hide();
  //         alert('something went wrong')
  //       }
  //     }
  //   );
  // }

  // resetReorder(){
  //   this.ReOrderList = [];
  //   this.finalReorderList = [];
  // }

  getReOrders(id: any) {
    this.isloading = true;
    this.spinner.show();
    let fd = new FormData();
    fd.append('orderId', id);
    this.orderService.getReorderItems('webapi/order/get_order_items', fd).subscribe((res: any) => {
      // console.log(res)
      // debugger
      if (res && res['message'] == 'Success') {
        // let data  = res['data']['OrderData'];
        let data = res['result']['rs']['orderDetails'];
        if (data.length > 0) {
          let arr: any = [];
          data.forEach((elm: any) => {
            let qty = parseInt(elm.Quantity)
            let obj: any = { ...elm, Quantity: qty, selected: true };
            arr.push(obj)
          });
          this.reorderItems = arr;
          this.isloading = false;
          this.spinner.hide();
          this.ReOrderModal.nativeElement.click();
        } else {
          this.reorderItems = [];
          this.isloading = false;
          this.spinner.hide();
        }
      } else {
        this.reorderItems = [];
        this.isloading = false;
        this.spinner.hide();
        this.respMsg = res['message'];
        // this.reorderModal.nativeElement.click();
      }
      // console.log('ttt', this.reorderItems);
    });
  }

  getPGlistForCOD(id: any){
    let orderId = btoa(id)
    this.router.navigate(['customers/dashboard/paynow', orderId]);
  }

  checkuncheck(dts: any){
    if(dts.selected == false){
      // this.finalReorderList.push(item);
      this.reorderItems  = this.reorderItems.map((obj: any) => {
        if (obj.ProductId == dts.ProductId) {
          return { ...obj, Quantity: 1, selected: true };
        }
        return obj;
      });      
    }else{
      this.reorderItems  = this.reorderItems.map((obj: any) => {
        if (obj.ProductId == dts.ProductId) {
          return { ...obj, Quantity: 0, selected: false };
        }
        return obj;
      });
    }
    // console.log(this.reorderItems);
  }

  addItem(item: any){
    this.respMsg = '';
    let qty = item.Quantity;
      if(item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction']> qty)){
        this.reorderItems  = this.reorderItems.map((obj: any) => {
          if (obj.ProductId == item.ProductId) {
            return { ...obj, Quantity: qty+1, selected: true };
          }
          return obj;
        });
      }else{
        // alert('max limit reached');
        // this.respMsg = `You can add maximum ${item['DosageRestriction']} quantity`;
        // alert(this.respMsg)
        // // this.reorderModal.nativeElement.click();
      }
  }
  removeItem(item: any){
    this.respMsg = '';
    let qty = item.Quantity;
      if(qty>1){
        this.reorderItems  = this.reorderItems.map((obj: any) => {
          if (obj.ProductId == item.ProductId) {
            return { ...obj, Quantity: qty-1, selected: true };
          }
          return obj;
        });
      }else{
        this.reorderItems  = this.reorderItems.map((obj: any) => {
          if (obj.ProductId == item.ProductId) {
            return { ...obj, Quantity: 0, selected: false };
          }
          return obj;
        });
      }
  }
  checkoutCart_123(){
    // console.log('checkout',this.reorderItems)
    this.spinner.show();
    this.dbService.clear('cartItems').subscribe((res: any) => {
      // console.log(res);
      if (res == true) {
        this.reorderItems.forEach((productObj: any)=>{
          if(productObj.selected == true){
            let productId = productObj.ProductId;
            let LotId = 0;
            let CPId = 0;
       
            let tmp = {
              id: productId + '_' + CPId + '_' + LotId,
              ProductId: parseInt(productId),
              ProductName: productObj.DisplayName,
              CustProductName: '',
              InteractiveHealthProfileId: '',
              DosageRestriction: productObj.DosageRestriction,
              OfferPrice: productObj.OfferPrice,
              ProductCount: productObj.Quantity,
              ItemVal: productObj.OfferPrice,
              SSCurrencyValue: ".00",
              Iscourierable: productObj.IsCourierable,
              ProductImage: productObj.ProductImage,
              ProductPrice: productObj.MRP,
              // IsGiftProduct: productObj[this.getKeyIndex("IsGiftableProduct")],
              PrescriptionOTC: productObj.PrescriptionOTC,
              WarehouseId: this.authService.WHId,
              CPId: 0,
              MyFamilyId: 0,
              PKLotId: LotId,
              MfgGroup: productObj.MfgGroup,
              ExpiryDate: productObj.ExpiryDate,
              ProductInteractiveModule: '',
              ProductInteractiveSubModule: '',
              IsNonReturnable: '',
              RefOrderId: productObj.OrderId,
              Brand: productObj.Brand,
              DiscountPercent: productObj.DiscountPercent
            };
       
            this.dbService.add('cartItems', tmp).subscribe((res: any) => {
              // console.log('Record added successfully.', res);
            });
          } 
        });
        let d: Date = new Date();
        this.cookieService.set('cartsynch', '0', d.getTime() + 86400 * 30, '/');
        window.location.href=this.commonService.baseurl +"customercart";
      }else{
        this.spinner.hide();
        alert('something went wrong')
      }
    })
  }

  resetReorder_123(){
    this.respMsg = '';
    this.reorderItems = [];
  }


}
