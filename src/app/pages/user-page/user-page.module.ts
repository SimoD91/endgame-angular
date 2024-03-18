import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserPageRoutingModule } from './user-page-routing.module';
import { UserPageComponent } from './user-page.component';
import { FavoritesComponent } from './favorites/favorites.component';


@NgModule({
  declarations: [
    UserPageComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    UserPageRoutingModule
  ]
})
export class UserPageModule { }
