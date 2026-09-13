<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let total = $derived(data.pool.heads + data.pool.tails);
	let headsPct = $derived(total > 0 ? Math.round((data.pool.heads / total) * 100) : 50);
</script>

<svelte:head><title>{data.match.title} — Admin</title></svelte:head>

<a href="/admin/matches" class="text-muted fs-sm">← Back to Matches</a>
<h2 style="font-size:1.3rem;font-weight:700;margin:0.5rem 0">{data.match.title}</h2>

<div class="status-row mb-3">
	<span class="badge {data.match.status === 'open' ? 'badge-open' : data.match.status === 'settled' ? 'badge-green' : 'badge-gray'}">
		{data.match.status.toUpperCase()}
	</span>
	{#if data.match.winningSide}
		<span class="text-secondary fs-sm">Winner: <strong class={data.match.winningSide === 'heads' ? 'text-heads' : 'text-tails'}>{data.match.winningSide.toUpperCase()}</strong></span>
	{/if}
</div>

{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}
{#if form?.success}<div class="alert alert-success mb-3">✅ Done!</div>{/if}

<!-- Pool -->
<div class="card mb-3">
	<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">Pool</h3>
	<div class="pool-row">
		<span class="text-heads mono">{Math.floor(data.pool.heads).toLocaleString()} 🪙 HEADS ({headsPct}%)</span>
		<span class="text-tails mono">{Math.floor(data.pool.tails).toLocaleString()} 🪙 TAILS ({100 - headsPct}%)</span>
	</div>
	<div class="pool-bar mt-2">
		<div class="pool-bar-heads" style="width:{headsPct}%"></div>
		<div class="pool-bar-tails"></div>
	</div>
	<p class="text-muted fs-xs mt-1">Total: {Math.floor(total).toLocaleString()} 🪙 · House edge {data.match.houseEdge}%</p>
</div>

<!-- Actions -->
{#if data.match.status !== 'settled' && data.match.status !== 'cancelled'}
	<div class="card mb-3">
		<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">Actions</h3>
		<div class="flex gap-3 flex-wrap">
			{#if data.match.status === 'open'}
				<form method="post" action="?/lock">
					<button type="submit" class="btn btn-ghost">🔒 Lock Betting</button>
				</form>
			{/if}
			<form method="post" action="?/settle_heads">
				<button type="submit" class="btn btn-primary" style="background:var(--heads);color:#000">🟡 Heads Wins</button>
			</form>
			<form method="post" action="?/settle_tails">
				<button type="submit" class="btn btn-primary" style="background:var(--tails);color:#000">🔵 Tails Wins</button>
			</form>
			<form method="post" action="?/cancel">
				<button type="submit" class="btn btn-danger" onclick={(e) => { if(!confirm('Cancel match and refund all bets?')) e.preventDefault(); }}>
					🚫 Cancel + Refund
				</button>
			</form>
		</div>
	</div>
{/if}

<!-- Bets log -->
<div class="card">
	<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">Bets ({data.bets.length})</h3>
	<div class="table-wrap">
		<table>
			<thead>
				<tr><th>User</th><th>Side</th><th>Amount</th><th>Payout</th><th>Status</th></tr>
			</thead>
			<tbody>
				{#each data.bets as bet (bet.id)}
					<tr>
						<td class="mono fs-sm">{bet.userId.slice(0, 8)}…</td>
						<td><span class="badge {bet.side === 'heads' ? 'badge-yellow' : 'badge-blue'}">{bet.side}</span></td>
						<td class="mono">{bet.amount} 🪙</td>
						<td class="mono {bet.status === 'won' ? 'text-green' : ''}">{bet.payout ? Math.floor(bet.payout) + ' 🪙' : '—'}</td>
						<td><span class="badge {bet.status === 'won' ? 'badge-green' : bet.status === 'lost' ? 'badge-red' : 'badge-gray'}">{bet.status}</span></td>
					</tr>
				{:else}
					<tr><td colspan="5" class="text-center text-muted" style="padding:1.5rem">No bets yet.</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.status-row { display: flex; align-items: center; gap: 0.75rem; }
	.pool-row { display: flex; justify-content: space-between; }
</style>
