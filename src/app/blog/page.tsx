import Image from "next/image";
import Link from "next/link";
import { BlogLayout } from "@/app/components/layouts/BlogLayout";
import { Card, CardContent } from "@/app/components/ui/card";

type Post = {
  title: string;
  file: string;
  description: string;
  date: string;
  datetime: string;
  author: { name: string; role: string; href: string; imageUrl: string };
  imageUrl: string;
};

const mdxPosts: Post[] = [
  {
    title: "리액트 컴파일러",
    file: "react-compiler",
    description:
      "리액트 컴파일러는 리액트 19와 함께 등장한 중요한 도구로, 기존에 개발자가 수동으로 최적화하던 작업을 자동화 할 수 있는 가능성을 제시합니다. 컴파일러가 어떻게 코드의 특정 부분을 최적화하고, 실제로 대규모 애플리케이션에서 성능을 얼마나 개선할 수 있을까요? 이번 글에서는 리액트 컴파일러의 진짜 역할과 가능성과 한계를 깊이 있게 분석해 보겠습니다.",
    date: "2024.10.02",
    datetime: "2024-10-02",
    author: {
      name: "Jin",
      role: "Founder",
      href: "#",
      imageUrl: "/시크한 리카르도.png",
    },
    imageUrl: "/시크한 리카르도.png",
  },
  {
    title: "로그인할 때 사용하는 JWT",
    file: "JWT",
    description:
      "단순한 원론적인 설명에서 벗어나, JWT와 리프레시 토큰을 사용하면서 실제로 마주하게 되는 문제들에 대해 깊이 있게 다루겠습니다. 특히 동시성 문제, 블랙리스트 관리, 그리고 실제 해킹 사례와 대응 전략에 대해 구체적으로 설명합니다.",
    date: "2024.09.25",
    datetime: "2024-09-25",
    author: {
      name: "Jin",
      role: "Founder",
      href: "#",
      imageUrl: "/시크한 리카르도.png",
    },
    imageUrl: "/시크한 리카르도.png",
  },
  {
    title: "리액트 컴파일러",
    file: "react compiler",
    description:
      "리액트 컴파일러는 리액트 19와 함께 등장한 중요한 도구로, 기존에 개발자가 수동으로 최적화하던 작업을 자동화 할 수 있는 가능성을 제시합니다. 컴파일러가 어떻게 코드의 특정 부분을 최적화하고, 실제로 대규모 애플리케이션에서 성능을 얼마나 개선할 수 있을까요? 이번 글에서는 리액트 컴파일러의 진짜 역할과 가능성과 한계를 깊이 있게 분석해 보겠습니다.",
    date: "2024.10.02",
    datetime: "2024-10-02",
    author: {
      name: "Jin",
      role: "Founder",
      href: "#",
      imageUrl: "/시크한 리카르도.png",
    },
    imageUrl: "/시크한 리카르도.png",
  },
 
  
];

export const revalidate = 60;

export default async function BlogContentsPage() {
  // const posts = await sanityFetch<SanityPost[]>({ query: postsQuery });
const posts = mdxPosts
  return (
    <BlogLayout>
      <Posts posts={posts} />
      <div className="mt-8">
        <Link href="/test">
          <p className="text-blue-500">테스트 링크</p>
        </Link>
      </div>
    </BlogLayout>
  );
}

function Posts({ posts }: { posts: Post[] }) {
  const allPosts: Post[] = [
    ...posts,
    ...mdxPosts,
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="mb-8 font-cal text-3xl tracking-tight text-gray-900 sm:text-4xl">
          From the blog
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allPosts.map((post, index) => (
            <PostCard key={`${post.file}-${index}`} post={post} /> 
          ))}
        </div>
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