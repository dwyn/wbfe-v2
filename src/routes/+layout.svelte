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

  setMode('dark');
  let BLUR_FADE_DELAY = 10;
</script>

<svelte:head>
  <title>{DATA.name}</title>
  <meta name="description" content={DATA.description} />
  <!-- …all your other meta tags… -->
</svelte:head>

<ModeWatcher />

<Tooltip.Provider delayDuration={200}>
  <div class="relative mx-auto min-h-screen max-w-2xl bg-background px-6 py-12 font-sans antialiased sm:py-24">
    <slot />
    <Navbar />
  </div>
</Tooltip.Provider>
