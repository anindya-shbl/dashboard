import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-related-articles',
  templateUrl: './related-articles.component.html',
  styleUrl: './related-articles.component.scss'
})
export class RelatedArticlesComponent implements OnInit {

  @Input() relatedData: any = [];
  langContent: any = [];
  @Input()currentLang: any;
  @Output() changeDetails = new EventEmitter<any>();
  
  constructor(
    private articleService: ArticleService,       
    private cookieService: CookieService, 
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
    // this.setLangWise(this.relatedData, this.currentLang)
  }

  ngOnChanges(){
    this.setLangWise(this.relatedData, this.currentLang)
  }

  // setLangWise(data: any, lang: any){
  //   if(data && data.length > 0){
  //     this.langContent = data.map((item: any) => {
  //       return {
  //         ...item,
  //         Content: item.Content[lang] ? item.Content[lang] : '',
  //       };
  //     });
  //   } else {
  //     this.langContent = [];
  //   }
  //   console.log('lang Response:', this.langContent);
  // }

  setLangWise(data: any, lang: any) {
    if (data && data.length > 0) {
      let arr: any = [];
      data.forEach((item: any) => {
        if (item.Content[lang] != null && item.Content[lang] != undefined && item.Content[lang] != '') {
          // if (item.Content[lang].Description.length > 0) {
            let obj = {
              ...item,
              Content: item.Content[lang],
            };
            arr.push(obj)
          // }
        }
      });
      this.langContent = arr;
    } else {
      this.langContent = [];
    }
    // console.log('lang Response:', this.langContent);
  }


  likeArticle(data: any) {
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    // console.log(this.isLoggedIn)
    let userId: any = '';
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if (data.IsLiked == false) {
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "like",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if (res && res.msgcode == 1) {
            this.relatedData = this.relatedData.map((item: any) => {
              if (item._id === data._id) {
                return {
                  ...item,
                  IsLiked: true,
                  LikeCount: (item.LikeCount || 0) + 1
                };
              }
              return item;
            })
            this.setLangWise(this.relatedData, this.currentLang);
          }
        })
      } else {
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "dislike",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if (res && res.msgcode == 1) {
            this.relatedData = this.relatedData.map((item: any) => {
              if (item._id === data._id) {
                return {
                  ...item,
                  IsLiked: false,
                  LikeCount: (item.LikeCount || 0) - 1
                };
              }
              return item;
            })
            this.setLangWise(this.relatedData, this.currentLang);
          }
        })
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }

  bookmarkArticle(data: any) {
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    // console.log(this.isLoggedIn)
    let userId: any = '';
    if (isLoggedIn == 'true') {
      userId = btoa(this.authService.UserId);
      if (data.IsBookmarked == false) {
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "bookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if (res && res.msgcode == 1) {
            this.relatedData = this.relatedData.map((item: any) => {
              if (item._id === data._id) {
                return {
                  ...item,
                  IsBookmarked: true,
                };
              }
              return item;
            })
            this.setLangWise(this.relatedData, this.currentLang);
          }
        })
      } else {
        let obj: any = {
          "ArticleId": data._id,
          "ArticlePermalink": data.Permalink,
          "CategoryId": data.CategoryId,
          "MobileNumber": this.authService.Mobile.toString(),
          "ActionType": "unbookmark",
          "CustUserId": userId
        }
        this.articleService.postData('healtharticle/updateUserPersonalisedHealthArticle', obj).subscribe((res: any) => {
          if (res && res.msgcode == 1) {
            this.relatedData = this.relatedData.map((item: any) => {
              if (item._id === data._id) {
                return {
                  ...item,
                  IsBookmarked: false,
                };
              }
              return item;
            })
            this.setLangWise(this.relatedData, this.currentLang);
          }
        })
      }
    } else {
      window.location.href = `${this.authService.baseurl}user/login`
    }
  }


  viewArtical(plink: any) {
    this.router.navigate(['healtharticle', plink]);
    if(plink != '' && plink != undefined && plink != null){
      this.changeDetails.emit(plink);
    }
  }

}
