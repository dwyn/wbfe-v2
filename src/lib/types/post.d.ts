import type { TOC } from '$lib/types/toc';

/**
 * Post-related type definitions
 * Enhanced from your current simple Post type to support QWER's advanced features
 * while maintaining backward compatibility with your existing posts
 */
export namespace Post {
  /**
   * Main Post interface
   * This represents a fully processed blog post with all metadata and content
   */
  export interface Post {
    // Basic post identification
    slug: string;                    // URL-friendly post identifier (e.g., "hello-world")
    title: string;                   // Post title
    language: string;                // Post language (e.g., "English", "Spanish")
    
    // Content and descriptions
    description: string;             // Brief description for SEO/previews
    summary?: string;                // Optional longer summary/excerpt
    content?: string;                // Raw markdown content
    html?: string;                   // Processed HTML content
    
    // Dates (ISO string format for consistency)
    published: string;               // Publication date (required)
    updated: string;                 // Last updated date
    created: string;                 // File creation date (auto-generated)
    
    // Cover image configuration
    cover?: string;                  // Relative path to cover image (e.g., "./cover.jpg")
    coverInPost?: boolean;           // Whether to show cover image inside the post content
    coverCaption?: string;           // HTML caption for cover image
    coverStyle: CoverStyle;          // How to display the cover image
    
    // Advanced features
    options?: Array<string>;         // Post-specific options/flags
    series_tag?: string;             // Tag that groups posts in a series
    series_title?: string;           // Display title for the series
    prev?: string;                   // Previous post slug in series
    next?: string;                   // Next post slug in series
    toc?: TOC.Heading[];            // Table of contents (auto-generated)
    
    // Tags and categorization
    tags?: Array<TagGroup>;          // Grouped tags (e.g., [["Technology", "JavaScript"], ["Tutorial"]])
    
    // Backward compatibility with your current posts
    categories?: Array<string>;      // Simple category list (will be converted to tags)
    published_old?: boolean;         // Your current "published" boolean (for migration)
    date?: string;                   // Your current simple date format (for migration)
  }

  /**
   * Cover image display styles
   * Controls how the cover image is positioned relative to the post content
   */
  export enum CoverStyle {
    TOP = 'TOP',     // Cover image at the top of the post
    RIGHT = 'RIGHT', // Cover image to the right of content
    BOT = 'BOT',     // Cover image at the bottom of the post
    LEFT = 'LEFT',   // Cover image to the left of content
    IN = 'IN',       // Cover image integrated within the content
    NONE = 'NONE',   // No cover image display
  }

  /**
   * Tag group type
   * QWER supports nested/grouped tags like [["Category", "Subcategory"], ["Single Tag"]]
   * This allows for more sophisticated organization than simple string arrays
   */
  export type TagGroup = Array<string>;

  /**
   * Post frontmatter interface
   * This represents the YAML frontmatter at the top of your markdown files
   * Used for type-checking when parsing markdown files
   */
  export interface PostFrontmatter {
    // Required fields
    title: string;
    description: string;
    published: string;               // ISO date string
    
    // Optional fields with defaults
    summary?: string;
    updated?: string;                // Will default to published date if not provided
    cover?: string;
    coverStyle?: keyof typeof CoverStyle; // String version for YAML
    coverCaption?: string;
    coverInPost?: boolean;
    tags?: Array<TagGroup>;
    options?: Array<string>;
    
    // Series support
    series?: string;                 // Series identifier
    seriesTitle?: string;            // Human-readable series title
    
    // Backward compatibility
    categories?: Array<string>;
    date?: string;                   // Your old date format
    published_old?: boolean;         // Your old published flag
    
    // Language and localization
    language?: string;               // Defaults to site config language
    
    // Custom fields (extend as needed)
    [key: string]: any;             // Allow additional custom frontmatter fields
  }

  /**
   * Post metadata interface
   * Lightweight version used for post lists and previews
   * Contains only essential information without full content
   */
  export interface PostMeta {
    slug: string;
    title: string;
    description: string;
    summary?: string;
    published: string;
    updated: string;
    cover?: string;
    coverStyle: CoverStyle;
    tags?: Array<TagGroup>;
    categories?: Array<string>;      // For backward compatibility
    language: string;
    series_tag?: string;
    series_title?: string;
    readingTime?: number;            // Estimated reading time in minutes
  }

