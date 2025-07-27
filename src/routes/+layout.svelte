<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	function toggleTheme() {
		$theme = $theme === 'light' ? 'dark' : 'light';
	}
	let isDarkMode = $derived.by(() => $theme === 'dark');

	onMount(() => {
		const unsubscribe = theme.subscribe((value) => {
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add(value);
		});

		return unsubscribe;
	});
</script>

<nav class=" p-4 {isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/" class="text-xl font-bold {isDarkMode ? 'text-white' : 'text-grey-900'}"
			>Password Manager</a
		>
		<button
			on:click={toggleTheme}
			class="rounded bg-gray-200 px-4 py-2 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
		>
			{#if $theme === 'light'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			{/if}
		</button>
	</div>
</nav>
<main class="min-h-screen {isDarkMode ? 'text-white' : 'text-black'}">
	{@render children()}
</main>
