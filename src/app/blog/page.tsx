import { BlogLayout } from "@/app/components/layouts/BlogLayout";
import { Posts } from '../components/Posts';
import { getAllPosts } from '../utils/mdx';
import { getSeries } from '../utils/series';

export const revalidate = 60;

export default async function BlogContentsPage({
  searchParams,
}: {
  searchParams: { view?: string }
}) {
  const posts = await getAllPosts();
  const series = await getSeries();
  
  const viewMode = searchParams?.view === 'series' || searchParams?.view === 'posts' 
    ? searchParams.view 
    : 'all';
  
  return (
    <BlogLayout>
      <Posts 
        posts={posts} 
        series={series}
        initialViewMode={viewMode}
      />
    </BlogLayout>
  );
}
