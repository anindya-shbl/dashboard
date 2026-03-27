import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { SearchComponent } from './modules/shared/search/search.component';
import { CategoryDetailsComponent } from './components/category-details/category-details.component';
import { TestDetailsComponent } from './components/test-details/test-details.component';
import { OrderOtcComponent } from './components/order-otc/order-otc.component';
import { OrderMedicineComponent } from './components/order-medicine/order-medicine.component';
import { HomeComponent } from './components/home/home.component';
import { CatalogDetailsComponent } from './components/catalog-details/catalog-details.component';
import { ShopByBrandsComponent } from './components/shop-by-brands/shop-by-brands.component';
import { BrandListingComponent } from './components/brand-listing/brand-listing.component';
import { LoginComponent } from './components/login/login.component';
import { LabcartSummaryComponent } from './components/labcart-summary/labcart-summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'customers/dashboard', pathMatch: 'full' },
  // { path: '', redirectTo: 'new', pathMatch: 'full' },
  { path: 'new', component: HomeComponent},
  { path: 'newlogin', component: LoginComponent},
  { path: 'newcatalog/lists/:name', component: CatalogDetailsComponent},
  { path: 'newbrand/shopbybrand', component: ShopByBrandsComponent},
  { path: 'newbrand/brandlisting/:brand', component: BrandListingComponent},
  { path: 'neworder-medicine/:name', component: OrderMedicineComponent},
  { path: 'neworder-otc/:name', component: OrderOtcComponent},
  { path: 'new/:name/:seg/:typ/:ctId', component: CategoryDetailsComponent},
  { path: 'newtest/:name', component: TestDetailsComponent},
  // { path: 'neworderlabtest', component: LabcartSummaryComponent},
  { path: 'customers/dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'order-online', loadChildren: () => import('./modules/order-online/order-online.module').then(m => m.OrderOnlineModule) },
  { path: 'healtharticle', loadChildren: () => import('./modules/article/article.module').then(m => m.ArticleModule) },
  { path: 'newlab-test', loadChildren: () => import('./modules/lab-home/lab-home.module').then(m => m.LabHomeModule) },
  { path: 'newhealth-packages', loadChildren: () => import('./modules/health-packages/health-packages.module').then(m => m.HealthPackagesModule) },
  { path: 'newradiology-test', loadChildren: () => import('./modules/radiology-tests/radiology-tests.module').then(m => m.RadiologyTestsModule) },
  { path: 'newdiagnostic-test', loadChildren: () => import('./modules/diagnostic-test/diagnostic-test.module').then(m => m.DiagnosticTestModule) },
  { path: 'newcategory', loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule) },
  // { path: 'jito-generics', loadChildren: () => import('./modules/jito-generics/jito-generics.module').then(m => m.JitoGenericsModule) },
  // { path: 'search', component: SearchComponent},
  { path: '**', redirectTo: 'customers/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