  /**
   * Post processing options
   * Configuration for how posts are processed and rendered
   */
  export interface PostOptions {
    // Content processing
    generateTOC?: boolean;           // Generate table of contents
    enableMath?: boolean;            // Enable KaTeX math rendering
    enableCodeHighlight?: boolean;   // Enable syntax highlighting
    enableImageOptimization?: boolean; // Optimize and resize images
    
    // Series handling
    autoLinkSeries?: boolean;        // Automatically link prev/next in series
    
    // Output format
    includeRawContent?: boolean;     // Include raw markdown in output
    includeHTML?: boolean;           // Include processed HTML in output
    
    // Performance
    lazy?: boolean;                  // Lazy load post content
  }

  /**
   * Post query interface
   * For filtering and searching posts
   */
  export interface PostQuery {
    // Filtering
    tags?: Array<string>;            // Filter by tags
    categories?: Array<string>;      // Filter by categories (backward compatibility)
    series?: string;                 // Filter by series
    language?: string;               // Filter by language
    published?: boolean;             // Filter by published status
    
    // Date range filtering
    publishedAfter?: string;         // ISO date string
    publishedBefore?: string;        // ISO date string
    
    // Search
    search?: string;                 // Text search in title/description/content
    
    // Sorting and pagination
    sortBy?: 'published' | 'updated' | 'title' | 'slug';
    sortOrder?: 'asc' | 'desc';
    limit?: number;                  // Maximum number of results
    offset?: number;                 // Skip this many results (for pagination)
  }

  /**
   * Post collection interface
   * Represents a group of related posts with metadata
   */
  export interface PostCollection {
    posts: Array<PostMeta>;
    total: number;                   // Total number of posts matching query
    hasMore: boolean;                // Whether there are more posts beyond current page
    tags: Array<string>;             // All unique tags in this collection
    series: Array<string>;           // All unique series in this collection
    languages: Array<string>;        // All unique languages in this collection
  }

  /**
   * Migration helpers
   * Types to help migrate from your current post format to QWER format
   */
  export interface LegacyPost {
    title: string;
    description: string;
    date: string;                    // Your current date format
    categories: Array<string>;
    published: boolean;
    content: string;
  }

  /**
   * Utility type for post transformation
   * Helps convert between different post formats
   */
  export type PostTransformer<T = Post> = (input: any) => T;
}

/**
 * Table of Contents types
 * If you don't already have a TOC type file, include this here
 * Otherwise, import from the separate toc.d.ts file
 */
export namespace TOC {
  export interface Heading {
    level: number;                   // Heading level (1-6)
    title: string;                   // Heading text
    slug: string;                    // URL fragment for linking
    children?: Array<Heading>;       // Nested headings
  }

  export interface TOCOptions {
    maxDepth?: number;               // Maximum heading level to include (default: 3)
    minDepth?: number;               // Minimum heading level to include (default: 1)
    includeRoot?: boolean;           // Include h1 headings (default: false)
    generateSlugs?: boolean;         // Auto-generate URL slugs (default: true)
  }
}

/**
 * Type guards and utility types
 * Helper functions for type checking and validation
 */
export namespace PostUtils {
  /**
   * Type guard to check if an object is a valid Post
   */
  export function isPost(obj: any): obj is Post.Post {
    return (
      obj &&
      typeof obj.slug === 'string' &&
      typeof obj.title === 'string' &&
      typeof obj.published === 'string'
    );
  }

  /**
   * Type guard to check if an object is valid PostMeta
   */
  export function isPostMeta(obj: any): obj is Post.PostMeta {
    return (
      obj &&
      typeof obj.slug === 'string' &&
      typeof obj.title === 'string' &&
      typeof obj.published === 'string'
    );
  }

  /**
   * Extract PostMeta from a full Post object
   */
  export type ExtractMeta<T extends Post.Post> = Pick<T, 
    | 'slug' 
    | 'title' 
    | 'description' 
    | 'summary'
    | 'published' 
    | 'updated'
    | 'cover'
    | 'coverStyle'
    | 'tags'
    | 'categories'
    | 'language'
    | 'series_tag'
    | 'series_title'
  >;
}
