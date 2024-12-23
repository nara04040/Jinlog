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
import Image from 'next/image'
import { Series } from '@/app/types/series'

interface Props {
  post: Post
  searchParams: {
    from?: string
    view?: string
    series?: string
  }
  series?: Series[]
}

export function ClientBlogPost({ post, searchParams, series }: Props) {
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

  const currentSeries = series?.find(s => s.id === searchParams.series)

  const backUrl = searchParams.from === 'series' 
    ? `/blog?view=posts&series=${searchParams.series}` 
    : '/blog'

  const backText = searchParams.from === 'series' && currentSeries
    ? `'${currentSeries.title}' 시리즈 목록으로`
    : '블로그로'

  return (
    <BlogLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="mb-8">
            <Link 
              href={backUrl}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              ← {backText} 돌아가기
            </Link>
          </div>

          <article className="prose prose-slate dark:prose-invert mx-auto max-w-3xl">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4 !mt-0">
                {post.title}
              </h1>
              <div className="flex items-center justify-start gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Image 
                    src={post.author.imageUrl} 
                    alt={post.author.name}
                    width={500}
                    height={300}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{post.author.name}</span>
                </div>
                <span>•</span>
                <time dateTime={post.datetime}>{post.date}</time>
              </div>
            </header>

            <div 
              className="mt-8"
              dangerouslySetInnerHTML={{ __html: contentHtml }} 
            />
          </article>

          <div className="h-20" />
        </div>
      </div>
    </BlogLayout>
  )
}