<script lang="ts">
	import type { PageData, ActionData } from './$types';
	let { data, form }: { data: PageData; form: ActionData } = $props();

	let referralLink = $derived(`${data.appUrl}/r/${data.user?.referralCode ?? ''}`);
	let copied = $state(false);
	async function copyLink() {
		await navigator.clipboard.writeText(referralLink);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head><title>Profile — Rakatoss</title></svelte:head>

<h2 style="font-size:1.2rem;font-weight:700;margin-bottom:1.25rem">👤 Profile</h2>

<div class="profile-grid">
	<!-- Info card -->
	<div class="card">
		<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:1rem">Account Info</h3>
		<p class="text-muted fs-xs">Username</p>
		<p style="margin-bottom:0.75rem;font-weight:600">{data.user?.username}</p>
		<p class="text-muted fs-xs">Email</p>
		<p style="margin-bottom:0.75rem">{data.user?.email}</p>
		<p class="text-muted fs-xs">Balance</p>
		<p class="coins" style="font-size:1.3rem">{Math.floor(data.wallet?.balance ?? 0).toLocaleString()} 🪙</p>
	</div>

	<!-- Referral card -->
	<div class="card">
		<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">🎁 Referral Program</h3>
		<p class="text-secondary fs-sm mb-2">Share your link and earn 20 coins for every friend who deposits!</p>
		<p class="text-muted fs-xs mb-1">Your referral code</p>
		<p class="mono" style="font-size:1.1rem;font-weight:700;color:var(--neon-glow);margin-bottom:0.75rem">{data.user?.referralCode}</p>
		<div class="flex gap-2">
			<input class="input" style="flex:1;font-size:0.8rem" value={referralLink} readonly />
			<button class="btn btn-primary" style="flex-shrink:0" onclick={copyLink}>
				{copied ? '✅' : '📋 Copy'}
			</button>
		</div>
		<p class="text-muted fs-xs mt-2">Friends referred: <strong>{data.referralCount}</strong></p>
	</div>

	<!-- Edit profile form -->
	<div class="card" style="grid-column: 1 / -1">
		<h3 style="font-size:0.95rem;font-weight:600;margin-bottom:0.75rem">Edit Profile</h3>
		{#if form?.success}<div class="alert alert-success mb-3">✅ Saved!</div>{/if}
		<form method="post" action="?/update">
			<div class="grid-2">
				<div class="field">
					<label class="label" for="phone">Phone</label>
					<input id="phone" name="phone" type="tel" class="input" value={data.user?.phone ?? ''} placeholder="+91 98765 43210" />
				</div>
				<div class="field">
					<label class="label" for="upiId">Default UPI ID (for withdrawals)</label>
					<input id="upiId" name="upiId" type="text" class="input" value={data.user?.upiId ?? ''} placeholder="yourname@upi" />
				</div>
			</div>
			<button type="submit" class="btn btn-primary mt-2">Save Changes</button>
		</form>
	</div>
</div>

<style>
	.profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.field { margin-bottom: 0.75rem; }
	@media (max-width: 600px) {
		.profile-grid { grid-template-columns: 1fr; }
	}
</style>
