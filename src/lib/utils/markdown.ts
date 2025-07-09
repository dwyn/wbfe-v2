import { marked } from 'marked';
import { getHighlighter, type Highlighter } from 'shiki';
import katex from 'katex';
import type { Post } from '$lib/types/post';
import type { TOC } from '$lib/types/toc';

/**
 * Advanced markdown processor inspired by QWER's mdify system
 * Handles syntax highlighting, math rendering, TOC generation, and custom components
 */

// Global highlighter instance for performance
let highlighter: Highlighter | null = null;

/**
 * Initialize the syntax highlighter
 * Call this once during app startup for better performance
 */
export async function initializeHighlighter(): Promise<void> {
  if (!highlighter) {
    highlighter = await getHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: [
        'javascript',
        'typescript',
        'svelte',
        'html',
        'css',
        'scss',
        'python',
        'bash',
        'json',
        'yaml',
        'markdown',
        'sql',
        'rust',
        'go',
        'java',
        'cpp',
        'c',
        // Add more languages as needed
      ],
    });
  }
}

/**
 * Configuration for markdown processing
 */
export interface MarkdownConfig {
  enableMath?: boolean;              // Enable KaTeX math rendering
  enableTOC?: boolean;               // Generate table of contents
  enableSyntaxHighlighting?: boolean; // Enable code syntax highlighting
  enableCustomComponents?: boolean;   // Enable custom Svelte components
  tocMaxDepth?: number;              // Maximum TOC depth (default: 3)
  mathDelimiters?: {                 // Math delimiter configuration
    inline: string[];
    block: string[];
  };
}

/**
 * Default markdown configuration
 */
const defaultConfig: MarkdownConfig = {
  enableMath: true,
  enableTOC: true,
  enableSyntaxHighlighting: true,
  enableCustomComponents: true,
  tocMaxDepth: 3,
  mathDelimiters: {
    inline: ['$', '$'],
    block: ['$$', '$$'],
  },
};

/**
 * Custom renderer for marked.js
 * Extends the default renderer with enhanced features
 */
class CustomRenderer extends marked.Renderer {
  private config: MarkdownConfig;
  private toc: TOC.Heading[] = [];
  private headingCounts: Map<number, number> = new Map();

  constructor(config: MarkdownConfig) {
    super();
    this.config = config;
  }

  /**
   * Enhanced heading renderer with TOC generation
   */
  heading(text: string, level: number, raw: string): string {
    if (this.config.enableTOC && level <= (this.config.tocMaxDepth || 3)) {
      // Generate unique slug for heading
      const slug = this.generateSlug(text);
      
      // Track heading for TOC
      this.toc.push({
        level,
        title: text,
        slug,
        children: [],
      });

      // Return heading with anchor link
      return `<h${level} id="${slug}" class="heading-with-anchor">
        <a href="#${slug}" class="heading-anchor" aria-label="Link to ${text}">
          ${text}
        </a>
      </h${level}>`;
    }

    return `<h${level}>${text}</h${level}>`;
  }

  /**
   * Enhanced code block renderer with syntax highlighting
   */
  code(code: string, language: string | undefined, escaped?: boolean): string {
    const validLanguage = language && this.isValidLanguage(language);
    
    if (this.config.enableSyntaxHighlighting && highlighter && validLanguage) {
      try {
        // Use light theme for now - you can make this dynamic based on user preference
        const highlighted = highlighter.codeToHtml(code, {
          lang: language,
          theme: 'github-light',
        });
        
        // Wrap in custom container for styling
        return `<div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-language">${language}</span>
            <button class="copy-code-btn" data-code="${this.escapeHtml(code)}">
              Copy
            </button>
          </div>
          ${highlighted}
        </div>`;
      } catch (error) {
        console.warn(`Failed to highlight code for language: ${language}`, error);
      }
    }

    // Fallback to default rendering
    const escapedCode = escaped ? code : this.escapeHtml(code);
    const langClass = validLanguage ? ` class="language-${language}"` : '';
    
    return `<pre><code${langClass}>${escapedCode}</code></pre>`;
  }

  /**
   * Enhanced image renderer with custom components support
   */
  image(href: string, title: string | null, text: string): string {
    if (this.config.enableCustomComponents) {
      // Check if this should be an ImgZoom component
      const titleAttr = title ? ` title="${this.escapeHtml(title)}"` : '';
      const altAttr = text ? ` alt="${this.escapeHtml(text)}"` : '';
      
      // Return custom component syntax that will be processed later
      return `<ImgZoom src="${href}"${altAttr}${titleAttr} class="blog-image">
        ${title || ''}
      </ImgZoom>`;
    }

    // Standard image rendering
    const titleAttr = title ? ` title="${this.escapeHtml(title)}"` : '';
    const altAttr = text ? ` alt="${this.escapeHtml(text)}"` : '';
    return `<img src="${href}"${altAttr}${titleAttr} class="blog-image">`;
  }

  /**
   * Enhanced blockquote renderer
   */
  blockquote(quote: string): string {
    return `<blockquote class="blog-blockquote">${quote}</blockquote>`;
  }

