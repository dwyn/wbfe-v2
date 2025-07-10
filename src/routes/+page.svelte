<!-- src/routes/+page.svelte -->
<script>
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import HackathonCard from '$lib/components/portfolio/HackathonCard.svelte';
	import ProjectCard from '$lib/components/portfolio/ProjectCard.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { DATA } from '$lib/data/resume';
	import { marked } from 'marked';
	import { gsap } from 'gsap';
	import { onMount, onDestroy } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { avatarManager, avatarTransition } from '$lib/stores/avatarTransition';
	import { browser } from '$app/environment';
	
	let BLUR_FADE_DELAY = 0.04; // Base delay between elements
	let avatarContainer;
	let floatingTween;
	
	onMount(() => {
		if (!browser) return;
		
		// Register avatar with manager
		if (avatarContainer) {
			avatarManager.registerHomeAvatar(avatarContainer);
			
			// Start floating animation
			floatingTween = gsap.to(avatarContainer, {
				y: -10,
				duration: 3,
				ease: "power1.inOut",
				yoyo: true,
				repeat: -1
			});
		}
		
		// Check if we're returning from blog
		avatarTransition.subscribe(state => {
			if (state.toRoute === '/' && state.isTransitioning) {
				// Avatar is coming back, prepare for it
				if (avatarContainer) {
					avatarContainer.style.opacity = '0';
					setTimeout(() => {
						if (avatarContainer) {
							avatarContainer.style.opacity = '1';
						}
					}, 700);
				}
			}
		});
		
		// Magnetic hover effect
		const handleMouseMove = (e) => {
			if (!avatarContainer) return;
			
			const rect = avatarContainer.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			
			const deltaX = (e.clientX - centerX) * 0.1;
			const deltaY = (e.clientY - centerY) * 0.1;
			
			gsap.to(avatarContainer, {
				x: deltaX,
				y: deltaY,
				duration: 0.3,
				ease: "power2.out",
				overwrite: 'auto'
			});
		};
		
		const handleMouseLeave = () => {
			gsap.to(avatarContainer, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: "elastic.out(1, 0.3)",
				overwrite: 'auto'
			});
		};
		
		if (avatarContainer) {
			avatarContainer.addEventListener('mousemove', handleMouseMove);
			avatarContainer.addEventListener('mouseleave', handleMouseLeave);
			
			return () => {
				avatarContainer.removeEventListener('mousemove', handleMouseMove);
				avatarContainer.removeEventListener('mouseleave', handleMouseLeave);
			};
		}
	});
	
	beforeNavigate(async ({ to }) => {
		if (to?.route?.id === '/blog') {
			// Stop animations
			if (floatingTween) {
				floatingTween.kill();
			}
			
			// Update store
			avatarTransition.set({
				isTransitioning: true,
				fromRoute: '/',
				toRoute: '/blog'
			});
			
			// Start transition
			await avatarManager.transitionToBlog();
		}
	});
	
	onDestroy(() => {
		if (floatingTween) {
			floatingTween.kill();
		}
	});
	
	function handleAvatarClick() {
		goto('/blog');
	}
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

