import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Use process.cwd() to get the correct base path
const POSTS_PATH = join(process.cwd(), 'src/content/posts');

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;
  console.log('API /api/content/[slug] called for:', slug);
  console.log('Looking for post at base path:', POSTS_PATH);
  
  try {
    // Construct the full path to the markdown file
    const postPath = join(POSTS_PATH, slug, 'index.md');
    console.log('Trying to read file at:', postPath);
    
    // Check if file exists first
    try {
      await access(postPath);
    } catch {
      console.error(`File not found: ${postPath}`);
      throw error(404, `Post file not found: ${slug}`);
    }
    
    // Read the markdown file
    const fileContent = await readFile(postPath, 'utf-8');
    console.log(`Successfully read file for ${slug}, length: ${fileContent.length}`);
    
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
    
    console.log(`Returning post data for ${slug}`);
    
    return json({
      post,
      meta: data, // All frontmatter data
      content: htmlContent // Rendered HTML content
    });
    
  } catch (err) {
    console.error(`Error loading post ${slug}:`, err);
    if (err instanceof Error && 'status' in err) {
      throw err; // Re-throw if it's already a SvelteKit error
    }
    throw error(404, `Post not found: ${slug}`);
  }
};
