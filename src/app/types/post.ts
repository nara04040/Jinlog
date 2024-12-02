export interface Author {
  name: string
  role: string
  href: string
  imageUrl: string
}

export interface PostFrontMatter {
  title: string
  date: string
  author: string
  description: string
  category: string
  tags: string[]
  series?: string
  seriesOrder?: number
  imageUrl: string
}

export interface Post {
  title: string
  date: string
  description: string
  category: string
  tags: string[]
  series?: string
  seriesOrder?: number
  imageUrl: string
  slug: string
  content: string
  file: string
  datetime: string
  author: Author
}