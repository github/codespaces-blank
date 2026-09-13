<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let qrDataUrl = $state('');

	onMount(async () => {
		try {
			// @ts-ignore
			const QRCode = (await import('qrcode')).default;
			const upiLink = `upi://pay?pa=${encodeURIComponent(data.upiId)}&am=${data.deposit.rupeeAmount}&tn=Rakatoss+${data.deposit.ref}&cu=INR`;
			qrDataUrl = await QRCode.toDataURL(upiLink, { width: 240, margin: 1, color: { dark: '#0a0e1a', light: '#f1f5f9' } });
		} catch {}
	});
</script>

<svelte:head><title>Complete Deposit — Rakatoss</title></svelte:head>

<div class="auth-wrap">
	<div class="card" style="width:100%;max-width:500px">
		<h2 style="font-size:1.2rem;font-weight:700;margin-bottom:0.5rem">💳 Complete Deposit</h2>

		{#if form?.submitted || data.deposit.status === 'submitted' || data.deposit.status === 'confirmed'}
			<div class="alert alert-success">
				✅ {data.deposit.status === 'confirmed'
					? `Deposit confirmed! ${data.deposit.coins + data.deposit.bonusCoins} coins credited.`
					: 'UTR submitted! Admin will confirm shortly and coins will be credited.'}
			</div>
		{:else}
			<!-- QR Code -->
			<div class="qr-block">
				{#if qrDataUrl}
					<img src={qrDataUrl} alt="UPI QR Code" class="qr-img" />
				{:else}
					<div class="qr-placeholder">Generating QR…</div>
				{/if}
				<div class="qr-info">
					<p class="text-muted fs-xs">UPI ID</p>
					<p class="mono" style="font-size:0.95rem">{data.upiId}</p>
					<p class="text-muted fs-xs mt-2">Amount</p>
					<p class="coins" style="font-size:1.2rem">₹{data.deposit.rupeeAmount}</p>
					<p class="text-muted fs-xs mt-2">Ref</p>
					<p class="mono fs-sm">{data.deposit.ref}</p>
				</div>
			</div>

			{#if data.deposit.bonusCoins > 0}
				<div class="alert alert-success" style="margin-bottom:1rem;font-size:0.85rem">
					🎉 Bonus: +{data.deposit.bonusCoins} coins on confirmation!
				</div>
			{/if}

			<p class="text-secondary fs-sm mb-3">
				Scan with GPay, PhonePe, or any UPI app, then enter the transaction ID below.
			</p>

			{#if form?.error}
				<div class="alert alert-error mb-3">{form.error}</div>
			{/if}

			<form method="post" action="?/submit">
				<div class="field mb-3">
					<label class="label" for="upiRef">UTR / Transaction ID</label>
					<input id="upiRef" name="upiRef" type="text" class="input" placeholder="e.g. 123456789012" required />
				</div>
				<!-- Screenshot upload hint (Cloudinary handled separately) -->
				<button type="submit" class="btn btn-primary w-full" style="justify-content:center">
					Submit Payment Proof
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth-wrap {
		min-height: calc(100vh - 120px);
		display: flex; align-items: center; justify-content: center; padding: 1rem;
	}
	.qr-block {
		display: flex; gap: 1.25rem; align-items: center;
		background: var(--bg-elevated); border-radius: 10px; padding: 1rem;
		margin-bottom: 1rem;
	}
	.qr-img { width: 120px; height: 120px; border-radius: 8px; flex-shrink: 0; }
	.qr-placeholder {
		width: 120px; height: 120px; display: flex;
		align-items: center; justify-content: center;
		background: var(--bg-card); border-radius: 8px;
		color: var(--text-muted); font-size: 0.8rem;
	}
	.qr-info { display: flex; flex-direction: column; }
	.field { margin-bottom: 1rem; }
</style>
