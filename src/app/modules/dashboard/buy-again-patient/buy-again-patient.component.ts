import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-buy-again-patient',
  templateUrl: './buy-again-patient.component.html',
  styleUrl: './buy-again-patient.component.scss'
})
export class BuyAgainPatientComponent implements OnInit {

  @Input() respData : any = [];
  PatientmedorderList: any = [];
  OtcHouseHoldList : any = [];
  checkoutArr: any = [];
  scrollPosition: any = 0;
  @Output() byagainOrder = new EventEmitter<any>();

  @HostListener('window:scroll', ['$event']) 
  doSomething(event: any) {
    // console.log("Scroll Event", window.scrollY );
    this.scrollPosition = window.scrollY;
  }

  constructor(public CommonService: CommonService, private orderService : OrderService, private authService: AuthService, private dbService: NgxIndexedDBService, private toastr: ToastrService){}

  ngOnInit(): void {

    let ptnList = this.respData[0]['data']['PatientmedorderList'];
    if (ptnList.length > 0) {
      ptnList.forEach((obj: any) => {
        obj.ItemList.forEach((dts: any) => {
          dts.selected = false;
          dts.disabled = false;
          dts.addedQty = 0;
        })
      })
      this.PatientmedorderList = ptnList;
    } else {
      this.PatientmedorderList = [];
    }

    let otcList = this.respData[0]['data']['otcHouseHoldList'];
    if (otcList.length > 0) {
      otcList.forEach((dts: any) => {
        dts.selected = false;
        dts.disabled = false;
        dts.addedQty = 0;
      })
      this.OtcHouseHoldList = otcList;
    } else {
      this.OtcHouseHoldList = [];
    }
  }


  checkUnchek(item: any){
    if(item.selected == false){
      this.PatientmedorderList.forEach((obj:any)=>{
        obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId){
            if(dts.OrderId == item.OrderId){
              dts.selected = true;
              dts.addedQty = dts.ItemQuantity;
              this.checkoutArr.push(item)
            }else{
              dts.disabled = true;
            }
          }
        })
      })
    }else{
      this.PatientmedorderList.forEach((obj:any)=>{
        obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId){
            dts.selected = false;
            dts.disabled = false;
            dts.addedQty = 0;
          }
        })
      });
      this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }
    // console.log(this.checkoutArr)
  }

  addUpdateItem(item: any){
    if(item.selected == false){
      this.PatientmedorderList.forEach((obj:any)=>{
        obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId){
            if(dts.OrderId == item.OrderId){
              dts.selected = true;
              dts.addedQty = dts.ItemQuantity + 1;
              this.checkoutArr.push(item)
            }else{
              dts.disabled = true;
            }
          }
        })
      });
      // console.log(this.checkoutArr)
    }else{
      this.PatientmedorderList.forEach((obj:any)=>{
        obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId && dts.OrderId == item.OrderId){
            dts.addedQty = dts.addedQty + 1;
            this.updateCheckout(item)
          }
        })
      });
      // this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }
  }

  updateCheckout(item: any){
    this.checkoutArr.forEach((dts:any)=>{
      if(dts.ProductId == item.ProductId){
        dts.addedQty = item.addedQty;
      }
    })
    // console.log(this.checkoutArr)
  }

  removeUpdateItem(item: any){
    if(item.selected == false){
      if(item.ItemQuantity >1){
        this.PatientmedorderList.forEach((obj:any)=>{
          obj.ItemList.forEach((dts:any)=>{
            if(dts.ProductId == item.ProductId){
              if(dts.OrderId == item.OrderId){
                dts.selected = true;
                dts.addedQty = dts.ItemQuantity - 1;
                this.checkoutArr.push(item)
              }else{
                dts.disabled = true;
              }
            }
          })
        });
      }else{
        return;
      }
      // console.log(this.checkoutArr)
    }else{
      if(item.addedQty > 1){
        this.PatientmedorderList.forEach((obj:any)=>{
          obj.ItemList.forEach((dts:any)=>{
            if(dts.ProductId == item.ProductId && dts.OrderId == item.OrderId){
              dts.addedQty = dts.addedQty - 1;
              this.updateCheckout(item)
            }
          })
        });
      }else{
        this.checkUnchek(item)
      }
      // this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }    
  }

  otcCheckUncheck(item: any){
    if(item.selected == false){
      this.OtcHouseHoldList.forEach((dts:any)=>{
        // obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId){
            if(dts.OrderId == item.OrderId){
              dts.selected = true;
              dts.addedQty = dts.ItemQuantity;
              this.checkoutArr.push(item)
            }else{
              dts.disabled = true;
            }
          }
        // })
      })
    }else{
      this.OtcHouseHoldList.forEach((dts:any)=>{
        // obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId){
            dts.selected = false;
            dts.disabled = false;
            dts.addedQty = 0;
          }
        // })
      });
      this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }
    // console.log(this.checkoutArr)
  }

  otcAddUpdate(item: any){
    if(item.selected == false){
      this.OtcHouseHoldList.forEach((dts:any)=>{
        // obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId){
            if(dts.OrderId == item.OrderId){
              dts.selected = true;
              dts.addedQty = dts.ItemQuantity + 1;
              this.checkoutArr.push(item)
            }else{
              dts.disabled = true;
            }
          }
        // })
      });
      // console.log(this.checkoutArr)
    }else{
      this.OtcHouseHoldList.forEach((dts:any)=>{
        // obj.ItemList.forEach((dts:any)=>{
          if(dts.ProductId == item.ProductId && dts.OrderId == item.OrderId){
            dts.addedQty = dts.addedQty + 1;
            this.updateCheckout(item)
          }
        })
      // });
      // this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }
  }

  otcRemoveUpdate(item: any){
    if(item.selected == false){
      if(item.ItemQuantity >1){
        this.OtcHouseHoldList.forEach((dts:any)=>{
          // obj.ItemList.forEach((dts:any)=>{
            if(dts.ProductId == item.ProductId){
              if(dts.OrderId == item.OrderId){
                dts.selected = true;
                dts.addedQty = dts.ItemQuantity - 1;
                this.checkoutArr.push(item)
              }else{
                dts.disabled = true;
              }
            }
          // })
        });
      }else{
        return;
      }
      // console.log(this.checkoutArr)
    }else{
      if(item.addedQty > 1){
        this.OtcHouseHoldList.forEach((dts:any)=>{
          // obj.ItemList.forEach((dts:any)=>{
            if(dts.ProductId == item.ProductId && dts.OrderId == item.OrderId){
              dts.addedQty = dts.addedQty - 1;
              this.updateCheckout(item)
            }
          })
        // });
      }else{
        this.otcCheckUncheck(item)
      }
      // this.checkoutArr = this.checkoutArr.filter((d: any) => d.ProductId !== item.ProductId);
    }    
  }

  proceed(){
    this.byagainOrder.emit(this.checkoutArr);
  }

  calculateDiff(data : any){
    let date = new Date(data);
    let currentDate = new Date();

    let days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) ) /(1000 * 60 * 60 * 24));

    return days;
  }

  requestNotify(item: any) {
    // console.log(item);
    let fd = new FormData();
    fd.append('ProductId', item.ProductId);
    fd.append('ProductName', item.DisplayName);
    fd.append('ProductType', item.PrescriptionOTC);
    fd.append('RequestSource', 'C');
    // fd.append('DeviceId', '');
    // fd.append('AppType', '');
    // fd.append('AppVersion', '');

    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);      
      if(res && res.response_code == 0){
        this.toastr.success(res.message);
      }else{
        this.toastr.error(res.message);
      }
    })

  }
    
}
