import { Injectable } from '@angular/core';
import { NewsModel } from './models/news.model';
import { ErrorService } from './error.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SaveFavoriteService {
  private readonly STORAGE_KEY = 'newsItems';

  constructor(private errorService: ErrorService, private router: Router) {}

  public saveNewsItems(newsItems: NewsModel[]): boolean {
    try {
      const serializedData = JSON.stringify(newsItems);
      localStorage.setItem(this.STORAGE_KEY, serializedData);
      return true;
    } catch (error) {
      this.errorService.sendError('Error occured during news saving process.');
      this.router.navigate(['/Error']);
      return false;
    }
  }

  public saveNewsItem(newsItem: NewsModel): boolean {
    try {
      let newsItems = this.getNewsItems();
      newsItems.push(newsItem);
      const serializedData = JSON.stringify(newsItems);
      localStorage.setItem(this.STORAGE_KEY, serializedData);
      return true;
    } catch (error) {
      this.errorService.sendError('Error occured during news saving process.');
      this.router.navigate(['/Error']);
      return false;
    }
  }

  public getNewsItems(): NewsModel[] {
    try {
      const serializedData = localStorage.getItem(this.STORAGE_KEY);
      if (serializedData === null) {
        return [];
      }
      return JSON.parse(serializedData) as NewsModel[];
    } catch (error) {
      this.errorService.sendError('Error occured during news retrival.');
      this.router.navigate(['/Error']);
      return [];
    }
  }

  public clearNewsItems(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      this.errorService.sendError('Error clearing news.');
      this.router.navigate(['/Error']);
    }
  }
}
