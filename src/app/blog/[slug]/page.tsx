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
import { Series } from '@/app/types/series';
import { SeriesNavigation } from '@/app/components/SeriesNavigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.file,
  }));
}

export default async function Page({ params, searchParams }: { 
  params: { slug: string },
  searchParams: { from?: string, view?: string }
}) {
  const postContent = await getPostContent(params.slug);
  
  if (!postContent) {
    return <div>포스트를 찾을 수 없습니다.</div>;
  }

  const backUrl = searchParams.from === 'series' 
    ? `/blog?view=series` 
    : '/blog';

  return (
    <BlogLayout>
      <div className="pt-20 relative">
        <div className="mb-8 absolute top-20 left-20">  
          <Link 
            href={backUrl}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            ← {searchParams.from === 'series' ? '시리즈 목록으로' : '블로그로'} 돌아가기
          </Link>
        </div>
        <ClientBlogPost
          title={postContent.title}
          date={postContent.date}
          author={postContent.author}
          content={postContent.content}
          slug={params.slug}
        />
        {postContent.series && (
          <SeriesNavigation 
            series={postContent.series} 
            currentPostId={params.slug} 
          />
        )}
      </div>
    </BlogLayout>
  );
}

async function getPostContent(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/data/posts');
  const seriesDirectory = path.join(process.cwd(), 'src/data/series');
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  try {
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    let seriesData = null;
    if (data.series) {
      const seriesPath = path.join(seriesDirectory, `${data.series}.json`);
      const seriesContent = await fs.readFile(seriesPath, 'utf8');
      seriesData = JSON.parse(seriesContent) as Series;
    }

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
      series: seriesData,
      seriesOrder: data.seriesOrder
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
