import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post } from '@/app/types/post'
import { getAllPosts } from '@/app/utils/mdx'
import { Metadata } from 'next'
import { ClientBlogPost } from './ClientBlogPost'

// 파일을 찾는 함수 수정
async function findMarkdownFile(slug: string): Promise<string | null> {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts')
  
  // 재귀적으로 파일 찾기
  const findFile = (dir: string): string | null => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        const found = findFile(fullPath)
        if (found) return found
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // .md 확장자를 제거하고 비교
        const fileSlug = path.basename(entry.name, '.md')
        // URL의 .md도 제거하고 비교
        const normalizedSlug = slug.replace('.md', '')
        if (fileSlug === normalizedSlug) {
          return fullPath
        }
      }
    }
    
    return null
  }
  
  return findFile(postsDirectory)
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    // .md 확장자 제거
    slug: post.slug.replace('.md', ''),
  }))
}

interface Props {
  params: {
    slug: string
  }
  searchParams: {
    from?: string
    view?: string
    series?: string
  }
}

async function getPost(slug: string): Promise<Post | null> {
  const filePath = await findMarkdownFile(slug)
  if (!filePath) {
    console.error(`File not found for slug: ${slug}`)
    return null
  }
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    const dateStr = data.date
    let formattedDate = dateStr
    let isoDate = new Date().toISOString()

    try {
      if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          formattedDate = dateStr
          isoDate = date.toISOString()
        }
      }
    } catch (error) {
      console.error(`Invalid date format for ${filePath}:`, dateStr, error)
    }

    return {
      title: data.title,
      date: formattedDate,
      description: data.description,
      category: data.category,
      tags: data.tags || [],
      series: data.series,
      seriesOrder: data.seriesOrder,
      imageUrl: data.imageUrl || "/next.svg",
      slug: path.basename(filePath, '.md'),
      content,
      file: path.basename(filePath),
      datetime: isoDate,
      author: {
        name: data.author,
        role: "Developer",
        href: "#",
        imageUrl: "/시크한 리카르도.png"
      }
    } as Post
  } catch (error) {
    console.error(`Error reading file for slug ${slug}:`, error)
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}
  
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPost({ params, searchParams }: Props) {
  const post = await getPost(params.slug)
  
  if (!post) {
    console.error(`Post not found for slug: ${params.slug}`)
    return <div>Post not found</div>
  }

  return <ClientBlogPost post={post} searchParams={searchParams} />
}
