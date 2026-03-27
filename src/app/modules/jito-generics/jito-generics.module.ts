import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JitoGenericsRoutingModule } from './jito-generics-routing.module';
import { JitoGenericsComponent } from './jito-generics.component';
import { JitoSearchComponent } from './jito-search/jito-search.component';
import { BrandedComponent } from './branded/branded.component';
import { GenericComponent } from './generic/generic.component';
import { SaltCompositionComponent } from './salt-composition/salt-composition.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    JitoGenericsComponent,
    JitoSearchComponent,
    BrandedComponent,
    GenericComponent,
    SaltCompositionComponent
  ],
  imports: [
    CommonModule,
    JitoGenericsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class JitoGenericsModule { }
