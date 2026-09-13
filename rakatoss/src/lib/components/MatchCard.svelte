<script lang="ts">
	import type { Match } from '$lib/db/schema';

	let { match }: { match: Match } = $props();

	// These could be fetched separately; shown as 0/0 without live data
	let headsTotal = $state(0);
	let tailsTotal = $state(0);

	let total = $derived(headsTotal + tailsTotal);
	let headsPct = $derived(total > 0 ? Math.round((headsTotal / total) * 100) : 50);
	let tailsPct = $derived(100 - headsPct);

	function statusClass(status: string) {
		if (status === 'open') return 'badge-open';
		if (status === 'settled') return 'badge badge-green';
		if (status === 'cancelled') return 'badge badge-red';
		return 'badge badge-gray';
	}

	function statusLabel(status: string) {
		return status.toUpperCase();
	}

	function formatDate(dt: string) {
		return new Date(dt).toLocaleString('en-IN', {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="card match-card">
	<div class="card-top">
		<h3 class="match-title">{match.title}</h3>
		<span class={`badge ${statusClass(match.status)}`}>{statusLabel(match.status)}</span>
	</div>

	{#if match.description}
		<p class="match-desc">{match.description}</p>
	{/if}

	<!-- Pool bar -->
	<div class="pool-row">
		<div class="pool-label">
			<span class="text-heads fs-sm">🟡 HEADS</span>
			<span class="text-tails fs-sm">🔵 TAILS</span>
		</div>
		<div class="pool-bar">
			<div class="pool-bar-heads" style="width:{headsPct}%"></div>
			<div class="pool-bar-tails"></div>
		</div>
		<div class="pool-pct">
			<span class="text-heads mono fs-sm">{headsPct}%</span>
			<span class="text-tails mono fs-sm">{tailsPct}%</span>
		</div>
	</div>

	<div class="card-meta">
		<span class="text-muted fs-xs">Min: <span class="mono">{match.minBet}</span> 🪙</span>
		<span class="text-muted fs-xs">Closes: {formatDate(match.bettingClosesAt)}</span>
	</div>

	<a href="/matches/{match.id}" class="btn btn-primary w-full mt-3" style="justify-content:center">
		Bet Now →
	</a>
</div>

<style>
	.match-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		transition: transform 0.15s, box-shadow 0.15s;
	}
	.match-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
	}
	.card-top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.match-title {
		font-size: 1rem;
		font-weight: 600;
		flex: 1;
	}
	.match-desc {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}
	.pool-row { display: flex; flex-direction: column; gap: 0.25rem; }
	.pool-label { display: flex; justify-content: space-between; }
	.pool-pct   { display: flex; justify-content: space-between; }
	.card-meta  { display: flex; justify-content: space-between; }
</style>
