import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-health-topics',
  templateUrl: './health-topics.component.html',
  styleUrl: './health-topics.component.scss'
})
export class HealthTopicsComponent implements OnInit {

  healthTopicList: any = [];
  currentLang: any = '';

  constructor(
    public articleService: ArticleService,
    private authService: AuthService,
    private avtiveRoute: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private spinner: NgxSpinnerService
  ){}

  ngOnInit(): void {
    this.currentLang = this.authService.CurrentLanguage;
    this.geAllHealthTopics();
  }

  geAllHealthTopics() {
    this.spinner.show()
    let mob: any = '';
    let userId: any = '';
    if(this.cookieService.get('isLoggedIn') == 'true'){
      mob = this.authService.Mobile.toString();
      userId = btoa(this.authService.UserId);
    }
    let data = {
      CategoryType: 'H',
      MobileNumber: mob,
      Language: this.currentLang,
      CustUserId: userId      
    }
    this.articleService.postData('healtharticle/getAllCategories',data).subscribe((res: any) => {
      // console.log('Health Topics:', res);
      if(res && res.msgcode == 1){
        if(res.results.categories.length > 0){
          this.healthTopicList = res.results.categories;
          this.spinner.hide()
        } else {
          this.healthTopicList = [];
          this.spinner.hide()
        }
      }else{
        this.healthTopicList = [];
        this.spinner.hide();
        console.error('Error fetching trending articles:', res.msg);
      }
    })
  }

  follow_Unfollow(data: any){
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    let userId: any = '';
    this.spinner.show()
    // console.log(this.isLoggedIn)
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if(data.isFollowed == false){
        let obj: any = {
          "ArticleId": '',
          "ArticlePermalink": data.Permalink,
          "CategoryId": data._id,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "follow",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.healthTopicList = this.healthTopicList.map((item: any) => {
              if(item._id === data._id) {
                return {
                  ...item,
                  isFollowed: true,
                };
              }
              return item;
            })
            // this.setTrendingArticles(this.response, this.currentLang);
          }
          this.spinner.hide()
        })
      }else{ 
        let obj: any = {
          "ArticleId": '',
          "ArticlePermalink": data.Permalink,
          "CategoryId": data._id,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "unfollow",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if(res && res.msgcode == 1){
            this.healthTopicList = this.healthTopicList.map((item: any) => {
              if(item._id === data._id) {
                return {
                  ...item,
                  isFollowed: false,
                };
              }
              return item;
            })
            // this.setTrendingArticles(this.response, this.currentLang);
          }
          this.spinner.hide()
        }) 
      }
    } else {
      this.spinner.hide()
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  viewDetails(category: any){
    this.router.navigate(['healtharticle/health-topic', category.Permalink]);
  }

}
