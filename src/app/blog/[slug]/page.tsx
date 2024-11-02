import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { BlogLayout } from "@/app/components/layouts/BlogLayout";
import { ClientBlogPost } from './ClientBlogPost';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.file,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const postContent = await getPostContent(params.slug);
  
  if (!postContent) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }

  return (
    <BlogLayout>
      <ClientBlogPost
        title={postContent.title}
        date={postContent.date}
        author={postContent.author}
        content={postContent.content}
        slug={params.slug}
      />
    </BlogLayout>
  );
}

async function getPostContent(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeHighlight, { detect: true }) 
      .use(rehypeStringify)
      .process(content);
    
    const contentHtml = processedContent.toString();

    return {
      title: data.title,
      date: data.date,
      author: data.author,
      content: contentHtml,
    };
  } catch (error) {
    console.error('포스트를 불러오는 중 오류 발생:', error);
    return null;
  }
}

async function getPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts');
  const fileNames = await fs.readdir(postsDirectory);
  
  const posts = await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      file: fileName.replace(/\.md$/, ''),
      title: data.title,
      date: data.date,
      author: data.author,
    };
  }));

  return posts;
}
