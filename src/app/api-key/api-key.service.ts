import { Injectable } from '@angular/core';
//import { environment } from '../../environments/environment.prod';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyService {
  private apiKey: string = environment.secrets.api_key;
  constructor() {}

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  getApiKey(): string {
    return this.apiKey || '';
  }
}
