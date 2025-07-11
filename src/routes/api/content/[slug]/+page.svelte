<script>
	import { formatDate } from '$lib/utils';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { DATA } from '$lib/data/resume';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	export let data;
	
	$: post = data.post;
	$: content = data.content;
	
	// Format the display date
	$: displayDate = post?.published ? new Date(post.published).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}) : '';
	
	// Extract unique categories
	$: categories = post?.categories || [];
	
	// Handle navigation back to blog
	function goBack() {
		goto('/blog');
	}
	
	onMount(() => {
		// Add styling to code blocks if needed
		const codeBlocks = document.querySelectorAll('pre code');
		codeBlocks.forEach(block => {
			block.classList.add('hljs');
		});
	});
</script>

<svelte:head>
	<title>{post?.title || 'Blog Post'} - {DATA.name}</title>
	<meta name="description" content={post?.description || post?.summary || ''} />
	<meta property="og:title" content="{post?.title || 'Blog Post'} - {DATA.name}" />
	<meta property="og:description" content={post?.description || post?.summary || ''} />
	<meta property="og:url" content="{DATA.url}/blog/{post?.slug}" />
	<meta property="og:type" content="article" />
	{#if post?.cover}
		<meta property="og:image" content="{DATA.url}{post.cover}" />
	{/if}
	<meta property="article:published_time" content={post?.published} />
	<meta property="article:modified_time" content={post?.updated} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{post?.title || 'Blog Post'} - {DATA.name}" />
	<meta name="twitter:description" content={post?.description || post?.summary || ''} />
	{#if post?.cover}
		<meta name="twitter:image" content="{DATA.url}{post.cover}" />
	{/if}
</svelte:head>

<main class="blog-post-container">
	<!-- Back button -->
	<BlurFade delay={0.04} duration={0.6} blur="6px">
		<button 
			on:click={goBack}
			class="back-button"
			aria-label="Back to blog"
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			<span>Back to blog</span>
		</button>
	</BlurFade>
	
	<!-- Article header -->
	<article class="blog-article">
		<!-- Cover image if exists -->
		{#if post?.cover}
			<BlurFade delay={0.08} duration={0.8} blur="10px">
				<div class="cover-container" style="--cover-style: {post.coverStyle || 'TOP'}">
					<img 
						src={post.cover} 
						alt={post.title}
						class="cover-image"
					/>
				</div>
			</BlurFade>
		{/if}
		
		<!-- Post header -->
		<header class="post-header">
			<BlurFade delay={0.12} duration={0.6} blur="6px">
				<h1 class="post-title">{post?.title || 'Untitled'}</h1>
			</BlurFade>
			
			<BlurFade delay={0.16} duration={0.6} blur="6px">
				<div class="post-meta">
					<time datetime={post?.published} class="post-date">
						{displayDate}
					</time>
					{#if post?.updated && post.updated !== post.published}
						<span class="post-updated">
							Updated: {new Date(post.updated).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</span>
					{/if}
				</div>
			</BlurFade>
			
			{#if categories.length > 0}
				<BlurFade delay={0.20} duration={0.6} blur="6px">
					<div class="post-categories">
						{#each categories as category}
							<Badge variant="secondary">{category}</Badge>
						{/each}
					</div>
				</BlurFade>
			{/if}
			
			{#if post?.summary}
				<BlurFade delay={0.24} duration={0.6} blur="6px">
					<p class="post-summary">{post.summary}</p>
				</BlurFade>
			{/if}
		</header>
		
		<!-- Post content -->
		<BlurFade delay={0.28} duration={0.8} blur="8px">
			<div class="post-content prose">
				{@html content}
			</div>
		</BlurFade>
	</article>
	
	<!-- Footer navigation -->
	<BlurFade delay={0.32} duration={0.6} blur="6px">
		<footer class="post-footer">
			<button 
				on:click={goBack}
				class="footer-back-button"
			>
				← Back to all posts
			</button>
		</footer>
	</BlurFade>
</main>

<style>
	.blog-post-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
	
	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		margin-bottom: 2rem;
		background: transparent;
		border: 1px solid hsl(var(--border));
		border-radius: 8px;
		color: hsl(var(--muted-foreground));
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.back-button:hover {
		background: hsl(var(--muted));
		color: hsl(var(--foreground));
		transform: translateX(-2px);
	}
	
	.blog-article {
		margin-bottom: 4rem;
	}
	
	.cover-container {
		margin: -2rem -1rem 2rem;
		overflow: hidden;
		border-radius: 12px;
	}
	
	@media (min-width: 768px) {
		.cover-container {
			margin: -2rem 0 3rem;
		}
	}
	
	.cover-image {
		width: 100%;
		height: auto;
		max-height: 400px;
		object-fit: cover;
		object-position: var(--cover-style, center);
	}
	
	.post-header {
		margin-bottom: 3rem;
		text-align: center;
	}
	
	.post-title {
		font-size: 2.5rem;
		font-weight: 700;
		line-height: 1.2;
		margin: 0 0 1rem 0;
		color: hsl(var(--foreground));
	}
	
	@media (min-width: 768px) {
		.post-title {
			font-size: 3rem;
		}
	}
	
	.post-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: hsl(var(--muted-foreground));
	}
	
	.post-date {
		font-weight: 500;
	}
	
	.post-updated {
		font-style: italic;
	}
	
	.post-categories {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
		margin-bottom: 1.5rem;
	}
	
	.post-summary {
		font-size: 1.125rem;
		line-height: 1.6;
		color: hsl(var(--muted-foreground));
		max-width: 600px;
		margin: 0 auto;
	}
	
	/* Prose content styling */
	.post-content {
		font-size: 1.0625rem;
		line-height: 1.75;
		color: hsl(var(--foreground));
	}
	
	.post-content :global(h1),
	.post-content :global(h2),
	.post-content :global(h3),
	.post-content :global(h4),
	.post-content :global(h5),
	.post-content :global(h6) {
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
		line-height: 1.25;
	}
	
	.post-content :global(h2) {
		font-size: 1.875rem;
		margin-top: 3rem;
	}
	
	.post-content :global(h3) {
		font-size: 1.5rem;
	}
	
	.post-content :global(p) {
		margin-bottom: 1.5rem;
	}
	
	.post-content :global(a) {
		color: hsl(var(--primary));
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;
	}
	
	.post-content :global(a:hover) {
		color: hsl(var(--primary) / 0.8);
	}
	
	.post-content :global(ul),
	.post-content :global(ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}
	
	.post-content :global(li) {
		margin-bottom: 0.5rem;
	}
	
	.post-content :global(blockquote) {
		border-left: 4px solid hsl(var(--primary));
		padding-left: 1rem;
		margin: 1.5rem 0;
		font-style: italic;
		color: hsl(var(--muted-foreground));
	}
	
	.post-content :global(code) {
		background: hsl(var(--muted));
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		font-size: 0.875em;
		font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
	}
	
	.post-content :global(pre) {
		background: hsl(var(--muted));
		padding: 1rem;
		border-radius: 8px;
		overflow-x: auto;
		margin: 1.5rem 0;
	}
	
	.post-content :global(pre code) {
		background: transparent;
		padding: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}
	
	.post-content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 2rem auto;
		display: block;
	}
	
	.post-content :global(hr) {
		border: none;
		border-top: 1px solid hsl(var(--border));
		margin: 3rem 0;
	}
	
	.post-content :global(table) {
		width: 100%;
		margin: 1.5rem 0;
		border-collapse: collapse;
	}
	
	.post-content :global(th),
	.post-content :global(td) {
		padding: 0.75rem;
		border: 1px solid hsl(var(--border));
		text-align: left;
	}
	
	.post-content :global(th) {
		background: hsl(var(--muted));
		font-weight: 600;
	}
	
	.post-footer {
		margin-top: 4rem;
		padding-top: 2rem;
		border-top: 1px solid hsl(var(--border));
		text-align: center;
	}
	
	.footer-back-button {
		padding: 0.75rem 1.5rem;
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		border: none;
		border-radius: 8px;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.footer-back-button:hover {
		background: hsl(var(--primary) / 0.9);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsl(var(--primary) / 0.2);
	}
</style>
