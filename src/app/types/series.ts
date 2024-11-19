export interface Series {
  id: string;
  title: string;
  description: string;
  posts: SeriesPost[];
}

export interface SeriesPost {
  id: string;
  title: string;
  order: number;
}

export interface PostFrontmatter {
  title: string;
  date: string;
  author: string;
  series?: string;
  seriesOrder?: number;
} 