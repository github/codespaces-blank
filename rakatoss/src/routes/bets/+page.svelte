<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();
	function fmtDate(s: string) {
		return new Date(s).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head><title>My Bets — Rakatoss</title></svelte:head>

<h2 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem">🎯 My Bets</h2>

<div class="table-wrap">
	<table>
		<thead>
			<tr><th>Match</th><th>Side</th><th>Amount</th><th>Payout</th><th>Status</th><th>Date</th></tr>
		</thead>
		<tbody>
			{#each data.bets as { bet, match } (bet.id)}
				<tr>
					<td>
						{#if match}
							<a href="/matches/{match.id}" class="text-neon">{match.title}</a>
						{:else}
							<span class="text-muted">—</span>
						{/if}
					</td>
					<td>
						<span class="badge {bet.side === 'heads' ? 'badge-yellow' : 'badge-blue'}">
							{bet.side === 'heads' ? '🟡 H' : '🔵 T'}
						</span>
					</td>
					<td class="mono">{Math.floor(bet.amount)} 🪙</td>
					<td class="mono {bet.status === 'won' ? 'text-green' : 'text-muted'}">
						{bet.payout ? Math.floor(bet.payout) + ' 🪙' : '—'}
					</td>
					<td>
						<span class="badge {bet.status === 'won' ? 'badge-green' : bet.status === 'lost' ? 'badge-red' : bet.status === 'refunded' ? 'badge-yellow' : 'badge-gray'}">
							{bet.status}
						</span>
					</td>
					<td class="text-muted fs-xs">{fmtDate(bet.placedAt)}</td>
				</tr>
			{:else}
				<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">No bets yet. <a href="/">Place a bet!</a></td></tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="flex justify-between mt-4">
	{#if data.hasPrev}<a href="?page={data.page - 1}" class="btn btn-ghost">← Prev</a>{:else}<span></span>{/if}
	<span class="text-muted fs-sm">Page {data.page}</span>
	{#if data.hasNext}<a href="?page={data.page + 1}" class="btn btn-ghost">Next →</a>{:else}<span></span>{/if}
</div>
