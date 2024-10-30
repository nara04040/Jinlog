import {useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import { BlogLayout } from "@/app/components/layouts/BlogLayout";
import { Card, CardContent } from "@/app/components/ui/card";
import { CoffeeIcon } from "lucide-react";
import { Posts } from '../components/Posts';


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
    category: "Development",
    tags: ["React", "Compiler", "Optimization"],
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
    category: "Development",
    tags: ["JWT", "Authentication", "Security"]
  },
];



export const revalidate = 60;

export default async function BlogContentsPage() {
const posts = mdxPosts
  return (
    <BlogLayout>
      <Posts posts={posts} />
    </BlogLayout>
  );
}
