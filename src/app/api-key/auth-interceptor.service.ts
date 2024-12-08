import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiKeyService } from './api-key.service';
import { environment } from '../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private apiKeyService: ApiKeyService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const urlsRequiringApiKey = [
      environment.api.marsCuriosityEndpoint,
      environment.api.apodEndpoint
    ];

    if (urlsRequiringApiKey.some(url => req.urlWithParams.includes(url))) {
      if (req.method !== 'OPTIONS') {
        req = req.clone({ headers: req.headers.set('X-API-KEY', this.apiKeyService.getApiKey()) });
      }

    }
    return next.handle(req);
  }
}
