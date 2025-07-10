import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_PATH = 'src/content/posts';

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  console.log('API /api/content/[slug] called for:', slug);
  
  try {
    // Read the markdown file
    const postPath = join(POSTS_PATH, slug, 'index.md');
    const fileContent = await readFile(postPath, 'utf-8');
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContent);
    
    // Convert markdown to HTML
    const htmlContent = marked(content);
    
    // Extract categories from tags if not directly provided
    let categories = data.categories || [];
    if (!categories.length && data.tags) {
      categories = data.tags.flat();
    }
    
    // Ensure date field exists
    const date = data.date || data.published || new Date().toISOString();
    
    const post = {
      slug,
      title: data.title || 'Untitled',
      description: data.description || data.summary || '',
      summary: data.summary || data.description || '',
      published: data.published || date,
      updated: data.updated || data.published || date,
      date: date.split('T')[0],
      categories,
      cover: data.cover,
      coverStyle: data.coverStyle,
      tags: data.tags
    };
    
    return json({
      post,
      meta: data, // All frontmatter data
      content: htmlContent // Rendered HTML content
    });
    
  } catch (err) {
    console.error(`Error loading post ${slug}:`, err);
    throw error(404, `Post not found: ${slug}`);
  }
};
