<script lang="ts">
  // Import the Sun and Moon icons from lucide-svelte
  // These will be used to display the appropriate icon based on the current theme
  import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
   
  // Import toggleMode function from mode-watcher library
  // This function handles switching between light and dark themes
  import { toggleMode } from "mode-watcher";
  
  // REMOVED: We're no longer using the Button component to avoid potential
  // DOM nesting issues where a <button> might be nested inside another <button>
  // import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- 
  EXPLANATION: We're replacing the Button component with a custom div
  that functions like a button. This helps avoid potential DOM nesting issues
  that can occur when bits-ui components interact with each other.
  
  We've added:
  - role="button" for accessibility
  - tabindex="0" to make it focusable
  - onKeyDown handler to support keyboard interaction
  - Appropriate styling to match the original button appearance
-->
<div 
  on:click={toggleMode} 
  on:keydown={(e) => e.key === 'Enter' && toggleMode()}
  class="inline-flex items-center justify-center rounded-full h-10 w-10 p-3 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
  role="button"
  tabindex="0"
>
  <!-- 
    Sun icon with transition animations
    - Visible in light mode (scale-100)
    - Rotates and scales to 0 when switching to dark mode
  -->
  <Sun
    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
  />
  
  <!-- 
    Moon icon with transition animations
    - Positioned absolutely to overlap with Sun icon
    - Hidden in light mode (scale-0)
    - Rotates and scales to 100 when switching to dark mode
  -->
  <Moon
    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
  />
  
  <!-- Screen reader text for accessibility -->
  <span class="sr-only">Toggle theme</span>
</div>
