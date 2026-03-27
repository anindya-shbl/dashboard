import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-packages',
  templateUrl: './home-packages.component.html',
  styleUrl: './home-packages.component.scss'
})
export class HomePackagesComponent implements OnInit {


  // @ViewChild('stepModal') stepModal!: ElementRef;

  popularPackages: any = [];
  isLoading: boolean = false;

  constructor(private authService: AuthService, private CommonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getpopularPackages()
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
      1600:{
        items: 6
      },
      1900: {
        items: 7
      },
    },
  }

  getpopularPackages() {
    this.CommonService.getLabData('home/popular-package').subscribe((res: any) => {
      if (res && res.data.length>0) {
        let id = 0
        if (res.data.length > 0) {
          res.data.forEach((item: any)=>{
            let Id: any = (id + 1).toString()
            this.popularPackages.push({ ...item, id: Id })
          });
        }
        this.authService.setPoularPckgList(this.popularPackages);
        this.isLoading = false;
      }
      // console.log(this.popularCategory)
    });
  }

  viewPckgDtls(plink: any){
    // window.open(plink);
    const path = plink.replace('https://sastasundar.com/health-packages/', '');
    this.router.navigate(['newhealth-packages/', path])
  }

  viewAllPckgs(){
    this.router.navigate(['/newhealth-packages']);
  }

}
