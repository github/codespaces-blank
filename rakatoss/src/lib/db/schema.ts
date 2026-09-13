import { sql } from 'drizzle-orm';
import {
	integer,
	real,
	sqliteTable,
	text,
	uniqueIndex,
	index
} from 'drizzle-orm/sqlite-core';

// ── Users ────────────────────────────────────────────────────────────────────
export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	phone: text('phone'),
	upiId: text('upi_id'),
	isStaff: integer('is_staff', { mode: 'boolean' }).notNull().default(false),
	isSuperadmin: integer('is_superadmin', { mode: 'boolean' }).notNull().default(false),
	isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	referralCode: text('referral_code').notNull().unique(),
	referredBy: text('referred_by').references((): ReturnType<typeof users._.column.id.getSQL> => users.id),
	totpSecret: text('totp_secret'), // AES-256 encrypted
	createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
});

// ── Sessions (Lucia) ─────────────────────────────────────────────────────────
export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull(),
	isTwoFactorVerified: integer('is_two_factor_verified', { mode: 'boolean' })
		.notNull()
		.default(false)
});

// ── Email Verifications ───────────────────────────────────────────────────────
export const emailVerifications = sqliteTable('email_verifications', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	token: text('token').notNull().unique(),
	expiresAt: text('expires_at').notNull(),
	usedAt: text('used_at')
});

// ── Password Resets ───────────────────────────────────────────────────────────
export const passwordResets = sqliteTable('password_resets', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	token: text('token').notNull().unique(),
	expiresAt: text('expires_at').notNull(),
	usedAt: text('used_at')
});

// ── Admin Roles ───────────────────────────────────────────────────────────────
export const adminRoles = sqliteTable('admin_roles', {
	userId: text('user_id')
		.primaryKey()
		.references(() => users.id),
	manageMatches: integer('manage_matches', { mode: 'boolean' }).notNull().default(false),
	manageDeposits: integer('manage_deposits', { mode: 'boolean' }).notNull().default(false),
	manageWithdrawals: integer('manage_withdrawals', { mode: 'boolean' }).notNull().default(false),
	manageUsers: integer('manage_users', { mode: 'boolean' }).notNull().default(false),
	viewReports: integer('view_reports', { mode: 'boolean' }).notNull().default(false),
	manageTickets: integer('manage_tickets', { mode: 'boolean' }).notNull().default(false)
});

// ── Wallets ───────────────────────────────────────────────────────────────────
export const wallets = sqliteTable('wallets', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => users.id),
	balance: real('balance').notNull().default(0),
	totalDeposited: real('total_deposited').notNull().default(0),
	totalWithdrawn: real('total_withdrawn').notNull().default(0),
	updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
});

// ── Bonus Tiers ───────────────────────────────────────────────────────────────
export const bonusTiers = sqliteTable('bonus_tiers', {
	id: text('id').primaryKey(),
	minDeposit: real('min_deposit').notNull(),
	maxDeposit: real('max_deposit').notNull(),
	bonusCoins: real('bonus_coins').notNull()
});

// ── Referrals ─────────────────────────────────────────────────────────────────
export const referrals = sqliteTable(
	'referrals',
	{
		id: text('id').primaryKey(),
		referrerId: text('referrer_id')
			.notNull()
			.references(() => users.id),
		referredId: text('referred_id')
			.notNull()
			.unique()
			.references(() => users.id),
		bonusPaid: integer('bonus_paid', { mode: 'boolean' }).notNull().default(false),
		createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
	},
	(t) => [index('referrals_referrer_idx').on(t.referrerId)]
);

// ── Matches ───────────────────────────────────────────────────────────────────
export const matches = sqliteTable('matches', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	minBet: real('min_bet').notNull().default(10),
	maxBet: real('max_bet').notNull().default(5000),
	houseEdge: real('house_edge').notNull().default(5), // percent
	status: text('status', { enum: ['pending', 'open', 'locked', 'settled', 'cancelled'] })
		.notNull()
		.default('pending'),
	winningSide: text('winning_side', { enum: ['heads', 'tails'] }),
	createdBy: text('created_by')
		.notNull()
		.references(() => users.id),
	startsAt: text('starts_at').notNull(),
	bettingClosesAt: text('betting_closes_at').notNull(),
	settledAt: text('settled_at'),
	createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
});

