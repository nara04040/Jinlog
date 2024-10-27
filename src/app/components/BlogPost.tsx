// /app/components/BlogPost.tsx
import React from 'react';

export function BlogPost(props: {
  date: string;
  title: string;
  author: string;
  content: string;
}) {
  const { date, title, author, content } = props;

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-8">{`By ${author} on ${date}`}</p>
      <div className="prose prose-lg prose-slate max-w-none
        prose-headings:font-bold
        prose-a:text-blue-600
        prose-strong:text-black prose-strong:font-bold
        prose-code:text-blue-600 prose-code:bg-gray-100 prose-code:rounded
        prose-pre:bg-gray-800 prose-pre:text-gray-100
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300
        prose-blockquote:pl-4 prose-blockquote:italic">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </article>
  );
}
