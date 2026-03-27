import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-popular-category',
  templateUrl: './popular-category.component.html',
  styleUrl: './popular-category.component.scss'
})
export class PopularCategoryComponent {

  @Input() pCtgry: any = [];

  customOptions: OwlOptions = {
    autoWidth: true,
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

  constructor(private router: Router, private CommonService: CommonService) {
  }

  seturl(url: any) {
    const path = url.replace('https://sastasundar.com', '');
    let result = path.split('/').filter(Boolean);
    this.router.navigate(['new/', ...result])
  }

  categoryDtls(url: any) {
    // window.location.href = url
    let path = url.substring(url.lastIndexOf('/') + 1);
    this.CommonService.getCatalogData(`shorturl/getShortUrlInfo?unique_code=${path}`).subscribe((res: any) => {
      // console.log(res)
      if (res && res.msgcode == 1) {
        if (res.results.ActionUrl != '' && res.results.ActionUrl != null && res.results.ActionUrl != undefined) {
          let hasCatalogLists = res.results.ActionUrl.includes("catalog/lists/");
          if (hasCatalogLists) {
            let plink = res.results.ActionUrl.substring(res.results.ActionUrl.lastIndexOf('/') + 1);
            this.router.navigate(['newcatalog/lists/', plink])
          } else {
            this.seturl(res.results.ActionUrl)
          }
        }
      }
    })
  }

}
