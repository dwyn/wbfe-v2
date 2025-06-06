u<script>
	// Import any shared components and data
	import BlurFade from '$lib/components/magic/BlurFade.svelte';
	import ResumeCard from '$lib/components/portfolio/ResumeCard.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { marked } from 'marked';
	import { DATA } from '$lib/data/resume';
	
	// Optional: if you use any delays, define them here as before.
	// let BLUR_FADE_DELAY = 0.04;
	let BLUR_FADE_DELAY = 1;
</script>

<svelte:head>
	<title>About - {DATA.name}</title>
	<meta name="description" content={DATA.description} />
</svelte:head>

<main class="flex min-h-[100dvh] flex-col space-y-10 p-6">
	<!-- About Section -->
	<section id="about" class="space-y-4">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-xl font-bold">About</h2>
		</BlurFade>
		<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
			<div class="prose max-w-full font-sans text-sm text-muted-foreground dark:prose-invert">
				{@html marked(DATA.summary)}
			</div>
		</BlurFade>
	</section>

	<!-- Education Section -->
	<section id="education" class="space-y-4">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-xl font-bold">Education</h2>
		</BlurFade>
		{#each DATA.education as edu, id}
			<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
				<ResumeCard
					href={edu.href}
					logoUrl={edu.logoUrl}
					company={edu.school}
					title={edu.school}
					subtitle={edu.degree}
					start={edu.start}
					end={edu.end}
				/>
			</BlurFade>
		{/each}
	</section>

	<!-- Skills Section -->
	<section id="skills" class="space-y-4">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-xl font-bold">Skills</h2>
		</BlurFade>
		<div class="flex flex-wrap gap-1">
			{#each DATA.skills as skill, id}
				<BlurFade delay={BLUR_FADE_DELAY * id + 0.002}>
					<Badge>{skill}</Badge>
				</BlurFade>
			{/each}
		</div>
	</section>
</main>


<!-- <section id="about">
		<BlurFade delay={BLUR_FADE_DELAY}>
			<h2 class="text-xl font-bold">About</h2>
		</BlurFade>
		<BlurFade delay={BLUR_FADE_DELAY * 1.4}>
			<div
				class="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert"
			>
				{@html marked(DATA.summary)}
			</div>
		</BlurFade>
	</section> -->
	<!-- <section id="work">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">Work Experience</h2>
			</BlurFade>
			{#each DATA.work as work, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
					<ResumeCard {...work} />
				</BlurFade>
			{/each}
		</div>
	</section> -->
	<!-- <section id="education">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">Education</h2>
			</BlurFade>
			{#each DATA.education as edu, id}
				<BlurFade delay={BLUR_FADE_DELAY * 1.2 + id * 0.05}>
					<ResumeCard
						href={edu.href}
						logoUrl={edu.logoUrl}
						company={edu.school}
						title={edu.school}
						subtitle={edu.degree}
						start={edu.start}
						end={edu.end}
					/>
				</BlurFade>
			{/each}
		</div>
	</section> -->
	<!-- <section id="skills">
		<div class="flex min-h-0 flex-col gap-y-3">
			<BlurFade delay={BLUR_FADE_DELAY}>
				<h2 class="text-xl font-bold">Skills</h2>
			</BlurFade>
			<div class="flex flex-wrap gap-1">
				{#each DATA.skills as skill, id}
					<BlurFade delay={BLUR_FADE_DELAY * id + 0.002}>
						<Badge>{skill}</Badge>
					</BlurFade>
				{/each}
			</div>
		</div>
	</section> -->
