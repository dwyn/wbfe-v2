import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile } from 'fs/promises';
import { join } from 'path';

const CONTENT_PATH = join(process.cwd(), 'src/content/posts');

// MIME types for common image formats
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

export const GET: RequestHandler = async ({ params }) => {
  try {
    // params.path will be something like "bte-ate/cover.png"
    const filePath = params.path || '';
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
      throw error(403, 'Forbidden');
    }
    
    // Construct full path
    const fullPath = join(CONTENT_PATH, filePath);
    console.log('Serving blog content:', fullPath);
    
    // Get file extension for MIME type
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Read and return the file
    const file = await readFile(fullPath);
    
    return new Response(file, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
    
  } catch (err) {
    console.error('Error serving blog content:', err);
    throw error(404, 'File not found');
  }
};
