import React from 'react';

export function BlogPost(props: {
  date: string;
  title: string;
  author: string;
  content: string;
}) {
  const { date, title, author, content } = props;

  return (
    <article className="mx-auto max-w-3xl px-2 py-20">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{`By ${author} on ${date}`}</p>
      <div className="prose prose-lg prose-slate dark:prose-invert max-w-none
        prose-headings:font-bold dark:prose-headings:text-gray-100
        prose-a:text-blue-600 dark:prose-a:text-blue-400
        prose-strong:text-black prose-strong:font-bold dark:prose-strong:text-white
        prose-code:text-blue-600 prose-code:bg-gray-100 
        dark:prose-code:text-blue-400 dark:prose-code:bg-gray-800
        prose-pre:bg-gray-800 prose-pre:text-gray-100
        prose-blockquote:border-l-4 prose-blockquote:border-gray-300 
        dark:prose-blockquote:border-gray-700
        prose-blockquote:pl-4 prose-blockquote:italic">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </article>
  );
}
