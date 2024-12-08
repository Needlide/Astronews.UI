import { NewsModel } from "./news.model";

export interface NewsRootModel {
    count : number;
    next : string;
    previous : string;
    results : NewsModel[];
}