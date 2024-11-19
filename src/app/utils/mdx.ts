import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export async function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts')
  const fileNames = await fs.readdir(postsDirectory)
  
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName)
      const fileContents = await fs.readFile(filePath, 'utf8')
      const { data } = matter(fileContents)
      
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
        console.error(`Invalid date format for ${fileName}:`, dateStr)
      }
      
      return {
        title: data.title,
        description: data.description || '',
        date: formattedDate,
        datetime: isoDate,
        author: {
          name: data.author,
          role: "Developer",
          href: "#",
          imageUrl: "/시크한 리카르도.png"
        },
        imageUrl: data.imageUrl || "/next.svg",
        category: data.category || "Uncategorized",
        tags: data.tags || [],
        file: fileName.replace(/\.md$/, ''),
        series: data.series || null,
        seriesOrder: data.seriesOrder || null
      }
    })
  )

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
} 