<script lang="ts">
	import type { User } from 'lucia';

	let { user, unreadCount = 0 }: { user: User | null; unreadCount?: number } = $props();

	let mobileOpen = $state(false);
</script>

<nav class="navbar">
	<div class="nav-inner">
		<!-- Logo -->
		<a href="/" class="logo">🪙 Rakatoss</a>

		<!-- Desktop links -->
		<div class="nav-links desktop-only">
			<a href="/matches" class="nav-link">Matches</a>
			{#if user}
				<a href="/bets" class="nav-link">My Bets</a>
				<a href="/wallet/deposit" class="nav-link">Deposit</a>
				<a href="/wallet/withdraw" class="nav-link">Withdraw</a>
			{/if}
		</div>

		<!-- Right side -->
		<div class="nav-right">
			{#if user}
				<!-- Notification bell -->
				<a href="/notifications" class="bell-btn" aria-label="Notifications">
					🔔
					{#if unreadCount > 0}
						<span class="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
					{/if}
				</a>

				<!-- User menu -->
				<div class="user-info desktop-only">
					<a href="/profile" class="nav-link user-btn">{user.username}</a>
					<form method="post" action="/auth/logout">
						<button type="submit" class="btn btn-ghost" style="padding: 0.3rem 0.75rem; font-size:0.85rem">Logout</button>
					</form>
				</div>

				{#if user.isStaff}
					<a href="/admin" class="btn btn-primary desktop-only" style="font-size:0.8rem;padding:0.35rem 0.9rem">Admin</a>
				{/if}
			{:else}
				<a href="/auth/login" class="btn btn-ghost desktop-only" style="font-size:0.85rem">Login</a>
				<a href="/auth/register" class="btn btn-primary" style="font-size:0.85rem">Sign Up</a>
			{/if}

			<!-- Mobile hamburger -->
			<button
				class="hamburger mobile-only"
				aria-label="Menu"
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				{mobileOpen ? '✕' : '☰'}
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="mobile-menu" role="menu">
			<a href="/matches" class="mobile-link" onclick={() => (mobileOpen = false)}>Matches</a>
			{#if user}
				<a href="/bets" class="mobile-link" onclick={() => (mobileOpen = false)}>My Bets</a>
				<a href="/wallet/deposit" class="mobile-link" onclick={() => (mobileOpen = false)}>Deposit</a>
				<a href="/wallet/withdraw" class="mobile-link" onclick={() => (mobileOpen = false)}>Withdraw</a>
				<a href="/wallet/history" class="mobile-link" onclick={() => (mobileOpen = false)}>Transactions</a>
				<a href="/notifications" class="mobile-link" onclick={() => (mobileOpen = false)}>Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}</a>
				<a href="/profile" class="mobile-link" onclick={() => (mobileOpen = false)}>Profile</a>
				{#if user.isStaff}
					<a href="/admin" class="mobile-link" onclick={() => (mobileOpen = false)}>⚙️ Admin Panel</a>
				{/if}
				<form method="post" action="/auth/logout">
					<button type="submit" class="mobile-link" style="border:none;background:none;cursor:pointer;color:var(--red)">Logout</button>
				</form>
			{:else}
				<a href="/auth/login" class="mobile-link" onclick={() => (mobileOpen = false)}>Login</a>
				<a href="/auth/register" class="mobile-link" onclick={() => (mobileOpen = false)}>Sign Up</a>
			{/if}
		</div>
	{/if}
</nav>

<style>
	.navbar {
		background: var(--bg-card);
		border-bottom: 1px solid var(--bg-border);
		position: sticky;
		top: 0;
		z-index: 100;
	}
	.nav-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		height: 56px;
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}
	.logo {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--neon-glow);
		text-decoration: none;
		flex-shrink: 0;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex: 1;
	}
	.nav-link {
		color: var(--text-secondary);
		font-size: 0.9rem;
		padding: 0.35rem 0.6rem;
		border-radius: 6px;
		text-decoration: none;
		transition: color 0.15s, background 0.15s;
	}
	.nav-link:hover {
		color: var(--text-primary);
		background: var(--bg-elevated);
		text-decoration: none;
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-left: auto;
	}
	.bell-btn {
		position: relative;
		font-size: 1.15rem;
		text-decoration: none;
		padding: 0.25rem 0.35rem;
		border-radius: 6px;
		transition: background 0.15s;
	}
	.bell-btn:hover { background: var(--bg-elevated); }
	.user-info { display: flex; align-items: center; gap: 0.5rem; }
	.user-btn { font-weight: 600; }

	.hamburger {
		background: none;
		border: 1px solid var(--bg-border);
		border-radius: 6px;
		color: var(--text-primary);
		cursor: pointer;
		font-size: 1.1rem;
		padding: 0.3rem 0.6rem;
	}

	.mobile-menu {
		background: var(--bg-card);
		border-top: 1px solid var(--bg-border);
		padding: 0.5rem 0;
	}
	.mobile-link {
		display: block;
		padding: 0.75rem 1.25rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
		text-decoration: none;
		transition: background 0.15s;
		width: 100%;
		text-align: left;
	}
	.mobile-link:hover {
		background: var(--bg-elevated);
		color: var(--text-primary);
		text-decoration: none;
	}

	.desktop-only { display: flex; }
	.mobile-only  { display: none; }

	@media (max-width: 700px) {
		.desktop-only { display: none !important; }
		.mobile-only  { display: flex !important; }
	}
</style>
