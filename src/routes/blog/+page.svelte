<!-- src/routes/blog/+page.svelte -->
<script>
	import { formatDate } from '$lib/utils';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { DATA } from '$lib/data/resume';
	import * as Avatar from '$lib/components/ui/avatar';
	import { gsap } from 'gsap';
	import { onMount, onDestroy } from 'svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import { avatarManager, avatarTransition } from '$lib/stores/avatarTransition';
	import { browser } from '$app/environment';

	export let data;
	let BLUR_FADE_DELAY = 0.5;
	
	let avatarContainer;
	let floatingTween;
	let avatarVisible = false;
	
	onMount(() => {
		if (!browser) return;
		
		// Register avatar with manager
		if (avatarContainer) {
			avatarManager.registerBlogAvatar(avatarContainer);
		}
		
		// Check if we're coming from home
		avatarTransition.subscribe(state => {
			if (state.toRoute === '/blog' && state.isTransitioning) {
				// Avatar is transitioning here
				avatarVisible = false;
				setTimeout(() => {
					avatarVisible = true;
					startFloatingAnimation();
				}, 700);
			} else {
				// Direct page load
				avatarVisible = true;
				startFloatingAnimation();
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
	
	function startFloatingAnimation() {
		if (avatarContainer && !floatingTween) {
			floatingTween = gsap.to(avatarContainer, {
				y: -8,
				duration: 3,
				ease: "power1.inOut",
				yoyo: true,
				repeat: -1
			});
		}
	}
	
	beforeNavigate(async ({ to }) => {
		if (to?.route?.id === '/') {
			// Stop animations
			if (floatingTween) {
				floatingTween.kill();
			}
			
			// Update store
			avatarTransition.set({
				isTransitioning: true,
				fromRoute: '/blog',
				toRoute: '/'
			});
			
			// Start transition
			await avatarManager.transitionToHome();
		}
	});
	
	onDestroy(() => {
		if (floatingTween) {
			floatingTween.kill();
		}
	});
	
	function handleAvatarClick() {
		goto('/');
	}
</script>

<svelte:head>
	<title>Blog - {DATA.name}</title>
	<meta name="description" content="Blog posts and thoughts by {DATA.name}" />
	<meta property="og:title" content="Blog - {DATA.name}" />
	<meta property="og:description" content="Blog posts and thoughts by {DATA.name}" />
	<meta property="og:url" content="{DATA.url}/blog" />
	<meta property="og:site_name" content={DATA.name} />
	<meta property="og:image" content={DATA.img} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="twitter:title" content="Blog - {DATA.name}" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={DATA.img} />
	<meta name="twitter:description" content="Blog posts and thoughts by {DATA.name}" />
</svelte:head>

<main class="blog-container">
	<!-- Year Header with Avatar (QWER style) -->
	<section class="year-header">
		<div class="year-header-content">
			<!-- Animated Avatar - no BlurFade -->
			<div 
				bind:this={avatarContainer}
				class="blog-avatar avatar-target {avatarVisible ? 'opacity-100' : 'opacity-0'}" 
				style="transition: opacity 0.3s ease;"
				data-avatar="blog"
				on:click={handleAvatarClick}
				role="button"
				tabindex="0"
				on:keydown={(e) => e.key === 'Enter' && handleAvatarClick()}
			>
				<Avatar.Root class="size-20 border-2 transition-shadow duration-300 hover:shadow-lg">
					<Avatar.Image alt={DATA.name} src={DATA.avatarUrl} />
					<Avatar.Fallback>{DATA.initials}</Avatar.Fallback>
				</Avatar.Root>
			</div>
			
			<!-- Year Title -->
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h1 class="year-title">2024</h1>
			</BlurFade>
		</div>
	</section>

	<!-- Blog Posts Grid (QWER style) -->
	<section class="blog-posts-grid">
		{#if data?.posts && data.posts.length > 0}
			{#each data.posts as post, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.5 + id * 0.1}>
					<article class="post-card">
						<a href="/blog/{post.slug}" class="post-link">
							<!-- Cover Image -->
							<div class="post-cover">
								{#if post.cover}
									<img src={post.cover} alt={post.title} class="cover-image" />
								{:else}
									<!-- Default gradient background if no cover -->
									<div class="cover-placeholder" style="background: linear-gradient(135deg, 
										hsl({Math.floor(Math.random() * 360)}, 70%, 60%), 
										hsl({Math.floor(Math.random() * 360)}, 70%, 40%));">
									</div>
								{/if}
								
								<!-- Post Date Overlay -->
								<div class="post-date-overlay">
									{#if post.date}
										{new Date(post.date).toLocaleDateString('en-US', { 
											weekday: 'short', 
											month: 'short', 
											day: 'numeric', 
											year: 'numeric' 
										})}
									{:else}
										Recent
									{/if}
								</div>
							</div>
							
							<!-- Post Content -->
							<div class="post-content">
								<h2 class="post-title">{post.title || 'Untitled Post'}</h2>
								
								<div class="post-summary">
									{#if post.summary}
										{post.summary}
									{:else if post.description}
										{post.description}
									{:else}
										<!-- Default summary with emoji like QWER -->
										<span class="summary-emoji">🚀</span> 
										{post.title && post.title.length > 50 ? post.title.substring(0, 50) + '...' : 'Read more about this post...'}
									{/if}
								</div>
								
								<!-- Tags -->
								{#if post.categories && post.categories.length > 0}
									<div class="post-tags">
										{#each post.categories.slice(0, 3) as category}
											<span class="post-tag">{category}</span>
										{/each}
									</div>
								{/if}
							</div>
						</a>
					</article>
				</BlurFade>
			{/each}
		{:else}
			<div class="no-posts">
				<p>No blog posts found.</p>
			</div>
		{/if}
	}</section>
</main>

<style>
	.blog-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	
	/* Year Header with Avatar */
	.year-header {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 3rem;
	}
	
	.year-header-content {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	
	.blog-avatar {
		cursor: pointer;
		transform-origin: center;
		will-change: transform;
	}
	
	.year-title {
		font-size: 3rem;
		font-weight: 300;
		color: hsl(var(--muted-foreground));
		letter-spacing: 0.1em;
		margin: 0;
	}
	
	/* Blog Posts Grid */
	.blog-posts-grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	
	/* Preserve BlurFade animations */
	.blog-posts-grid :global(.blur-fade) {
		height: 100%;
	}
	
	/* Ultra-Slim Post Card */
	.post-card {
		background: hsl(var(--card));
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid hsl(var(--border));
		transition: all 0.3s ease;
		position: relative;
		height: 100px;
	}
	
	.post-card:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 24px -2px hsl(var(--foreground) / 0.1);
		border-color: hsl(var(--primary) / 0.4);
	}
	
	.post-link {
		display: flex;
		text-decoration: none;
		color: inherit;
		height: 100%;
		align-items: stretch;
	}
	
	/* Compact Cover Image Section */
	.post-cover {
		position: relative;
		width: 140px;
		flex-shrink: 0;
		overflow: hidden;
		background: hsl(var(--muted));
	}
	
	.cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}
	
	.post-card:hover .cover-image {
		transform: scale(1.05);
	}
	
	.cover-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}
	
	.cover-placeholder::before {
		content: '📝';
		font-size: 4rem;
		opacity: 0.5;
	}
	
	/* Mini Date Overlay */
	.post-date-overlay {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		background: hsl(var(--background) / 0.95);
		backdrop-filter: blur(8px);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.625rem;
		font-weight: 600;
		color: hsl(var(--foreground));
		text-transform: uppercase;
		letter-spacing: 0.05em;
		border: 1px solid hsl(var(--border));
		line-height: 1;
	}
	
	/* Ultra-Compact Post Content */
	.post-content {
		padding: 0.75rem 1rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-width: 0;
	}
	
	.post-title {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		line-height: 1.25;
		color: hsl(var(--foreground));
		transition: color 0.3s ease;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.post-card:hover .post-title {
		color: hsl(var(--primary));
	}
	
	.post-summary {
		color: hsl(var(--muted-foreground));
		line-height: 1.3;
		margin-bottom: 0.5rem;
		font-size: 0.8125rem;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.summary-emoji {
		margin-right: 0.25rem;
	}
	
	/* Mini Tags */
	.post-tags {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		margin-top: auto;
	}
	
	.post-tag {
		background: hsl(var(--primary) / 0.1);
		color: hsl(var(--primary));
		padding: 0.125rem 0.375rem;
		border-radius: 6px;
		font-size: 0.625rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		line-height: 1;
	}
	
	/* Responsive Design */
	@media (min-width: 768px) {
		.blog-posts-grid {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}
	}
	
	@media (min-width: 1024px) {
		.blog-posts-grid {
			gap: 1.5rem;
		}
		
		.year-title {
			font-size: 4rem;
		}
		
		.blog-avatar :global(.size-20) {
			width: 5.5rem;
			height: 5.5rem;
		}
		
		.year-header-content {
			gap: 2rem;
		}
		
		.post-card {
			height: 110px;
		}
		
		.post-cover {
			width: 160px;
		}
		
		.post-content {
			padding: 0.875rem 1.125rem;
		}
		
		.post-title {
			font-size: 1rem;
		}
		
		.post-summary {
			font-size: 0.875rem;
		}
	}
	
	@media (max-width: 768px) {
		.year-header-content {
			gap: 1rem;
		}
		
		.blog-avatar :global(.size-20) {
			width: 4rem;
			height: 4rem;
		}
		
		.year-title {
			font-size: 2.5rem;
		}
		
		.post-card {
			height: auto;
			min-height: 90px;
		}
		
		.post-link {
			flex-direction: column;
		}
		
		.post-cover {
			width: 100%;
			height: 80px;
		}
		
		.post-content {
			padding: 0.75rem;
		}
		
		.post-title {
			font-size: 0.875rem;
			-webkit-line-clamp: 1;
		}
		
		.post-summary {
			font-size: 0.75rem;
			-webkit-line-clamp: 1;
		}
		
		.post-tags {
			gap: 0.25rem;
		}
		
		.post-tag {
			font-size: 0.5625rem;
			padding: 0.125rem 0.25rem;
		}
	}
	
	/* Avatar-specific styles */
	.avatar-target :global(img) {
		transition: none !important;
	}
</style>
