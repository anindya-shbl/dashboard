import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  banners: any = [];
  mostBought: any = [];
  popularCategory: any = [];
  topRated: any = [];
  newArrivals: any = [];
  offerZone: any = [];
  keywordProduct: any = [];
  popularBrands: any = [];

  constructor(private commonService: CommonService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getMedHomeBanner();
    this.getMostBought();
    this.getPopularCategory();
    this.getTopRated();
    this.getNewArrivals();
    this.getOfferZone();
    this.getKeywordProduct();
    this.getPopularBrands();
  }

  getMedHomeBanner() {
    this.spinner.show();
    let fd: any = new FormData();
    fd.append('warehouseId', 1);
    fd.append('panindia', 0);
    fd.append('view_type', 'HPB');
    this.commonService.postProductData('home/top-banner-web', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        if (res['data']['results'].length > 0) {
          this.banners = res['data']['results'];
          this.spinner.hide();
        } else {
          this.banners = [];
          this.spinner.hide();
        }
      } else {
        this.banners = [];
        this.spinner.hide();
      }
    })
  }

  getMostBought() {
    let fd: any = new FormData();
    this.commonService.getCatalogData('home/most-bought-products-web').subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        if (res['data'].length > 0) {
          this.mostBought = res['data']
        } else {
          this.mostBought = []
        }
      } else {
        this.mostBought = [];
      }
    })
  }

  getPopularCategory() {
    let fd: any = new FormData();
    fd.append('warehouseId', 1);
    fd.append('panindia', 0);
    fd.append('view_type', 'HPCAT');
    fd.append('view_type', 'WEB');

    this.commonService.postCatalogData('home/popular-categories-web', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        if (res['data']['results'].length > 0) {
          this.popularCategory = res['data']['results']
        } else {
          this.popularCategory = []
        }
      } else {
        this.popularCategory = [];
      }
    })
  }

  getTopRated() {
    let fd: any = new FormData();
    this.commonService.getCatalogData('home/top-rated-products-web').subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        if (res['data'].length > 0) {
          this.topRated = res['data']
        } else {
          this.topRated = []
        }
      } else {
        this.topRated = [];
      }
    })
  }

  getNewArrivals() {
    let fd: any = new FormData();
    this.commonService.getCatalogData('home/new-arrival-products-web').subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        if (res['data'].length > 0) {
          this.newArrivals = res['data']
        } else {
          this.newArrivals = []
        }
      } else {
        this.newArrivals = [];
      }
    })
  }

  getOfferZone() {
    let fd: any = new FormData();
    fd.append('warehouseId', 1);
    fd.append('panindia', 0);
    // fd.append('view_type', 'HPCAT');
    // fd.append('view_type', 'WEB');

    this.commonService.postCatalogData('offer/getofferzonecategoryproduct', fd).subscribe((res: any) => {
      // console.log(res);
      // if (res && res['status'] == 200) {
      //     if (res['data']['results'].length > 0) {
      //         this.popularCategory = res['data']['results']
      //     } else {
      //         this.popularCategory = []
      //     }
      // } else {
      //     this.popularCategory = [];
      // }
    })
  }

  getKeywordProduct() {
    // let fd: any = new FormData();
    let warehouseId = 1;
    let panindia = 0;
    let section = 'Y';
    let pincode = '700156';

    let url: any = `product/keywordProductList/?section=${section}&warehouseId=${warehouseId}&panindia=${panindia}&pincode=${pincode}`

    this.commonService.getCatalogData(url).subscribe((res: any) => {
      // console.log(res);
      if (res && res['msgcode'] == 1) {
        if (res['results'].length > 0) {
          this.keywordProduct = res['results']
        } else {
          this.keywordProduct = []
        }
      } else {
        this.keywordProduct = [];
      }
    })
  }

  getPopularBrands() {
    let fd: any = new FormData();
    fd.append('warehouseId', 1);
    fd.append('panindia', 0);
    // fd.append('view_type', 'HPB');
    this.commonService.postCatalogData('home/popular-brand', fd).subscribe((res: any) => {
      // console.log(res);
      if (res && res['status'] == 200) {
        if (res['data']['results'].length > 0) {
          this.popularBrands = res['data']['results']
        } else {
          this.popularBrands = []
        }
      } else {
        this.popularBrands = [];
      }
    })
  }

  openJito(){
    // window.open('https://sastasundar.com/jitosearch', '_blank')
    window.location.href = 'https://sastasundar.com/jitosearch';
  }

}
