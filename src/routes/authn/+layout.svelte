<script>
	import { SideMenu, SessionWatch } from '@stratech-team/svelte5-component-library';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let component_id = $state('/authn/dashboard');
	let AppName = localStorage.getItem('AppName');
	let session = JSON.parse(localStorage.getItem(AppName + '-user-login-response'));
	let componentIDList = $state([]);
	let sessionActive = $state(false);

	let showHeader = $state(true);
	let showFooter = $state(true);
	/**
	 * @type {Array<any>}
	 */
	let menuItems = $state([
		{
			label: 'Dashboard',
			componentId: '/authn/dashboard',
			goto: '/authn/dashboard',
			subMenu: []
		},
		{
			label: 'Nested Items',
			componentId: 'nested',
			subMenu: [
				{
					label: 'Item 1',
					componentId: '/authn/item/1',
					goto: '/authn/item/1',
					subMenu: []
				},
				{
					label: 'Item 2',
					componentId: '/authn/item/2',
					goto: '/authn/item/2',
					subMenu: []
				}
			]
		}
	]);

	onMount(() => {});

	function signOutHandler() {
		localStorage.removeItem(AppName + '-session-expiry');
		localStorage.removeItem(AppName + '-user-login-response');
		goto('/');
	}

	// Function to flatten component IDs
	function flattenComponentID(items) {
		const result = [];

		for (let i = 0; i < items.length; i++) {
			result.push(items[i].componentId);
			if (items[i].subMenu.length > 0) {
				result.push(...flattenComponentID(items[i].subMenu));
			}
		}

		return result;
	}

	// Derive componentIDList from menuItems
	$effect(() => {
		componentIDList = flattenComponentID(menuItems);
	});

	// Update component_id based on URL and componentIDList
	$effect(() => {
		const pathname = $page.url.pathname;

		if (pathname === component_id) {
			// Keep the current component_id if it matches exactly
			component_id = pathname;
		} else {
			// Find the first matching componentId in our flattened list
			for (let j = 0; j < componentIDList.length; j++) {
				if (pathname.includes(componentIDList[j])) {
					component_id = componentIDList[j];
					break; // Exit the loop once we find a match
				}
			}
		}
	});

	function handleSideMenuItemClicked() {}
</script>

<SessionWatch bind:sessionActive />
<div class="desktop-page-layout">
	{#if sessionActive === true}
		<div class="desktop-side-menu-container">
			<!-- {#if session && session.data && session.data.role} -->
			<SideMenu
				{menuItems}
				{showHeader}
				{showFooter}
				role={session.data.role}
				activeComponentID={component_id}
				menuName={'Console-Products'}
				sideMenuItemClicked={handleSideMenuItemClicked}
				sideMenuLogoutClicked={signOutHandler}
			/>
			<!-- {/if} -->
		</div>
		{@render children()}
	{/if}
</div>
