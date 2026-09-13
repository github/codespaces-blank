<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();
	function fmtDate(s: string) { return new Date(s).toLocaleString('en-IN', { day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}); }
	const kindIcon = { success: '✅', warning: '⚠️', system: '🔔', info: 'ℹ️' };
</script>

<svelte:head><title>Notifications — Rakatoss</title></svelte:head>

<div class="flex justify-between items-center mb-4">
	<h2 style="font-size:1.2rem;font-weight:700">🔔 Notifications</h2>
	<form method="post" action="?/mark_all_read">
		<button type="submit" class="btn btn-ghost" style="font-size:0.85rem">Mark all read</button>
	</form>
</div>

<div class="notif-list">
	{#each data.notifications as n (n.id)}
		<div class="notif-item {n.isRead ? '' : 'unread'}">
			<div class="notif-icon">{kindIcon[n.kind] ?? 'ℹ️'}</div>
			<div class="notif-body">
				<p style="font-weight:{n.isRead ? '400' : '600'}">{n.title}</p>
				<p class="text-secondary fs-sm">{n.body}</p>
				<p class="text-muted fs-xs mt-1">{fmtDate(n.createdAt)}</p>
			</div>
			{#if n.link}
				<a href={n.link} class="btn btn-ghost" style="font-size:0.8rem;padding:0.2rem 0.6rem;flex-shrink:0">View</a>
			{/if}
		</div>
	{:else}
		<div class="card text-center" style="padding:3rem">
			<p class="text-muted">No notifications yet.</p>
		</div>
	{/each}
</div>

<style>
	.notif-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.notif-item {
		display: flex; align-items: flex-start; gap: 0.75rem;
		background: var(--bg-card); border: 1px solid var(--bg-border);
		border-radius: 10px; padding: 0.875rem 1rem;
	}
	.notif-item.unread { border-color: rgba(124,58,237,0.3); background: var(--bg-elevated); }
	.notif-icon { font-size: 1.2rem; flex-shrink: 0; }
	.notif-body { flex: 1; min-width: 0; }
</style>
