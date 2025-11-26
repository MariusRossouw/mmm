<script>
	let appName = $state(localStorage.getItem('AppName') || '');
	let session = $derived(getSession());

	function getSession() {
		try {
			const key = appName + '-user-login-response';
			const stored = localStorage.getItem(key);

			if (!stored) return 'Guest';

			const parsedData = JSON.parse(stored);
			const firstName = parsedData?.data?.first_name || '';
			const lastName = parsedData?.data?.last_name || '';

			return `${firstName} ${lastName}`.trim() || 'Guest';
		} catch (err) {
			console.error('Error parsing session data:', err);
			return 'Guest';
		}
	}
</script>

<div class="desktop-content-container">
	<h2>Welcome back {session}</h2>
</div>
