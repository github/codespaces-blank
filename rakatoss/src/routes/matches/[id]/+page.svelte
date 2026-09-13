<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { onMount, onDestroy } from 'svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let selectedSide = $state<'heads' | 'tails' | null>(null);
	let betAmount = $state(data.match.minBet);

	// SSE pool data
	let pool = $state(data.pool);
	let es: EventSource | null = null;

	let total = $derived(pool.heads + pool.tails);
	let headsPct = $derived(total > 0 ? Math.round((pool.heads / total) * 100) : 50);
	let tailsPct = $derived(100 - headsPct);

	onMount(() => {
		if (data.match.status === 'open') {
			es = new EventSource(`/api/matches/${data.match.id}/stream`);
			es.onmessage = (e) => {
				try { pool = JSON.parse(e.data); } catch {}
			};
		}
	});

	onDestroy(() => { es?.close(); });

	function formatDate(dt: string) {
		return new Date(dt).toLocaleString('en-IN', {
			day: '2-digit', month: 'short', year: 'numeric',
			hour: '2-digit', minute: '2-digit'
		});
	}

	function statusBadge(s: string) {
		if (s === 'open') return 'badge-open';
		if (s === 'settled') return 'badge badge-green';
		if (s === 'cancelled') return 'badge badge-red';
		if (s === 'locked') return 'badge badge-yellow';
		return 'badge badge-gray';
	}
</script>

<svelte:head><title>{data.match.title} — Rakatoss</title></svelte:head>

