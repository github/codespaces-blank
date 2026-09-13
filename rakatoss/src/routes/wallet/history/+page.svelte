<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();

	function fmtDate(s: string) {
		return new Date(s).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
	}
</script>

<svelte:head><title>Transaction History — Rakatoss</title></svelte:head>

<div class="flex justify-between items-center mb-4">
	<h2 style="font-size:1.2rem;font-weight:700">📊 Transaction History</h2>
	<span class="coins">{Math.floor(data.balance).toLocaleString()} 🪙</span>
</div>

<div class="table-wrap">
	<table>
		<thead>
			<tr>
				<th>Type</th>
				<th>Amount</th>
				<th>Balance After</th>
				<th>Description</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{#each data.transactions as tx (tx.id)}
				<tr>
					<td>
						{#if tx.kind === 'credit'}
							<span class="badge badge-green">+ Credit</span>
						{:else}
							<span class="badge badge-red">- Debit</span>
						{/if}
					</td>
					<td class="mono">{Math.floor(tx.amount).toLocaleString()} 🪙</td>
					<td class="mono">{Math.floor(tx.balanceAfter).toLocaleString()} 🪙</td>
					<td class="text-secondary fs-sm truncate" style="max-width:200px">{tx.description}</td>
					<td class="text-muted fs-xs">{fmtDate(tx.createdAt)}</td>
				</tr>
			{:else}
				<tr><td colspan="5" class="text-center text-muted" style="padding:2rem">No transactions yet.</td></tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="flex justify-between mt-4">
	{#if data.hasPrev}
		<a href="?page={data.page - 1}" class="btn btn-ghost">← Prev</a>
	{:else}
		<span></span>
	{/if}
	<span class="text-muted fs-sm">Page {data.page}</span>
	{#if data.hasNext}
		<a href="?page={data.page + 1}" class="btn btn-ghost">Next →</a>
	{:else}
		<span></span>
	{/if}
</div>
