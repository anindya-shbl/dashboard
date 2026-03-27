import { Component, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home-collection-steps',
  templateUrl: './home-collection-steps.component.html',
  styleUrl: './home-collection-steps.component.scss'
})
export class HomeCollectionStepsComponent {

  @Input() stepsData: any = [];

  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    lazyLoad: true,
    nav: true,
    navSpeed: 700,
    navText: ['<i class="fa-solid fa-chevron-left fs-18 pt-1 px-1"></i>', '<i class="fa-solid fa-chevron-right fs-18 pt-1 px-1"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      },
      1024: {
        items: 4
      },
      1280: {
        items: 5
      },
      1440: {
        items: 6
      },
      1600: {
        items: 7
      },
      1900: {
        items: 8
      },
    },
  }

}
