import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  console.log('=== DIRECT blog post server load called ===');
  console.log('Slug:', params.slug);
  
  try {
    const { slug } = params;
    
    // Handle test posts directly
    if (slug === 'test-post-1') {
      const testPost = {
        slug: 'test-post-1',
        title: 'Test Post 1',
        description: 'This is a test post',
        published: new Date().toISOString(),
        updated: new Date().toISOString(),
        categories: ['test'],
        date: '2024-07-25',
        html: `
          <h1>Test Post 1</h1>
          <p>This is a <strong>test post</strong> to verify the system is working.</p>
          <h2>Features</h2>
          <ul>
            <li>Markdown rendering</li>
            <li>Syntax highlighting</li>
            <li>Math support</li>
          </ul>
          <pre><code class="language-javascript">console.log('Hello from test post!');</code></pre>
          <h2>Math Example</h2>
          <p>Here's some inline math: $E = mc^2$</p>
          <p>And a block equation:</p>
          <p>$$\\int_0^\\infty e^{-x} dx = 1$$</p>
        `
      };
      
      console.log('Returning test post 1');
      return {
        post: testPost,
        meta: {
          title: testPost.title,
          description: testPost.description,
          date: testPost.date,
          categories: testPost.categories
        },
        content: testPost.html
      };
    }
    
    if (slug === 'test-post-2') {
      const testPost = {
        slug: 'test-post-2',
        title: 'Test Post 2',
        description: 'Another test post',
        published: new Date().toISOString(),
        updated: new Date().toISOString(),
        categories: ['test'],
        date: '2024-07-26',
        html: `
          <h1>Test Post 2</h1>
          <p>This is another <strong>test post</strong> with different content.</p>
          <h2>Code Examples</h2>
          <p>Here's some Python code:</p>
          <pre><code class="language-python">def hello_world():
    print("Hello from Python!")
    return "success"

result = hello_world()</code></pre>
          <h2>Lists</h2>
          <ol>
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ol>
          <ul>
            <li>Bullet point 1</li>
            <li>Bullet point 2</li>
            <li>Bullet point 3</li>
          </ul>
          <blockquote>
            <p>This is a blockquote to test styling</p>
          </blockquote>
        `
      };
      
      console.log('Returning test post 2');
      return {
        post: testPost,
        meta: {
          title: testPost.title,
          description: testPost.description,
          date: testPost.date,
          categories: testPost.categories
        },
        content: testPost.html
      };
    }
    
    // For any other slug, return 404
    console.log(`Post not found: ${slug}`);
    throw error(404, `Post not found: ${slug}`);
    
  } catch (err) {
    console.error('=== Error in direct blog post server load ===');
    console.error('Error:', err);
    
    if (err.status) {
      throw err;
    } else {
      throw error(500, `Internal server error: ${err.message}`);
    }
  }
};
