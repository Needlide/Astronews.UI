import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment.prod';
import { MarsRootLatestModel, MarsRootModel } from './models/mars/mars.model';
import { ApodModel } from './models/apod/apod.model';
import { NewsRootModel } from './models/news/news.root.model';
import { GalleryRootModel } from './models/gallery/gallery.root.model';
import { ApiKeyService } from './api-key/api-key.service';
import { convertDateToString } from './shared/date-functions';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private newsEndpoint = environment.api.newsEndpoint;
  private nasaEndpoint = environment.api.nasaEndpoint;
  private apodEndpoint = environment.api.apodEndpoint;

  constructor(private http: HttpClient, private apiKeyService: ApiKeyService) {}

  getNews(url: string): Observable<NewsRootModel> {
    if (!url) {
      let requestUrl = this.newsEndpoint.concat(`?limit=60&offset=0`);
      return this.http
        .get<NewsRootModel>(requestUrl)
        .pipe(catchError(this.handleError));
    }
    return this.http.get<NewsRootModel>(url).pipe(catchError(this.handleError));
  }

  getNasaGallery(url: string): Observable<GalleryRootModel> {
    if (!url) {
      let date = new Date();
      let utcYear = date.getUTCFullYear();
      let requestUrl = this.nasaEndpoint.concat(
        `?year_start=${utcYear}&page_size=50`
      );
      return this.http
        .get<GalleryRootModel>(requestUrl)
        .pipe(catchError(this.handleError));
    }
    return this.http
      .get<GalleryRootModel>(url)
      .pipe(catchError(this.handleError));
  }

  getMarsPhotos(url: string): Observable<MarsRootModel> {
    let apiKey = this.apiKeyService.getApiKey();

    let requestUrl = url;

    if (url.includes('?')) {
      requestUrl = requestUrl.concat(`&api_key=${apiKey}`);
    } else {
      requestUrl = requestUrl.concat(`?api_key=${apiKey}`);
    }
    return this.http
      .get<MarsRootModel>(requestUrl)
      .pipe(catchError(this.handleError));
  }

  // difference between `getMarsPhotos` and `getMarsLatestPhotos` in the name of the returned property from the API
  getMarsLatestPhotos(url: string): Observable<MarsRootLatestModel> {
    let apiKey = this.apiKeyService.getApiKey();

    let requestUrl = url;

    if (url.includes('?')) {
      requestUrl = requestUrl.concat(`&api_key=${apiKey}`);
    } else {
      requestUrl = requestUrl.concat(`?api_key=${apiKey}`);
    }
    return this.http
      .get<MarsRootLatestModel>(requestUrl)
      .pipe(catchError(this.handleError));
  }

  getApods(startDate: Date, endDate: Date): Observable<ApodModel[]> {
    let apiKey = this.apiKeyService.getApiKey();
    let requestUrl = this.apodEndpoint.concat(
      `?start_date=${convertDateToString(
        startDate
      )}&end_date=${convertDateToString(endDate)}&api_key=${apiKey}`
    );
    return this.http
      .get<ApodModel[]>(requestUrl)
      .pipe(catchError(this.handleError));
  }

  // retrieve a single APOD image
  getApod(date: Date): Observable<ApodModel> {
    let apiKey = this.apiKeyService.getApiKey();
    let requestUrl = this.apodEndpoint.concat(
      `?date=${convertDateToString(date)}&api_key=${apiKey}`
    );
    return this.http
      .get<ApodModel>(requestUrl)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred: ', error);

    return throwError(
      () => new Error("Couldn't retrieve data; please try again later.")
    );
  }
}