<div class="match-wrap">
	<!-- Header -->
	<div class="match-header">
		<div>
			<a href="/" class="text-muted fs-sm">← Back to Lobby</a>
			<h1 class="match-title">{data.match.title}</h1>
			{#if data.match.description}
				<p class="text-secondary mt-1">{data.match.description}</p>
			{/if}
		</div>
		<span class={`badge ${statusBadge(data.match.status)}`}>{data.match.status.toUpperCase()}</span>
	</div>

	<div class="match-body">
		<!-- Pool section -->
		<div class="card pool-card">
			<h3 class="card-heading">Live Pool</h3>
			<div class="pool-totals">
				<div class="pool-side heads">
					<span class="side-label">🟡 HEADS</span>
					<span class="side-amount coins">{Math.floor(pool.heads).toLocaleString()} 🪙</span>
				</div>
				<div class="pool-center">
					<span class="text-muted fs-sm">Total</span>
					<span class="mono" style="color:var(--text-primary);font-size:1.1rem">{Math.floor(total).toLocaleString()} 🪙</span>
				</div>
				<div class="pool-side tails" style="text-align:right">
					<span class="side-label">🔵 TAILS</span>
					<span class="side-amount coins" style="color:var(--tails)">{Math.floor(pool.tails).toLocaleString()} 🪙</span>
				</div>
			</div>
			<div class="pool-bar mt-3">
				<div class="pool-bar-heads" style="width:{headsPct}%"></div>
				<div class="pool-bar-tails"></div>
			</div>
			<div class="pool-pct mt-1">
				<span class="text-heads mono fs-sm">{headsPct}%</span>
				<span class="text-tails mono fs-sm">{tailsPct}%</span>
			</div>
		</div>

		<!-- Bet form or status -->
		{#if data.match.status === 'open' && !data.userBet}
			{#if data.user}
				<div class="card bet-card">
					<h3 class="card-heading">Place Your Bet</h3>
					<p class="text-secondary fs-sm mb-3">Balance: <span class="coins">{Math.floor(data.walletBalance).toLocaleString()} 🪙</span></p>

					{#if form?.error}
						<div class="alert alert-error mb-3">{form.error}</div>
					{/if}

					<form method="post" action="?/bet">
						<!-- Side selection -->
						<div class="side-grid mb-4">
							<button
								type="button"
								class="side-btn btn-heads {selectedSide === 'heads' ? 'selected' : ''}"
								onclick={() => (selectedSide = 'heads')}
							>
								🟡 HEADS
							</button>
							<button
								type="button"
								class="side-btn btn-tails {selectedSide === 'tails' ? 'selected' : ''}"
								onclick={() => (selectedSide = 'tails')}
							>
								🔵 TAILS
							</button>
						</div>
						<input type="hidden" name="side" value={selectedSide ?? ''} />

						<div class="field mb-3">
							<label class="label" for="amount">Bet Amount (coins)</label>
							<input
								id="amount" name="amount" type="number"
								class="input" bind:value={betAmount}
								min={data.match.minBet} max={Math.min(data.match.maxBet, data.walletBalance)}
								step="1" required
							/>
							<div class="quick-bets">
								{#each [data.match.minBet, 50, 100, 500] as q}
									{#if q <= data.walletBalance && q >= data.match.minBet && q <= data.match.maxBet}
										<button type="button" class="q-btn" onclick={() => (betAmount = q)}>{q}</button>
									{/if}
								{/each}
								<button type="button" class="q-btn" onclick={() => (betAmount = Math.min(data.match.maxBet, data.walletBalance))}>MAX</button>
							</div>
						</div>

						<button
							type="submit"
							class="btn btn-primary w-full"
							style="justify-content:center;font-size:1rem;padding:0.75rem"
							disabled={!selectedSide}
						>
							🎯 Place Bet
						</button>

						<p class="text-muted fs-xs mt-2 text-center">
							Min {data.match.minBet} — Max {data.match.maxBet} coins · House edge {data.match.houseEdge}%
						</p>
					</form>
				</div>
			{:else}
				<div class="card bet-card text-center">
					<p class="mb-3 text-secondary">Login to place your bet</p>
					<a href="/auth/login?next=/matches/{data.match.id}" class="btn btn-primary">Login to Bet</a>
				</div>
			{/if}
		{:else if data.userBet}
			<div class="card bet-card">
				<h3 class="card-heading">Your Bet</h3>
				<div class="bet-summary">
					<div>
						<p class="text-muted fs-sm">Side</p>
						<span class="badge {data.userBet.side === 'heads' ? 'badge-yellow' : 'badge-blue'}" style="font-size:0.9rem;padding:4px 12px">
							{data.userBet.side === 'heads' ? '🟡 HEADS' : '🔵 TAILS'}
						</span>
					</div>
					<div>
						<p class="text-muted fs-sm">Amount</p>
						<span class="coins">{data.userBet.amount.toLocaleString()} 🪙</span>
					</div>
					<div>
						<p class="text-muted fs-sm">Status</p>
						<span class="badge {data.userBet.status === 'won' ? 'badge-green' : data.userBet.status === 'lost' ? 'badge-red' : 'badge-gray'}">
							{data.userBet.status.toUpperCase()}
						</span>
					</div>
					{#if data.userBet.payout}
						<div>
							<p class="text-muted fs-sm">Payout</p>
							<span class="coins text-green">{Math.floor(data.userBet.payout).toLocaleString()} 🪙</span>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="card bet-card text-center">
				<p class="text-muted">Betting is {data.match.status} for this match.</p>
				{#if data.match.winningSide}
					<p class="mt-2">Winner: <strong class={data.match.winningSide === 'heads' ? 'text-heads' : 'text-tails'}>
						{data.match.winningSide === 'heads' ? '🟡 HEADS' : '🔵 TAILS'}
					</strong></p>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Match info -->
	<div class="match-meta card mt-3">
		<div class="meta-grid">
			<div><span class="text-muted fs-xs">Closes</span><p class="fs-sm">{formatDate(data.match.bettingClosesAt)}</p></div>
			<div><span class="text-muted fs-xs">Min Bet</span><p class="fs-sm mono">{data.match.minBet} 🪙</p></div>
			<div><span class="text-muted fs-xs">Max Bet</span><p class="fs-sm mono">{data.match.maxBet} 🪙</p></div>
			<div><span class="text-muted fs-xs">House Edge</span><p class="fs-sm">{data.match.houseEdge}%</p></div>
		</div>
	</div>
</div>

<style>
	.match-wrap { max-width: 720px; margin: 0 auto; }
	.match-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}
	.match-title { font-size: 1.4rem; font-weight: 700; margin-top: 0.25rem; }
	.match-body { display: flex; flex-direction: column; gap: 1rem; }
	.card-heading { font-size: 1rem; font-weight: 600; margin-bottom: 0.75rem; }

	.pool-card {}
	.pool-totals { display: flex; justify-content: space-between; align-items: center; }
	.pool-side { display: flex; flex-direction: column; gap: 0.25rem; }
	.pool-center { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
	.side-label { font-size: 0.85rem; font-weight: 600; }
	.side-amount { font-size: 1.1rem; }
	.pool-pct { display: flex; justify-content: space-between; }

	.side-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
	.side-btn {
		padding: 1rem;
		border-radius: 10px;
		font-size: 1rem;
		font-weight: 700;
		border: 2px solid transparent;
		cursor: pointer;
		transition: box-shadow 0.2s, border-color 0.2s;
	}

	.quick-bets {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}
	.q-btn {
		background: var(--bg-elevated);
		border: 1px solid var(--bg-border);
		border-radius: 6px;
		color: var(--text-secondary);
		cursor: pointer;
		font-size: 0.8rem;
		padding: 0.25rem 0.6rem;
		transition: background 0.15s;
	}
	.q-btn:hover { background: var(--neon-dim); color: var(--neon-glow); }

	.bet-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; }
	.meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; }

	@media (max-width: 500px) {
		.meta-grid { grid-template-columns: 1fr 1fr; }
		.match-header { flex-direction: column; }
	}
</style>
