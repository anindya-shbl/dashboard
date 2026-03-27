import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-alernative-product',
  templateUrl: './alernative-product.component.html',
  styleUrl: './alernative-product.component.scss'
})
export class AlernativeProductComponent implements OnInit {

  @Input() productData: any = [];
  JitoConfig: any = [];
  compareAlter: any = '';
  mainPrd: any = '';
  @Output() pdpAlter = new EventEmitter<any>();
  @ViewChild('compareAltrMdl') compareAltrMdl!: ElementRef;

  constructor(public CommonService: CommonService, public authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    // console.log(this.productData)
    this.setJitoHeader()
  }

  setJitoHeader() {
    this.CommonService.getJitoHeader('home/recommended-alternative').subscribe((res: any) => {
      // console.log(res)
      if (res && res['data'] != undefined) {
        this.JitoConfig = res['data'];
      }
    })
  }



  openCompare(main: any, prdct: any) {
    // console.log(main, prdct);
    this.mainPrd = main;
    this.compareAlter = prdct

    this.compareAltrMdl.nativeElement.click()

  }

  closeAlterMod(){
    this.mainPrd = '';
    this.compareAlter = '';
  }

  getPPU(main: any) {
    let mainProductConfigPrice: any = '';
    if (this.authService.ConfigData.GenericPercentageCalOnOfferPrice == 'Y') {
      mainProductConfigPrice = main.OfferPrice;
    } else {
      mainProductConfigPrice = main.MRP;
    }
    let ppt =  Number(mainProductConfigPrice) / main.Size;

    return ppt;
  }

  viewAlter(data: any, precs: any) {
    data.PrescriptionOTC = precs;
    this.pdpAlter.emit({ dtls: data, type: 'redirect' });
  }

  addToCart(data: any) {
    this.pdpAlter.emit({ dtls: data, type: 'subNew' });
  }

  cartAddMinus(data: any) {
    this.pdpAlter.emit({ dtls: data, type: 'subMinus' });
  }
  cartAddPlus(data: any) {
    this.pdpAlter.emit({ dtls: data, type: 'subPlus' });
  }



  replaceAlternative(data: any, ds: any) {
    // console.log(data, ds);
    let addedNow = ds.addedQty * ds.Size;
    let tobeAdd = addedNow / data.Size;
    let alteQty = Math.ceil(tobeAdd);
    let replace = {...data, replaceQty: alteQty}
    this.pdpAlter.emit({ dtls: replace, type: 'subReplace' });
   }

  requestNotify(data: any) {
    let fd = new FormData();
    fd.append('ProductId', data.ProductId);
    fd.append('ProductName', data.DisplayName);
    fd.append('ProductType', data.PrescriptionOTC);
    fd.append('RequestSource', 'S');


    this.CommonService.requestNotify('webapi/request_product/productRequest', fd).subscribe((res: any) => {
      // console.log(res);      
      if (res && res.response_code == 0) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    })
   }

}
