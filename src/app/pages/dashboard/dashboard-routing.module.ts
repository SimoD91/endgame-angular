import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PortalComponent } from './portal/portal.component';
import { LoadingComponent } from './loading/loading.component';
import { TitleComponent } from './title/title.component';

const routes: Routes = [{ path: '', component: DashboardComponent },
{ path: 'loading', component : LoadingComponent},
{ path: 'portal', component : PortalComponent},
{ path: 'title/:id', component : TitleComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
