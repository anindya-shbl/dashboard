import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-online-slider',
  templateUrl: './online-slider.component.html',
  styleUrl: './online-slider.component.scss'
})
export class OnlineSliderComponent implements OnInit {


  // @ViewChild('stepModal') stepModal!: ElementRef;

  popularCategory: any = [];
  isLoading: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.getpoularCategory()
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
      1920: {
        items: 8
      },
    },
  }

  getpoularCategory() {
    let fd = new FormData();
    fd.append('panindia', '0');
    fd.append('warehouseId', '1');
    fd.append('app_type', 'WEB');
    fd.append('view_type', 'HPCAT');
    // panindia=0&warehouseId=1&app_type=WEB&view_type=HPCAT
    this.authService.getCategoryDetails('home/popular-categories-web', fd).subscribe((res: any) => {
      if (res && res.status == 200) {
        let id = 0
        if (res.data.results.length > 0) {
          res.data.results.forEach((item: any)=>{
            let Id: any = (id + 1).toString()
            this.popularCategory.push({ ...item, id: Id })
          });
        }
        this.isLoading = false;
      }
      // console.log(this.popularCategory)
    });
  }

  viewCategory(url: any) {
    window.open(url, '_blank');
  }

}
