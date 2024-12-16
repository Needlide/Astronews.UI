import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from 'src/app/news/news.component';
import { NasaGalleryComponent } from './nasa-gallery/nasa-gallery.component';
import { MarsPhotosCuriosityComponent } from './mars-photos-curiosity/mars-photos-curiosity.component';
import { APODComponent } from './apod/apod.component';
import { ErrorComponent } from './error/error.component';
//import { MarsPhotosOpportunityComponent } from './mars-photos-opportunity/mars-photos-opportunity.component';
//import { MarsPhotosSpiritComponent } from './mars-photos-spirit/mars-photos-spirit.component';

const routes: Routes = [
  { path: 'news', component: NewsComponent },
  { path: 'gallery', component: NasaGalleryComponent },
  { path: 'mars/curiosity', component: MarsPhotosCuriosityComponent },
  //{ path: 'mars/opportunity', component: MarsPhotosOpportunityComponent },
  //{ path: 'mars/spirit', component: MarsPhotosSpiritComponent },
  { path: 'apod', component: APODComponent },
  { path: 'error', component: ErrorComponent },
  { path: '', redirectTo: 'news', pathMatch: 'full' },
  { path: '**', redirectTo: 'news' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
