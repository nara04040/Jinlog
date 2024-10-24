// /app/components/BlogPost.tsx
import React from 'react';
import { Prose } from './Prose'; // Prose 컴포넌트가 필요하다면 추가

export function BlogPost(props: {
  date: string;
  title: string;
  author: string;
  content: React.ReactNode;
}) {
  const { date, title, author, content } = props;

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-gray-600">{`By ${author} on ${date}`}</p>
      <div className="mt-6">
        <Prose>{content}</Prose>
      </div>
    </article>
  );
}