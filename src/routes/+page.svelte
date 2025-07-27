<script lang="ts">
	import PasswordForm from '$lib/PasswordForm.svelte';
	import PasswordList from '$lib/PasswordList.svelte';
	import { theme } from '$lib/theme';

	let isDarkMode = $derived.by(() => $theme === 'dark');
</script>

<div class="{isDarkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen">
	<div class="flex flex-wrap gap-8">
		<div class="w-full">
			<PasswordForm />
		</div>
		<div class="w-full">
			<PasswordList />
		</div>
	</div>
</div>
