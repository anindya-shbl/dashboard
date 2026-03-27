import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-organs',
  templateUrl: './home-organs.component.html',
  styleUrl: './home-organs.component.scss'
})
export class HomeOrgansComponent implements OnInit {


  // @ViewChild('stepModal') stepModal!: ElementRef;

  OrganList: any = [];
  isLoading: boolean = false;

  constructor(public authService: AuthService, private CommonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getOrganList()
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
      1600: {
        items: 8
      },
      1900: {
        items: 9
      },
    },
  }

  getOrganList() {
    this.authService.OrganNames = [];
    this.CommonService.getLabData('home/organ-list').subscribe((res: any) => {
      if (res && res.data.length > 0) {
        let id = 0
        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            let Id: any = (id + 1).toString()
            this.OrganList.push({ ...item, id: Id });
            this.authService.OrganNames.push({OrganName: item.OrganName})
          });
        }
        this.isLoading = false;
      }
      // console.log(this.popularCategory)
    });
  }

  // viewPckgDtls(link: any) {
  //   window.open(link)
  // }

  viewByOrgan(plink: any){
    this.router.navigate(['newdiagnostic-test/organ/', plink]);
  }
}
