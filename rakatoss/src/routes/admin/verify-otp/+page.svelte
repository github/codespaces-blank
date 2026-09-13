<script lang="ts">
	import type { ActionData } from './$types';
	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>2FA Verification — Admin</title></svelte:head>

<div class="auth-wrap">
	<div class="card" style="width:100%;max-width:380px">
		<h2 style="font-size:1.2rem;font-weight:700;margin-bottom:0.25rem">🔐 Two-Factor Auth</h2>
		<p class="text-secondary fs-sm mb-4">Enter the 6-digit code from your authenticator app</p>

		{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}

		<form method="post">
			<div class="field mb-4">
				<label class="label">Authenticator Code</label>
				<input
					name="code" type="text" class="input mono"
					inputmode="numeric" pattern="\d{6}" maxlength="6"
					placeholder="123456" autocomplete="one-time-code" required
					style="font-size:1.5rem;letter-spacing:0.2em;text-align:center"
				/>
			</div>
			<button type="submit" class="btn btn-primary w-full" style="justify-content:center">Verify →</button>
		</form>
	</div>
</div>

<style>
	.auth-wrap { min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem; }
	.field { margin-bottom: 1rem; }
</style>
