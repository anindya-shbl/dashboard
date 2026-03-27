import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-popular-brands',
  templateUrl: './popular-brands.component.html',
  styleUrl: './popular-brands.component.scss'
})
export class PopularBrandsComponent {

  @Input() pplBrnd: any = [];

  constructor(private router: Router){}

  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    lazyLoad: true,
    navSpeed: 200,
    navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      600: {
        items: 3
      },
      768: {
        items: 4
      },
      1024: {
        items: 5
      },
      1280: {
        items: 6
      },
      1440: {
        items: 7
      },
      1920: {
        items: 8
      }
    },
    nav: true
  }

  viewListings(data: any){
    this.router.navigate(['newbrand/brandlisting/', data.BrandUrl])
  }

}
