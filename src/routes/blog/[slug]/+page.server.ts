import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
  console.log('=== Blog [slug] +page.server.ts called ===');
  console.log('Slug:', params.slug);
  
  try {
    const { slug } = params;
    
    console.log('About to fetch from API endpoint...');
    
    // Fetch from our API route - in SvelteKit, relative URLs work fine
    const response = await fetch(`/api/content/${slug}`);
    
    console.log('API response received, status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw error(404, `Post not found: ${slug}`);
    }
    
    const data = await response.json();
    console.log('Successfully loaded post:', data.post?.title);
    
    return {
      post: data.post,
      meta: data.meta,
      content: data.content,
    };
    
  } catch (err) {
    console.error('=== Error in blog [slug] +page.server.ts ===');
    console.error('Error type:', err?.constructor?.name);
    console.error('Error details:', err);
    
    if (err && typeof err === 'object' && 'status' in err) {
      throw err;
    }
    
    throw error(404, 'Post not found');
  }
};
