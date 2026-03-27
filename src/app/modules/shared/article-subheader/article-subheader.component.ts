import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-article-subheader',
  templateUrl: './article-subheader.component.html',
  styleUrl: './article-subheader.component.scss'
})
export class ArticleSubheaderComponent {

  constructor(public CommonService: CommonService){}

}
