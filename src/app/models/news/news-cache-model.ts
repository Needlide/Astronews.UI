import { NewsModel } from "./news.model";

export interface NewsCache {
    nextUrl: string,
    data: NewsModel[]
}