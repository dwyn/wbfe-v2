import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

// Use process.cwd() to get the correct base path
const POSTS_PATH = join(process.cwd(), 'src/content/posts');

interface PostMetadata {
  title: string;
  description?: string;
  summary?: string;
  published?: string;
  updated?: string;
  cover?: string;
  coverStyle?: string;
  tags?: string[][];
  categories?: string[];
  date?: string;
}

export const GET: RequestHandler = async () => {
  console.log('API /api/content called!');
  
  try {
    // Read all directories in the posts folder
    const postDirs = await readdir(POSTS_PATH);
    
    // Filter out system files and non-directories
    const validDirs = postDirs.filter(dir => !dir.startsWith('.'));
    console.log('Found post directories:', validDirs);
    
    const posts = await Promise.all(
      validDirs.map(async (slug) => {
        try {
          // Try to read index.md file in each post directory
          const postPath = join(POSTS_PATH, slug, 'index.md');
          const fileContent = await readFile(postPath, 'utf-8');
          
          // Parse frontmatter
          const { data } = matter(fileContent);
          const metadata = data as PostMetadata;
          
          // Extract categories from tags if not directly provided
          let categories = metadata.categories || [];
          if (!categories.length && metadata.tags) {
            // Flatten tags array if it's nested
            categories = metadata.tags.flat();
          }
          
          // Ensure date field exists for compatibility
          const date = metadata.date || metadata.published || new Date().toISOString();
          
          return {
            slug,
            title: metadata.title || 'Untitled',
            description: metadata.description || metadata.summary || '',
            summary: metadata.summary || metadata.description || '',
            published: metadata.published || date,
            updated: metadata.updated || metadata.published || date,
            date: date.split('T')[0], // Format as YYYY-MM-DD for compatibility
            categories,
            cover: metadata.cover,
            coverStyle: metadata.coverStyle,
            tags: metadata.tags
          };
        } catch (error) {
          console.error(`Error reading post ${slug}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any null posts (failed reads) and sort by date
    const validPosts = posts
      .filter(post => post !== null)
      .sort((a, b) => {
        const dateA = new Date(a.published).getTime();
        const dateB = new Date(b.published).getTime();
        return dateB - dateA; // Most recent first
      });
    
    console.log(`Returning ${validPosts.length} posts`);
    return json(validPosts);
    
  } catch (error) {
    console.error('Error in API route:', error);
    return json({ error: 'Failed to load posts' }, { status: 500 });
  }
};
