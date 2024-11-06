import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { glob } from 'glob'

export async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts')
  const mdFiles = await glob('*.md', { cwd: postsDirectory })
  
  const posts = mdFiles.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      title: data.title,
      file: fileName.replace('.md', ''),
      description: data.description || '',
      date: data.date,
      datetime: new Date(data.date).toISOString(),
      author: {
        name: data.author,
        role: "Founder",
        href: "#",
        imageUrl: "/시크한 리카르도.png",
      },
      imageUrl: "/시크한 리카르도.png",
      category: data.category,
      tags: data.tags || [],
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} 