// ── Bets ──────────────────────────────────────────────────────────────────────
export const bets = sqliteTable(
	'bets',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		matchId: text('match_id')
			.notNull()
			.references(() => matches.id),
		side: text('side', { enum: ['heads', 'tails'] }).notNull(),
		amount: real('amount').notNull(),
		payout: real('payout'),
		status: text('status', { enum: ['pending', 'won', 'lost', 'refunded'] })
			.notNull()
			.default('pending'),
		placedAt: text('placed_at').notNull().default(sql`(datetime('now'))`)
	},
	(t) => [uniqueIndex('bets_user_match_unique').on(t.userId, t.matchId)]
);

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactions = sqliteTable(
	'transactions',
	{
		id: text('id').primaryKey(),
		walletId: text('wallet_id')
			.notNull()
			.references(() => wallets.id),
		kind: text('kind', { enum: ['credit', 'debit'] }).notNull(),
		amount: real('amount').notNull(),
		balanceAfter: real('balance_after').notNull(),
		description: text('description').notNull(),
		adminId: text('admin_id').references(() => users.id),
		createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
	},
	(t) => [index('tx_wallet_idx').on(t.walletId)]
);

// ── Deposits ──────────────────────────────────────────────────────────────────
export const deposits = sqliteTable('deposits', {
	id: text('id').primaryKey(),
	ref: text('ref').notNull().unique(), // UUID ref
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	rupeeAmount: real('rupee_amount').notNull(),
	coins: real('coins').notNull(),
	bonusCoins: real('bonus_coins').notNull().default(0),
	upiRef: text('upi_ref').unique(), // UTR — unique to prevent reuse
	screenshotUrl: text('screenshot_url'),
	status: text('status', { enum: ['pending', 'submitted', 'confirmed', 'rejected'] })
		.notNull()
		.default('pending'),
	adminNote: text('admin_note'),
	requestedAt: text('requested_at').notNull().default(sql`(datetime('now'))`),
	confirmedAt: text('confirmed_at'),
	confirmedBy: text('confirmed_by').references(() => users.id)
});

// ── Withdrawals ───────────────────────────────────────────────────────────────
export const withdrawals = sqliteTable('withdrawals', {
	id: text('id').primaryKey(),
	ref: text('ref').notNull().unique(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	coins: real('coins').notNull(),
	rupeeAmount: real('rupee_amount').notNull(),
	upiId: text('upi_id').notNull(),
	status: text('status', { enum: ['pending', 'approved', 'paid', 'rejected'] })
		.notNull()
		.default('pending'),
	adminNote: text('admin_note'),
	upiRefPaid: text('upi_ref_paid'),
	requestedAt: text('requested_at').notNull().default(sql`(datetime('now'))`),
	processedAt: text('processed_at'),
	processedBy: text('processed_by').references(() => users.id)
});

// ── Notifications ─────────────────────────────────────────────────────────────
export const notifications = sqliteTable(
	'notifications',
	{
		id: text('id').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		title: text('title').notNull(),
		body: text('body').notNull(),
		kind: text('kind', { enum: ['info', 'success', 'warning', 'system'] })
			.notNull()
			.default('info'),
		link: text('link'),
		isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
		createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
	},
	(t) => [index('notif_user_idx').on(t.userId)]
);

// ── Support Tickets ───────────────────────────────────────────────────────────
export const tickets = sqliteTable('tickets', {
	id: text('id').primaryKey(),
	ref: text('ref').notNull().unique(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	subject: text('subject').notNull(),
	status: text('status', { enum: ['open', 'in_progress', 'resolved', 'closed'] })
		.notNull()
		.default('open'),
	priority: text('priority', { enum: ['low', 'medium', 'high'] })
		.notNull()
		.default('medium'),
	assignedTo: text('assigned_to').references(() => users.id),
	createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
	updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`)
});

export const ticketMessages = sqliteTable('ticket_messages', {
	id: text('id').primaryKey(),
	ticketId: text('ticket_id')
		.notNull()
		.references(() => tickets.id),
	authorId: text('author_id')
		.notNull()
		.references(() => users.id),
	body: text('body').notNull(),
	isStaff: integer('is_staff', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at').notNull().default(sql`(datetime('now'))`)
});

// Type exports
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Match = typeof matches.$inferSelect;
export type Bet = typeof bets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Deposit = typeof deposits.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type TicketMessage = typeof ticketMessages.$inferSelect;
export type AdminRoles = typeof adminRoles.$inferSelect;
export type BonusTier = typeof bonusTiers.$inferSelect;
