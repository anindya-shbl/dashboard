import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { ListingComponent } from './listing/listing.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    children: [
      { path: '', redirectTo: 'listing', pathMatch: 'full' },
      { path: 'listing', component: ListingComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
