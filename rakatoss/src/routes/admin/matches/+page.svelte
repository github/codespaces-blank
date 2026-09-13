<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let showForm = $state(false);
	function fmtDate(s: string) { return new Date(s).toLocaleString('en-IN', { day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }
</script>

<svelte:head><title>Matches — Admin</title></svelte:head>

<div class="flex justify-between items-center mb-4">
	<h2 style="font-size:1.2rem;font-weight:700">🎯 Matches</h2>
	<button class="btn btn-primary" onclick={() => (showForm = !showForm)}>
		{showForm ? '✕ Cancel' : '+ New Match'}
	</button>
</div>

{#if showForm}
	<div class="card mb-4">
		<h3 style="font-size:1rem;font-weight:600;margin-bottom:1rem">Create Match</h3>
		{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}
		{#if form?.created}<div class="alert alert-success mb-3">✅ Match created!</div>{/if}

		<form method="post" action="?/create">
			<div class="grid-2">
				<div class="field">
					<label class="label">Title</label>
					<input name="title" type="text" class="input" required placeholder="IPL Final Toss" />
				</div>
				<div class="field">
					<label class="label">Description</label>
					<input name="description" type="text" class="input" placeholder="Optional" />
				</div>
				<div class="field">
					<label class="label">Min Bet (coins)</label>
					<input name="minBet" type="number" class="input" value="10" min="1" required />
				</div>
				<div class="field">
					<label class="label">Max Bet (coins)</label>
					<input name="maxBet" type="number" class="input" value="5000" min="1" required />
				</div>
				<div class="field">
					<label class="label">House Edge (%)</label>
					<input name="houseEdge" type="number" class="input" value="5" min="0" max="50" step="0.1" required />
				</div>
				<div class="field">
					<label class="label">Starts At</label>
					<input name="startsAt" type="datetime-local" class="input" required />
				</div>
				<div class="field" style="grid-column:1/-1">
					<label class="label">Betting Closes At</label>
					<input name="bettingClosesAt" type="datetime-local" class="input" required />
				</div>
			</div>
			<button type="submit" class="btn btn-primary mt-3">Create Match</button>
		</form>
	</div>
{/if}

<div class="table-wrap">
	<table>
		<thead>
			<tr><th>Title</th><th>Status</th><th>Min/Max</th><th>Closes</th><th>Actions</th></tr>
		</thead>
		<tbody>
			{#each data.matches as match (match.id)}
				<tr>
					<td><a href="/admin/matches/{match.id}" class="text-neon">{match.title}</a></td>
					<td>
						<span class="badge {match.status === 'open' ? 'badge-open' : match.status === 'settled' ? 'badge-green' : match.status === 'cancelled' ? 'badge-red' : match.status === 'locked' ? 'badge-yellow' : 'badge-gray'}">
							{match.status}
						</span>
					</td>
					<td class="mono fs-sm">{match.minBet} / {match.maxBet}</td>
					<td class="text-muted fs-xs">{fmtDate(match.bettingClosesAt)}</td>
					<td><a href="/admin/matches/{match.id}" class="btn btn-ghost" style="padding:0.25rem 0.6rem;font-size:0.8rem">Manage →</a></td>
				</tr>
			{:else}
				<tr><td colspan="5" class="text-center text-muted" style="padding:2rem">No matches yet.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.field { margin-bottom: 0.75rem; }
</style>
