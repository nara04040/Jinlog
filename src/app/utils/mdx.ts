import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { glob } from 'glob'

function formatDate(dateString: string | undefined) {
  if (!dateString) {
    return new Date().toISOString().split('T')[0]; // 날짜가 없으면 현재 날짜 사용
  }
  // 이미 YYYY-MM-DD 형식이면 그대로 반환
  if (dateString.includes('-')) {
    return dateString;
  }
  // YYYY.MM.DD 형식을 YYYY-MM-DD 형식으로 변환
  return dateString.replace(/\./g, '-');
}

export async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts')
  const mdFiles = await glob('*.md', { cwd: postsDirectory })
  
  const posts = mdFiles.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    const formattedDate = formatDate(data.date);
    
    return {
      title: data.title || 'Untitled',
      file: fileName.replace('.md', ''),
      description: data.description || '',
      date: formattedDate,
      datetime: formattedDate,
      author: {
        name: data.author || 'Anonymous',
        role: "Founder",
        href: "#",
        imageUrl: "/시크한 리카르도.png",
      },
      imageUrl: "/시크한 리카르도.png",
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} 