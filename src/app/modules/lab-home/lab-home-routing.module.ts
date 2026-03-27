import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LabHomeComponent } from './lab-home.component';
import { LabLandingComponent } from './lab-landing/lab-landing.component';

const routes: Routes = [
  { path: '', 
    component: LabHomeComponent,
    children: [
      { path: '', component: LabLandingComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabHomeRoutingModule { }
