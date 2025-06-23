<!-- src/lib/components/portfolio/Navbar.svelte -->
<script lang="ts">
	import { DATA } from '$lib/data/resume';
	import Dock from '../magic/Dock.svelte';
	import DockIcon from '../magic/DockIcon.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ModeToggle from './ModeToggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { mode } from 'mode-watcher';
	$: theme = $mode;
</script>

<!-- 
  Navigation Dock Container
  - Fixed positioning to stay at bottom of viewport
  - High z-index to float above all content including transitions
  - Enhanced backdrop blur for better visual separation
  - navbar-dock class for targeted styling from layout
-->
<div
	class="navbar-dock pointer-events-none fixed inset-x-0 bottom-10 z-[9999] mx-auto mb-4 flex h-full max-h-14 origin-bottom"
>
	<!-- 
		Background blur layer
		- Creates visual separation from page content
		- Enhanced backdrop blur for modern glass effect
		- Gradient mask for smooth fade-out
	-->
	<div
		class="fixed inset-x-0 bottom-0 h-16 w-full bg-background/80 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_top,black,transparent)] dark:bg-background/80"
	></div>
	
	<!-- 
		Main dock component
		- Pointer events enabled for interactions
		- Enhanced shadow and border for floating effect
		- Responsive gap spacing for different screen sizes
	-->
	<Dock
		class="pointer-events-auto relative z-50 mx-auto flex h-full min-h-full transform-gpu items-center gap-0.5 rounded-full bg-background/90 px-1 backdrop-blur-md [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:bg-background/90 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] sm:gap-1 md:gap-2"
		let:magnification
		let:distance
		let:mouseX
	>
		<!-- 
			Navigation items from DATA.navbar
			- Home, Blog, Projects navigation
			- Consistent icon sizing and styling
		-->
		{#each DATA.navbar as item}
			<DockIcon {magnification} {mouseX} {distance}>
				<Tooltip.Root openDelay={300}>
					<Tooltip.Trigger>
						<Button href={item.href} variant="ghost" size="icon" class="size-12 rounded-full hover:bg-muted/50 transition-colors duration-200">
							<svelte:component this={item.icon} class="size-[18px]" strokeWidth={1.5} />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{item.label}</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</DockIcon>
		{/each}
		
		<!-- Visual separator between navigation and social links -->
		<Separator orientation="vertical" class="h-full" />
		
		<!-- 
			Social media links
			- Filtered to show only navbar-enabled socials
			- Theme-aware icons (dark/light mode support)
			- Enhanced hover effects
		-->
		{#each Object.entries(DATA.contact.social)
			.filter(([_, social]) => social.navbar)
			.map(([_, social]) => social) as social}
			<DockIcon {magnification} {mouseX} {distance}>
				<Tooltip.Root openDelay={300}>
					<Tooltip.Trigger>
						<Button href={social.url} variant="ghost" size="icon" class="size-12 rounded-full hover:bg-muted/50 transition-colors duration-200">
							{#if social?.dark_icon && theme === 'dark'}
								<img src={social?.dark_icon} class="size-4" alt={social.name} />
							{:else}
								<img src={social.icon} class="size-[18px]" alt={social.name} />
							{/if}
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>{social.name}</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</DockIcon>
		{/each}
		
		<!-- Visual separator between social links and theme toggle -->
		<Separator orientation="vertical" class="h-full py-2" />
		
		<!-- 
			Theme toggle button
			- Dark/light mode switcher
			- Consistent with other dock items
		-->
		<DockIcon {magnification} {mouseX} {distance}>
			<Tooltip.Root openDelay={300}>
				<Tooltip.Trigger>
					<ModeToggle />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Theme</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</DockIcon>
	</Dock>
</div>
