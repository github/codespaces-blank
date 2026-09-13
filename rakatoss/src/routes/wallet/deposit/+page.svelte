<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Deposit — Rakatoss</title></svelte:head>

<div class="auth-wrap">
	<div class="card" style="width:100%;max-width:440px">
		<h2 style="font-size:1.3rem;font-weight:700;margin-bottom:0.25rem">💰 Deposit Coins</h2>
		<p class="text-secondary fs-sm mb-4">Your balance: <span class="coins">{Math.floor(data.balance).toLocaleString()} 🪙</span></p>

		{#if form?.error}
			<div class="alert alert-error mb-3">{form.error}</div>
		{/if}

		<form method="post">
			<div class="field mb-3">
				<label class="label" for="amount">Amount (₹)</label>
				<input id="amount" name="amount" type="number" class="input" min="50" step="50" placeholder="e.g. 200" required />
			</div>

			<div class="alert alert-info mb-4" style="font-size:0.85rem">
				<strong>Bonus on deposit:</strong><br />
				₹100–199 → +5 coins · ₹200–499 → +10 coins · ₹500+ → +25 coins and more!
			</div>

			<button type="submit" class="btn btn-primary w-full" style="justify-content:center">
				Generate UPI QR →
			</button>
		</form>
	</div>
</div>

<style>
	.auth-wrap {
		min-height: calc(100vh - 120px);
		display: flex; align-items: center; justify-content: center; padding: 1rem;
	}
	.field { margin-bottom: 1rem; }
</style>