  /**
   * Enhanced table renderer
   */
  table(header: string, body: string): string {
    return `<div class="table-wrapper">
      <table class="blog-table">
        <thead>${header}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
  }

  /**
   * Get generated table of contents
   */
  getTOC(): TOC.Heading[] {
    return this.buildNestedTOC(this.toc);
  }

  /**
   * Generate URL-friendly slug from heading text
   */
  private generateSlug(text: string): string {
    const baseSlug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .trim();

    // Handle duplicate headings by adding a counter
    const count = this.headingCounts.get(text.toLowerCase()) || 0;
    this.headingCounts.set(text.toLowerCase(), count + 1);
    
    return count > 0 ? `${baseSlug}-${count}` : baseSlug;
  }

  /**
   * Build nested TOC structure from flat heading list
   */
  private buildNestedTOC(flatTOC: TOC.Heading[]): TOC.Heading[] {
    const result: TOC.Heading[] = [];
    const stack: TOC.Heading[] = [];

    for (const heading of flatTOC) {
      // Pop items from stack until we find the right parent level
      while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
        stack.pop();
      }

      if (stack.length === 0) {
        // Top-level heading
        result.push(heading);
      } else {
        // Nested heading
        const parent = stack[stack.length - 1];
        parent.children = parent.children || [];
        parent.children.push(heading);
      }

      stack.push(heading);
    }

    return result;
  }

  /**
   * Check if language is supported for syntax highlighting
   */
  private isValidLanguage(language: string): boolean {
    if (!highlighter) return false;
    return highlighter.getLoadedLanguages().includes(language as any);
  }

  /**
   * Escape HTML characters
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * Process math expressions in markdown content
 */
function processMath(content: string, config: MarkdownConfig): string {
  if (!config.enableMath || !config.mathDelimiters) {
    return content;
  }

  const { inline, block } = config.mathDelimiters;

  // Process block math first (to avoid conflicts with inline)
  content = content.replace(
    new RegExp(`\\${block[0]}([^]+?)\\${block[1]}`, 'g'),
    (match, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: true });
      } catch (error) {
        console.warn('KaTeX block math error:', error);
        return match; // Return original if rendering fails
      }
    }
  );

  // Process inline math
  content = content.replace(
    new RegExp(`\\${inline[0]}([^${inline[1]}]+?)\\${inline[1]}`, 'g'),
    (match, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: false });
      } catch (error) {
        console.warn('KaTeX inline math error:', error);
        return match; // Return original if rendering fails
      }
    }
  );

  return content;
}

/**
 * Process custom Svelte components in markdown
 */
function processCustomComponents(content: string): string {
  // Transform custom component syntax to proper HTML/Svelte syntax
  // This is a simplified version - you may need more sophisticated processing
  
  // Example: Convert <ImgZoom> components
  content = content.replace(
    /<ImgZoom\s+([^>]+)>(.*?)<\/ImgZoom>/gs,
    (match, attributes, children) => {
      // In a real implementation, you'd want to properly parse and validate attributes
      return `<div class="img-zoom-wrapper" data-component="ImgZoom" ${attributes}>
        ${children}
      </div>`;
    }
  );

  return content;
}

/**
 * Calculate estimated reading time for post content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract excerpt from post content
 */
export function extractExcerpt(content: string, maxLength: number = 150): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // Remove images
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Main markdown processing function
 * Converts markdown content to HTML with all enhancements
 */
export async function processMarkdown(
  content: string, 
  config: MarkdownConfig = defaultConfig
): Promise<{ html: string; toc: TOC.Heading[]; readingTime: number }> {
  // Ensure highlighter is initialized
  if (config.enableSyntaxHighlighting && !highlighter) {
    await initializeHighlighter();
  }

  // Create custom renderer
  const renderer = new CustomRenderer(config);

  // Configure marked with custom renderer
  marked.setOptions({
    renderer,
    gfm: true,              // GitHub Flavored Markdown
    breaks: false,          // Don't convert \n to <br>
    pedantic: false,        // Don't conform to original markdown.pl
    sanitize: false,        // Allow HTML (we trust our content)
    smartLists: true,       // Use smarter list behavior
    smartypants: false,     // Don't convert quotes/dashes
  });

  // Process math expressions
  let processedContent = config.enableMath ? processMath(content, config) : content;

  // Convert markdown to HTML
  let html = marked(processedContent);

  // Process custom components
  if (config.enableCustomComponents) {
    html = processCustomComponents(html);
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(content);

  // Get table of contents
  const toc = config.enableTOC ? renderer.getTOC() : [];

  return {
    html,
    toc,
    readingTime,
  };
}

/**
 * Process frontmatter and content from raw markdown file
 */
export function parseMarkdownFile(fileContent: string): {
  frontmatter: Record<string, any>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)/s;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    return {
      frontmatter: {},
      content: fileContent,
    };
  }

  const [, frontmatterText, content] = match;
  
  // Parse YAML frontmatter (you might want to use a proper YAML parser)
  const frontmatter: Record<string, any> = {};
  
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // Simple value parsing (extend this for arrays, objects, etc.)
      if (value === 'true') frontmatter[key] = true;
      else if (value === 'false') frontmatter[key] = false;
      else if (/^\d+$/.test(value)) frontmatter[key] = parseInt(value);
      else if (value.startsWith('[') && value.endsWith(']')) {
        // Simple array parsing
        frontmatter[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
      }
      else frontmatter[key] = value.replace(/['"]/g, '');
    }
  });

  return {
    frontmatter,
    content: content.trim(),
  };
}

/**
 * Convert legacy post format to new QWER format
 */
export function migrateLegacyPost(legacyPost: Post.LegacyPost): Post.PostFrontmatter {
  return {
    title: legacyPost.title,
    description: legacyPost.description,
    published: new Date(legacyPost.date).toISOString(),
    updated: new Date(legacyPost.date).toISOString(),
    tags: legacyPost.categories.map(cat => [cat]), // Convert categories to tag groups
    coverStyle: 'TOP',
    language: 'English',
    
    // Keep legacy fields for backward compatibility
    categories: legacyPost.categories,
    date: legacyPost.date,
    published_old: legacyPost.published,
  };
}
