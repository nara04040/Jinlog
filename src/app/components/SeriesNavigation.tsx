import Link from 'next/link';
import { Series } from '../types/series';

interface SeriesNavigationProps {
  series: Series;
  currentPostId: string;
}

export function SeriesNavigation({ series, currentPostId }: SeriesNavigationProps) {
  const currentIndex = series.posts.findIndex(post => post.id === currentPostId);
  const prevPost = currentIndex > 0 ? series.posts[currentIndex - 1] : null;
  const nextPost = currentIndex < series.posts.length - 1 ? series.posts[currentIndex + 1] : null;

  return (
    <div className="px-20 mt-8 space-y-4 border-t border-gray-200 pt-4 dark:border-gray-700">
      <h3 className="text-lg font-semibold">{series.title}</h3>
      <div className="flex justify-between">
        {prevPost && (
          <Link 
            href={`/blog/${prevPost.id}`}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            ← {prevPost.title}
          </Link>
        )}
        {nextPost && (
          <Link 
            href={`/blog/${nextPost.id}`}
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400"
          >
            {nextPost.title} →
          </Link>
        )}
      </div>
    </div>
  );
} 