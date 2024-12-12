import { NewsModel } from '../news/news.model';

// model used to store the news data in cache
export interface NewsCache {
  nextUrl: string;
  prevUrl: string;
  data: NewsModel[];
}
