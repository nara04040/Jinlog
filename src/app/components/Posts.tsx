'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { Card, CardContent } from "@/app/components/ui/card";

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
};

function PostFilters({ 
  categories, 
  selectedCategory, 
  tags, 
  selectedTags, 
  onCategoryChange, 
  onTagChange 
}: {
  categories: string[];
  selectedCategory: string;
  tags: string[];
  selectedTags: string[];
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex gap-4 mb-4">
        <select 
          value={selectedCategory} 
          onChange={(e) => onCategoryChange(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">모든 카테고리</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onTagChange(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden transition-transform duration-300 hover:scale-105">
      <Link href={`/blog/${encodeURIComponent(post.file)}`}> 
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

export function Posts({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const categories = [...new Set(posts.map(post => post.category))];
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  const filteredPosts = posts.filter(post => {
    const categoryMatch = !selectedCategory || post.category === selectedCategory;
    const tagsMatch = selectedTags.length === 0 || 
      selectedTags.every(tag => post.tags?.includes(tag));
    return categoryMatch && tagsMatch;
  });

  return (
    <div className="py-16 sm:py-24">
<div className='mx-auto max-w-7xl px-6 lg:px-8'>
      <PostFilters
        categories={categories}
        selectedCategory={selectedCategory}
        tags={allTags}
        selectedTags={selectedTags}
        onCategoryChange={setSelectedCategory}
        onTagChange={(tag) => {
          setSelectedTags(prev => 
            prev.includes(tag)
              ? prev.filter(t => t !== tag)
              : [...prev, tag]
          );
        }}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <PostCard key={post.file} post={post} />
        ))}
      </div>
</div>
    </div>
  );
} 