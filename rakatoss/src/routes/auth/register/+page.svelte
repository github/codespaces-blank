<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Register — Rakatoss</title></svelte:head>

<div class="auth-wrap">
	<div class="auth-card card">
		<h2 class="auth-title">🪙 Create Account</h2>
		<p class="text-secondary fs-sm mb-4" style="text-align:center">Join Rakatoss and start betting coins</p>

		{#if form?.success}
			<div class="alert alert-success">{form.message}</div>
		{:else}
			<form method="post">
				{#if data.ref}
					<input type="hidden" name="ref" value={data.ref} />
				{/if}

				<div class="field">
					<label class="label" for="username">Username</label>
					<input
						id="username" name="username" type="text" class="input"
						value={form?.values?.username ?? ''} autocomplete="username" required
					/>
					{#if form?.errors?.username}<p class="field-error">{form.errors.username[0]}</p>{/if}
				</div>

				<div class="field">
					<label class="label" for="email">Email</label>
					<input
						id="email" name="email" type="email" class="input"
						value={form?.values?.email ?? ''} autocomplete="email" required
					/>
					{#if form?.errors?.email}<p class="field-error">{form.errors.email[0]}</p>{/if}
				</div>

				<div class="field">
					<label class="label" for="password">Password <span class="text-muted fs-xs">(min 8 chars)</span></label>
					<input
						id="password" name="password" type="password" class="input"
						autocomplete="new-password" required
					/>
					{#if form?.errors?.password}<p class="field-error">{form.errors.password[0]}</p>{/if}
				</div>

				<button type="submit" class="btn btn-primary w-full mt-4" style="justify-content:center">Create Account</button>
			</form>

			<p class="text-secondary fs-sm mt-4 text-center">
				Already have an account? <a href="/auth/login">Login</a>
			</p>
		{/if}
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
	.field-error { color: var(--red); font-size: 0.8rem; margin-top: 0.25rem; }
</style>
