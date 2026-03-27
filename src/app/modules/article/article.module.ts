import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { TrendingsComponent } from './trendings/trendings.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { DetailsComponent } from './details/details.component';
import { HealthFeedsComponent } from './health-feeds/health-feeds.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArticleHomeComponent } from './article-home/article-home.component';
import { TrendingSliderComponent } from './trending-slider/trending-slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RelatedArticlesComponent } from './related-articles/related-articles.component';
import { HealthTopicsComponent } from './health-topics/health-topics.component';
import { CategoryWiseArticlesComponent } from './category-wise-articles/category-wise-articles.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlePathComponent } from './article-path/article-path.component';
import { TabListsComponent } from './tab-lists/tab-lists.component';


@NgModule({
  declarations: [
    ArticleComponent,
    TrendingsComponent,
    BookmarksComponent,
    DetailsComponent,
    HealthFeedsComponent,
    ArticleHomeComponent,
    TrendingSliderComponent,
    RelatedArticlesComponent,
    HealthTopicsComponent,
    CategoryWiseArticlesComponent,
    ArticlePathComponent,
    TabListsComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    SharedModule
  ]
})
export class ArticleModule { }
