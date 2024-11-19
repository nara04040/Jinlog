import fs from 'fs/promises';
import path from 'path';
import { Series } from '../types/series';

export async function getSeries(): Promise<Series[]> {
  const seriesDirectory = path.join(process.cwd(), 'src/data/series');
  
  try {
    const fileNames = await fs.readdir(seriesDirectory);
    const seriesData = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(seriesDirectory, fileName);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents) as Series;
      })
    );
    
    return seriesData;
  } catch (error) {
    console.error('시리즈 데이터를 불러오는 중 오류 발생:', error);
    return [];
  }
} 