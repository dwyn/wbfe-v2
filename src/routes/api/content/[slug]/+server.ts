import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
  console.log('Blog post server load called for slug:', params.slug);
  
  try {
    const { slug } = params;
    
    // Fetch from our API route
    const response = await fetch(`/api/content/${slug}`);
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      throw error(404, `Post not found: ${slug}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    return {
      post: data.post,
      meta: data.meta,
      content: data.content, // For backward compatibility with your current post component
    };
    
  } catch (err) {
    console.error('Error in blog post server load:', err);
    throw error(404, 'Post not found');
  }
};
