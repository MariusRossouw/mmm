export const ssr = false;
export const csr = true;
export const prerender = false;

import { storageInterface, api } from '@stratech-team/svelte5-component-library';

console.log('commitHash: ', __GIT_COMMIT_HASH__);
console.log('commitDate: ', __GIT_COMMIT_DATE__);

export async function load(event) {
	// Typically for deploys and connecting to spesific API's without .ENV file
	if (import.meta.env.VITE_CONFIG_URL) {
		let request = {
			getConfigUrl: import.meta.env.VITE_CONFIG_URL,
			gitInfo: {
				commitHash: __GIT_COMMIT_HASH__,
				commitDate: __GIT_COMMIT_DATE__
			}
		};
		const conf = await fetch(import.meta.env.VITE_CONFIG_URL, {
			method: 'POST',
			body: JSON.stringify(request),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-API-KEY': import.meta.env.VITE_API_KEY,
				'X-build-number': __GIT_COMMIT_HASH__
			}
		});
		const data = await conf.json();
		let name = 'AppConfig';
		localStorage.removeItem(name);
		localStorage.setItem(name, JSON.stringify(data.data));
		localStorage.removeItem('AppName');
		localStorage.setItem('AppName', data.data.APP_NAME);
		localStorage.setItem('ENV', data.data.ENV);
		// First reinitialize storage
		await storageInterface.reinitialize();
		// Then reinitialize API with fresh config
		await api.reinitialize();
		return data.data;
	} else {
		// Use details from .ENV file
		let meta = import.meta.env;
		for (const [key, value] of Object.entries(meta)) {
			if (key.startsWith('VITE_')) {
				var replaced_key = key.replace('VITE_', '');
				meta[replaced_key] = meta[key];
				delete meta[key];
			}
		}
		let name = 'AppConfig';
		// console.log("NAME: ", name)
		localStorage.setItem(name, JSON.stringify(meta));
		localStorage.removeItem('AppName');
		localStorage.setItem('AppName', meta.APP_NAME);
		localStorage.setItem('ENV', 'LOCAL');
		// First reinitialize storage
		await storageInterface.reinitialize();
		// Then reinitialize API with fresh config
		await api.reinitialize();
		return meta;
	}
}
