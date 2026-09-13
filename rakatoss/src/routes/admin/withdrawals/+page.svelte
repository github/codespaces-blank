<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	let payingId = $state<string | null>(null);
	let rejectId = $state<string | null>(null);
	function fmtDate(s: string) { return new Date(s).toLocaleString('en-IN', { day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }
</script>

<svelte:head><title>Withdrawals — Admin</title></svelte:head>

<div class="flex justify-between items-center mb-4">
	<h2 style="font-size:1.2rem;font-weight:700">💸 Withdrawals</h2>
	<div class="flex gap-2">
		{#each ['pending','approved','paid','rejected','all'] as s}
			<a href="?status={s}" class="btn btn-ghost {data.filterStatus === s ? 'active-filter' : ''}" style="font-size:0.8rem;padding:0.25rem 0.5rem">{s}</a>
		{/each}
	</div>
</div>

{#if form?.success}<div class="alert alert-success mb-3">✅ Done!</div>{/if}
{#if form?.error}<div class="alert alert-error mb-3">{form.error}</div>{/if}

<div class="table-wrap">
	<table>
		<thead>
			<tr><th>Ref</th><th>User</th><th>Coins</th><th>₹</th><th>UPI</th><th>Status</th><th>Requested</th><th>Actions</th></tr>
		</thead>
		<tbody>
			{#each data.withdrawals as { wd, user } (wd.id)}
				<tr>
					<td class="mono fs-xs">{wd.ref}</td>
					<td class="fs-sm">{user?.username ?? '?'}</td>
					<td class="mono">{wd.coins} 🪙</td>
					<td class="mono">₹{wd.rupeeAmount}</td>
					<td class="text-muted fs-xs">{wd.upiId}</td>
					<td>
						<span class="badge {wd.status === 'paid' ? 'badge-green' : wd.status === 'approved' ? 'badge-blue' : wd.status === 'rejected' ? 'badge-red' : 'badge-gray'}">
							{wd.status}
						</span>
					</td>
					<td class="text-muted fs-xs">{fmtDate(wd.requestedAt)}</td>
					<td>
						{#if wd.status === 'pending'}
							<div class="flex gap-1">
								<form method="post" action="?/approve">
									<input type="hidden" name="wdId" value={wd.id} />
									<button type="submit" class="btn btn-success" style="padding:0.2rem 0.5rem;font-size:0.75rem">Approve</button>
								</form>
								<button class="btn btn-danger" style="padding:0.2rem 0.5rem;font-size:0.75rem" onclick={() => (rejectId = wd.id)}>Reject</button>
							</div>
						{:else if wd.status === 'approved'}
							<button class="btn btn-primary" style="padding:0.2rem 0.5rem;font-size:0.75rem" onclick={() => (payingId = wd.id)}>Mark Paid</button>
						{:else}
							<span class="text-muted fs-xs">{wd.upiRefPaid ?? '—'}</span>
						{/if}
					</td>
				</tr>
			{:else}
				<tr><td colspan="8" class="text-center text-muted" style="padding:2rem">No withdrawals.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Mark Paid modal -->
{#if payingId}
	<div class="modal-overlay">
		<div class="modal card">
			<h3 style="margin-bottom:0.75rem">Mark as Paid</h3>
			<form method="post" action="?/mark_paid">
				<input type="hidden" name="wdId" value={payingId} />
				<div class="field mb-3">
					<label class="label">UTR (payment reference)</label>
					<input name="upiRefPaid" type="text" class="input" placeholder="e.g. 123456789012" />
				</div>
				<div class="flex gap-2">
					<button type="submit" class="btn btn-success">Confirm Paid</button>
					<button type="button" class="btn btn-ghost" onclick={() => (payingId = null)}>Cancel</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Reject modal -->
{#if rejectId}
	<div class="modal-overlay">
		<div class="modal card">
			<h3 style="margin-bottom:0.75rem">Reject Withdrawal</h3>
			<form method="post" action="?/reject">
				<input type="hidden" name="wdId" value={rejectId} />
				<div class="field mb-3">
					<label class="label">Reason (optional)</label>
					<input name="adminNote" type="text" class="input" placeholder="Reason for rejection" />
				</div>
				<div class="flex gap-2">
					<button type="submit" class="btn btn-danger">Reject & Refund</button>
					<button type="button" class="btn btn-ghost" onclick={() => (rejectId = null)}>Cancel</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.active-filter { border-color: var(--neon); color: var(--neon-glow); }
	.field { margin-bottom: 0.75rem; }
	.modal-overlay {
		position: fixed; inset: 0;
		background: rgba(0,0,0,0.7); z-index: 200;
		display: flex; align-items: center; justify-content: center; padding: 1rem;
	}
	.modal { width: 100%; max-width: 400px; }
</style>
