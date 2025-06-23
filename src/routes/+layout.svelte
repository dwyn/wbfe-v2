<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import BlurFade from '$lib/components/magic/BlurFade.svelte';
  import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
  import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
  import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
  import * as Avatar from '$lib/components/ui/avatar';
  import Badge from '$lib/components/ui/badge/badge.svelte';
  import Navbar from '$lib/components/portfolio/Navbar.svelte';
  import { DATA } from '$lib/data/resume';
  import { marked } from 'marked';
  import '../app.css';
  import { ModeWatcher, setMode } from 'mode-watcher';
  import { Tooltip } from 'bits-ui';
  import { onMount, beforeUpdate } from 'svelte';
  import { page } from '$app/stores';
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { browser } from '$app/environment';

  setMode('dark');
  let BLUR_FADE_DELAY = 10;

  // Element Morphing Transition System (CSS-based)
  let pageContainer: HTMLElement;
  let isTransitioning = false;
  let previousRoute = '';
  let currentRoute = '';

  /**
   * Page Transition Configuration
   * Defines the CSS-based morphing behavior between different routes
   */
  const transitionConfig = {
    // Home to Blog: Title morphs and content slides up
    '/': {
      '/blog': {
        type: 'slide-up',
        duration: 500
      },
      // Home to Projects: Hero section transforms
      '/projects': {
        type: 'fade-left',
        duration: 400
      }
    },
    // Blog to Home: Reverse slide
    '/blog': {
      '/': {
        type: 'slide-down',
        duration: 500
      },
      // Blog to Projects: Cross-fade
      '/projects': {
        type: 'cross-fade',
        duration: 600
      }
    },
    // Projects back to other pages
    '/projects': {
      '/': {
        type: 'fade-right',
        duration: 400
      },
      '/blog': {
        type: 'cross-fade-reverse',
        duration: 600
      }
    }
  };

  /**
   * Execute CSS-based morphing transition
   * @param {string} from - Previous route
   * @param {string} to - Target route
   */
  function executeMorphTransition(from: string, to: string) {
    if (!browser || !pageContainer) return;
    
    const config = transitionConfig[from]?.[to];
    if (!config) return;

    console.log(`Executing ${config.type} transition from ${from} to ${to}`);
    
    isTransitioning = true;
    
    // Add transition class based on type
    pageContainer.classList.add('transitioning', `transition-${config.type}`);
    
    // Remove transition classes after animation
    setTimeout(() => {
      if (pageContainer) {
        pageContainer.classList.remove('transitioning', `transition-${config.type}`);
        isTransitioning = false;
      }
    }, config.duration);
  }

  /**
   * Execute entrance animation for new page
   * @param {string} from - Previous route
   * @param {string} to - Current route
   */
  function executeEntranceAnimation(from: string, to: string) {
    if (!browser || !pageContainer) return;

    const config = transitionConfig[from]?.[to];
    
    console.log(`Executing entrance animation from ${from} to ${to}`);
    
    // Add entrance animation class
    pageContainer.classList.add('entering');
    
    // Add specific entrance type
    if (config) {
      pageContainer.classList.add(`entering-${config.type}`);
    }
    
    // Remove entrance classes after animation
    setTimeout(() => {
      if (pageContainer) {
        pageContainer.classList.remove('entering', `entering-${config?.type || 'default'}`);
      }
    }, config?.duration || 600);
  }

  // SvelteKit Navigation Hooks
  beforeNavigate(({ from, to }) => {
    if (from && to && browser) {
      previousRoute = from.route.id || '/';
      currentRoute = to.route.id || '/';
      
      console.log(`Navigating from ${previousRoute} to ${currentRoute}`);
      
      // Only transition if we have a mapped transition
      if (transitionConfig[previousRoute]?.[currentRoute]) {
        console.log('Executing morph transition');
        executeMorphTransition(previousRoute, currentRoute);
      }
    }
  });

  afterNavigate(({ from, to }) => {
    if (from && to && browser) {
      const fromRoute = from.route.id || '/';
      const toRoute = to.route.id || '/';
      
      console.log(`After navigation from ${fromRoute} to ${toRoute}`);
      
      // Execute entrance animation after navigation
      setTimeout(() => {
        executeEntranceAnimation(fromRoute, toRoute);
      }, 100);
    }
  });

  onMount(() => {
    if (pageContainer) {
      // Initial page load animation
      pageContainer.classList.add('initial-load');
      
      setTimeout(() => {
        if (pageContainer) {
          pageContainer.classList.remove('initial-load');
        }
      }, 800);
    }
  });
</script>

