'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/app/components/ui/card";
import { Series } from '../types/series';
import { useRouter, useSearchParams } from 'next/navigation';

type Post = {
  title: string;
  file: string;
  description: string;
  date: string;
  datetime: string;
  author: { name: string; role: string; href: string; imageUrl: string };
  imageUrl: string;
  category: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
};

type ViewMode = 'all' | 'series' | 'posts';

function PostFilters({ 
  tags, 
  selectedTag,
  onTagChange,
}: {
  categories: string[];
  selectedCategory: string;
  tags: string[];
  selectedTag: string;
  series: Series[];
  selectedSeries: string;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSeriesChange: (seriesId: string) => void;
}) {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleTags = showAllTags ? tags : tags.slice(0, 6);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {visibleTags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagChange(selectedTag === tag ? '' : tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            #{tag}
          </button>
        ))}
        {tags.length > 6 && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="px-3 py-1 rounded-full text-sm bg-gray-400 text-gray-900 hover:bg-gray-300"
          >
            {showAllTags ? '접기' : `+${tags.length - 6}개 더보기`}
          </button>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, fromSeries }: { post: Post; fromSeries?: boolean }) {
  const queryParams = new URLSearchParams({
    from: fromSeries ? 'series' : 'all',
    view: fromSeries ? 'series' : 'all',
    series: fromSeries ? (post.series || '') : ''
  }).toString();

  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/blog/${encodeURIComponent(post.file)}?${queryParams}`}> 
        <div className="relative h-48 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <CardContent className="pt-4">
          <h3 className="mb-2 font-semibold text-xl leading-6 text-gray-900 group-hover:text-gray-600">
            {post.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
            {post.description}
          </p>
          <div className="flex items-center gap-x-4">
            <Image
              src={post.author.imageUrl}
              alt=""
              className="h-8 w-8 rounded-full bg-gray-50"
              width={32}
              height={32}
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{post.author.name}</p>
              <time dateTime={post.datetime} className="text-gray-500">
                {post.date}
              </time>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function SeriesCard({ series, onClick }: { series: Series; onClick: () => void }) {
  const postCount = series.posts?.length || 0;

  return (
    <Card 
      className="overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="pt-4">
        <h3 className="mb-2 font-semibold text-xl leading-6 text-gray-900 group-hover:text-gray-600">
          {series.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
          {series.description}
        </p>
        <div className="text-sm text-gray-500">
          {postCount}개의 포스트
        </div>
      </CardContent>
    </Card>
  );
}

function PostsContent({ 
  posts, 
  series,
  initialViewMode,
  currentSeriesId
}: { 
  posts: Post[],
  series: Series[],
  initialViewMode: ViewMode,
  currentSeriesId?: string
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  useEffect(() => {
    setMounted(true);
    console.log(viewMode);
  }, []);

  useEffect(() => {
    if (mounted) {
      const view = searchParams.get('view');
      if (view === 'series') {
        setViewMode('series');
      } else if (view === 'posts') {
        setViewMode('posts');
      }
    }
  }, [mounted, searchParams]);

  if (!mounted) {
    return null;
  }

  const categories = [...new Set(posts.map(post => post.category))];
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  const handleSeriesSelect = (seriesId: string) => {
    if (seriesId === '') {
      setSelectedSeries('');
      setViewMode('all');
      router.push('/blog');
    } else {
      setSelectedSeries(seriesId);
      setViewMode('posts');
      router.push(`/blog?view=posts&series=${seriesId}`);
    }
  };

  const handleBackToSeries = () => {
    setSelectedSeries('');
    setViewMode('series');
    router.push('/blog?view=series');
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'series') {
      router.push('/blog?view=series');
    } else {
      router.push('/blog?view=all');
    }
  };

  const filteredPosts = posts.filter(post => {
    const categoryMatch = !selectedCategory || post.category === selectedCategory;
    const tagMatch = !selectedTag || post.tags.includes(selectedTag);
    const seriesMatch = viewMode === 'all' 
      ? true 
      : viewMode === 'posts' && selectedSeries 
        ? post.series === selectedSeries
        : true;
    return categoryMatch && tagMatch && seriesMatch;
  });

  const sortedPosts = selectedSeries
    ? [...filteredPosts].sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0))
    : filteredPosts;

  const sortedSeries = series.sort((a,b) => (a.order || 0) - (b.order || 0));

  const currentSeries = currentSeriesId 
    ? series.find(s => s.id === currentSeriesId)
    : null;

  return (
    <div className="py-16 sm:py-24">
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => handleViewModeChange('series')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'series'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            시리즈
          </button>
          <button
            onClick={() => handleViewModeChange('all')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            전체 포스트
          </button>
        </div>

        {viewMode !== 'series' && (
          <PostFilters
            categories={categories}
            selectedCategory={selectedCategory}
            tags={allTags}
            selectedTag={selectedTag}
            series={series}
            selectedSeries={selectedSeries}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
            onSeriesChange={handleSeriesSelect}
          />
        )}
        
        
        {viewMode === 'posts' && selectedSeries && (
          <>
            <div className="mb-8">
              <button 
                onClick={handleBackToSeries}
                className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
              >
                ← 시리즈 목록으로 돌아가기
              </button>
            </div>
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold mb-2">
                {series.find(s => s.id === selectedSeries)?.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {series.find(s => s.id === selectedSeries)?.description}
              </p>
            </div>
          </>
        )}

        {(viewMode === 'all' || viewMode === 'posts') && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPosts.map((post) => (
              <PostCard 
                key={post.file} 
                post={post} 
                fromSeries={viewMode === 'posts'}
              />
            ))}
          </div>
        )}

        {viewMode === 'series' && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedSeries.map((seriesItem) => (
              <SeriesCard
                key={seriesItem.id}
                series={seriesItem}
                onClick={() => handleSeriesSelect(seriesItem.id)}
              />
            ))}
          </div>
        )}

        {currentSeries && (
          <h2 className="text-2xl font-bold mb-4">
            {currentSeries.title}
          </h2>
        )}
      </div>
    </div>
  );
}

export function Posts(props: { 
  posts: Post[],
  series: Series[],
  initialViewMode?: ViewMode,
  currentSeriesId?: string
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsContent 
        {...props} 
        initialViewMode={props.initialViewMode || 'series'}
      />
    </Suspense>
  );
}