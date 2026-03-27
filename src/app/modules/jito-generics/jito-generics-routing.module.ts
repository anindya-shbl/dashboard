import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JitoGenericsComponent } from './jito-generics.component';
import { JitoSearchComponent } from './jito-search/jito-search.component';
import { BrandedComponent } from './branded/branded.component';
import { GenericComponent } from './generic/generic.component';
import { SaltCompositionComponent } from './salt-composition/salt-composition.component';

const routes: Routes = [{
  path: '',
  component: JitoGenericsComponent,
  children: [
    { path: '', component: JitoSearchComponent },
    { path: 'branded', component: BrandedComponent  },
    { path: 'generic', component: GenericComponent  },
    { path: 'saltcomposition', component: SaltCompositionComponent  },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JitoGenericsRoutingModule { }
