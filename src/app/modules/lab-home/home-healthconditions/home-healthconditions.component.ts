import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-healthconditions',
  templateUrl: './home-healthconditions.component.html',
  styleUrl: './home-healthconditions.component.scss'
})
export class HomeHealthconditionsComponent implements OnInit {


  // @ViewChild('stepModal') stepModal!: ElementRef;

  healthConditions: any = [];
  isLoading: boolean = false;

  constructor(private authService: AuthService, private CommonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.gethealthConditions()
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

  gethealthConditions() {
    this.CommonService.getLabData('home/health-condition-list').subscribe((res: any) => {
      if (res && res.data.length > 0) {
        let id = 0
        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            let Id: any = (id + 1).toString()
            this.healthConditions.push({ ...item, id: Id })
          });
        }
        this.isLoading = false;
      }
      // console.log(this.popularCategory)
    });
  }

  viewPckgDtls(link: any) {
    window.open(link)
  }

  viewByCondition(plink: any){
    let hLink = plink.replace(/ /g, "-");
    this.router.navigate(['newdiagnostic-test/health-condition/', hLink]);
  }
}
