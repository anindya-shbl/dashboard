import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-popular-packages',
  templateUrl: './popular-packages.component.html',
  styleUrl: './popular-packages.component.scss'
})
export class PopularPackagesComponent {

  @Input() popularPackages: any = [];
  @Input() selectedPckg: any = '';
  filteredArr: any = [];
  isLoading: boolean = false;
  @Output() changeDetails = new EventEmitter<any>()

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    if(this.selectedPckg != ''){}
    this.filteredArr = this.popularPackages.filter((obj: any) => obj.ServiceId != this.selectedPckg);
  }

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
      // 1280: {
      //   items: 5
      // },
      1400: {
        items: 5
      },
      1600: {
        items: 6
      },
      1900: {
        items: 7
      },
    },
  }


  // viewPckgDtls(url: any) {
  //   // window.open(link)
  //   const path = url.replace('https://sastasundar.com/health-packages/', '');
  //   // let result = path.split('/').filter(Boolean);
  //   this.router.navigate(['newhealth-packages/', path])
  // }

  viewPckgDtls(plink: any) {
    this.changeDetails.emit(plink);
    // const path = plink.replace('https://sastasundar.com/health-packages/', '');
    // this.router.navigate(['newhealth-packages/', path])
    // if(plink != '' && plink != undefined && plink != null){
    //   this.changeDetails.emit(plink);
    // }
  }


}
