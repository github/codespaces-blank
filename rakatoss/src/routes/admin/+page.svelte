<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { data } = $props<{ data: PageData }>();

	const kpis = [
		{ label: 'Total Users', value: data.kpis.totalUsers.toLocaleString(), icon: '👥' },
		{ label: 'Coins in Circulation', value: Math.floor(data.kpis.coinsInCirculation).toLocaleString() + ' 🪙', icon: '💰' },
		{ label: 'Open Matches', value: data.kpis.openMatches, icon: '🎯' },
		{ label: 'Pending Deposits', value: data.kpis.pendingDeposits, icon: '💳', alert: data.kpis.pendingDeposits > 0 },
		{ label: 'Pending Withdrawals', value: data.kpis.pendingWithdrawals, icon: '💸', alert: data.kpis.pendingWithdrawals > 0 },
		{ label: 'Open Tickets', value: data.kpis.openTickets, icon: '🎫', alert: data.kpis.openTickets > 0 }
	];

	// Chart
	let chartEl: HTMLCanvasElement;
	onMount(async () => {
		if (!browser || !data.dailyBets.length) return;
		try {
			const { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement } = await import('chart.js');
			Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement);
			new Chart(chartEl, {
				type: 'bar',
				data: {
					labels: data.dailyBets.map((d: any) => d.day.slice(5)), // MM-DD
					datasets: [
						{
							label: 'Bets Placed',
							data: data.dailyBets.map((d: any) => d.count),
							backgroundColor: 'rgba(124,58,237,0.7)',
							borderColor: '#7c3aed',
							borderWidth: 1
						},
						{
							label: 'Coins Wagered',
							data: data.dailyBets.map((d: any) => d.total),
							backgroundColor: 'rgba(245,158,11,0.5)',
							borderColor: '#f59e0b',
							borderWidth: 1,
							yAxisID: 'y1'
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { labels: { color: '#94a3b8' } } },
					scales: {
						x: { ticks: { color: '#475569' }, grid: { color: '#1f2d45' } },
						y: { ticks: { color: '#475569' }, grid: { color: '#1f2d45' } },
						y1: { position: 'right', ticks: { color: '#475569' }, grid: { drawOnChartArea: false } }
					}
				}
			});
		} catch {}
	});
</script>

<svelte:head><title>Admin Dashboard — Rakatoss</title></svelte:head>

<h1 style="font-size:1.4rem;font-weight:700;margin-bottom:1.25rem">📊 Dashboard</h1>

<!-- KPI tiles -->
<div class="kpi-grid">
	{#each kpis as kpi}
		<div class="card kpi-card {kpi.alert ? 'kpi-alert' : ''}">
			<div class="kpi-icon">{kpi.icon}</div>
			<div>
				<p class="text-muted fs-xs">{kpi.label}</p>
				<p class="kpi-value {kpi.alert ? 'text-red' : ''}">{kpi.value}</p>
			</div>
		</div>
	{/each}
</div>

<!-- Chart -->
<div class="card mt-4">
	<h3 style="font-size:1rem;font-weight:600;margin-bottom:1rem">Bets (Last 7 Days)</h3>
	{#if data.dailyBets.length}
		<div style="height:260px;position:relative">
			<canvas bind:this={chartEl}></canvas>
		</div>
	{:else}
		<p class="text-muted text-center" style="padding:2rem">No bet data yet.</p>
	{/if}
</div>

<!-- Quick actions -->
<div class="quick-actions mt-4">
	<h3 style="font-size:1rem;font-weight:600;margin-bottom:0.75rem">Quick Actions</h3>
	<div class="flex gap-3 flex-wrap">
		<a href="/admin/matches" class="btn btn-primary">+ New Match</a>
		<a href="/admin/deposits" class="btn btn-ghost">Review Deposits</a>
		<a href="/admin/withdrawals" class="btn btn-ghost">Review Withdrawals</a>
		<a href="/admin/users" class="btn btn-ghost">Manage Users</a>
	</div>
</div>

<style>
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 1rem;
	}
	.kpi-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.kpi-alert {
		border-color: rgba(239,68,68,0.4);
	}
	.kpi-icon { font-size: 1.5rem; }
	.kpi-value { font-size: 1.3rem; font-weight: 700; }
</style>
