import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLinksComponent } from './social-links/social-links.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LogoComponent } from './logo/logo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderSearchComponent } from './header-search/header-search.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { SubHeaderComponent } from './sub-header/sub-header.component';
import { ReplacePipe } from '../../pipes/replace.pipe';
import { TimeConverterPipe } from '../../pipes/time-converter.pipe';
import { RouterModule } from '@angular/router';
import { ArticleSearchComponent } from './article-search/article-search.component';
import { ArticleSubheaderComponent } from './article-subheader/article-subheader.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { SearchComponent } from './search/search.component';
import { FooterComponent } from './footer/footer.component';
import { SubFooterComponent } from './sub-footer/sub-footer.component';
import { DownloadAppComponent } from './download-app/download-app.component';
import { HomeCollectionStepsComponent } from './home-collection-steps/home-collection-steps.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PopularPackagesComponent } from './popular-packages/popular-packages.component';
import { PatientVitalsComponent } from './patient-vitals/patient-vitals.component';



@NgModule({
  declarations: [
    SocialLinksComponent,
    NotFoundComponent,
    LogoComponent,
    HeaderSearchComponent,
    MainHeaderComponent,
    SubHeaderComponent,
    ArticleSearchComponent,
    ArticleSubheaderComponent,
    ReplacePipe,
    TimeConverterPipe,
    ArticleSubheaderComponent,
    ProductSearchComponent,
    SearchComponent,
    FooterComponent,
    SubFooterComponent,
    DownloadAppComponent,
    HomeCollectionStepsComponent,
    PopularPackagesComponent,
    PatientVitalsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CarouselModule
  ],
  exports: [
    SocialLinksComponent,
    NotFoundComponent,
    LogoComponent,
    HeaderSearchComponent,
    MainHeaderComponent,
    SubHeaderComponent,
    ArticleSearchComponent,
    ArticleSubheaderComponent,
    ReplacePipe,
    TimeConverterPipe,
    ProductSearchComponent,
    SearchComponent,
    FooterComponent,
    SubFooterComponent,
    DownloadAppComponent,
    HomeCollectionStepsComponent,
    PopularPackagesComponent,
    PatientVitalsComponent
  ]
})
export class SharedModule { }
