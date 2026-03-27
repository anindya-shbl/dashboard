import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-lab-landing',
  templateUrl: './lab-landing.component.html',
  styleUrl: './lab-landing.component.scss'
})
export class LabLandingComponent implements OnInit{

  topBanner: any = [];
  popularPackages: any = [];

  constructor(private CommonService: CommonService, private router: Router, private spinner: NgxSpinnerService){}

  ngOnInit(): void {
    this.spinner.show();
    this.getLabBanner();
  }

  getLabBanner(){    
    let data = {
      warehouseId: '1',
      panindia: '0',
      isLab: '1',
      view_type: 'HPB'
    };

    this.CommonService.postLabData('home/top-banner-web', data).subscribe((res: any) => {
      // console.log(res);
      if(res && res.status == 200){
        this.topBanner = res.data.results;
        this.spinner.hide();
      }else{
        this.topBanner = [];
        this.spinner.hide();
      }
    })
  }

  viewRadiology(){
    this.router.navigate(['/newradiology-test']);
  }

  seturl(url: any) {
    const path = url.replace('https://sastasundar.com', '');
    let result = path.split('/').filter(Boolean);
    if(result[0]=='ordermedicine'){
      window.location.href = 'https://sastasundar.com/ordermedicine';
    }else if(result[0]=='diagnostic-test' || result[0]=='test'){
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
