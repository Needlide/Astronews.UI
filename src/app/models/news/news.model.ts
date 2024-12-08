export interface NewsModel{
    id: number;
    title: string;
    url: string;
    image_url: string;
    news_site: string;
    summary: string;
    published_at: any;
    updated_at: any;
    featured: boolean;
    launches : Launch[];
    events : Event[];
}

interface Launch {
    launch_id : string;
    provider : string;
}

interface Event {
    event_id : number;
    provider : string;
}