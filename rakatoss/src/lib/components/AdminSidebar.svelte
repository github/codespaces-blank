<script lang="ts">
	import type { User } from 'lucia';
	import type { AdminRoles } from '$lib/db/schema';
	import { page } from '$app/stores';

	let {
		user,
		roles,
		isOpen,
		onClose
	}: {
		user: User;
		roles: AdminRoles | null;
		isOpen: boolean;
		onClose: () => void;
	} = $props();

	function can(perm: keyof AdminRoles): boolean {
		if (user.isSuperadmin) return true;
		return roles?.[perm] === true;
	}

	function isActive(path: string) {
		return $page.url.pathname.startsWith(path);
	}
</script>

<aside class="sidebar {isOpen ? 'open' : ''}">
	<div class="sidebar-header">
		<a href="/admin" class="sidebar-logo" onclick={onClose}>⚙️ Admin Panel</a>
	</div>

	<nav class="sidebar-nav">
		<a
			href="/admin"
			class="nav-item {$page.url.pathname === '/admin' ? 'active' : ''}"
			onclick={onClose}
		>
			📊 Dashboard
		</a>

		{#if can('manageMatches')}
			<a
				href="/admin/matches"
				class="nav-item {isActive('/admin/matches') ? 'active' : ''}"
				onclick={onClose}
			>
				🎯 Matches
			</a>
		{/if}

		{#if can('manageDeposits')}
			<a
				href="/admin/deposits"
				class="nav-item {isActive('/admin/deposits') ? 'active' : ''}"
				onclick={onClose}
			>
				💰 Deposits
			</a>
		{/if}

		{#if can('manageWithdrawals')}
			<a
				href="/admin/withdrawals"
				class="nav-item {isActive('/admin/withdrawals') ? 'active' : ''}"
				onclick={onClose}
			>
				💸 Withdrawals
			</a>
		{/if}

		{#if can('manageUsers')}
			<a
				href="/admin/users"
				class="nav-item {isActive('/admin/users') ? 'active' : ''}"
				onclick={onClose}
			>
				👥 Users
			</a>
		{/if}

		{#if can('manageTickets')}
			<a
				href="/admin/support"
				class="nav-item {isActive('/admin/support') ? 'active' : ''}"
				onclick={onClose}
			>
				🎫 Support
			</a>
		{/if}

		{#if user.isSuperadmin}
			<div class="nav-divider"></div>
			<a
				href="/admin/settings"
				class="nav-item {isActive('/admin/settings') ? 'active' : ''}"
				onclick={onClose}
			>
				🔧 Settings
			</a>
		{/if}

		<div class="nav-divider"></div>
		<a href="/" class="nav-item" onclick={onClose}>← Back to Site</a>
		<form method="post" action="/auth/logout">
			<button type="submit" class="nav-item nav-logout">Logout</button>
		</form>
	</nav>

	<div class="sidebar-user">
		<p class="text-muted fs-xs">Logged in as</p>
		<p class="fs-sm" style="font-weight:600">{user.username}</p>
		{#if user.isSuperadmin}
			<span class="badge badge-purple" style="font-size:0.7rem;margin-top:0.25rem">Superadmin</span>
		{/if}
	</div>
</aside>

<style>
	.sidebar {
		width: 240px;
		min-height: 100vh;
		background: var(--bg-card);
		border-right: 1px solid var(--bg-border);
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		position: relative;
	}
	.sidebar-header {
		padding: 1.25rem 1rem 0.75rem;
		border-bottom: 1px solid var(--bg-border);
	}
	.sidebar-logo {
		font-size: 1rem;
		font-weight: 700;
		color: var(--neon-glow);
		text-decoration: none;
	}
	.sidebar-nav {
		flex: 1;
		padding: 0.75rem 0;
		display: flex;
		flex-direction: column;
	}
	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem 1rem;
		color: var(--text-secondary);
		font-size: 0.9rem;
		text-decoration: none;
		border-left: 3px solid transparent;
		transition: background 0.15s, color 0.15s, border-color 0.15s;
		cursor: pointer;
		background: none;
		border-top: none;
		border-right: none;
		border-bottom: none;
		width: 100%;
		text-align: left;
	}
	.nav-item:hover {
		background: var(--neon-dim);
		color: var(--text-primary);
	}
	.nav-item.active {
		background: var(--neon-dim);
		color: var(--neon-glow);
		border-left-color: var(--neon-glow);
		font-weight: 600;
	}
	.nav-divider {
		height: 1px;
		background: var(--bg-border);
		margin: 0.5rem 1rem;
	}
	.nav-logout { color: var(--red); }
	.nav-logout:hover { background: rgba(239,68,68,0.1); }

	.sidebar-user {
		padding: 1rem;
		border-top: 1px solid var(--bg-border);
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			left: 0;
			top: 0;
			bottom: 0;
			z-index: 100;
			transform: translateX(-100%);
			transition: transform 0.25s ease;
			width: 280px;
		}
		.sidebar.open {
			transform: translateX(0);
		}
	}
</style>