<svelte:head>
  <title>{DATA.name}</title>
  <meta name="description" content={DATA.description} />
  <meta property="og:title" content={DATA.name} />
  <meta property="og:description" content={DATA.description} />
  <meta property="og:url" content={DATA.url} />
  <meta property="og:site_name" content={DATA.name} />
  <meta property="og:image" content={DATA.img} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta name="robots" content="index, follow" />
  <meta
    name="googlebot"
    content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
  />
  <meta name="twitter:title" content={DATA.name} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={DATA.img} />
  <meta name="twitter:description" content={DATA.description} />
  <meta name="google-site-verification" content="your-google-verification-code" />
  <meta name="yandex-verification" content="your-yandex-verification-code" />
</svelte:head>

<ModeWatcher />

<Tooltip.Provider delayDuration={200}>
  <!-- 
    Main page container with CSS-based morphing transition system
    - Uses CSS transitions and transforms for smooth morphing effects
    - No external dependencies required
    - Compatible with existing BlurFade animations
  -->
  <div 
    bind:this={pageContainer}
    class="relative mx-auto min-h-screen max-w-2xl bg-background px-6 py-12 font-sans antialiased sm:py-24 transition-container"
    class:is-transitioning={isTransitioning}
  >
    <!-- Page content slot - this is where individual pages render -->
    <slot />
  </div>

  <!-- 
    Fixed navigation dock - always visible, floating above all content
    - Positioned outside the transition container to remain visible during page transitions
    - High z-index ensures it stays above all other content
  -->
  <Navbar />
</Tooltip.Provider>

<style>
  /* 
    Base transition container styling
    - Smooth CSS transitions for all morphing effects
    - Hardware acceleration for better performance
  */
  .transition-container {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center center;
    padding-bottom: 120px;
  }
  
  /* 
    Initial page load animation
    - Smooth entrance when first visiting the site
  */
  .transition-container.initial-load {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  
  /* 
    Disable interactions during transitions
    - Prevents user input during morphing animations
    - Maintains smooth transition experience
  */
  .is-transitioning {
    pointer-events: none;
  }
  
  /* 
    Transition Types - Exit Animations
    - Different exit animations for different transition types
  */
  .transition-container.transitioning.transition-slide-up {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  
  .transition-container.transitioning.transition-slide-down {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  
  .transition-container.transitioning.transition-fade-left {
    opacity: 0;
    transform: translateX(-30px) scale(0.95);
  }
  
  .transition-container.transitioning.transition-fade-right {
    opacity: 0;
    transform: translateX(30px) scale(0.95);
  }
  
  .transition-container.transitioning.transition-cross-fade {
    opacity: 0;
    transform: perspective(1000px) rotateY(-15deg) translateX(-40px);
  }
  
  .transition-container.transitioning.transition-cross-fade-reverse {
    opacity: 0;
    transform: perspective(1000px) rotateY(15deg) translateX(40px);
  }
  
  /* 
    Entrance Animations
    - Smooth entrance animations for new pages
    - Coordinated with exit animations
  */
  .transition-container.entering {
    opacity: 0;
  }
  
  .transition-container.entering.entering-slide-up {
    transform: translateY(50px) scale(0.95);
  }
  
  .transition-container.entering.entering-slide-down {
    transform: translateY(-50px) scale(0.95);
  }
  
  .transition-container.entering.entering-fade-left {
    transform: translateX(30px) scale(0.95);
  }
  
  .transition-container.entering.entering-fade-right {
    transform: translateX(-30px) scale(0.95);
  }
  
  .transition-container.entering.entering-cross-fade {
    transform: perspective(1000px) rotateY(15deg) translateX(40px);
  }
  
  .transition-container.entering.entering-cross-fade-reverse {
    transform: perspective(1000px) rotateY(-15deg) translateX(-40px);
  }

  /* 
    Element-specific morphing
    - Target specific elements for more detailed morphing
  */
  .transition-container h1,
  .transition-container .hero-section,
  .transition-container .projects-header {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .transition-container.transitioning h1 {
    transform: scale(0.8) translateY(-20px);
    opacity: 0.3;
  }
  
  .transition-container.transitioning .hero-section {
    transform: scale(0.95) translateY(-30px);
    opacity: 0.3;
  }
  
  .transition-container.transitioning .projects-header {
    transform: scale(1.1) translateX(50px);
    opacity: 0.3;
  }

  /* 
    Ensure navbar stays above all content
    - Override any z-index conflicts
  */
  :global(.navbar-dock) {
    z-index: 9999 !important;
  }

  /* 
    Global styles for proper page layout
    - Prevent layout shifts during transitions
  */
  :global(body) {
    overflow-x: hidden;
  }

  /* 
    Responsive adjustments for navbar spacing
    - Different padding for different screen sizes
  */
  @media (max-width: 640px) {
    .transition-container {
      padding-bottom: 100px;
    }
  }

  @media (min-width: 641px) {
    .transition-container {
      padding-bottom: 120px;
    }
  }
</style>
