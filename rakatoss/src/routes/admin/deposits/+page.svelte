<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	function fmtDate(s: string) { return new Date(s).toLocaleString('en-IN', { day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }
</script>

<svelte:head><title>Deposits — Admin</title></svelte:head>

<div class="flex justify-between items-center mb-4">
	<h2 style="font-size:1.2rem;font-weight:700">💰 Deposits</h2>
	<div class="flex gap-2">
		{#each ['submitted','confirmed','rejected','all'] as s}
			<a href="?status={s}" class="btn btn-ghost {data.filterStatus === s ? 'active-filter' : ''}" style="font-size:0.8rem;padding:0.25rem 0.6rem">{s}</a>
		{/each}
	</div>
</div>

{#if form?.success}<div class="alert alert-success mb-3">✅ Done!</div>{/if}
{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}

<div class="table-wrap">
	<table>
		<thead>
			<tr><th>Ref</th><th>User</th><th>₹</th><th>Coins</th><th>Bonus</th><th>UTR</th><th>Status</th><th>Requested</th><th>Actions</th></tr>
		</thead>
		<tbody>
			{#each data.deposits as { deposit, user } (deposit.id)}
				<tr>
					<td class="mono fs-xs">{deposit.ref}</td>
					<td class="fs-sm">{user?.username ?? '?'}</td>
					<td class="mono">₹{deposit.rupeeAmount}</td>
					<td class="mono">{deposit.coins} 🪙</td>
					<td class="mono text-green">{deposit.bonusCoins > 0 ? '+' + deposit.bonusCoins : '—'}</td>
					<td class="mono fs-xs">{deposit.upiRef ?? '—'}</td>
					<td>
						<span class="badge {deposit.status === 'confirmed' ? 'badge-green' : deposit.status === 'rejected' ? 'badge-red' : deposit.status === 'submitted' ? 'badge-yellow' : 'badge-gray'}">
							{deposit.status}
						</span>
					</td>
					<td class="text-muted fs-xs">{fmtDate(deposit.requestedAt)}</td>
					<td>
						{#if deposit.status === 'submitted'}
							<div class="flex gap-2">
								<form method="post" action="?/confirm">
									<input type="hidden" name="depositId" value={deposit.id} />
									<button type="submit" class="btn btn-success" style="padding:0.2rem 0.6rem;font-size:0.8rem">✅ Confirm</button>
								</form>
								<form method="post" action="?/reject">
									<input type="hidden" name="depositId" value={deposit.id} />
									<button type="submit" class="btn btn-danger" style="padding:0.2rem 0.6rem;font-size:0.8rem">❌ Reject</button>
								</form>
							</div>
						{:else}
							<span class="text-muted fs-xs">—</span>
						{/if}
					</td>
				</tr>
			{:else}
				<tr><td colspan="9" class="text-center text-muted" style="padding:2rem">No deposits with status: {data.filterStatus}</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.active-filter { border-color: var(--neon); color: var(--neon-glow); }
</style>
