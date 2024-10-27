'use client'

import { useParams } from 'next/navigation';
import { BlogPost } from '@/app/components/BlogPost';

export function ClientBlogPost(props: {
  title: string;
  date: string;
  author: string;
  content: React.ReactNode;
  slug: string;
}) {
  const {content} = props
  const params = useParams();
  console.log(params);

  return (
    <BlogPost
      title={props.title}
      date={props.date}
      author={props.author}
      content={typeof props.content === 'string' ? props.content : ''}
    />
  );
}