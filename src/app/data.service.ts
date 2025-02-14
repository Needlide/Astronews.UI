import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MarsRootModel } from './models/mars/mars.model';
import { ApodModel } from './models/apod/apod.model';
import { NewsRootModel } from './models/news/news.root.model';
import { GalleryRootModel } from './models/gallery/gallery.root.model';
import { ManifestModelRoot } from './models/mars/manifest.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  getNews(url: string): Observable<NewsRootModel> {
    return this.http.get<NewsRootModel>(url).pipe(catchError(this.handleError));
  }

  getNasaGallery(url: string): Observable<GalleryRootModel> {
    return this.http
      .get<GalleryRootModel>(url)
      .pipe(catchError(this.handleError));
  }

  getMarsPhotos(url: string): Observable<MarsRootModel> {
    return this.http.get<MarsRootModel>(url).pipe(catchError(this.handleError));
  }

  getMarsManifest(url: string): Observable<ManifestModelRoot> {
    return this.http
      .get<ManifestModelRoot>(url)
      .pipe(catchError(this.handleError));
  }

  getApods(url: string): Observable<ApodModel[]> {
    return this.http.get<ApodModel[]>(url).pipe(catchError(this.handleError));
  }

  // retrieve a single APOD image
  getApod(url: string): Observable<ApodModel> {
    return this.http.get<ApodModel>(url).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred: ', error);

    return throwError(
      () => new Error("Couldn't retrieve data; please try again later.")
    );
  }
}
