import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { SharedModule } from "./modules/shared/shared.module";
import { TestDetailsComponent } from './components/test-details/test-details.component';
import { OrderOtcComponent } from './components/order-otc/order-otc.component';
import { ImageMedotcComponent } from './components/image-medotc/image-medotc.component';
import { SimilarProductsComponent } from './components/similar-products/similar-products.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OrderMedicineComponent } from './components/order-medicine/order-medicine.component';
import { SmallImgMedOTCComponent } from './components/small-img-med-otc/small-img-med-otc.component';
import { AlernativeProductComponent } from './components/alernative-product/alernative-product.component';
import { HomeComponent } from './components/home/home.component';
import { HomeBannerComponent } from './components/home/home-banner/home-banner.component';
import { OrderActionComponent } from './components/home/order-action/order-action.component';
import { MostBoughtComponent } from './components/home/most-bought/most-bought.component';
import { PopularCategoryComponent } from './components/home/popular-category/popular-category.component';
import { KeywordProductsComponent } from './components/home/keyword-products/keyword-products.component';
import { PopularBrandsComponent } from './components/home/popular-brands/popular-brands.component';
import { MedNotesComponent } from './components/home/med-notes/med-notes.component';
import { MedScrollerComponent } from './components/home/med-scroller/med-scroller.component';
import { CatalogDetailsComponent } from './components/catalog-details/catalog-details.component';
import { ShopByBrandsComponent } from './components/shop-by-brands/shop-by-brands.component';
import { BrandListingComponent } from './components/brand-listing/brand-listing.component';
import { LoginComponent } from './components/login/login.component';
import { LabcartSummaryComponent } from './components/labcart-summary/labcart-summary.component';
import { MedcartSummeryComponent } from './components/medcart-summery/medcart-summery.component';

const dbConfig: DBConfig  = {
  name: 'ssht_webDB',
  version: 2,
  objectStoresMeta: [
    {
      store: 'cartItems',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'ProductId_idx', keypath: 'ProductId', options: { unique: false } },
      ]
    },
    {
      store: 'LabTests',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'LabtestId_idx', keypath: 'ProductId', options: { unique: false } },
      ]
    }
  ],
  // provide the migration factory to the DBConfig
  // migrationFactory
};

// export function migrationFactory() {
//   return {
//     2: (db, transaction) => {
//       const store = transaction.objectStore('people');
//       store.createIndex('country', 'country', { unique: false });
//     },
//     3: (db, transaction) => {
//       const store = transaction.objectStore('people');
//       store.createIndex('age', 'age', { unique: false });
//     }
//   };
// }

@NgModule({
  declarations: [
    AppComponent,
    CategoryDetailsComponent,
    TestDetailsComponent,
    OrderOtcComponent,
    ImageMedotcComponent,
    SimilarProductsComponent,
    OrderMedicineComponent,
    SmallImgMedOTCComponent,
    AlernativeProductComponent,
    HomeComponent,
    HomeBannerComponent,
    OrderActionComponent,
    MostBoughtComponent,
    PopularCategoryComponent,
    KeywordProductsComponent,
    PopularBrandsComponent,
    MedNotesComponent,
    MedScrollerComponent,
    CatalogDetailsComponent,
    ShopByBrandsComponent,
    BrandListingComponent,
    LoginComponent,
    LabcartSummaryComponent,
    MedcartSummeryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
        maxOpened: 1,
        autoDismiss: true,
    }),
    SharedModule,
    CarouselModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
