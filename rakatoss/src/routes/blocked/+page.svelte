<svelte:head><title>Account Suspended — Rakatoss</title></svelte:head>

<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem">
	<div class="card text-center" style="max-width:400px;width:100%;padding:2.5rem">
		<p style="font-size:3rem;margin-bottom:1rem">🚫</p>
		<h2 style="font-size:1.3rem;font-weight:700;margin-bottom:0.5rem">Account Suspended</h2>
		<p class="text-secondary" style="margin-bottom:1.5rem">
			Your account has been suspended. Contact support if you believe this is a mistake.
		</p>
		<a href="/support/new" class="btn btn-primary" style="justify-content:center">Contact Support</a>
		<form method="post" action="/auth/logout" class="mt-3">
			<button type="submit" class="btn btn-ghost w-full" style="justify-content:center">Logout</button>
		</form>
	</div>
</div>
