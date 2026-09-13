<script lang="ts">
	import type { PageData } from './$types';
	import MatchCard from '$lib/components/MatchCard.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Rakatoss — Toss &amp; Win Coins</title>
</svelte:head>

<div class="hero">
	<h1 class="hero-title">🪙 Bet Heads or Tails. Win Big.</h1>
	<p class="hero-sub">Coin-based toss betting — no real money, pure fun and strategy.</p>
	{#if !data.user}
		<div class="hero-cta">
			<a href="/auth/register" class="btn btn-primary" style="font-size:1rem;padding:0.6rem 1.5rem">Play Now →</a>
			<a href="/auth/login" class="btn btn-ghost" style="font-size:1rem;padding:0.6rem 1.5rem">Login</a>
		</div>
	{/if}
</div>

<section class="matches-section">
	<h2 class="section-title">🟢 Live Matches</h2>

	{#if data.matches.length === 0}
		<div class="empty-state card">
			<p>No open matches right now. Check back soon!</p>
		</div>
	{:else}
		<div class="matches-grid">
			{#each data.matches as match (match.id)}
				<MatchCard {match} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.hero {
		text-align: center;
		padding: 3rem 1rem 2rem;
	}
	.hero-title {
		font-size: clamp(1.6rem, 5vw, 2.5rem);
		font-weight: 700;
		color: var(--neon-glow);
		margin-bottom: 0.5rem;
	}
	.hero-sub {
		color: var(--text-secondary);
		font-size: 1.05rem;
		margin-bottom: 1.5rem;
	}
	.hero-cta {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
		flex-wrap: wrap;
	}
	.matches-section {
		margin-top: 1rem;
	}
	.section-title {
		font-size: 1.2rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	.matches-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--text-muted);
	}
</style>
