import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post } from '../app/types/post';

const postsDirectory = path.join(process.cwd(), 'src/data/posts');

export async function getPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html)
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      id: fileName.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      author: data.author,
      content: contentHtml,
      file: fileName.replace(/\.md$/, ''),
    } as Post;
  }));

  return posts;
}
