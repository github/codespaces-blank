<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Withdraw — Rakatoss</title></svelte:head>

<div class="auth-wrap">
	<div class="card" style="width:100%;max-width:440px">
		<h2 style="font-size:1.3rem;font-weight:700;margin-bottom:0.25rem">💸 Withdraw Coins</h2>
		<p class="text-secondary fs-sm mb-4">Balance: <span class="coins">{Math.floor(data.balance).toLocaleString()} 🪙</span></p>

		{#if form?.success}
			<div class="alert alert-success">✅ Withdrawal request submitted! Admin will process within 24 hours.</div>
			<a href="/wallet/history" class="btn btn-ghost w-full mt-3" style="justify-content:center">View History</a>
		{:else}
			<div class="alert alert-info mb-4" style="font-size:0.85rem">
				Minimum 10 coins · Admin processes within 24 hrs via UPI
			</div>

			{#if form?.errors?.coins}
				<div class="alert alert-error mb-3">{form.errors.coins[0]}</div>
			{/if}

			<form method="post">
				<div class="field mb-3">
					<label class="label" for="coins">Coins to Withdraw</label>
					<input id="coins" name="coins" type="number" class="input" min="10" max={data.balance} step="1" placeholder="e.g. 100" required />
					{#if form?.errors?.coins}<p class="field-error">{form.errors.coins[0]}</p>{/if}
				</div>
				<div class="field mb-4">
					<label class="label" for="upiId">Your UPI ID</label>
					<input id="upiId" name="upiId" type="text" class="input" placeholder="yourname@upi" required />
					{#if form?.errors?.upiId}<p class="field-error">{form.errors.upiId[0]}</p>{/if}
				</div>
				<button type="submit" class="btn btn-primary w-full" style="justify-content:center">
					Request Withdrawal
				</button>
			</form>
		{/if}
	</div>
</div>

<style>
	.auth-wrap { min-height:calc(100vh - 120px);display:flex;align-items:center;justify-content:center;padding:1rem; }
	.field { margin-bottom: 1rem; }
	.field-error { color: var(--red); font-size: 0.8rem; margin-top: 0.25rem; }
</style>
