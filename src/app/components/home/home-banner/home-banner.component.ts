import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss'
})
export class HomeBannerComponent {

  @Input() topBanner: any = [];

  constructor(private router: Router, private CommonService: CommonService) {
  }

  seturl(url: any) {
    const path = url.replace('https://sastasundar.com', '');
    let result = path.split('/').filter(Boolean);
    if(result[0]=='ordermedicine'){
      window.location.href = 'https://sastasundar.com/ordermedicine';
    }else if(result[0]=='diagnostic-test'){
      this.router.navigate(['/newdiagnostic-test'])
    }else if(result[0]=='health-packages'){
      this.router.navigate(['/newhealth-packages'])
    }else{
      this.router.navigate(['new/', ...result])
    }
  }

  bnrDtls(url: any) {
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
