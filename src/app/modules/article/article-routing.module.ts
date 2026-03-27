import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './article.component';
import { ArticleHomeComponent } from './article-home/article-home.component';
import { TrendingsComponent } from './trendings/trendings.component';
import { DetailsComponent } from './details/details.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { HealthTopicsComponent } from './health-topics/health-topics.component';
import { CategoryWiseArticlesComponent } from './category-wise-articles/category-wise-articles.component';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent,
    children: [
      { path: '', component: ArticleHomeComponent },
      { path: 'trending', component: TrendingsComponent },
      { path: 'bookmark', component: BookmarksComponent},
      { path: 'health-topics', component: HealthTopicsComponent},
      { path: 'health-topic/:parmalink', component: CategoryWiseArticlesComponent},
      { path: ':parmalink', component: DetailsComponent},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
