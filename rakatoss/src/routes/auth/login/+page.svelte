<script lang="ts">
	import type { ActionData, PageData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Login — Rakatoss</title></svelte:head>

<div class="auth-wrap">
	<div class="auth-card card">
		<h2 class="auth-title">🪙 Welcome Back</h2>
		<p class="text-secondary fs-sm mb-4 text-center">Login to your Rakatoss account</p>

		{#if form?.error}
			<div class="alert alert-error mb-3">{form.error}</div>
		{/if}

		<form method="post">
			<input type="hidden" name="next" value={data.next} />

			<div class="field">
				<label class="label" for="email">Email</label>
				<input
					id="email" name="email" type="email" class="input"
					value={form?.email ?? ''} autocomplete="email" required
				/>
			</div>

			<div class="field">
				<label class="label" for="password">Password</label>
				<input id="password" name="password" type="password" class="input" autocomplete="current-password" required />
			</div>

			<button type="submit" class="btn btn-primary w-full mt-4" style="justify-content:center">Login</button>
		</form>

		<p class="text-secondary fs-sm mt-3 text-center">
			<a href="/auth/forgot-password">Forgot password?</a>
		</p>
		<p class="text-secondary fs-sm mt-2 text-center">
			No account? <a href="/auth/register">Sign up</a>
		</p>
	</div>
</div>

<style>
	.auth-wrap {
		min-height: calc(100vh - 120px);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
	}
	.auth-card { width: 100%; max-width: 420px; }
	.auth-title { font-size: 1.4rem; font-weight: 700; text-align: center; margin-bottom: 0.25rem; }
	.field { margin-bottom: 1rem; }
</style>
