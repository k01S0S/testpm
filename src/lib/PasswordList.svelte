<script lang="ts">
	import { passwords } from './stores';
	import type { PasswordEntry } from './types';
	import { theme } from '$lib/theme';

	let selectedPassword = $state<PasswordEntry | null>(null);
	let editingPassword = $state<PasswordEntry | null>(null);
	let searchTerm = $state('');
	let isDarkTheme = $derived.by(() => $theme === 'dark');

	function showPassword(password: PasswordEntry) {
		selectedPassword = password;
		console.log('pas}', selectedPassword);
	}

	function hidePassword() {
		selectedPassword = null;
	}

	function editPassword(password: PasswordEntry) {
		editingPassword = { ...password };
	}

	function savePassword() {
		if (editingPassword) {
			const index = $passwords.findIndex((p) => p.id === editingPassword?.id);
			if (index !== -1) {
				$passwords[index] = editingPassword;
				$passwords = $passwords;
			}
			editingPassword = null;
		}
	}

	function cancelEdit() {
		editingPassword = null;
	}

	function deletePassword(id: string) {
		const index = $passwords.findIndex((p) => p.id === id);
		if (index !== -1) {
			$passwords.splice(index, 1);
			$passwords = $passwords;
		}
	}

	const filteredPasswords = $derived(
		$passwords.filter(
			(p) =>
				p.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
				p.password.toLowerCase().includes(searchTerm.toLowerCase())
		)
	);

	const groupedPasswords = $derived(
		filteredPasswords.reduce(
			(acc, password) => {
				const site = password.site;
				if (!acc[site]) {
					acc[site] = [];
				}
				acc[site].push(password);
				return acc;
			},
			{} as Record<string, PasswordEntry[]>
		)
	);
</script>

<div class="mb-4 rounded {isDarkTheme ? 'bg-gray-800' : 'bg-white'} px-8 pt-6 pb-8 shadow-md">
	<h2 class="mb-4 text-2xl font-bold {isDarkTheme ? 'text-white' : 'text-gray-900'}">
		Saved Passwords
	</h2>
	<div class="relative">
		<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
			<svg
				class="h-4 w-4 text-gray-500 dark:text-gray-400"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 20 20"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
				/>
			</svg>
		</div>
		<input
			bind:value={searchTerm}
			type="search"
			id="default-search"
			class="mb-4 block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			placeholder="search..."
			required
		/>
	</div>

	<div class="overflow-hidden overflow-x-auto border-b border-gray-200 shadow sm:rounded-lg">
		{#if Object.keys(groupedPasswords).length === 0}
			<p class="p-4">No passwords found.</p>
		{:else}
			{#each Object.entries(groupedPasswords) as [site, sitePasswords] (site)}
				<div class="mb-4">
					<h3
						class="{isDarkTheme
							? 'bg-white/10 text-white'
							: 'bg-gray-100 text-gray-900'} p-4 text-lg font-bold"
					>
						{site}
					</h3>
					<table class="min-w-full table-fixed divide-y divide-gray-200">
						<thead class={isDarkTheme ? 'bg-white/10' : 'bg-gray-100 '}>
							<tr>
								<th
									scope="col"
									class="w-1/3 px-6 py-3 text-left text-xs font-medium tracking-wider {isDarkTheme
										? 'text-white'
										: 'text-grey-700'} uppercase">Username</th
								>
								<th
									scope="col"
									class="w-1/3 px-6 py-3 text-left text-xs font-medium tracking-wider {isDarkTheme
										? 'text-white'
										: 'text-grey-700'} uppercase">Password</th
								>
								<th
									scope="col"
									class="w-1/3 px-6 py-3 text-left text-xs font-medium tracking-wider {isDarkTheme
										? 'text-white'
										: 'text-grey-700'} uppercase">Actions</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 {isDarkTheme ? 'bg-white/10' : 'bg-gray-100 '}">
							{#each sitePasswords as password (password.id)}
								<tr>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if editingPassword?.id === password.id}
											<div class="flex">
												<span
													class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400"
												>
													<svg
														class="h-4 w-4 text-gray-500 dark:text-gray-400"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														fill="currentColor"
														viewBox="0 0 20 20"
													>
														<path
															d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
														/>
													</svg>
												</span>
												<input
													bind:value={editingPassword.username}
													type="text"
													id="website-admin"
													class="block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
													placeholder="Username"
												/>
											</div>
										{:else}
											{password.username}
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										{#if editingPassword?.id === password.id}
											<div class="flex">
												<span
													class="rounded-e-0 inline-flex items-center rounded-s-md border border-e-0 border-gray-300 bg-gray-200 px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400"
												>
													<svg
														class="h-6 w-6 text-gray-800 dark:text-white"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															fill-rule="evenodd"
															d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
															clip-rule="evenodd"
														/>
													</svg>
												</span>
												<input
													bind:value={editingPassword.password}
													type="text"
													id="website-admin"
													class="block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
													placeholder="Password"
												/>
											</div>
										{:else if selectedPassword?.id === password.id}
											<span>{password.password}</span>
										{:else}
											<span>********</span>
										{/if}
									</td>
									<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
										{#if editingPassword?.id === password.id}
											<button
												onclick={savePassword}
												class="focus:shadow-outline mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
											>
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
														d="M5 13l4 4L19 7"
													/>
												</svg>
											</button>
											<button
												onclick={cancelEdit}
												class="focus:shadow-outline rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
											>
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
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											</button>
										{:else}
											{#if selectedPassword?.id === password.id}
												<button
													onclick={hidePassword}
													class="focus:shadow-outline mr-2 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
												>
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
															d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
														/>
													</svg>
												</button>
											{:else}
												<button
													onclick={() => showPassword(password)}
													class="focus:shadow-outline mr-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
												>
													<svg
														class="h-6 w-6 text-gray-800 dark:text-white"
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														width="24"
														height="24"
														fill="none"
														viewBox="0 0 24 24"
													>
														<path
															stroke="currentColor"
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
														/>
													</svg>
												</button>
											{/if}
											<button
												onclick={() => editPassword(password)}
												class="focus:shadow-outline mr-2 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700 focus:outline-none"
											>
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
														d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
													/>
												</svg>
											</button>
											<button
												onclick={() => deletePassword(password.id)}
												class="focus:shadow-outline rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700 focus:outline-none"
											>
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
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/each}
		{/if}
	</div>
</div>
