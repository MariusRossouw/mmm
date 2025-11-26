<script>
	import '../app.css'; //Import all the styling for the app
	import { ToastContainer } from '@stratech-team/svelte5-component-library';

	let { children } = $props();
</script>

<ToastContainer />
{@render children()}
