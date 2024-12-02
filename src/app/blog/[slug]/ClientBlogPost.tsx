'use client'

import { Post } from '@/app/types/post'
import { BlogLayout } from "@/app/components/layouts/BlogLayout"
import Link from 'next/link'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { useEffect, useState } from 'react'

interface Props {
  post: Post
  searchParams: {
    from?: string
    view?: string
    series?: string
  }
}

export function ClientBlogPost({ post, searchParams }: Props) {
  const [contentHtml, setContentHtml] = useState('')

  useEffect(() => {
    async function processContent() {
      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeHighlight, { detect: true })
        .use(rehypeStringify)
        .process(post.content)

      setContentHtml(processedContent.toString())
    }

    processContent()
  }, [post.content])

  const backUrl = searchParams.from === 'series' 
    ? `/blog?view=series` 
    : '/blog'

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
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1>{post.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <img 
                src={post.author.imageUrl} 
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{post.author.name}</span>
            </div>
            <time dateTime={post.datetime}>{post.date}</time>
          </div>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
      </div>
    </BlogLayout>
  )
}