import { json } from '@sveltejs/kit';

// Simple test API route to check if the endpoint works
export async function GET() {
  console.log('API /api/content called!');
  
  try {
    // First, let's just return some test data to see if the route works
    const testPosts = [
      {
        slug: 'test-post-1',
        title: 'Test Post 1',
        description: 'This is a test post',
        published: new Date().toISOString(),
        updated: new Date().toISOString(),
        categories: ['test'],
        date: '2024-07-25' // Your old format for compatibility
      },
      {
        slug: 'test-post-2', 
        title: 'Test Post 2',
        description: 'Another test post',
        published: new Date().toISOString(),
        updated: new Date().toISOString(),
        categories: ['test'],
        date: '2024-07-26'
      }
    ];

    console.log('Returning test posts:', testPosts);
    return json(testPosts);
    
  } catch (error) {
    console.error('Error in API route:', error);
    return json({ error: 'Failed to load posts' }, { status: 500 });
  }
}
