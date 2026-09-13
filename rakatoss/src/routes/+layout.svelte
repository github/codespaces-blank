<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data, children } = $props<{ data: LayoutData; children: () => any }>();
</script>

<Navbar user={data.user} unreadCount={data.unreadCount} />

<main class="main-content">
	{@render children()}
</main>

<style>
	.main-content {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1.5rem 1rem 4rem;
	}
</style>
