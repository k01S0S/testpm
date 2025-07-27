
import { writable } from 'svelte/store';
import type { PasswordEntry } from './types';

const isBrowser = typeof window !== 'undefined';

function isBase64(str: string) {
	try {
		return btoa(atob(str)) === str;
	} catch (err) {
		return false;
	}
}

const initialValue = isBrowser
	? JSON.parse(window.localStorage.getItem('passwords') || '[]').map((p: PasswordEntry) => ({
			...p,
			password: isBase64(p.password) ? atob(p.password) : p.password,
	  }))
	: [];

const passwords = writable<PasswordEntry[]>(initialValue);

if (isBrowser) {
	passwords.subscribe((value) => {
		const encodedPasswords = value.map((p) => ({
			...p,
			password: btoa(p.password),
		}));
		window.localStorage.setItem('passwords', JSON.stringify(encodedPasswords));
	});
}

export { passwords };
