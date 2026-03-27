import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-health-feeds',
  templateUrl: './health-feeds.component.html',
  styleUrl: './health-feeds.component.scss'
})
export class HealthFeedsComponent implements OnInit {

  healthFeeds: any = [];
  displayList: any = [];
  tabList: any  = [];
  currentTab: any = '';
  currentLang: any = '';

  constructor(
    public articleService: ArticleService,
    private authService: AuthService,
    private avtiveRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ){ }

  ngOnInit(): void {
    this.currentLang = this.authService.CurrentLanguage;
    this.geAllHealthFeeds();
  }

  geAllHealthFeeds() {
    this.spinner.show()
    let mob: any = '';
    let userId: any = '';
    if (this.cookieService.get('isLoggedIn') == 'true') {
      mob = this.authService.Mobile.toString()
      userId = btoa(this.authService.UserId);
    }
    let data = {
      "MobileNumber": mob,
      //"CategoryPermalink": "H",
      "PageNo": 1,
      "RecordCount": 10,
      "Language": this.currentLang,
      "CustUserId": userId 
    }
    this.articleService.postData('healtharticle/getLatestArticlesByCategory', data).subscribe((res: any) => {
      // console.log('Health Feeds:', res);
      if (res && res.msgcode == 1) {
        if (res.results.categoryarticles.length > 0) {
          this.healthFeeds = res.results.categoryarticles;
          this.healthFeeds.forEach((data: any)=>{
            let obj = {
              CategoryName: data.CategoryName,
              ColorCode: data.ColorCode,
              Permalink: data.Permalink,
              _id: data._id
            }
            this.tabList.push(obj);
          }) 
          this.currentTab = this.tabList[0];
          this.setDispalyList(this.currentTab, this.currentLang)
        } else {
          this.healthFeeds = [];
          this.displayList = [];
          this.tabList = [];
          this.spinner.hide()
        }
      } else {
        this.healthFeeds = [];
        this.displayList = [];
        this.tabList = [];
        this.spinner.hide();
        console.error('Error fetching trending articles:', res.msg);
      }
    })
  }

  setDispalyList(tab: any, lang: any){
    // this.setDispalyList = this.healthFeeds.map(obj)
    this.displayList = [];
    let content = this.healthFeeds.filter((ds: any) => {
      return ds._id === tab._id
    })
    if(content && content[0].articles.length > 0){
      content[0].articles.forEach((item: any)=>{
        if(item.Content[lang] != undefined && item.Content[lang] != null && item.Content[lang] != ''){
          this.displayList.push({...item, Content: item.Content[lang]})
        }
      })
      this.spinner.hide()
    }else{
      this.displayList = [];
      this.spinner.hide()
    }
    // console.log(this.displayList)
  }

  changeTab(tab: any){
    this.spinner.show()
    this.currentTab = tab;
    this.setDispalyList(this.currentTab, this.currentLang)
  }

  viewArtical(plink: any) {
    this.router.navigate(['healtharticle', plink]);
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


}
