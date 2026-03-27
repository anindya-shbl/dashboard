import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderOnlineComponent } from './order-online.component';
import { OnlineHomeComponent } from './online-home/online-home.component';

const routes: Routes = [{
  path: '',
  component: OrderOnlineComponent,
  children: [
    { path: '', component: OnlineHomeComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderOnlineRoutingModule { }
