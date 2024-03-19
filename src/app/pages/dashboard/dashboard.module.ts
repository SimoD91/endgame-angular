import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TitleComponent } from './title/title.component';
import { PortalComponent } from './portal/portal.component';
import { LoadingComponent } from './loading/loading.component';


@NgModule({
  declarations: [
    DashboardComponent,
    TitleComponent,
    PortalComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
