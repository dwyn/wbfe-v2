<script lang="ts">
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { formatDate } from '$lib/utils';
	import { onMount } from 'svelte';

	export let data;
	
	// Handle both old and new data structures
	const post = data.post || {};
	const meta = data.meta || {};
	const content = data.content || post.html || '';
	
	// Use categories from either meta or post
	const categories = meta.categories || post.categories || [];
	const title = meta.title || post.title || 'Untitled';
	const description = meta.description || post.description || '';
	const date = meta.date || post.date || post.published || '';
	
	// Copy code functionality
	onMount(() => {
		// Add copy functionality to code blocks
		const copyButtons = document.querySelectorAll('.copy-code-btn');
		copyButtons.forEach(button => {
			button.addEventListener('click', () => {
				const code = button.getAttribute('data-code');
				if (code) {
					navigator.clipboard.writeText(code).then(() => {
						button.textContent = 'Copied!';
						setTimeout(() => {
							button.textContent = 'Copy';
						}, 2000);
					});
				}
			});
		});
	});
</script>

<!-- SEO -->
<svelte:head>
	<title>{title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
</svelte:head>

<!-- QWER-style blog post container -->
<div class="qwer-post-container">
	<!-- Header with back button -->
	<header class="post-header">
		<Button
			href="/blog"
			variant="ghost"
			class="back-button"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="mr-2"
			>
				<path d="m12 19-7-7 7-7" />
				<path d="M19 12H5" />
			</svg>
			Back to Blog
		</Button>
	</header>

	<!-- Main post content -->
	<article class="qwer-post">
		<!-- Post cover image (if available) -->
		{#if post.cover}
			<div class="post-cover-container">
				<img src={post.cover} alt={title} class="post-cover-image" />
				<div class="post-cover-overlay">
					<div class="cover-content">
						<time datetime={date} class="cover-date">
							{new Date(date).toLocaleDateString('en-US', { 
								weekday: 'long', 
								year: 'numeric', 
								month: 'long', 
								day: 'numeric' 
							})}
						</time>
					</div>
				</div>
			</div>
		{/if}

		<!-- Post header -->
		<header class="post-title-section">
			<h1 class="qwer-post-title">{title}</h1>
			
			{#if description}
				<p class="qwer-post-description">{description}</p>
			{/if}
			
			<div class="post-meta">
				{#if !post.cover}
					<time datetime={date} class="post-date">
						{formatDate(date)}
					</time>
				{/if}
				
				<!-- Tags -->
				{#if categories && categories.length > 0}
					<div class="post-tags">
						{#each categories as category}
							<Badge variant="secondary" class="qwer-tag">
								{category}
							</Badge>
						{/each}
					</div>
				{/if}
			</div>
		</header>
		
		<Separator class="post-separator" />

		<!-- Enhanced post content with QWER-style prose -->
		<div class="qwer-prose">
			{@html content}
		</div>
	</article>
</div>

<style>
	.qwer-post-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1rem;
	}
	
	.post-header {
		margin-bottom: 2rem;
	}
	
	.back-button {
		color: hsl(var(--muted-foreground));
		transition: all 0.2s ease;
	}
	
	.back-button:hover {
		color: hsl(var(--foreground));
		transform: translateX(-4px);
	}
	
	/* Post Cover */
	.post-cover-container {
		position: relative;
		width: calc(100% + 2rem);
		margin: 0 -1rem 3rem -1rem;
		height: 400px;
		border-radius: 16px;
		overflow: hidden;
	}
	
	.post-cover-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.post-cover-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			transparent 60%,
			rgba(0, 0, 0, 0.7) 100%
		);
		display: flex;
		align-items: flex-end;
		padding: 2rem;
	}
	
	.cover-content {
		color: white;
	}
	
	.cover-date {
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(8px);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}
	
	/* Post Title Section */
	.post-title-section {
		margin-bottom: 2rem;
	}
	
	.qwer-post-title {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 1rem 0;
		color: hsl(var(--foreground));
		letter-spacing: -0.02em;
	}
	
	.qwer-post-description {
		font-size: 1.25rem;
		color: hsl(var(--muted-foreground));
		line-height: 1.6;
		margin: 0 0 1.5rem 0;
	}
	
	.post-meta {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	
	.post-date {
		color: hsl(var(--muted-foreground));
		font-size: 0.875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	
	.post-tags {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	
	:global(.qwer-tag) {
		background: hsl(var(--primary) / 0.1);
		color: hsl(var(--primary));
		border: 1px solid hsl(var(--primary) / 0.2);
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		padding: 0.25rem 0.75rem;
	}
	
	.post-separator {
		margin: 2rem 0;
	}
	
	/* QWER-style Prose */
	.qwer-prose {
		line-height: 1.8;
		font-size: 1.1rem;
		color: hsl(var(--foreground));
	}
	
	.qwer-prose :global(h1),
	.qwer-prose :global(h2),
	.qwer-prose :global(h3),
	.qwer-prose :global(h4),
	.qwer-prose :global(h5),
	.qwer-prose :global(h6) {
		font-weight: 700;
		line-height: 1.3;
		margin: 2rem 0 1rem 0;
		color: hsl(var(--foreground));
		scroll-margin-top: 2rem;
	}
	
	.qwer-prose :global(h1) { font-size: 2.25rem; }
	.qwer-prose :global(h2) { font-size: 1.875rem; }
	.qwer-prose :global(h3) { font-size: 1.5rem; }
	.qwer-prose :global(h4) { font-size: 1.25rem; }
	
	.qwer-prose :global(p) {
		margin: 1.5rem 0;
		line-height: 1.8;
	}
	
	.qwer-prose :global(a) {
		color: hsl(var(--primary));
		text-decoration: underline;
		text-decoration-color: hsl(var(--primary) / 0.3);
		text-underline-offset: 3px;
		transition: all 0.2s ease;
	}
	
	.qwer-prose :global(a:hover) {
		text-decoration-color: hsl(var(--primary));
		transform: translateY(-1px);
	}
	
	.qwer-prose :global(code) {
		background: hsl(var(--muted));
		color: hsl(var(--primary));
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.9em;
		font-weight: 500;
		border: 1px solid hsl(var(--border));
	}
	
	.qwer-prose :global(pre) {
		background: hsl(var(--muted));
		border: 1px solid hsl(var(--border));
		border-radius: 12px;
		padding: 1.5rem;
		margin: 2rem 0;
		overflow-x: auto;
		font-size: 0.875rem;
		line-height: 1.6;
	}
	
	.qwer-prose :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		color: hsl(var(--foreground));
	}
	
	.qwer-prose :global(blockquote) {
		border-left: 4px solid hsl(var(--primary));
		background: hsl(var(--muted) / 0.5);
		padding: 1.5rem;
		margin: 2rem 0;
		border-radius: 8px;
		font-style: italic;
		position: relative;
	}
	
	.qwer-prose :global(blockquote::before) {
		content: '"';
		position: absolute;
		top: -0.5rem;
		left: 1rem;
		font-size: 3rem;
		color: hsl(var(--primary));
		opacity: 0.3;
	}
	
	.qwer-prose :global(ul),
	.qwer-prose :global(ol) {
		margin: 1.5rem 0;
		padding-left: 2rem;
	}
	
	.qwer-prose :global(li) {
		margin: 0.5rem 0;
		line-height: 1.7;
	}
	
	.qwer-prose :global(img) {
		border-radius: 12px;
		margin: 2rem 0;
		box-shadow: 0 8px 32px -8px hsl(var(--foreground) / 0.1);
		transition: transform 0.3s ease;
	}
	
	.qwer-prose :global(img:hover) {
		transform: scale(1.02);
	}
	
	.qwer-prose :global(hr) {
		margin: 3rem 0;
		border: none;
		height: 2px;
		background: linear-gradient(
			90deg,
			transparent,
			hsl(var(--border)) 20%,
			hsl(var(--border)) 80%,
			transparent
		);
	}
	
	/* Responsive */
	@media (max-width: 768px) {
		.qwer-post-container {
			padding: 0 0.5rem;
		}
		
		.post-cover-container {
			width: calc(100% + 1rem);
			margin: 0 -0.5rem 2rem -0.5rem;
			height: 250px;
		}
		
		.post-cover-overlay {
			padding: 1rem;
		}
		
		.qwer-post-title {
			font-size: 2rem;
		}
		
		.qwer-post-description {
			font-size: 1.125rem;
		}
		
		.qwer-prose {
			font-size: 1rem;
		}
		
		.qwer-prose :global(h1) { font-size: 1.875rem; }
		.qwer-prose :global(h2) { font-size: 1.5rem; }
		.qwer-prose :global(h3) { font-size: 1.25rem; }
	}
</style>
