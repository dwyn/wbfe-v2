<!-- src/routes/blog/+page.svelte -->
<script lang="ts">
	import { formatDate } from '$lib/utils';
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import { DATA } from '$lib/data/resume';

	export let data;
	// let BLUR_FADE_DELAY = 0.04;
	let BLUR_FADE_DELAY = 1;
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

<main class="flex min-h-[100dvh] flex-col space-y-10">
	<!-- 
		Blog Header Section
		- h1 element is targeted by the morphing transition system
		- This element morphs when transitioning from other pages
	-->
	<section class="blog-header">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h1 class="mb-8 text-2xl font-medium tracking-tighter">Blog</h1>
		</BlurFade>
	</section>

	<!-- 
		Blog Posts Section
		- Posts list with staggered entrance animations
		- Each post item animates in with a slight delay
	-->
	<section class="blog-posts">
		<ul class="posts">
			{#each data.posts as post, id}
				<li class="post">
					<BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05}>
						<a class="mb-4 flex flex-col space-y-1" href="/blog/{post.slug}">
							<div class="flex w-full flex-col">
								<p class="tracking-tight">{post.title}</p>
								<p class="h-6 text-xs text-muted-foreground">
									{formatDate(post.date)}
								</p>
							</div>
						</a>
					</BlurFade>
				</li>
			{/each}
		</ul>
	</section>
</main>

<style>
	/* 
		Blog posts styling
		- Grid layout for clean post organization
		- Border separators between posts
		- Responsive design considerations
	*/
	.posts {
		display: grid;
	}

	.post {
		max-inline-size: var(--size-content-3);
	}

	.post:not(:last-child) {
		border-bottom: 1px solid var(--border);
		padding-bottom: var(--size-7);
	}

	/* 
		Hover effects for better interactivity
		- Smooth transitions on post links
		- Enhanced accessibility
	*/
	.post a {
		transition: all 0.2s ease-in-out;
		border-radius: 8px;
		padding: 12px;
		margin: -12px;
	}

	.post a:hover {
		background-color: var(--muted);
		transform: translateY(-2px);
	}

	/* 
		Typography improvements
		- Better line height for readability
		- Consistent spacing
	*/
	.post p:first-child {
		line-height: 1.4;
		font-weight: 500;
	}

	.post p:last-child {
		margin-top: 4px;
	}
</style>
