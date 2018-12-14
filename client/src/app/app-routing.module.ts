import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {SiteLayoutComponent} from "./shared/layouts/site-layout/site-layout.component";
import {MoviePageComponent} from "./movie-page/movie-page.component";

const routes: Routes = [
  {
    path: '', component: SiteLayoutComponent, children: [
      {path: '', component: HomePageComponent},
      {path: 'movie/new', component: MoviePageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
