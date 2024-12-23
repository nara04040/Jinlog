export interface Series {
  id: string;
  title: string;
  description: string;
  posts: {
    id: string;
    title: string;
    // 필요한 다른 포스트 관련 필드들...
  }[];
  order: number
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