import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop-by-brands',
  templateUrl: './shop-by-brands.component.html',
  styleUrl: './shop-by-brands.component.scss'
})
export class ShopByBrandsComponent implements OnInit {

  allBrands: any = [];

  constructor(private commonService: CommonService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands() {
    window.scrollTo(0,0);
    this.spinner.show();
    let fd: any = new FormData();
    fd.append('warehouseId', 1);
    fd.append('panindia', 0);

    this.commonService.postCatalogData('brand/getAllBrands', fd).subscribe((res: any) => {
      
      if(res){
        this.allBrands = res.results.Brands
        this.spinner.hide();
      }else{
        this.spinner.hide()
      }
    })
  }

  viewListings(data: any){
    this.router.navigate(['newbrand/brandlisting/', data.BrandUrl])
  }

}
