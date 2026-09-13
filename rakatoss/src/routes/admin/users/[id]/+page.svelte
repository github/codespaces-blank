<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let coinAction = $state<'add' | 'deduct' | null>(null);
</script>

<svelte:head><title>{data.targetUser.username} — Admin</title></svelte:head>

<a href="/admin/users" class="text-muted fs-sm">← Back to Users</a>

<div class="flex items-center gap-3 mt-2 mb-4">
	<div>
		<h2 style="font-size:1.3rem;font-weight:700">{data.targetUser.username}</h2>
		<p class="text-muted fs-sm">{data.targetUser.email}</p>
	</div>
	<div class="flex gap-2 flex-wrap">
		{#if data.targetUser.isActive}
			<form method="post" action="?/block">
				<button type="submit" class="btn btn-danger" style="font-size:0.85rem" onclick={(e) => { if(!confirm('Block this user?')) e.preventDefault(); }}>🚫 Block</button>
			</form>
		{:else}
			<span class="badge badge-red" style="padding:6px 12px">BLOCKED</span>
			<form method="post" action="?/unblock">
				<button type="submit" class="btn btn-success" style="font-size:0.85rem">✅ Unblock</button>
			</form>
		{/if}
	</div>
</div>

{#if form?.success}<div class="alert alert-success mb-3">✅ Done!</div>{/if}
{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}

<!-- Wallet -->
<div class="card mb-4">
	<div class="flex justify-between items-center">
		<div>
			<p class="text-muted fs-xs">Balance</p>
			<p class="coins" style="font-size:1.4rem">{Math.floor(data.wallet?.balance ?? 0).toLocaleString()} 🪙</p>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-success" style="font-size:0.85rem" onclick={() => (coinAction = 'add')}>+ Add Coins</button>
			<button class="btn btn-danger" style="font-size:0.85rem" onclick={() => (coinAction = 'deduct')}>- Deduct Coins</button>
		</div>
	</div>
	{#if coinAction}
		<form method="post" action="?/{coinAction === 'add' ? 'add_coins' : 'deduct_coins'}" class="mt-3">
			<div class="flex gap-2 items-end flex-wrap">
				<div class="field">
					<label class="label">Amount</label>
					<input name="amount" type="number" class="input" min="1" style="width:120px" required />
				</div>
				<div class="field" style="flex:1;min-width:160px">
					<label class="label">Reason</label>
					<input name="reason" type="text" class="input" required placeholder="e.g. Contest win" />
				</div>
				<div class="flex gap-2">
					<button type="submit" class="btn {coinAction === 'add' ? 'btn-success' : 'btn-danger'}">{coinAction === 'add' ? 'Add' : 'Deduct'}</button>
					<button type="button" class="btn btn-ghost" onclick={() => (coinAction = null)}>Cancel</button>
				</div>
			</div>
		</form>
	{/if}
</div>

<!-- Recent bets -->
<div class="card mb-4">
	<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">Recent Bets</h3>
	<div class="table-wrap">
		<table>
			<thead><tr><th>Match</th><th>Side</th><th>Amount</th><th>Status</th></tr></thead>
			<tbody>
				{#each data.bets as { bet, match } (bet.id)}
					<tr>
						<td class="fs-sm">{match?.title ?? '—'}</td>
						<td><span class="badge {bet.side === 'heads' ? 'badge-yellow' : 'badge-blue'}">{bet.side}</span></td>
						<td class="mono">{bet.amount} 🪙</td>
						<td><span class="badge {bet.status === 'won' ? 'badge-green' : bet.status === 'lost' ? 'badge-red' : 'badge-gray'}">{bet.status}</span></td>
					</tr>
				{:else}
					<tr><td colspan="4" class="text-muted text-center" style="padding:1rem">No bets.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<!-- Recent transactions -->
<div class="card">
	<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">Recent Transactions</h3>
	<div class="table-wrap">
		<table>
			<thead><tr><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th></tr></thead>
			<tbody>
				{#each data.transactions as tx (tx.id)}
					<tr>
						<td><span class="badge {tx.kind === 'credit' ? 'badge-green' : 'badge-red'}">{tx.kind}</span></td>
						<td class="mono">{tx.amount} 🪙</td>
						<td class="mono">{Math.floor(tx.balanceAfter)} 🪙</td>
						<td class="text-muted fs-xs truncate" style="max-width:200px">{tx.description}</td>
					</tr>
				{:else}
					<tr><td colspan="4" class="text-muted text-center" style="padding:1rem">No transactions.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.field { margin-bottom: 0; }
</style>