<main class="flex min-h-[100dvh] flex-col space-y-10">
	<section id="hero">
		<div class="mx-auto w-full max-w-2xl space-y-8">
			<div class="flex justify-between gap-2">
				<div class="flex flex-1 flex-col space-y-1.5">
					<BlurFade
						delay={BLUR_FADE_DELAY * 1}
						duration={0.6}
						blur="6px"
						class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
						yOffset={8}
					>
						Hi, I'm Dwayne!😊
					</BlurFade>
					<BlurFade 
						class="max-w-[600px] md:text-xl" 
						delay={BLUR_FADE_DELAY * 2}
						duration={0.6}
						blur="6px"
					>
						Creative, Engineer, Humanist. I love building things and helping people. I'm fairly active on BlueSky.
					</BlurFade>
				</div>
				<!-- Avatar WITHOUT BlurFade - renders immediately -->
				<div 
					bind:this={avatarContainer}
					class="cursor-pointer avatar-source" 
					data-avatar="home"
					on:click={handleAvatarClick}
					role="button"
					tabindex="0"
					on:keydown={(e) => e.key === 'Enter' && handleAvatarClick()}
				>
					<Avatar.Root class="size-36 border transition-shadow duration-300 hover:shadow-lg">
						<Avatar.Image alt={DATA.name} src={DATA.avatarUrl} />
						<Avatar.Fallback>{DATA.initials}</Avatar.Fallback>
					</Avatar.Root>
				</div>
			</div>
		</div>
	</section>
	
	<section id="about">
		<BlurFade 
			delay={BLUR_FADE_DELAY * 3}
			duration={0.6}
			blur="6px"
		>
			<h2 class="text-xl font-bold">About</h2>
		</BlurFade>
		<BlurFade 
			delay={BLUR_FADE_DELAY * 4}
			duration={0.6}
			blur="6px"
		>
			<div
				class="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert"
			>
				{@html marked(DATA.summary)}
			</div>
		</BlurFade>
	</section>
	
	<!-- <section id="work">
		<BlurFade 
			delay={BLUR_FADE_DELAY * 5}
			duration={0.6}
			blur="6px"
		>
			<h2 class="text-xl font-bold">Work Experience</h2>
		</BlurFade>
		<BlurFade 
			delay={BLUR_FADE_DELAY * 6}
			duration={0.6}
			blur="6px"
		>
			<div class="space-y-4">
				{#each DATA.work as work, id}
					<BlurFade 
						delay={BLUR_FADE_DELAY * 7 + id * 0.05}
						duration={0.5}
						blur="4px"
					>
						<ResumeCard
							logoUrl={work.logoUrl}
							altText={work.company}
							title={work.company}
							subtitle={work.title}
							href={work.href}
							badges={work.badges}
							period={`${work.start} - ${work.end ?? 'Present'}`}
							description={work.description}
						/>
					</BlurFade>
				{/each}
			</div>
		</BlurFade>
	</section> -->
	
	<!-- <section id="education">
		<BlurFade 
			delay={BLUR_FADE_DELAY * 8}
			duration={0.6}
			blur="6px"
		>
			<h2 class="text-xl font-bold">Education</h2>
		</BlurFade>
		<BlurFade 
			delay={BLUR_FADE_DELAY * 9}
			duration={0.6}
			blur="6px"
		>
			<div class="space-y-4">
				{#each DATA.education as education, id}
					<BlurFade 
						delay={BLUR_FADE_DELAY * 10 + id * 0.05}
						duration={0.5}
						blur="4px"
					>
						<ResumeCard
							logoUrl={education.logoUrl}
							altText={education.school}
							title={education.school}
							subtitle={education.degree}
							period={`${education.start} - ${education.end}`}
						/>
					</BlurFade>
				{/each}
			</div>
		</BlurFade>
	</section> -->
	
	<!-- <section id="skills">
		<BlurFade 
			delay={BLUR_FADE_DELAY * 11}
			duration={0.6}
			blur="6px"
		>
			<h2 class="text-xl font-bold">Skills</h2>
		</BlurFade>
		<BlurFade 
			delay={BLUR_FADE_DELAY * 12}
			duration={0.6}
			blur="6px"
		>
			<div class="flex flex-wrap gap-1">
				{#each DATA.skills as skill, id}
					<BlurFade 
						delay={BLUR_FADE_DELAY * 13 + id * 0.02}
						duration={0.4}
						blur="3px"
					>
						<Badge>{skill}</Badge>
					</BlurFade>
				{/each}
			</div>
		</BlurFade>
	</section>
	
	<section id="projects">
		<BlurFade 
			delay={BLUR_FADE_DELAY * 14}
			duration={0.6}
			blur="6px"
		>
			<div class="space-y-12 w-full py-12">
				<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl text-center">Projects</h2>
				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
					{#each DATA.projects as project, id}
						<BlurFade 
							delay={BLUR_FADE_DELAY * 15 + id * 0.07}
							duration={0.5}
							blur="4px"
						>
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
		</BlurFade>
	</section>
	
	<section id="hackathons">
		<BlurFade 
			delay={BLUR_FADE_DELAY * 16}
			duration={0.6}
			blur="6px"
		>
			<div class="space-y-12 w-full py-12">
				<h2 class="text-3xl font-bold tracking-tighter sm:text-5xl text-center">Hackathons</h2>
				<BlurFade 
					delay={BLUR_FADE_DELAY * 17}
					duration={0.5}
					blur="4px"
				>
					<ul class="mb-4 ml-4 divide-y divide-dashed border-l">
						{#each DATA.hackathons as project, id}
							<BlurFade 
								delay={BLUR_FADE_DELAY * 18 + id * 0.05}
								duration={0.4}
								blur="3px"
							>
								<HackathonCard
									title={project.title}
									description={project.description}
									location={project.location}
									dates={project.dates}
									image={project.image}
									links={project.links}
								/>
							</BlurFade>
						{/each}
					</ul>
				</BlurFade>
			</div>
		</BlurFade>
	</section> -->
	
	<section id="contact">
		<div class="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
			<BlurFade 
				delay={BLUR_FADE_DELAY * 19}
				duration={0.6}
				blur="6px"
			>
				<div class="space-y-3">
					<div class="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
						Contact
					</div>
					<h2 class="text-3xl font-bold tracking-tight sm:text-5xl">Get in Touch</h2>
					<p
						class="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
					>
						Want to chat? Just shoot me a dm
						<a href={DATA.contact.social.X.url} class="text-blue-500 hover:underline">
							with a direct question on BSky!
						</a>
						and I&apos;ll respond whenever I can. I will ignore all soliciting.
					</p>
				</div>
			</BlurFade>
		</div>
	</section>
</main>

<style>
	.avatar-source {
		transform-origin: center;
		will-change: transform;
	}
	
	.avatar-source :global(img) {
		transition: none !important;
	}
	
	.avatar-source :global(.size-36) {
		transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
	}
	
	.avatar-source:hover :global(.size-36) {
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	}
</style>
