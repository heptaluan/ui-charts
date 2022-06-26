/*
 * @Description: 根路由模块
 */
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthGuard } from './auth-guard.service'

const routes: Routes = [
  {
    path: '',
    redirectTo: '/pages/home',
    pathMatch: 'full',
  },
  {
    path: 'pages',
    loadChildren: 'app/pages/pages.module#PagesModule',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
