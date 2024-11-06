import { BlogLayout } from "@/app/components/layouts/BlogLayout";
import { Posts } from '../components/Posts';
import { getAllPosts } from '../utils/mdx';

export const revalidate = 60;

export default async function BlogContentsPage() {
  const posts = await getAllPosts();
  
  return (
    <BlogLayout>
      <Posts posts={posts} />
    </BlogLayout>
  );
}
