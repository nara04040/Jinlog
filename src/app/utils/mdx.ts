import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostFrontMatter, Author } from '../types/post'

const postsDirectory = path.join(process.cwd(), 'src/data/posts')

export async function getAllPosts(): Promise<Post[]> {
  const getMarkdownFiles = (dir: string): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    const files = entries
      .filter(entry => {
        if (entry.name.startsWith('.')) return false
        
        if (entry.isDirectory()) {
          return true
        }
        
        return entry.isFile() && entry.name.endsWith('.md')
      })
      .map(entry => {
        if (entry.isDirectory()) {
          return getMarkdownFiles(path.join(dir, entry.name))
        }
        return path.join(dir, entry.name)
      })
      .flat()
      
    return files
  }

  const markdownFiles = getMarkdownFiles(postsDirectory)
  
  const posts = await Promise.all(
    markdownFiles.map(async (filePath) => {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const frontMatter = data as PostFrontMatter
      
      const dateStr = frontMatter.date
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

      const author: Author = {
        name: frontMatter.author,
        role: "Developer",
        href: "#",
        imageUrl: "/시크한 리카르도.png"
      }
      
      return {
        title: frontMatter.title,
        date: formattedDate,
        description: frontMatter.description,
        category: frontMatter.category,
        tags: frontMatter.tags,
        series: frontMatter.series,
        seriesOrder: frontMatter.seriesOrder,
        imageUrl: frontMatter.imageUrl,
        slug: path.basename(filePath, '.md'),
        content,
        file: path.basename(filePath),
        datetime: isoDate,
        author
      } as Post
    })
  )

  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
} 