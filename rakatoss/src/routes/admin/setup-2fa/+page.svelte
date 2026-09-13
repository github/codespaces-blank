<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let qrDataUrl = $state('');
	let secret = $derived(form?.secret ?? data.secret);

	onMount(async () => {
		try {
			// @ts-ignore
			const QRCode = (await import('qrcode')).default;
			qrDataUrl = await QRCode.toDataURL(data.otpauthUrl, { width: 200, margin: 1 });
		} catch {}
	});
</script>

<svelte:head><title>Setup 2FA — Admin</title></svelte:head>

<div class="auth-wrap">
	<div class="card" style="width:100%;max-width:460px">
		<h2 style="font-size:1.2rem;font-weight:700;margin-bottom:0.25rem">🔐 Setup Two-Factor Auth</h2>
		<p class="text-secondary fs-sm mb-4">Scan the QR code with Google Authenticator or Authy</p>

		<div style="text-align:center;margin-bottom:1rem">
			{#if qrDataUrl}
				<img src={qrDataUrl} alt="2FA QR Code" style="border-radius:8px;width:180px;height:180px" />
			{:else}
				<div style="width:180px;height:180px;margin:0 auto;background:var(--bg-elevated);border-radius:8px;display:flex;align-items:center;justify-content:center">
					<span class="text-muted fs-sm">Loading QR…</span>
				</div>
			{/if}
		</div>

		<div class="alert alert-info mb-4" style="font-size:0.85rem;word-break:break-all">
			<strong>Manual entry key:</strong><br />
			<span class="mono">{data.secret}</span>
		</div>

		{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}

		<form method="post">
			<input type="hidden" name="secret" value={secret} />
			<div class="field mb-4">
				<label class="label">Enter 6-digit code to confirm</label>
				<input
					name="code" type="text" class="input mono"
					inputmode="numeric" pattern="\d{6}" maxlength="6"
					placeholder="123456" required
					style="font-size:1.5rem;letter-spacing:0.2em;text-align:center"
				/>
			</div>
			<button type="submit" class="btn btn-primary w-full" style="justify-content:center">Activate 2FA →</button>
		</form>
	</div>
</div>

<style>
	.auth-wrap { min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem; }
	.field { margin-bottom: 1rem; }
</style>
