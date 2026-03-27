import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {

  constructor( public authService: AuthService){
    this.authService.currentModule = 'Article';
  }

  ngOnInit(): void {
    let lang = localStorage.getItem('Currentlanguage')
    if(lang != undefined && lang != null && lang != ''){
      // console.log('st-1', lang)
      this.authService.CurrentLanguage = lang;
    }else{
      this.authService.CurrentLanguage = "English";
      localStorage.setItem("Currentlanguage", "English");
    }
  }

}
