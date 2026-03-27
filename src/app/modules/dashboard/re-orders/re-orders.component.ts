import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AuthService } from '../../../services/auth.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-re-orders',
  templateUrl: './re-orders.component.html',
  styleUrl: './re-orders.component.scss'
})

export class ReOrdersComponent implements OnInit {

  reorderItems: any =[];
  addedInCart: any = [];

  searchOrderId: any = '';
  isloading: boolean = false;
  respMsg: any = '';
  @ViewChild('reorderModal') reorderModal: any;
  @Output() newItemEvent = new EventEmitter<any>();

  constructor(
    public CommonService: CommonService,
    private dbService: NgxIndexedDBService,
    private authService: AuthService,
    private orderService : OrderService, 
    private router: Router,
    private activatedRoute : ActivatedRoute, 
    private spinner: NgxSpinnerService) {
     }

  ngOnInit(): void {
    // this.getAllRecord();
    let orderId : any = this.activatedRoute.snapshot.queryParamMap.get('orderID');
    if(orderId == undefined || orderId == '' || orderId == null){      
      this.searchOrderId = '';
    }else{
      this.searchOrderId = atob(orderId);
      this.searchbyID()
    }
    // console.log(this.searchOrderId)
  }

  searchbyID(){
    this.getAllRecord();
    this.getReOrders(this.searchOrderId);
  }

  getAllRecord(){
    this.dbService.getAll('cartItems').subscribe((res: any) => {
      // console.log('all records', res);
      this.addedInCart = res;
    });
  }

  // getDetails(id: any){
  //   let fd = new FormData();
  //   fd.append('orderId', id);
  //   this.orderService.getReorderItems('webapi/order/get_order_items', fd).subscribe((res: any) => {
  //     if(res && res['message'] == 'Success'){
  //       let data = res['data']['OrderData'];
  //       this.reorderItems = res['data']['OrderData'];

  //       this.getOrderItems(data)
  //     }
  //   })
      
  // }

  // getOrderItems(data: any) {
  //   data.forEach((elm: any) => {
  //     let found = this.addedInCart.some((dt: any) => dt.ProductId == elm.ProductId);
  //     if (found) {
  //       // let updatedItem = {...item, 'ProductCount': elm.Quantity }
  //       this.dbService.getByKey('cartItems', elm.ProductId).subscribe((item: any) => {
  //         console.log('item by key path', item);
  //         let qty = elm.Quantity;
  //         const updatedItem = { ...item, 'ProductCount': qty }
  //         // console.log(updatedItem);
  //         this.updateById(updatedItem)

  //       });
  //     } else {
  //       this.addToCart(elm, elm.Quantity)
  //     }
  //   });
  // }

  getReOrders(id: any){
    this.isloading = true;
    this.spinner.show();
    let fd = new FormData();
    fd.append('orderId', id);
    this.orderService.getReorderItems('webapi/order/get_order_items', fd).subscribe((res: any) => {
      // console.log(res)
      // debugger
      if(res && res['message'] == 'Success'){
        // let data  = res['data']['OrderData'];
        let data  = res['result']['rs']['orderDetails'];
        if(data.length > 0){
          if(this.addedInCart.length>0){
            let arr: any = [];
            data.forEach((elm: any)=>{
              let obj: any = {...elm, addedQty: 0};
              this.addedInCart.forEach((item: any) => {
                if(elm.ProductId == item.ProductId){                
                  obj = {...elm, addedQty: item.ProductCount};
                }
              });
              arr.push(obj)
            });
            this.reorderItems = arr;
          }else{
            let arr: any = [];
            data.forEach((elm: any)=>{
              let obj: any = {...elm, addedQty: 0};
              arr.push(obj)
            });
            this.reorderItems = arr;
          }
          this.isloading = false;
          this.spinner.hide();
        }else{
          this.reorderItems = [];
          this.isloading = false;
          this.spinner.hide();
        }
      }else{
        this.reorderItems = [];
        this.isloading = false;
        this.spinner.hide();
        this.respMsg = res['message'];
        this.reorderModal.nativeElement.click();
      }
      // console.log('ttt',this.reorderItems);
    });
  }

  addToCart(productObj: any, ProductQty: any){
    // console.log(productObj, ProductQty);
    let productId = productObj.ProductId;
    let LotId = 0;
    let CPId = 0;

    let tmp = {
      id: productId + '_' + CPId + '_' + LotId,
      ProductId: parseInt(productId),
      ProductName: productObj.ProductName,
      CustProductName: '',
      InteractiveHealthProfileId: '',
      DosageRestriction: productObj.DosageRestriction,
      OfferPrice: productObj.OfferPrice,
      ProductCount: parseInt(ProductQty),
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
      this.updateById(tmp)
      this.newItemEvent.emit();
      this.CommonService.sendClickEvent();
    });

  }

  cartAddPlus(pro_id : any){
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if(item['DosageRestriction'] == 0 || (item['DosageRestriction'] != 0 && item['DosageRestriction']> qty)){
        const updatedItem = {...item, 'ProductCount': item['ProductCount'] + 1 }
      // console.log(updatedItem);
      this.updateById(updatedItem)
      }else{
        // alert('max limit reached');
        this.respMsg = `You can add maximum ${item['DosageRestriction']} quantity`;
        this.reorderModal.nativeElement.click();
      }
    });
  }

  cartAddMinus(pro_id : any){
    let id = `${pro_id}_0_0`;
    // console.log(id)
    this.dbService.getByKey('cartItems', id).subscribe((item: any) => {
      // console.log('item by key path',item);
      let qty = item['ProductCount'];
      if(qty >1){
        const updatedItem = {...item, 'ProductCount': item['ProductCount'] - 1 };
      // console.log(updatedItem);
      this.updateById(updatedItem)
      }else{
        this.deleteById(pro_id)
      }
    });
  }

  updateById(tmp: any){
    this.dbService.update('cartItems', tmp).subscribe((res: any) => {
      // console.log('storeData: ', res);
      if(res){
        this.getAllRecord();
        this.updateByagainList(tmp)
      }
    });
  }

  updateByagainList(tmp: any){
    this.reorderItems = this.reorderItems.map((obj: any) => {
      if (obj.ProductId == tmp.ProductId) {
          return { ...obj, addedQty: tmp.ProductCount };
      }
      return obj;
    });
  }

  deleteById(pro_id: any){
    let id = `${pro_id}_0_0`;
    this.dbService.deleteByKey('cartItems', id).subscribe((status: any) => {
        // console.log('Deleted?:', status);
        if(status == true){
          this.getAllRecord();
          this.reorderItems = this.reorderItems.map((obj: any) => {
            if (obj.ProductId == pro_id) {
                return { ...obj, addedQty: 0 };
            }
            return obj;
          });
          this.CommonService.sendClickEvent();
        }else{
          // alert('some thing went wrong');
          this.respMsg = 'Some thing went wrong, please try again';
          this.reorderModal.nativeElement.click();
        }
    });
  }


}
