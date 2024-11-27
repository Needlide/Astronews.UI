import { NgModule, isDevMode, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './news/news.component';
import { MarsPhotosCuriosityComponent } from './mars-photos-curiosity/mars-photos-curiosity.component';
import { NasaGalleryComponent } from './nasa-gallery/nasa-gallery.component';
import { APODComponent } from './apod/apod.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SortPipe } from './shared/sort.pipe';
//import { MarsPhotosOpportunityComponent } from './mars-photos-opportunity/mars-photos-opportunity.component';
//import { MarsPhotosSpiritComponent } from './mars-photos-spirit/mars-photos-spirit.component';
import { DataSortPipe } from './data-sort.pipe';
import { BackToTopComponent } from './back-to-top/back-to-top.component';
import { DateFormatPipe } from './date-format.pipe';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { AboutComponent } from './about/about.component';
import { SearchBarComponent } from './search-bar/search-bar.component';

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
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
