<script lang="ts">
	import type { LayoutData } from './$types';
	import AdminSidebar from '$lib/components/AdminSidebar.svelte';

	let { data, children } = $props<{ data: LayoutData; children: () => any }>();

	let sidebarOpen = $state(false);
</script>

<div class="admin-shell">
	<!-- Mobile header -->
	<header class="mobile-header">
		<button class="hamburger-btn" onclick={() => (sidebarOpen = !sidebarOpen)} aria-label="Menu">
			{sidebarOpen ? '✕' : '☰'}
		</button>
		<span class="admin-logo">⚙️ Rakatoss Admin</span>
	</header>

	<!-- Sidebar overlay (mobile) -->
	{#if sidebarOpen}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="overlay" onclick={() => (sidebarOpen = false)}></div>
	{/if}

	<AdminSidebar
		user={data.adminUser}
		roles={data.roles}
		isOpen={sidebarOpen}
		onClose={() => (sidebarOpen = false)}
	/>

	<main class="admin-content">
		{@render children()}
	</main>
</div>

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
		background: var(--bg-base);
	}
	.admin-content {
		flex: 1;
		padding: 1.5rem;
		overflow-x: hidden;
		min-width: 0;
	}
	.mobile-header {
		display: none;
		align-items: center;
		gap: 0.75rem;
		background: var(--bg-card);
		border-bottom: 1px solid var(--bg-border);
		padding: 0.75rem 1rem;
		position: sticky;
		top: 0;
		z-index: 90;
	}
	.admin-logo { font-size: 1rem; font-weight: 700; color: var(--neon-glow); }
	.hamburger-btn {
		background: none; border: 1px solid var(--bg-border);
		border-radius: 6px; color: var(--text-primary);
		cursor: pointer; font-size: 1rem; padding: 0.3rem 0.6rem;
	}
	.overlay {
		position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99;
	}
	@media (max-width: 768px) {
		.mobile-header { display: flex; }
		.admin-content { padding: 1rem; }
	}
</style>
