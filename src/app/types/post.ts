export interface Post {
  file: string | string[] | undefined;
  id: string; // 고유 ID
  title: string;
  content: string; // Markdown 형식의 내용
  author: string;
  date: string; // ISO 형식의 날짜
}