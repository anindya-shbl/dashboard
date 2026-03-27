import { Component } from '@angular/core';

@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrl: './article-search.component.scss'
})
export class ArticleSearchComponent {

  searchTxt: any = '';

  onSearchChange(evnt: any){}

  onKeydown(){}

}
