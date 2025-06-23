<script lang="ts">
  import BlurFade from '$lib/components/magic/BlurFade.svelte';
  import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
  import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
  import { DATA } from '$lib/data/resume';
  import { onMount } from 'svelte';

  let BLUR_FADE_DELAY = 1;
  let disableBlurFade = false;
  let pageElement: HTMLElement;

  // Check if BlurFade should be disabled (during transitions)
  onMount(() => {
    const checkBlurFadeStatus = () => {
      const container = document.querySelector('[data-disable-blur-fade]');
      disableBlurFade = !!container;
    };
    
    checkBlurFadeStatus();
    
    // Watch for changes to blur fade status
    const observer = new MutationObserver(checkBlurFadeStatus);
    const targetNode = document.body;
    observer.observe(targetNode, { 
      attributes: true, 
      subtree: true, 
      attributeFilter: ['data-disable-blur-fade'] 
    });
    
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>Projects - {DATA.name}</title>
  <meta name="description" content="Portfolio projects and hackathons by {DATA.name}" />
  <meta property="og:title" content="Projects - {DATA.name}" />
  <meta property="og:description" content="Portfolio projects and hackathons by {DATA.name}" />
  <meta property="og:url" content="{DATA.url}/projects" />
  <meta property="og:site_name" content={DATA.name} />
  <meta property="og:image" content={DATA.img} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta name="twitter:title" content="Projects - {DATA.name}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={DATA.img} />
  <meta name="twitter:description" content="Portfolio projects and hackathons by {DATA.name}" />
</svelte:head>

<main class="flex min-h-[100dvh] flex-col space-y-10">
  <!-- 
    Projects Header Section
    - .projects-header class is used by the morphing transition system
    - This element morphs when transitioning from other pages
    - BlurFade is conditionally disabled during transitions
  -->
  <section id="projects" class="projects-header">
    <div class="w-full space-y-12 py-12">
      {#if !disableBlurFade}
        <BlurFade delay={BLUR_FADE_DELAY}>
          <div class="flex flex-col items-center justify-center space-y-4 text-center">
            <div class="space-y-2">
              <div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
                My Projects
              </div>
              <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl">
                Check out my latest work
              </h1>
              <p
                class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
              >
                I've worked on a variety of projects, from simple websites to complex web
                applications. Here are a few of my favorites.
              </p>
            </div>
          </div>
        </BlurFade>
      {:else}
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
              My Projects
            </div>
            <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl">
              Check out my latest work
            </h1>
            <p
              class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              I've worked on a variety of projects, from simple websites to complex web
              applications. Here are a few of my favorites.
            </p>
          </div>
        </div>
      {/if}
      
      <!-- 
        Projects Grid
        - Uses staggered BlurFade animations for smooth entrance
        - Grid layout adapts to different screen sizes
      -->
      <div class="mx-auto grid max-w-[800px] grid-cols-1 gap-3 sm:grid-cols-2">
        {#each DATA.projects as project, id}
          <BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.05}>
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.technologies}
              image={project.image}
              video={project.video}
              links={project.links}
            />
          </BlurFade>
        {/each}
      </div>
    </div>
  </section>

  <!-- 
    Hackathons Section
    - Secondary content that appears after projects
    - Also uses morphing-aware class structure
  -->
  <section id="hackathons" class="hackathons-section">
    <div class="w-full space-y-12 py-12">
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
              Hackathons
            </div>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">I like building things</h2>
            <p
              class="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              During my time in university, I attended {DATA.hackathons.length}+ hackathons. People from around the country would come
              together and build incredible things in 2-3 days. It was eye-opening to see the endless possibilities brought to life by a group of motivated and passionate individuals.
            </p>
          </div>
        </div>
      </BlurFade>
      
      <!-- 
        Hackathons Timeline
        - Vertical timeline layout for hackathon entries
        - Staggered animation entrance
      -->
      <BlurFade delay={BLUR_FADE_DELAY * 2.5}>
        <ul class="mb-4 ml-4 divide-y divide-dashed border-l">
          {#each DATA.hackathons as hackathon, id}
            <BlurFade delay={BLUR_FADE_DELAY * 2.5 + id * 0.02}>
              <HackathonCard {...hackathon} />
            </BlurFade>
          {/each}
        </ul>
      </BlurFade>
    </div>
  </section>
</main>
