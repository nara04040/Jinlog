'use client'

import { useParams } from 'next/navigation';
import { BlogPost } from '@/app/components/BlogPost';
import { useEffect, useState } from 'react';

export function ClientBlogPost(props: {
  title: string;
  date: string;
  author: string;
  content: React.ReactNode;
  slug: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <BlogPost
      title={props.title}
      date={props.date}
      author={props.author}
      content={typeof props.content === 'string' ? props.content : ''}
    />
  );
}