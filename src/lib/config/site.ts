import type { Site } from '$lib/types/site';

// Import your avatar/profile image
// You can place this in src/lib/imgs/ or static/ folder
// import Avatar from '$lib/imgs/me.png';

/**
 * Main site configuration
 * This replaces and extends your existing DATA object from resume.ts
 * Adapted from QWER's site config but simplified for your needs
 */
export const siteConfig: Site.Config = {
  // Basic site information
  url: 'https://your-domain.com', // Replace with your actual domain
  title: 'Your Name', // Your name or site title
  subtitle: 'Software Developer & Engineer', // Brief tagline
  description: 'Personal portfolio and blog of [Your Name] - Software Developer, Engineer, and Technology Enthusiast',
  
  // Internationalization settings
  lang: 'en', // Primary language
  timeZone: 'America/Chicago', // Austin, Texas timezone
  
  // Site metadata
  since: 2024, // Year your site/career started
  
  // Cover image for social sharing (optional)
  // cover: SiteCover, // Uncomment and import if you have a cover image
  
  // Author/personal information
  author: {
    name: 'Your Full Name',
    status: '🚀', // Fun status emoji/text that appears next to your name
    statusTip: 'Building awesome software with modern technologies', // Tooltip text for status
    
    // Avatar images - you can use the same image in different sizes
    // QWER supports optimized responsive images
    avatar: '/favicon.png', // Replace with your actual avatar path
    // avatar_128: Avatar_128, // Uncomment these if you want optimized sizes
    // avatar_48_png: Avatar_48_PNG,
    // avatar_96_png: Avatar_96_PNG,
    // avatar_192_png: Avatar_192_PNG,
    // avatar_512_png: Avatar_512_PNG,
    
    // Contact and social links
    website: 'https://your-domain.com',
    github: 'https://github.com/yourusername',
    email: 'your.email@example.com',
    
    // Professional bio (supports HTML)
    bio: `Software Developer passionate about <br/> modern web technologies and clean code`,
    
    // Additional social links (optional)
    // linkedin: 'https://linkedin.com/in/yourprofile',
    // twitter: 'https://twitter.com/yourusername',
  },
};

/**
 * Date formatting configuration
 * Controls how dates appear throughout your blog
 */
export const dateConfig: Site.DateConfig = {
  // Format for "published" dates
  toPublishedString: {
    locales: 'en-US', // US English formatting
    options: {
      year: 'numeric',    // 2024
      weekday: 'short',   // Mon, Tue, etc.
      month: 'short',     // Jan, Feb, etc.
      day: 'numeric',     // 1, 2, 3, etc.
      timeZone: `${siteConfig.timeZone}`, // Use the timezone from site config
    },
  },
  
  // Format for "updated" dates (can be different from published)
  toUpdatedString: {
    locales: 'en-US',
    options: {
      year: 'numeric',
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      timeZone: `${siteConfig.timeZone}`,
    },
  },
};

/**
 * Blog-specific configuration
 * These settings control various blog features
 */
export const blogConfig = {
  // Post defaults
  defaultCoverStyle: 'TOP', // Default cover image position: 'TOP', 'RIGHT', 'BOT', 'LEFT', 'IN', 'NONE'
  defaultTagName: 'tags', // Default tag category name
  defaultPostLanguage: 'English', // Default language for posts
  
  // Special tag categories (optional)
  postLanguageTagName: 'Language', // Tag for post language
  seriesTagName: 'Series', // Tag for post series
  yearTagName: 'Year', // Tag for post year
  
  // Image processing settings
  bannerImage: {
    width: 768,  // Default banner width
    height: 320, // Default banner height
    format: ['avif', 'webp'], // Optimized formats
  },
  
  // Additional responsive image sizes
  extraResolutions: {
    1280: {
      width: 1280,
      format: ['avif', 'webp'],
      minWidth: '1024px', // CSS media query
    },
    800: {
      width: 800,
      format: ['avif', 'webp'],
      minWidth: '360px',
    },
  },
  
  // SEO and metadata
  postsPerPage: 10, // For pagination (if implemented)
  showTagFilter: false, // Show tag filtering on desktop by default
  enableSearch: true, // Enable search functionality
  enableTableOfContents: true, // Enable TOC generation
  
  // Code syntax highlighting languages
  // Add/remove languages based on what you write about
  supportedLanguages: {
    bash: 'bash',
    css: 'css',
    html: 'markup',
    js: 'javascript',
    javascript: 'javascript',
    ts: 'typescript',
    typescript: 'typescript',
    python: 'python',
    py: 'python',
    svelte: 'svelte',
    json: 'json',
    markdown: 'markdown',
    md: 'markdown',
    yaml: 'yaml',
    sql: 'sql',
    // Add more as needed
  },
};

/**
 * Head/SEO configuration
 * Controls what goes in the <head> of your pages
 */
export const headConfig: Site.Head = {
  // IndieWeb rel=me links (for verification)
  me: [
    'https://github.com/yourusername',
    // Add other verification URLs
  ],
  
  // Custom head elements based on environment
  custom: ({ dev }) =>
    dev
      ? [
          // Development environment only
          // Add any dev-specific scripts/meta tags here
        ]
      : [
          // Production environment only
          // Add analytics, tracking, etc. here
          
          // Example: Google Analytics (replace with your ID)
          // `<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>`,
          // `<script>
          //   window.dataLayer = window.dataLayer || [];
          //   function gtag(){dataLayer.push(arguments);}
          //   gtag('js', new Date());
          //   gtag('config', 'G-XXXXXXXXXX');
          // </script>`,
          
          // Example: Plausible Analytics
          // `<script defer data-domain="your-domain.com" src="https://plausible.io/js/script.js"></script>`,
        ],
};

/**
 * Navigation configuration
 * Controls the main navigation menu
 * You can extend this to support multiple languages like QWER does
 */
export const navConfig = [
  {
    name: 'About',
    url: '/about',
  },
  {
    name: 'Projects', 
    url: '/projects',
  },
  {
    name: 'Blog',
    url: '/blog',
  },
  {
    name: 'Timeline',
    url: '/timeline',
  },
  // Example of external link
  // {
  //   name: 'Resume',
  //   url: '/resume.pdf',
  //   rel: 'external',
  // },
];

/**
 * Mobile navigation configuration
 * Separate config for mobile menu (can be different from desktop)
 */
export const mobileNavConfig = {
  orientation: 2, // Layout orientation
  links: [
    {
      name: 'About',
      url: '/about',
    },
    {
      name: 'Projects',
      url: '/projects', 
    },
    {
      name: 'Blog',
      url: '/blog',
    },
    {
      name: 'Timeline',
      url: '/timeline',
    },
  ],
};
