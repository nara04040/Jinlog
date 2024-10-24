import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '../app/types/post'; // Post 타입 가져오기

const postsDirectory = path.join(process.cwd(), 'src/data/posts'); // Markdown 파일 경로

export function getPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory); // 디렉토리 내 파일 목록 가져오기
  const posts = fileNames.map((fileName) => {
    const filePath = path.join(postsDirectory, fileName); // 파일 경로
    const fileContents = fs.readFileSync(filePath, 'utf8'); // 파일 내용 읽기
    const { data, content } = matter(fileContents); // 메타데이터와 내용 분리

    return {
      id: fileName.replace(/\.md$/, ''), // 파일 이름에서 .md 제거
      title: data.title,
      date: data.date,
      author: data.author,
      content, // Markdown 내용
      file: fileName.replace(/\.md$/, ''), // file 속성 추가 (확인)
    } as Post;
  });
  console.log(posts)

  return posts; // 포스트 배열 반환
}
