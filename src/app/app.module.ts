import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './news/news.component';
import { MarsPhotosCuriosityComponent } from './mars-photos-curiosity/mars-photos-curiosity.component';
import { NasaGalleryComponent } from './nasa-gallery/nasa-gallery.component';
import { APODComponent } from './apod/apod.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './api-key/auth-interceptor.service';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SortPipe } from './shared/sort.pipe';
//import { MarsPhotosOpportunityComponent } from './mars-photos-opportunity/mars-photos-opportunity.component';
//import { MarsPhotosSpiritComponent } from './mars-photos-spirit/mars-photos-spirit.component';
import { DataSortPipe } from './shared/data-sort.pipe';
import { BackToTopComponent } from './back-to-top/back-to-top.component';
import { DateFormatPipe } from './shared/date-format.pipe';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { AboutComponent } from './about/about.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { newsReducer } from './news/news.reducer';
import { NewsEffects } from './news/news.effects';
import { marsCuriosityReducer } from './mars-photos-curiosity/mars-photos-curiosity.reducer';
import { nasaGalleryReducer } from './nasa-gallery/nasa-gallery.reducer';
import { apodReducer } from './apod/apod.reducer';
import { MarsCuriosityEffects } from './mars-photos-curiosity/mars-photos-curiosity.effects';
import { NasaGalleryEffects } from './nasa-gallery/nasa-gallery.effects';
import { ApodEffects } from './apod/apod.effects';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NewsComponent,
    MarsPhotosCuriosityComponent,
    NasaGalleryComponent,
    APODComponent,
    ErrorComponent,
    SortPipe,
    //MarsPhotosOpportunityComponent,
    //MarsPhotosSpiritComponent,
    DataSortPipe,
    BackToTopComponent,
    DateFormatPipe,
    MobileMenuComponent,
    AboutComponent,
  ],
  imports: [
    LoadingSpinnerComponent,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    SearchBarComponent,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true,
      //enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    StoreModule.forRoot({
      news: newsReducer,
      marsCuriosity: marsCuriosityReducer,
      nasaGallery: nasaGalleryReducer,
      apod: apodReducer,
    }),
    EffectsModule.forRoot([
      NewsEffects,
      MarsCuriosityEffects,
      NasaGalleryEffects,
      ApodEffects,
    ]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
