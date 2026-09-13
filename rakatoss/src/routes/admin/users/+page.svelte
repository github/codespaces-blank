<script lang="ts">
	import type { PageData } from './$types';
	let { data } = $props<{ data: PageData }>();
	let q = $state(data.q);
</script>

<svelte:head><title>Users — Admin</title></svelte:head>

<div class="flex justify-between items-center mb-4">
	<h2 style="font-size:1.2rem;font-weight:700">👥 Users</h2>
</div>

<form class="flex gap-2 mb-4">
	<input name="q" type="text" class="input" style="max-width:300px" placeholder="Search username..." bind:value={q} />
	<button type="submit" class="btn btn-primary">Search</button>
	{#if data.q}<a href="/admin/users" class="btn btn-ghost">Clear</a>{/if}
</form>

<div class="table-wrap">
	<table>
		<thead>
			<tr><th>Username</th><th>Email</th><th>Balance</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
		</thead>
		<tbody>
			{#each data.users as { user, wallet } (user.id)}
				<tr>
					<td><a href="/admin/users/{user.id}" class="text-neon">{user.username}</a></td>
					<td class="text-muted fs-sm">{user.email}</td>
					<td class="mono">{Math.floor(wallet?.balance ?? 0).toLocaleString()} 🪙</td>
					<td>
						{#if !user.isActive}
							<span class="badge badge-red">Blocked</span>
						{:else if user.emailVerified}
							<span class="badge badge-green">Active</span>
						{:else}
							<span class="badge badge-gray">Unverified</span>
						{/if}
						{#if user.isStaff}<span class="badge badge-purple" style="margin-left:4px">Staff</span>{/if}
					</td>
					<td class="text-muted fs-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
					<td><a href="/admin/users/{user.id}" class="btn btn-ghost" style="padding:0.2rem 0.6rem;font-size:0.8rem">View →</a></td>
				</tr>
			{:else}
				<tr><td colspan="6" class="text-center text-muted" style="padding:2rem">No users found.</td></tr>
			{/each}
		</tbody>
	</table>
</div>
