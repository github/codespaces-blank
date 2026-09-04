import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Pool } from "pg";
import type { LiveSnapshot } from "~/types/live";
import type { Roster, Team } from "~/types/tracker";
import { getCompetitionScope, getCompetitionGender } from "~/types/tracker";
import { rosterStatePayloadSchema } from "~/utils/schemas.server";
import {
  ALL_CLUBS,
  ELITE1_CLUBS_2025_2026,
  PROD2_CLUBS_2025_2026,
  PROD2_CLUBS_2026_2027,
  TOP14_CLUBS_2025_2026,
  TOP14_CLUBS_2026_2027,
} from "~/utils/clubs";
import { FRANCE_W6N_SQUAD_2025_2026 } from "~/utils/france-w6n-squad";

type Sport = "Rugby" | "Football";
type Championship = "Top 14" | "Pro D2" | "Elite 1" | "Women's Six Nations" | "World Series";

export interface RosterStatePayload {
  rosters: Roster[];
  teams: Team[];
  activeRosterId: string | null;
  matchDay?: string;
  season?: string;
  sport?: Sport;
  championship?: Championship;
}

export interface MatchDayTeamSelection {
  accountId: string;
  championship: string;
  matchDay: number;
  team1Id: string;
  team2Id: string;
  savedAt: string;
}

export interface StoredSummary {
  accountId: string;
  id: string;
  createdAt: string;
  currentTime: number;
  summary: Record<string, number>;
  events: unknown[];
  teams?: Array<{ id: string; name: string }>;
  matchDay?: number;
  matchDate?: string;
  matchField?: string;
  matchReferee?: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountResult {
  account: Account;
}

export interface AccountListItem {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LiveMatchRecord {
  id: string;
  publicSlug: string;
  adminToken: string;
  adminTokenHash: string;
  championship: string | null;
  matchDay: number | null;
  state: LiveSnapshot | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  closedAt: string | null;
}

export type LiveMatchUpdateError =
  | "not-found"
  | "invalid-token"
  | "expired"
  | "closed";

export interface LiveMatchUpdateResult {
  record: LiveMatchRecord | null;
  error: LiveMatchUpdateError | null;
}

const dataDir = path.join(process.cwd(), "data");
const LEGACY_ACCOUNT_ID = "legacy-account";
const LEGACY_ACCOUNT_NAME = "Compte historique";
const LEGACY_ACCOUNT_ACCESS_CODE = "SIDEPITCHERLEGACY";
const LEGACY_ACCOUNT_EMAIL = "legacy@sidepitcher.local";
const LEGACY_ACCOUNT_PASSWORD = crypto.randomUUID();
const ADMIN_ACCOUNT_ID = process.env.BOOTSTRAP_ADMIN_ID?.trim() || "admin-account";
const ADMIN_ACCOUNT_NAME = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Admin";
const ADMIN_ACCOUNT_EMAIL = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || "";
const ADMIN_ACCOUNT_PASSWORD = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim() || "";
const ANONYMOUS_SCOPE_PREFIX = "anon:";
const ANONYMOUS_DATA_TTL_MS = 24 * 60 * 60 * 1000;
const ANONYMOUS_CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const SEED_TEST_ACCOUNT_ID = process.env.SEED_TEST_ACCOUNT_ID?.trim() || "";
const SEED_TEST_ACCOUNT_NAME = process.env.SEED_TEST_ACCOUNT_NAME?.trim() || "Compte test";
const SEED_TEST_ACCOUNT_ACCESS_CODE = process.env.SEED_TEST_ACCOUNT_ACCESS_CODE?.trim() || "";
const SEED_ELITE1_ACCOUNT_NAME = process.env.SEED_ELITE1_ACCOUNT_NAME?.trim() || "";
const SEED_ELITE1_SEASON = process.env.SEED_ELITE1_SEASON?.trim() || "2026/2027";
const LEGACY_DATA_MIGRATION_TARGET_EMAIL = process.env.LEGACY_DATA_MIGRATION_TARGET_EMAIL?.trim().toLowerCase() || "";

const defaultRosterState: RosterStatePayload = {
  rosters: [],
  teams: [],
  activeRosterId: null,
  matchDay: "",
  sport: "Rugby",
  championship: "Top 14",
};

let singletonPool: Pool | null = null;
let initializationPromise: Promise<void> | null = null;
let lastAnonymousCleanupAt = 0;

const DEFAULT_LIVE_SESSION_TTL_HOURS = 12;

function parseJsonOrNull<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is required. Configure your Render PostgreSQL connection string in environment variables."
    );
  }
  return url;
}

function getPool(): Pool {
  if (singletonPool) return singletonPool;

  const connectionString = getDatabaseUrl();
  const ssl = process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: false };

  singletonPool = new Pool({
    connectionString,
    ssl,
  });

  // Log slow queries
  const SLOW_QUERY_MS = Number(process.env.SLOW_QUERY_MS) || 200;
  singletonPool.on("connect", (client) => {
    const origQuery = client.query.bind(client);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client as any).query = (...args: any[]) => {
      const start = performance.now();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (origQuery as any)(...args);
      if (result && typeof result.then === "function") {
        (result as Promise<unknown>).then(() => {
          const ms = performance.now() - start;
          if (ms >= SLOW_QUERY_MS) {
            const text = typeof args[0] === "string" ? args[0] : (args[0] as { text?: string })?.text ?? "?";
            console.warn(`[slow-query] ${ms.toFixed(1)}ms — ${text.slice(0, 120)}`);
          }
        }).catch(() => {});
      }
      return result;
    };
  });

  return singletonPool;
}

function getLiveSessionTtlMs(): number {
  const raw = process.env.LIVE_SESSION_TTL_HOURS;
  const parsed = Number(raw);
  const hours = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LIVE_SESSION_TTL_HOURS;
  return hours * 60 * 60 * 1000;
}

function hashLiveAdminToken(token: string): string {
  const pepper = process.env.LIVE_TOKEN_PEPPER ?? "";
  return crypto.createHash("sha256").update(`${pepper}:${token}`).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, "utf-8");
  const bBuf = Buffer.from(b, "utf-8");
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function isLiveMatchExpired(expiresAt: string): boolean {
  return Date.now() > new Date(expiresAt).getTime();
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeAccessCode(code: string): string {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function hashAccountAccessCode(code: string): string {
  return crypto
    .createHash("sha256")
    .update(`account:${normalizeAccessCode(code)}`)
    .digest("hex");
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

function hashPasswordResetToken(token: string): string {
  const pepper = process.env.PASSWORD_RESET_TOKEN_PEPPER ?? "";
  return crypto.createHash("sha256").update(`${pepper}:${token}`).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  const separatorIndex = hash.indexOf(":");
  if (separatorIndex === -1) return false;
  const salt = hash.slice(0, separatorIndex);
  const expectedHex = hash.slice(separatorIndex + 1);
  const computed = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== computed.length) return false;
  return crypto.timingSafeEqual(expected, computed);
}

function generateAccountAccessCode(): string {
  return `SP${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

function trimAccountName(name?: string): string {
  const trimmed = (name ?? "").trim();
  if (!trimmed) {
    return "Compte Match Reporter";
  }
  return trimmed.slice(0, 80);
}

function validatePasswordInput(password: string): void {
  if (password.trim().length < 6) {
    throw new Error("Password must contain at least 6 characters");
  }
}

function mapAccountRow(row: {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}): Account {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isAdmin: row.is_admin,
    isApproved: row.is_approved,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

function isAnonymousScopeId(scopeId: string): boolean {
  return scopeId.startsWith(ANONYMOUS_SCOPE_PREFIX);
}

async function cleanupExpiredAnonymousData(pool: Pool): Promise<void> {
  const now = Date.now();
  if (now - lastAnonymousCleanupAt < ANONYMOUS_CLEANUP_INTERVAL_MS) {
    return;
  }
  lastAnonymousCleanupAt = now;

  const thresholdIso = new Date(now - ANONYMOUS_DATA_TTL_MS).toISOString();
  await pool.query(
    `DELETE FROM account_rosters_state
     WHERE account_id LIKE $1 AND updated_at < $2`,
    [`${ANONYMOUS_SCOPE_PREFIX}%`, thresholdIso]
  );
  await pool.query(
    `DELETE FROM match_day_selections
     WHERE account_id LIKE $1 AND saved_at < $2`,
    [`${ANONYMOUS_SCOPE_PREFIX}%`, thresholdIso]
  );
  await pool.query(
    `DELETE FROM summaries
     WHERE account_id LIKE $1 AND created_at < $2`,
    [`${ANONYMOUS_SCOPE_PREFIX}%`, thresholdIso]
  );
}

/** Backfill: remplit national_roster_id pour les joueurs en effectif international ayant un club */
async function backfillNationalRosterIds(pool: Pool): Promise<void> {
  try {
    // Récupère tous les joueurs avec club mais sans national_roster_id
    const playersResult = await pool.query(
      `SELECT p.account_id, p.id, p.club
       FROM players p
       WHERE p.account_id NOT LIKE $1
         AND p.club IS NOT NULL
         AND p.national_roster_id IS NULL`,
      [`${ANONYMOUS_SCOPE_PREFIX}%`]
    );

    for (const row of playersResult.rows) {
      const { account_id, id, club } = row;
      const normalizedClub = (club || "").trim();
      if (!normalizedClub) continue;

      // Cherche un effectif national correspondant (même nom de club)
      const nationalResult = await pool.query(
        `SELECT id FROM stored_rosters
         WHERE account_id = $1
           AND (category LIKE '%Elite%' OR category LIKE '%Pro D2%' OR category LIKE '%National%')
           AND LOWER(name) = LOWER($2)
         LIMIT 1`,
        [account_id, normalizedClub]
      );

      if (nationalResult.rows.length > 0) {
        const { id: national_id } = nationalResult.rows[0];
        await pool.query(
          `UPDATE players SET national_roster_id = $1, updated_at = $2
           WHERE account_id = $3 AND id = $4`,
          [national_id, new Date().toISOString(), account_id, id]
        );
      }
    }
  } catch (err) {
    console.error("Backfill national_roster_ids failed:", err);
  }
}

/** Backfill: lie les joueurs nationaux aux sélections internationales du même club via memberships */
async function backfillInternationalMemberships(pool: Pool): Promise<void> {
  try {
    // Récupère tous les joueurs avec club
    const playersResult = await pool.query(
      `SELECT p.account_id, p.id, p.club
       FROM players p
       WHERE p.account_id NOT LIKE $1
         AND p.club IS NOT NULL`,
      [`${ANONYMOUS_SCOPE_PREFIX}%`]
    );

    for (const row of playersResult.rows) {
      const { account_id, id, club } = row;
      const normalizedClub = (club || "").trim();
      if (!normalizedClub) continue;

      // Cherche les effectifs internationaux correspondants (même nom de club)
      const intlResult = await pool.query(
        `SELECT id FROM stored_rosters
         WHERE account_id = $1
           AND (category LIKE 'W6N%' OR category = 'World Series')
           AND LOWER(name) = LOWER($2)`,
        [account_id, normalizedClub]
      );

      // Ajoute les memberships manquants
      for (const intlRoster of intlResult.rows) {
        await pool.query(
          `INSERT INTO player_roster_memberships (account_id, player_id, roster_id)
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [account_id, id, intlRoster.id]
        );
      }
    }
  } catch (err) {
    console.error("Backfill international memberships failed:", err);
  }
}

async function ensureLegacyAccount(pool: Pool): Promise<void> {
  const createdAt = new Date().toISOString();
  await pool.query(
    `INSERT INTO accounts (id, name, email, password_hash, is_admin, access_code_hash, created_at, updated_at)
     VALUES ($1, $2, $3, $4, FALSE, $5, $6, $6)
     ON CONFLICT (id)
     DO UPDATE SET
       name = EXCLUDED.name,
       email = COALESCE(accounts.email, EXCLUDED.email),
       password_hash = COALESCE(accounts.password_hash, EXCLUDED.password_hash),
       access_code_hash = COALESCE(accounts.access_code_hash, EXCLUDED.access_code_hash),
       updated_at = EXCLUDED.updated_at`,
    [
      LEGACY_ACCOUNT_ID,
      LEGACY_ACCOUNT_NAME,
      LEGACY_ACCOUNT_EMAIL,
      hashPassword(LEGACY_ACCOUNT_PASSWORD),
      hashAccountAccessCode(LEGACY_ACCOUNT_ACCESS_CODE),
      createdAt,
    ]
  );
}

async function ensureAdminAccount(pool: Pool): Promise<void> {
  if (!ADMIN_ACCOUNT_EMAIL || !ADMIN_ACCOUNT_PASSWORD) {
    return;
  }

  const now = new Date().toISOString();
  await pool.query(
    `INSERT INTO accounts (id, name, email, password_hash, is_admin, access_code_hash, created_at, updated_at)
     VALUES ($1, $2, $3, $4, TRUE, $5, $6, $6)
     ON CONFLICT (id)
     DO UPDATE SET
       name = COALESCE(accounts.name, EXCLUDED.name),
       email = COALESCE(accounts.email, EXCLUDED.email),
       password_hash = COALESCE(accounts.password_hash, EXCLUDED.password_hash),
       is_admin = TRUE,
       updated_at = EXCLUDED.updated_at`,
    [
      ADMIN_ACCOUNT_ID,
      ADMIN_ACCOUNT_NAME,
      ADMIN_ACCOUNT_EMAIL,
      hashPassword(ADMIN_ACCOUNT_PASSWORD),
      hashAccountAccessCode("ADMINACCESS"),
      now,
    ]
  );
}

async function addForeignKeyIfMissing(
  pool: Pool,
  constraintName: string,
  tableName: string,
  constraintDef: string
): Promise<void> {
  const check = await pool.query(
    `SELECT 1 FROM pg_constraint WHERE conname = $1`,
    [constraintName]
  );
  if (check.rowCount === 0) {
    await pool.query(
      `ALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} ${constraintDef}`
    );
  }
}

async function initializeSchema(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      password_hash TEXT,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      is_approved BOOLEAN NOT NULL DEFAULT TRUE,
      access_code_hash TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS email TEXT;
    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS password_hash TEXT;
    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;
    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT TRUE;
    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

    CREATE TABLE IF NOT EXISTS account_rosters_state (
      account_id TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rosters_state (
      id INTEGER PRIMARY KEY,
      payload TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );

    CREATE TABLE IF NOT EXISTS match_day_selections (
      championship TEXT NOT NULL,
      match_day INTEGER NOT NULL,
      team1_id TEXT NOT NULL,
      team2_id TEXT NOT NULL,
      saved_at TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (championship, match_day)
    );

    CREATE TABLE IF NOT EXISTS summaries (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL,
      payload TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS account_password_resets (
      token_hash TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL
    );

    ALTER TABLE summaries ADD COLUMN IF NOT EXISTS account_id TEXT;

    CREATE TABLE IF NOT EXISTS live_matches (
      id TEXT PRIMARY KEY,
      public_slug TEXT UNIQUE NOT NULL,
      admin_token TEXT NOT NULL,
      admin_token_hash TEXT,
      championship TEXT,
      match_day INTEGER,
      payload TEXT,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      expires_at TIMESTAMPTZ,
      closed_at TIMESTAMPTZ
    );

    ALTER TABLE live_matches ADD COLUMN IF NOT EXISTS admin_token_hash TEXT;
    ALTER TABLE live_matches ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
    ALTER TABLE live_matches ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;
    ALTER TABLE live_matches ADD COLUMN IF NOT EXISTS last_modified_by TEXT;

    ALTER TABLE accounts ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
    ALTER TABLE summaries ADD COLUMN IF NOT EXISTS last_modified_by TEXT;
    ALTER TABLE match_day_selections ADD COLUMN IF NOT EXISTS last_modified_by TEXT;

    CREATE INDEX IF NOT EXISTS idx_live_matches_public_slug ON live_matches(public_slug);
    CREATE INDEX IF NOT EXISTS idx_live_matches_expires_at ON live_matches(expires_at);
    CREATE INDEX IF NOT EXISTS idx_summaries_account_created_at ON summaries(account_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_account_password_resets_account_id ON account_password_resets(account_id);

    ALTER TABLE match_day_selections ADD COLUMN IF NOT EXISTS account_id TEXT;

    -- Structured relational tables --

    CREATE TABLE IF NOT EXISTS coaches (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      photo_url VARCHAR,
      nationality VARCHAR,
      club VARCHAR,
      last_modified_by TEXT
    );

    CREATE TABLE IF NOT EXISTS presidents (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      photo_url VARCHAR,
      nationality VARCHAR,
      club VARCHAR,
      last_modified_by TEXT
    );

    CREATE TABLE IF NOT EXISTS competitions (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS stored_rosters (
      id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      name TEXT NOT NULL,
      nickname TEXT,
      color TEXT,
      logo TEXT,
      coach TEXT[] NOT NULL DEFAULT '{}',
      president TEXT,
      category TEXT,
      founded_in INTEGER,
      players JSONB NOT NULL DEFAULT '[]',
      titles JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      last_modified_by TEXT,
      coach_id INTEGER,
      president_id INTEGER,
      PRIMARY KEY (account_id, id)
    );

    -- Migration: coach TEXT → TEXT[] (idempotent) --
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'stored_rosters' AND column_name = 'coach' AND data_type = 'text'
      ) THEN
        ALTER TABLE stored_rosters ALTER COLUMN coach TYPE TEXT[]
          USING CASE WHEN coach IS NULL OR TRIM(coach) = '' THEN '{}'::TEXT[]
                ELSE string_to_array(coach, ', ') END;
        ALTER TABLE stored_rosters ALTER COLUMN coach SET NOT NULL;
        ALTER TABLE stored_rosters ALTER COLUMN coach SET DEFAULT '{}';
      END IF;
    END $$;

    -- Cleanup: drop legacy multi-coach columns if they exist --
    ALTER TABLE stored_rosters DROP COLUMN IF EXISTS coaches;
    ALTER TABLE stored_rosters DROP COLUMN IF EXISTS coach_ids;

    -- Ranking / points / last 5 matches --
    ALTER TABLE stored_rosters ADD COLUMN IF NOT EXISTS current_ranking INTEGER;
    ALTER TABLE stored_rosters ADD COLUMN IF NOT EXISTS current_points INTEGER;
    ALTER TABLE stored_rosters ADD COLUMN IF NOT EXISTS last_five_matches JSONB;
    ALTER TABLE stored_rosters ADD COLUMN IF NOT EXISTS season_record JSONB;
    ALTER TABLE stored_rosters ADD COLUMN IF NOT EXISTS seasons JSONB;

    CREATE TABLE IF NOT EXISTS stored_teams (
      id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      roster_id TEXT,
      name TEXT NOT NULL,
      nickname TEXT,
      color TEXT,
      logo TEXT,
      captain_player_id TEXT,
      starters JSONB NOT NULL DEFAULT '[]',
      substitutes JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      last_modified_by TEXT,
      PRIMARY KEY (account_id, id)
    );

    CREATE TABLE IF NOT EXISTS players (
      id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      name TEXT NOT NULL,
      number INTEGER,
      positions JSONB DEFAULT '[]',
      photo_url TEXT,
      nationality VARCHAR,
      club TEXT,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      last_modified_by TEXT,
      PRIMARY KEY (account_id, id)
    );

    ALTER TABLE players ADD COLUMN IF NOT EXISTS club TEXT;

    CREATE TABLE IF NOT EXISTS player_stats (
      id SERIAL PRIMARY KEY,
      account_id TEXT NOT NULL,
      player_id TEXT NOT NULL,
      points INTEGER DEFAULT 0,
      essais INTEGER DEFAULT 0,
      pied INTEGER DEFAULT 0,
      taux_transfo INTEGER DEFAULT 0,
      cartons INTEGER DEFAULT 0,
      drops INTEGER DEFAULT 0,
      matchs_2526 INTEGER DEFAULT 0,
      titularisations_2526 INTEGER DEFAULT 0,
      updated_at TIMESTAMPTZ,
      UNIQUE (account_id, player_id)
    );

    ALTER TABLE player_stats ADD COLUMN IF NOT EXISTS last_modified_by TEXT;

    ALTER TABLE players ADD COLUMN IF NOT EXISTS national_roster_id TEXT;
    ALTER TABLE players ADD COLUMN IF NOT EXISTS international_roster_id TEXT;
    ALTER TABLE players ADD COLUMN IF NOT EXISTS gender TEXT;

    CREATE TABLE IF NOT EXISTS player_roster_memberships (
      account_id TEXT NOT NULL,
      player_id  TEXT NOT NULL,
      roster_id  TEXT NOT NULL,
      PRIMARY KEY (account_id, player_id, roster_id)
    );

    CREATE TABLE IF NOT EXISTS titles (
      id SERIAL PRIMARY KEY,
      account_id TEXT,
      roster_id TEXT,
      competition TEXT,
      ranking VARCHAR,
      year INTEGER,
      last_modified_by TEXT,
      UNIQUE (account_id, roster_id, competition, year)
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      account_id TEXT,
      championship TEXT,
      match_day INTEGER,
      team1_id TEXT,
      team1_name TEXT,
      team2_id TEXT,
      team2_name TEXT,
      scores JSONB,
      events JSONB,
      stats JSONB,
      snapshot JSONB,
      referee TEXT,
      played_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL,
      last_modified_by TEXT
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id BIGSERIAL PRIMARY KEY,
      table_name TEXT NOT NULL,
      row_id TEXT NOT NULL,
      action TEXT NOT NULL,
      "by" TEXT,
      "at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "before" JSONB,
      "after" JSONB
    );

    CREATE TABLE IF NOT EXISTS event_log (
      id BIGSERIAL PRIMARY KEY,
      event_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      schema_version INTEGER NOT NULL DEFAULT 1,
      occurred_at TIMESTAMPTZ NOT NULL,
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source TEXT NOT NULL DEFAULT 'unknown',
      correlation_id TEXT,
      actor_account_id TEXT,
      match_id TEXT,
      payload JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seed_runs (
      seed_key TEXT PRIMARY KEY,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Indexes for structured tables --
    CREATE INDEX IF NOT EXISTS idx_coaches_name ON coaches(name);
    CREATE INDEX IF NOT EXISTS idx_presidents_name ON presidents(name);
    CREATE INDEX IF NOT EXISTS idx_competitions_name ON competitions(name);
    CREATE INDEX IF NOT EXISTS idx_stored_rosters_account_id ON stored_rosters(account_id);
    CREATE INDEX IF NOT EXISTS idx_stored_teams_account_id ON stored_teams(account_id);
    CREATE INDEX IF NOT EXISTS idx_stored_teams_roster_id ON stored_teams(account_id, roster_id);
    CREATE INDEX IF NOT EXISTS idx_players_account_id ON players(account_id);
    CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
    CREATE INDEX IF NOT EXISTS idx_players_gender ON players(account_id, gender);
    CREATE INDEX IF NOT EXISTS idx_player_roster_memberships_player ON player_roster_memberships(account_id, player_id);
    CREATE INDEX IF NOT EXISTS idx_player_roster_memberships_roster ON player_roster_memberships(account_id, roster_id);
    CREATE INDEX IF NOT EXISTS idx_player_stats_account_id ON player_stats(account_id);
    CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats(account_id, player_id);
    CREATE INDEX IF NOT EXISTS idx_titles_roster ON titles(account_id, roster_id);
    CREATE INDEX IF NOT EXISTS idx_titles_competition ON titles(competition);
    CREATE INDEX IF NOT EXISTS idx_titles_year ON titles(year);
    CREATE INDEX IF NOT EXISTS idx_titles_ranking ON titles(ranking);
    CREATE INDEX IF NOT EXISTS idx_event_log_event_type ON event_log(event_type);
    CREATE INDEX IF NOT EXISTS idx_event_log_match_id ON event_log(match_id);
    CREATE INDEX IF NOT EXISTS idx_event_log_occurred_at ON event_log(occurred_at);

    -- Composite indexes for frequent query patterns --
    CREATE INDEX IF NOT EXISTS idx_players_account_name ON players(account_id, name);
    CREATE INDEX IF NOT EXISTS idx_titles_account_competition ON titles(account_id, competition);
    CREATE INDEX IF NOT EXISTS idx_titles_account_year ON titles(account_id, year DESC);
    CREATE INDEX IF NOT EXISTS idx_stored_rosters_account_category ON stored_rosters(account_id, category);
    CREATE INDEX IF NOT EXISTS idx_stored_rosters_coach ON stored_rosters USING gin(coach);
    CREATE INDEX IF NOT EXISTS idx_stored_rosters_president_id ON stored_rosters(president_id);
    CREATE INDEX IF NOT EXISTS idx_matches_account_id ON matches(account_id);
    CREATE INDEX IF NOT EXISTS idx_matches_championship ON matches(championship);
    CREATE INDEX IF NOT EXISTS idx_event_log_actor ON event_log(actor_account_id);
    CREATE INDEX IF NOT EXISTS idx_event_log_correlation ON event_log(correlation_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_table_row ON audit_log(table_name, row_id);
    CREATE INDEX IF NOT EXISTS idx_audit_log_at ON audit_log("at" DESC);
    CREATE INDEX IF NOT EXISTS idx_audit_log_by ON audit_log("by");
    CREATE INDEX IF NOT EXISTS idx_account_rosters_state_updated ON account_rosters_state(updated_at);
  `);

  // ---- GIN trigram indexes for ILIKE %...% searches ----
  // pg_trgm is needed; silently skip if the extension is unavailable
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_players_name_trgm ON players USING gin (name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_coaches_name_trgm ON coaches USING gin (name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_presidents_name_trgm ON presidents USING gin (name gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_titles_competition_trgm ON titles USING gin (competition gin_trgm_ops);
      CREATE INDEX IF NOT EXISTS idx_competitions_name_trgm ON competitions USING gin (name gin_trgm_ops);
    `);
  } catch {
    // pg_trgm not available — ILIKE searches will use sequential scans (acceptable at current scale)
  }

  // Add FK constraints (ignore if they already exist)
  await addForeignKeyIfMissing(pool, "fk_stored_rosters_account", "stored_rosters", "FOREIGN KEY (account_id) REFERENCES accounts(id)");
  await addForeignKeyIfMissing(pool, "fk_stored_rosters_coach", "stored_rosters", "FOREIGN KEY (coach_id) REFERENCES coaches(id)");
  await addForeignKeyIfMissing(pool, "fk_stored_rosters_president", "stored_rosters", "FOREIGN KEY (president_id) REFERENCES presidents(id)");
  await addForeignKeyIfMissing(pool, "fk_stored_rosters_competition", "stored_rosters", "FOREIGN KEY (category) REFERENCES competitions(name)");
  await addForeignKeyIfMissing(pool, "fk_stored_teams_account", "stored_teams", "FOREIGN KEY (account_id) REFERENCES accounts(id)");
  await addForeignKeyIfMissing(pool, "fk_stored_teams_roster", "stored_teams", "FOREIGN KEY (account_id, roster_id) REFERENCES stored_rosters(account_id, id)");
  await addForeignKeyIfMissing(pool, "fk_players_account", "players", "FOREIGN KEY (account_id) REFERENCES accounts(id)");
  await addForeignKeyIfMissing(pool, "fk_players_national_roster", "players", "FOREIGN KEY (account_id, national_roster_id) REFERENCES stored_rosters(account_id, id)");
  await addForeignKeyIfMissing(pool, "fk_players_international_roster", "players", "FOREIGN KEY (account_id, international_roster_id) REFERENCES stored_rosters(account_id, id)");
  await addForeignKeyIfMissing(pool, "fk_player_stats_account", "player_stats", "FOREIGN KEY (account_id) REFERENCES accounts(id)");
  await addForeignKeyIfMissing(pool, "fk_player_stats_player", "player_stats", "FOREIGN KEY (account_id, player_id) REFERENCES players(account_id, id)");
  await addForeignKeyIfMissing(pool, "fk_titles_roster", "titles", "FOREIGN KEY (account_id, roster_id) REFERENCES stored_rosters(account_id, id)");
  await addForeignKeyIfMissing(pool, "fk_titles_competition", "titles", "FOREIGN KEY (competition) REFERENCES competitions(name)");
  await addForeignKeyIfMissing(pool, "fk_matches_account", "matches", "FOREIGN KEY (account_id) REFERENCES accounts(id)");
  await addForeignKeyIfMissing(pool, "fk_summaries_account", "summaries", "FOREIGN KEY (account_id) REFERENCES accounts(id)");

  // Backfill national_roster_ids et international memberships pour les joueurs existants
  await backfillNationalRosterIds(pool);
  await backfillInternationalMemberships(pool);

  await pool.query(
    `UPDATE accounts
     SET email = CONCAT(id, '@sidepitcher.local')
     WHERE email IS NULL OR TRIM(email) = ''`
  );
  await pool.query(
    `UPDATE accounts
     SET password_hash = $1
     WHERE password_hash IS NULL OR TRIM(password_hash) = ''`,
    [hashPassword("temporary-password")]
  );
  await pool.query(
    `UPDATE accounts
     SET updated_at = COALESCE(updated_at, created_at, NOW())`
  );
  await pool.query(
    `UPDATE accounts
     SET is_approved = TRUE
     WHERE is_approved IS NULL`
  );
  await pool.query(`ALTER TABLE accounts ALTER COLUMN email SET NOT NULL`);
  await pool.query(`ALTER TABLE accounts ALTER COLUMN password_hash SET NOT NULL`);
  await pool.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_accounts_email_unique
     ON accounts ((LOWER(email)))`
  );

  await pool.query(
    `UPDATE match_day_selections
     SET account_id = $1
     WHERE account_id IS NULL`,
    [LEGACY_ACCOUNT_ID]
  );

  await pool.query(`ALTER TABLE match_day_selections DROP CONSTRAINT IF EXISTS match_day_selections_pkey`);
  await pool.query(`ALTER TABLE match_day_selections ALTER COLUMN account_id SET NOT NULL`);
  await pool.query(`ALTER TABLE match_day_selections ADD PRIMARY KEY (account_id, championship, match_day)`);
}

// ---------------------------------------------------------------------------
// Structured sync: roster blob → relational tables
// ---------------------------------------------------------------------------

async function syncRosterDataToTables(
  pool: Pool,
  accountId: string,
  payload: RosterStatePayload
): Promise<void> {
  if (isAnonymousScopeId(accountId)) return;

  const rosters = Array.isArray(payload.rosters) ? payload.rosters : [];
  const teams = Array.isArray(payload.teams) ? payload.teams : [];
  const nowIso = new Date().toISOString();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Collect all unique competition names (from category + titles)
    const competitionNames = new Set<string>();
    for (const r of rosters) {
      if (r.category) {
        competitionNames.add(r.category);
      }
      for (const t of r.titles ?? []) {
        if (t.competition) {
          competitionNames.add(t.competition);
        }
      }
    }
    for (const name of competitionNames) {
      await client.query(
        `INSERT INTO competitions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
        [name]
      );
    }

    // 2. Upsert coaches → collect name→id (support multi-coach comma-separated)
    const coachIdMap = new Map<string, number>();
    for (const r of rosters) {
      const coachNames = r.coach
        ? r.coach.split(",").map((n: string) => n.trim()).filter(Boolean)
        : [];
      // Build a map of name → Coach details from coachesData (if available)
      const detailsByName = new Map<string, { photoUrl?: string; nationality?: string; club?: string }>();
      if (r.coachesData) {
        for (const cd of r.coachesData) {
          if (cd.name) detailsByName.set(cd.name, { ...cd, club: cd.club || r.name });
        }
      } else if (r.coachData && coachNames[0]) {
        detailsByName.set(coachNames[0], { ...r.coachData, club: r.coachData.club || r.name });
      } else {
        // No coachData at all — still default club to roster name
        for (const cn of coachNames) {
          detailsByName.set(cn, { club: r.name });
        }
      }
      for (const coachName of coachNames) {
        if (!coachIdMap.has(coachName)) {
          const details = detailsByName.get(coachName);
          const res = await client.query<{ id: number }>(
            `INSERT INTO coaches (name, photo_url, nationality, club, last_modified_by)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (name) DO UPDATE SET
               photo_url = COALESCE(EXCLUDED.photo_url, coaches.photo_url),
               nationality = COALESCE(EXCLUDED.nationality, coaches.nationality),
               club = COALESCE(EXCLUDED.club, coaches.club),
               last_modified_by = EXCLUDED.last_modified_by
             RETURNING id`,
            [coachName, details?.photoUrl ?? null, details?.nationality ?? null, details?.club ?? null, accountId]
          );
          coachIdMap.set(coachName, res.rows[0].id);
        }
      }
    }

    // 2b. Cleanup stale combined-string coach entries (legacy: "A, B" instead of individual "A" and "B")
    await client.query(
      `DELETE FROM coaches WHERE name LIKE '%,%' AND last_modified_by = $1`,
      [accountId]
    );

    // 3. Upsert presidents → collect name→id
    const presidentIdMap = new Map<string, number>();
    for (const r of rosters) {
      const presName = r.president;
      if (presName && !presidentIdMap.has(presName)) {
        const presDetails: { photoUrl?: string; nationality?: string; club?: string } = r.presidentData ?? {};
        const presClub = presDetails.club || r.name;
        const res = await client.query<{ id: number }>(
          `INSERT INTO presidents (name, photo_url, nationality, club, last_modified_by)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (name) DO UPDATE SET
             photo_url = COALESCE(EXCLUDED.photo_url, presidents.photo_url),
             nationality = COALESCE(EXCLUDED.nationality, presidents.nationality),
             club = COALESCE(EXCLUDED.club, presidents.club),
             last_modified_by = EXCLUDED.last_modified_by
           RETURNING id`,
          [presName, presDetails.photoUrl ?? null, presDetails.nationality ?? null, presClub, accountId]
        );
        presidentIdMap.set(presName, res.rows[0].id);
      }
    }

    // 4. Delete existing data for this account (respecting FK order)
    await client.query("DELETE FROM player_stats WHERE account_id = $1", [accountId]);
    await client.query("DELETE FROM titles WHERE account_id = $1", [accountId]);
    await client.query("DELETE FROM stored_teams WHERE account_id = $1", [accountId]);
    await client.query("DELETE FROM player_roster_memberships WHERE account_id = $1", [accountId]);
    await client.query("DELETE FROM players WHERE account_id = $1", [accountId]);
    await client.query("DELETE FROM stored_rosters WHERE account_id = $1", [accountId]);

    // 5. Insert stored_rosters
    for (const r of rosters) {
      if (!r.id || !r.name) continue;

      const coachStr = r.coach ?? null;
      const coachNames = coachStr
        ? coachStr.split(",").map((n: string) => n.trim()).filter(Boolean)
        : [];
      const firstCoachId = coachNames[0] ? coachIdMap.get(coachNames[0]) ?? null : null;
      const presName = r.president ?? null;
      const presidentId = presName ? presidentIdMap.get(presName) ?? null : null;
      const rPlayers = r.players ?? [];
      const rTitles = r.titles ?? [];

      await client.query(
        `INSERT INTO stored_rosters
         (id, account_id, name, nickname, color, logo, coach, president, category,
          founded_in, players, titles, created_at, updated_at, last_modified_by,
          coach_id, president_id, current_ranking, current_points, last_five_matches, season_record, seasons)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
        [
          r.id,
          accountId,
          r.name,
          r.nickname ?? null,
          r.color ?? null,
          r.logo ?? null,
          coachNames,
          presName,
          r.category ?? null,
          r.founded_in ?? null,
          JSON.stringify(rPlayers),
          JSON.stringify(rTitles),
          nowIso,
          accountId,
          firstCoachId,
          presidentId,
          r.currentRanking ?? null,
          r.currentPoints ?? null,
          r.lastFiveMatches ? JSON.stringify(r.lastFiveMatches) : null,
          r.seasonRecord ? JSON.stringify(r.seasonRecord) : null,
          r.seasons ? JSON.stringify(r.seasons) : null,
        ]
      );

      // 6. Insert players from this roster
      const rosterScope = getCompetitionScope(r.category);
      const rosterGender = getCompetitionGender(r.category) === 'feminine' ? 'female'
                         : getCompetitionGender(r.category) === 'masculine' ? 'male'
                         : null;
      for (const p of rPlayers) {
        if (!p.id || !p.name) continue;

        const nationalRosterId = rosterScope === 'national' ? r.id : null;
        const internationalRosterId = rosterScope === 'international' ? r.id : null;

        await client.query(
          `INSERT INTO players
           (id, account_id, name, number, positions, photo_url, nationality, club,
            gender, national_roster_id, international_roster_id,
            created_at, updated_at, last_modified_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12,$13)
           ON CONFLICT (account_id, id) DO UPDATE SET
             name = EXCLUDED.name,
             number = EXCLUDED.number,
             positions = EXCLUDED.positions,
             photo_url = EXCLUDED.photo_url,
             nationality = EXCLUDED.nationality,
             club = COALESCE(EXCLUDED.club, players.club),
             gender = COALESCE(EXCLUDED.gender, players.gender),
             national_roster_id = COALESCE(EXCLUDED.national_roster_id, players.national_roster_id),
             international_roster_id = COALESCE(EXCLUDED.international_roster_id, players.international_roster_id),
             updated_at = EXCLUDED.updated_at`,
          [
            p.id,
            accountId,
            p.name,
            p.number ?? null,
            JSON.stringify(p.positions ?? []),
            p.photoUrl ?? null,
            p.nationality ?? null,
            p.club ?? r.name,
            rosterGender,
            nationalRosterId,
            internationalRosterId,
            nowIso,
            accountId,
          ]
        );

        // Insert membership
        await client.query(
          `INSERT INTO player_roster_memberships (account_id, player_id, roster_id)
           VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
          [accountId, p.id, r.id]
        );

        // 7. Insert player_stats if present
        if (p.stats) {
          await client.query(
            `INSERT INTO player_stats
             (account_id, player_id, points, essais, pied, taux_transfo,
              cartons, drops, matchs_2526, titularisations_2526, updated_at)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             ON CONFLICT (account_id, player_id) DO UPDATE SET
               points = EXCLUDED.points,
               essais = EXCLUDED.essais,
               pied = EXCLUDED.pied,
               taux_transfo = EXCLUDED.taux_transfo,
               cartons = EXCLUDED.cartons,
               drops = EXCLUDED.drops,
               matchs_2526 = EXCLUDED.matchs_2526,
               titularisations_2526 = EXCLUDED.titularisations_2526,
               updated_at = EXCLUDED.updated_at`,
            [
              accountId,
              p.id,
              p.stats.points,
              p.stats.essais,
              p.stats.pied,
              p.stats.tauxTransfo,
              p.stats.cartons,
              p.stats.drops,
              p.stats.matchs2526,
              p.stats.titularisations2526,
              nowIso,
            ]
          );
        }
      }

      // 8. Insert titles from this roster
      for (const t of rTitles) {
        if (!t.competition || typeof t.year !== "number") continue;

        await client.query(
          `INSERT INTO titles
           (account_id, roster_id, competition, ranking, year, last_modified_by)
           VALUES ($1,$2,$3,$4,$5,$6)
           ON CONFLICT (account_id, roster_id, competition, year) DO UPDATE SET
             ranking = EXCLUDED.ranking,
             last_modified_by = EXCLUDED.last_modified_by`,
          [accountId, r.id, t.competition, t.ranking ?? null, t.year, accountId]
        );
      }
    }

    // 9. Insert stored_teams
    for (const team of teams) {
      if (!team.id || !team.name) continue;

      await client.query(
        `INSERT INTO stored_teams
         (id, account_id, roster_id, name, nickname, color, logo,
          captain_player_id, starters, substitutes,
          created_at, updated_at, last_modified_by)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11,$12)`,
        [
          team.id,
          accountId,
          team.rosterId ?? null,
          team.name,
          team.nickname ?? null,
          team.color ?? null,
          team.logo ?? null,
          team.captainPlayerId ?? null,
          JSON.stringify(team.starters ?? []),
          JSON.stringify(team.substitutes ?? []),
          nowIso,
          accountId,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[syncRosterDataToTables] Sync failed (JSON blob was saved):", err);
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Structured sync: summary blob → matches + event_log
// ---------------------------------------------------------------------------

async function syncSummaryDataToTables(
  pool: Pool,
  summary: StoredSummary
): Promise<void> {
  if (isAnonymousScopeId(summary.accountId)) return;

  const summaryTeams = Array.isArray(summary.teams) ? summary.teams : [];
  const team1 = summaryTeams[0] ?? null;
  const team2 = summaryTeams[1] ?? null;
  const events = Array.isArray(summary.events)
    ? (summary.events as Record<string, unknown>[])
    : [];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Upsert match record
    await client.query(
      `INSERT INTO matches
       (id, account_id, championship, match_day,
        team1_id, team1_name, team2_id, team2_name,
        scores, events, stats, played_at,
        created_at, updated_at, last_modified_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NULL,$11,$11,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
         events = EXCLUDED.events,
         scores = EXCLUDED.scores,
         updated_at = EXCLUDED.updated_at`,
      [
        summary.id,
        summary.accountId,
        null,
        summary.matchDay ?? null,
        team1?.id ?? null,
        team1?.name ?? null,
        team2?.id ?? null,
        team2?.name ?? null,
        JSON.stringify(summary.summary ?? {}),
        JSON.stringify(events),
        summary.createdAt,
        summary.accountId,
      ]
    );

    // Replace event_log entries for this match
    await client.query(
      `DELETE FROM event_log WHERE match_id = $1`,
      [summary.id]
    );

    for (let i = 0; i < events.length; i++) {
      const evt = events[i];
      const eventType = (evt.type as string) ?? "unknown";
      const eventTime = typeof evt.time === "number" ? evt.time : 0;
      const occurredAt = new Date(
        new Date(summary.createdAt).getTime() + eventTime * 1000
      ).toISOString();

      await client.query(
        `INSERT INTO event_log
         (event_id, event_type, schema_version, occurred_at,
          source, actor_account_id, match_id, payload)
         VALUES ($1,$2,1,$3,'tracker',$4,$5,$6)`,
        [
          `${summary.id}_${i}`,
          eventType,
          occurredAt,
          summary.accountId,
          summary.id,
          JSON.stringify(evt),
        ]
      );
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[syncSummaryDataToTables] Sync failed (JSON blob was saved):", err);
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Remove structured data for a deleted summary
// ---------------------------------------------------------------------------

async function removeSummaryStructuredData(
  pool: Pool,
  summaryId: string
): Promise<void> {
  await pool.query(`DELETE FROM event_log WHERE match_id = $1`, [summaryId]);
  await pool.query(`DELETE FROM matches WHERE id = $1`, [summaryId]);
}

async function migrateFromJsonFiles(pool: Pool) {
  await ensureLegacyAccount(pool);
  await ensureAdminAccount(pool);

  const rostersCountResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM account_rosters_state"
  );
  const summariesCountResult = await pool.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM summaries");
  const selectionsCountResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM match_day_selections"
  );

  const rostersCount = Number(rostersCountResult.rows[0]?.count ?? "0");
  const summariesCount = Number(summariesCountResult.rows[0]?.count ?? "0");
  const selectionsCount = Number(selectionsCountResult.rows[0]?.count ?? "0");

  if (rostersCount === 0) {
    const legacyDbRostersResult = await pool.query<{ payload: string }>(
      "SELECT payload FROM rosters_state WHERE id = 1"
    );
    const legacyDbPayload = legacyDbRostersResult.rows[0]?.payload;
    if (legacyDbPayload) {
      await pool.query(
        `INSERT INTO account_rosters_state (account_id, payload, updated_at)
         VALUES ($1, $2, $3)
         ON CONFLICT(account_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
        [LEGACY_ACCOUNT_ID, legacyDbPayload, new Date().toISOString()]
      );
    } else {
      const legacyRostersPath = path.join(dataDir, "rosters.json");
      if (fs.existsSync(legacyRostersPath)) {
        const raw = fs.readFileSync(legacyRostersPath, "utf-8");
        const parsed = parseJsonOrNull<RosterStatePayload>(raw);
        if (parsed) {
          await pool.query(
            `INSERT INTO account_rosters_state (account_id, payload, updated_at)
             VALUES ($1, $2, $3)
             ON CONFLICT(account_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
            [LEGACY_ACCOUNT_ID, JSON.stringify(parsed), new Date().toISOString()]
          );
        }
      }
    }
  }

  if (summariesCount === 0) {
    const legacySummariesPath = path.join(dataDir, "summaries.json");
    if (fs.existsSync(legacySummariesPath)) {
      const raw = fs.readFileSync(legacySummariesPath, "utf-8");
      const parsed = parseJsonOrNull<{ summaries?: StoredSummary[] }>(raw);
      if (parsed?.summaries?.length) {
        for (const summary of parsed.summaries) {
          await pool.query(
            `INSERT INTO summaries (id, created_at, payload, account_id)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (id) DO NOTHING`,
            [summary.id, summary.createdAt, JSON.stringify({ ...summary, accountId: LEGACY_ACCOUNT_ID }), LEGACY_ACCOUNT_ID]
          );
        }
      }
    }
  } else {
    await pool.query(
      `UPDATE summaries
       SET account_id = $1
       WHERE account_id IS NULL`,
      [LEGACY_ACCOUNT_ID]
    );
  }

  if (selectionsCount === 0) {
    const legacySelectionsPath = path.join(dataDir, "match-day-teams.json");
    if (fs.existsSync(legacySelectionsPath)) {
      const raw = fs.readFileSync(legacySelectionsPath, "utf-8");
      const parsed = parseJsonOrNull<{ selections?: MatchDayTeamSelection[] }>(raw);
      if (parsed?.selections?.length) {
        for (const selection of parsed.selections) {
          await pool.query(
            `INSERT INTO match_day_selections
             (account_id, championship, match_day, team1_id, team2_id, saved_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (account_id, championship, match_day)
             DO UPDATE SET
               team1_id = EXCLUDED.team1_id,
               team2_id = EXCLUDED.team2_id,
               saved_at = EXCLUDED.saved_at`,
            [
              LEGACY_ACCOUNT_ID,
              selection.championship,
              selection.matchDay,
              selection.team1Id,
              selection.team2Id,
              selection.savedAt,
            ]
          );
        }
      }
    }
  } else {
    await pool.query(
      `UPDATE match_day_selections
       SET account_id = $1
       WHERE account_id IS NULL`,
      [LEGACY_ACCOUNT_ID]
    );
  }
}

// ---------------------------------------------------------------------------
// Backfill: sync all existing JSON blobs to structured tables
// ---------------------------------------------------------------------------

async function backfillStructuredTables(pool: Pool): Promise<void> {
  // Only run once: skip if stored_rosters already has data
  const check = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM stored_rosters"
  );
  if (Number(check.rows[0]?.count ?? "0") > 0) return;

  console.log("[backfill] Syncing existing roster blobs to structured tables…");
  const rostersRows = await pool.query<{ account_id: string; payload: string }>(
    "SELECT account_id, payload FROM account_rosters_state"
  );
  for (const row of rostersRows.rows) {
    const parsed = parseJsonOrNull<RosterStatePayload>(row.payload);
    if (!parsed) continue;
    const validated = rosterStatePayloadSchema.safeParse(parsed);
    if (!validated.success) {
      console.warn(`[backfill] Skipping invalid roster blob for account ${row.account_id}:`, validated.error.issues);
      continue;
    }
    await syncRosterDataToTables(pool, row.account_id, validated.data as RosterStatePayload);
  }

  console.log("[backfill] Syncing existing summary blobs to structured tables…");
  const summaryRows = await pool.query<{ account_id: string; payload: string }>(
    "SELECT account_id, payload FROM summaries"
  );
  for (const row of summaryRows.rows) {
    const parsed = parseJsonOrNull<StoredSummary>(row.payload);
    if (!parsed) continue;
    await syncSummaryDataToTables(pool, { ...parsed, accountId: parsed.accountId ?? row.account_id });
  }

  console.log("[backfill] Done.");
}

// ---------------------------------------------------------------------------
// Seed: default club rosters for a specific account
// ---------------------------------------------------------------------------

async function seedRostersSubsetForAccount(
  pool: Pool,
  accountId: string,
  candidates: typeof ALL_CLUBS,
  seedLabel: string,
  previousCandidates: typeof ALL_CLUBS = [],
  previousSeason = "2025/2026",
): Promise<void> {
  const existing = await pool.query<{ name: string; category: string }>(
    `SELECT name, category FROM stored_rosters WHERE account_id = $1`,
    [accountId]
  );
  const existingKeys = new Set(
    existing.rows.map((r) => `${r.name}||${r.category}`)
  );

  const missing = candidates.filter(
    (c) => !existingKeys.has(`${c.name}||${c.category}`)
  );
  if (missing.length > 0) {
    console.log(`[seed] Account "${accountId}": adding ${missing.length} ${seedLabel} roster(s)…`);
  }

  const currentPayload = await pool.query<{ payload: string }>(
    `SELECT payload FROM account_rosters_state WHERE account_id = $1`,
    [accountId]
  );
  const parsed = currentPayload.rows[0]
    ? parseJsonOrNull<RosterStatePayload>(currentPayload.rows[0].payload)
    : null;

  const existingRosters: Roster[] = parsed?.rosters ?? [];
  const existingTeams: Team[] = parsed?.teams ?? [];

  const previousNameByCurrentName: Record<string, string> = {
    "Stade Toulousain": "Stade Toulousain Rugby Féminin",
    "Montpellier Hérault Rugby": "Montpellier HR",
    "Soyaux-Angoulême XV": "Soyaux-Angoulême RC",
    "Stade Aurillacois": "Aurillac Rugby",
    "Biarritz Olympique PB": "Biarritz Olympique",
    "FC Grenoble Rugby": "FC Grenoble",
    "Valence Romans": "Valence-Romans Drôme",
  };

  const findPreviousRoster = (candidate: (typeof ALL_CLUBS)[number]) => {
    const previousCandidate = previousCandidates.find(
      (previous) => previous.category === candidate.category &&
        (previous.name === previousNameByCurrentName[candidate.name] || previous.nickname === candidate.nickname)
    );
    if (!previousCandidate) return undefined;
    return existingRosters.find(
      (roster) => roster.name === previousCandidate.name && roster.category === previousCandidate.category
    );
  };

  const clonePlayers = (players: Roster["players"]): Roster["players"] =>
    players.map((player) => ({ ...player, id: crypto.randomUUID() }));

  const newRosters: Roster[] = missing.map((c) => ({
    id: crypto.randomUUID(),
    name: c.name,
    nickname: c.nickname,
    color: c.color,
    category: c.category,
    players: clonePlayers(findPreviousRoster(c)?.players ?? []),
    currentRanking: c.currentRanking,
    currentPoints: c.currentPoints,
    seasons: (() => {
      const previous = findPreviousRoster(c);
      if (!previous) return undefined;
      return {
        [previousSeason]: {
          players: previous.players,
          coach: previous.coach,
          ranking: previous.currentRanking,
          points: previous.currentPoints,
        },
      };
    })(),
  }));

  const migratedRosters = existingRosters.map((roster) => {
    const candidate = candidates.find(
      (item) => item.name === roster.name && item.category === roster.category
    );
    const previous = candidate ? findPreviousRoster(candidate) : undefined;
    if (!candidate || !previous || roster.seasons?.[previousSeason]) return roster;
    return {
      ...roster,
      seasons: {
        ...roster.seasons,
        [previousSeason]: {
          players: previous.players,
          coach: previous.coach,
          ranking: previous.currentRanking,
          points: previous.currentPoints,
        },
      },
      players: roster.players.length > 0 ? roster.players : clonePlayers(previous.players),
    };
  });

  const payload: RosterStatePayload = {
    rosters: [...migratedRosters, ...newRosters],
    teams: existingTeams,
    activeRosterId: parsed?.activeRosterId ?? null,
    matchDay: parsed?.matchDay,
    season: parsed?.season,
    sport: parsed?.sport,
    championship: parsed?.championship,
  };

  if (newRosters.length === 0 && migratedRosters.every((roster, index) => roster === existingRosters[index])) return;

  const now = new Date().toISOString();
  await pool.query(
    `INSERT INTO account_rosters_state (account_id, payload, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (account_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
    [accountId, JSON.stringify(payload), now]
  );
  await syncRosterDataToTables(pool, accountId, payload);
}

async function seedDefaultRostersForAccount(pool: Pool, accountId: string): Promise<void> {
  await seedRostersSubsetForAccount(
    pool,
    accountId,
    [...TOP14_CLUBS_2026_2027, ...PROD2_CLUBS_2026_2027],
    "Top 14 / Pro D2 2026/2027",
    [...TOP14_CLUBS_2025_2026, ...PROD2_CLUBS_2025_2026],
  );
  await seedRostersSubsetForAccount(pool, accountId, ELITE1_CLUBS_2025_2026, "Elite 1");
}

async function seedElite1ForNamedAccount(pool: Pool): Promise<void> {
  if (!SEED_ELITE1_ACCOUNT_NAME) return;

  const target = await pool.query<{ id: string }>(
    `SELECT id FROM accounts WHERE LOWER(name) = LOWER($1) LIMIT 1`,
    [SEED_ELITE1_ACCOUNT_NAME]
  );
  const accountId = target.rows[0]?.id;
  if (!accountId) {
    console.warn(`[seed] No account found with name "${SEED_ELITE1_ACCOUNT_NAME}"; skipping Elite 1 seed.`);
    return;
  }

  const seedKey = `elite1:${SEED_ELITE1_SEASON}:${accountId}`;
  const alreadySeeded = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM seed_runs WHERE seed_key = $1`,
    [seedKey]
  );
  if (Number(alreadySeeded.rows[0]?.count ?? "0") > 0) {
    return;
  }

  await seedRostersSubsetForAccount(
    pool,
    accountId,
    ELITE1_CLUBS_2025_2026,
    "Elite 1"
  );

  await pool.query(
    `INSERT INTO seed_runs (seed_key, executed_at)
     VALUES ($1, NOW())
     ON CONFLICT (seed_key) DO NOTHING`,
    [seedKey]
  );
}

async function ensureTestAccount(pool: Pool): Promise<void> {
  if (!SEED_TEST_ACCOUNT_ID || !SEED_TEST_ACCOUNT_ACCESS_CODE) return;

  const now = new Date().toISOString();
  await pool.query(
    `INSERT INTO accounts (id, name, email, password_hash, is_admin, access_code_hash, created_at, updated_at)
     VALUES ($1, $2, $3, $4, FALSE, $5, $6, $6)
     ON CONFLICT (id) DO NOTHING`,
    [
      SEED_TEST_ACCOUNT_ID,
      SEED_TEST_ACCOUNT_NAME,
      `${SEED_TEST_ACCOUNT_ID}@seed.local`,
      hashPassword(SEED_TEST_ACCOUNT_ACCESS_CODE),
      hashAccountAccessCode(SEED_TEST_ACCOUNT_ACCESS_CODE),
      now,
    ]
  );
  await seedDefaultRostersForAccount(pool, SEED_TEST_ACCOUNT_ID);
}

// Seed: default club rosters (Top 14 + Pro D2) for the legacy account
// ---------------------------------------------------------------------------

/**
 * Migration : renomme "Stade Toulousain" → "Stade Toulousain Rugby Féminin"
 * dans les rosters de catégorie Elite 1 (category = 'Elite 1').
 * Fusionne les joueurs si les deux rosters coexistent dans un même compte.
 */
function normalizeClubEntityName(name: string | null | undefined): string {
  const value = (name ?? "").trim();
  if (!value) return "";
  if (value === "Stade Toulousain") return "Stade Toulousain Rugby Féminin";
  return value;
}

async function migrateStadeToulousainFeminin(pool: Pool): Promise<void> {
  const OLD_NAME = "Stade Toulousain";
  const NEW_NAME = "Stade Toulousain Rugby Féminin";

  // Corriger dans stored_rosters (table structurée)
  await pool.query(
    `UPDATE stored_rosters SET name = $1
     WHERE name = $2 AND category = 'Elite 1'
       AND NOT EXISTS (
         SELECT 1 FROM stored_rosters sr2
         WHERE sr2.account_id = stored_rosters.account_id
           AND sr2.name = $1
           AND sr2.category = 'Elite 1'
       )`,
    [NEW_NAME, OLD_NAME]
  );

  // Corriger dans les payloads JSON (account_rosters_state)
  const accounts = await pool.query<{ account_id: string; payload: string }>(
    `SELECT account_id, payload FROM account_rosters_state
     WHERE payload LIKE $1`,
    [`%${OLD_NAME}%`]
  );

  for (const row of accounts.rows) {
    const state = parseJsonOrNull<RosterStatePayload>(row.payload);
    if (!state) continue;

    let changed = false;

    // Chercher le roster avec l'ancien nom ET un éventuel doublon avec le nouveau nom
    const oldRoster = state.rosters.find(
      (r) => r.name === OLD_NAME && r.category === "Elite 1"
    );
    const newRoster = state.rosters.find(
      (r) => r.name === NEW_NAME && r.category === "Elite 1"
    );

    let updatedRosters = state.rosters;

    if (oldRoster && newRoster) {
      // Fusion : ajouter les joueurs de l'ancien roster vers le nouveau (sans doublon par id)
      const existingIds = new Set(newRoster.players.map((p) => p.id));
      const merged = {
        ...newRoster,
        players: [
          ...newRoster.players,
          ...oldRoster.players.filter((p) => !existingIds.has(p.id)),
        ],
      };
      updatedRosters = state.rosters
        .filter((r) => r.id !== oldRoster.id)
        .map((r) => (r.id === newRoster.id ? merged : r));
      console.log(
        `[migrate] Fusion Stade Toulousain → Rugby Féminin pour le compte ${row.account_id} (${oldRoster.players.length} joueurs migrés)`
      );
      changed = true;
    } else if (oldRoster) {
      // Simple renommage
      updatedRosters = state.rosters.map((r) =>
        r.id === oldRoster.id ? { ...r, name: NEW_NAME } : r
      );
      changed = true;
    }

    if (!changed) continue;

    const updatedState = { ...state, rosters: updatedRosters };
    const now = new Date().toISOString();
    await pool.query(
      `UPDATE account_rosters_state SET payload = $2, updated_at = $3 WHERE account_id = $1`,
      [row.account_id, JSON.stringify(updatedState), now]
    );
    await syncRosterDataToTables(pool, row.account_id, updatedState);
  }

  // Corriger le champ `club` des joueurs qui avaient l'ancien nom
  await pool.query(
    `UPDATE players SET club = $1 WHERE club = $2`,
    [NEW_NAME, OLD_NAME]
  );
}

async function seedDefaultRosters(pool: Pool): Promise<void> {
  await seedDefaultRostersForAccount(pool, LEGACY_ACCOUNT_ID);
}

async function migrateLegacyRosterState(pool: Pool): Promise<void> {
  if (!LEGACY_DATA_MIGRATION_TARGET_EMAIL) return;

  const targetResult = await pool.query<{ id: string }>(
    `SELECT id FROM accounts WHERE LOWER(email) = $1 LIMIT 1`,
    [LEGACY_DATA_MIGRATION_TARGET_EMAIL]
  );
  const targetAccountId = targetResult.rows[0]?.id;
  if (!targetAccountId || targetAccountId === LEGACY_ACCOUNT_ID) return;

  const states = await pool.query<{ account_id: string; payload: string }>(
    `SELECT account_id, payload FROM account_rosters_state WHERE account_id IN ($1, $2)`,
    [LEGACY_ACCOUNT_ID, targetAccountId]
  );
  const legacyPayload = states.rows.find((row) => row.account_id === LEGACY_ACCOUNT_ID)?.payload;
  const targetPayload = states.rows.find((row) => row.account_id === targetAccountId)?.payload;
  const legacyState = legacyPayload ? parseJsonOrNull<RosterStatePayload>(legacyPayload) : null;
  const targetState = targetPayload ? parseJsonOrNull<RosterStatePayload>(targetPayload) : null;

  if (!legacyState || (targetState?.rosters.length ?? 0) > 0) return;

  const requiredCategories: Championship[] = ["Top 14", "Pro D2", "Elite 1", "World Series"];
  const categories = new Set(legacyState.rosters.map((roster) => roster.category));
  if (!requiredCategories.every((category) => categories.has(category))) {
    console.error("[migration] Legacy roster state is missing required championships; migration skipped.");
    return;
  }

  const validated = rosterStatePayloadSchema.safeParse(legacyState);
  if (!validated.success) {
    console.error("[migration] Legacy roster state is invalid; migration skipped.");
    return;
  }

  const payload = validated.data as RosterStatePayload;
  await pool.query(
    `INSERT INTO account_rosters_state (account_id, payload, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (account_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
    [targetAccountId, JSON.stringify(payload), new Date().toISOString()]
  );
  await syncRosterDataToTables(pool, targetAccountId, payload);
  console.log(`[migration] Migrated ${payload.rosters.length} legacy roster(s) to account ${targetAccountId}.`);
}

/**
 * Pour chaque compte ayant au moins un effectif Women's Six Nations,
 * ajoute les joueuses du XV de France Féminin manquantes (contrôle doublon
 * par nom normalisé). Ne crée pas de nouveau roster — se greffe sur
 * les rosters W6N existants.
 */
async function seedFranceW6NPlayers(pool: Pool): Promise<void> {
  // Uniquement pour les comptes enregistrés — exclut le compte legacy
  // (usage non-authentifié) et les scopes anonymes (préfixe "anon:").
  const accounts = await pool.query<{ account_id: string }>(
    `SELECT DISTINCT account_id FROM stored_rosters
     WHERE category = $1
       AND account_id != $2
       AND account_id NOT LIKE $3`,
    ["Women's Six Nations", LEGACY_ACCOUNT_ID, `${ANONYMOUS_SCOPE_PREFIX}%`]
  );
  if (accounts.rows.length === 0) return;

  for (const { account_id } of accounts.rows) {
    const stateResult = await pool.query<{ payload: string }>(
      `SELECT payload FROM account_rosters_state WHERE account_id = $1`,
      [account_id]
    );
    if (!stateResult.rows[0]) continue;

    const state = parseJsonOrNull<RosterStatePayload>(stateResult.rows[0].payload);
    if (!state) continue;

    let changed = false;
    const updatedRosters = state.rosters.map((roster) => {
      if (roster.category !== "Women's Six Nations") return roster;

      const existingNames = new Set(
        (roster.players ?? []).map((p) => p.name.trim().toLowerCase())
      );

      const toAdd = FRANCE_W6N_SQUAD_2025_2026.filter(
        (sp) => !existingNames.has(sp.name.toLowerCase())
      ).map((sp) => ({
        id: crypto.randomUUID(),
        name: sp.name,
        positions: sp.positions,
        nationality: sp.nationality,
        gender: sp.gender,
      }));

      if (toAdd.length === 0) return roster;

      changed = true;
      console.log(
        `[seed] W6N roster "${roster.name}" (compte ${account_id}) : ajout de ${toAdd.length} joueuse(s)…`
      );
      return { ...roster, players: [...(roster.players ?? []), ...toAdd] };
    });

    if (!changed) continue;

    const updatedState = { ...state, rosters: updatedRosters };
    const now = new Date().toISOString();
    await pool.query(
      `UPDATE account_rosters_state
       SET payload = $2, updated_at = $3
       WHERE account_id = $1`,
      [account_id, JSON.stringify(updatedState), now]
    );
    await syncRosterDataToTables(pool, account_id, updatedState);
  }
}

async function ensureInitialized() {
  if (initializationPromise) {
    await initializationPromise;
    return;
  }

  const pool = getPool();
  initializationPromise = (async () => {
    await initializeSchema(pool);
    await migrateFromJsonFiles(pool);
    await backfillStructuredTables(pool);
    await migrateStadeToulousainFeminin(pool);
    await seedDefaultRosters(pool);
    await migrateLegacyRosterState(pool);
    await ensureTestAccount(pool);
    await seedElite1ForNamedAccount(pool);
    await seedFranceW6NPlayers(pool);
  })();

  await initializationPromise;
}

export async function getRostersState(): Promise<RosterStatePayload> {
  return getRostersStateForAccount(LEGACY_ACCOUNT_ID);
}

const CHAMPIONSHIP_ALIASES: Record<string, Championship> = {
  "W6N": "Women's Six Nations",
  "Women's 6 Nations": "Women's Six Nations",
};

function normalizeRosterStatePayload(payload: RosterStatePayload): RosterStatePayload {
  const normalizeChampionship = (v?: string): Championship | undefined => {
    if (!v) return undefined;
    return (CHAMPIONSHIP_ALIASES[v] ?? v) as Championship;
  };
  return {
    ...payload,
    championship: normalizeChampionship(payload.championship),
    rosters: (payload.rosters ?? []).map((r) => ({
      ...r,
      category: r.category ? (CHAMPIONSHIP_ALIASES[r.category] ?? r.category) : r.category,
    })),
  };
}

export async function getRostersStateForAccount(accountId: string): Promise<RosterStatePayload> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  const result = await pool.query<{ payload: string }>(
    "SELECT payload FROM account_rosters_state WHERE account_id = $1",
    [accountId]
  );
  const row = result.rows[0];

  if (!row) return defaultRosterState;
  const parsed = parseJsonOrNull<RosterStatePayload>(row.payload);
  if (!parsed) return defaultRosterState;
  return normalizeRosterStatePayload(parsed);
}

export async function saveRostersState(payload: RosterStatePayload): Promise<void> {
  return saveRostersStateForAccount(LEGACY_ACCOUNT_ID, payload);
}

export async function saveRostersStateForAccount(accountId: string, payload: RosterStatePayload): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);

  const previous = await pool.query<{ payload: string }>(
    `SELECT payload FROM account_rosters_state WHERE account_id = $1`,
    [accountId]
  );
  const previousParsed = previous.rows[0]
    ? parseJsonOrNull<RosterStatePayload>(previous.rows[0].payload)
    : null;
  const previousHasRosterData =
    (previousParsed?.rosters.length ?? 0) > 0 ||
    (previousParsed?.teams.length ?? 0) > 0;
  const incomingHasRosterData =
    (payload.rosters?.length ?? 0) > 0 ||
    (payload.teams?.length ?? 0) > 0;
  if (previousHasRosterData && !incomingHasRosterData) {
    throw new Error("Refusing to overwrite non-empty roster data with an empty payload");
  }
  const rosterDataUnchanged =
    JSON.stringify(previousParsed?.rosters ?? []) === JSON.stringify(payload.rosters ?? []) &&
    JSON.stringify(previousParsed?.teams ?? []) === JSON.stringify(payload.teams ?? []);

  await pool.query(
    `INSERT INTO account_rosters_state (account_id, payload, updated_at)
     VALUES ($1, $2, $3)
     ON CONFLICT(account_id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = EXCLUDED.updated_at`,
    [accountId, JSON.stringify(payload), new Date().toISOString()]
  );

  // Sync to structured tables only when roster/team content changed.
  // Welcome form mostly changes metadata (match day/championship/season),
  // and running full sync for those changes is unnecessarily expensive.
  if (!rosterDataUnchanged) {
    await syncRosterDataToTables(pool, accountId, payload);
  }
}

export async function getAccountById(accountId: string): Promise<Account | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, name, email, is_admin, is_approved, created_at, updated_at
     FROM accounts
     WHERE id = $1`,
    [accountId]
  );

  const row = result.rows[0];
  if (!row) return null;
  return mapAccountRow(row);
}

export async function authenticateAccountByEmail(input: {
  email: string;
  password: string;
}): Promise<{ account: Account | null; reason?: "invalid-credentials" | "not-approved" }> {
  await ensureInitialized();
  const normalized = normalizeEmail(input.email);
  if (!normalized) return { account: null, reason: "invalid-credentials" };

  const pool = getPool();
  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    password_hash: string;
  }>(
    `SELECT id, name, email, is_admin, is_approved, created_at, updated_at, password_hash
     FROM accounts
     WHERE LOWER(email) = $1`,
    [normalized]
  );

  const row = result.rows[0];
  if (!row) return { account: null, reason: "invalid-credentials" };
  const valid = verifyPassword(input.password, row.password_hash);
  if (!valid) return { account: null, reason: "invalid-credentials" };
  if (!row.is_approved) return { account: null, reason: "not-approved" };
  return { account: mapAccountRow(row) };
}

export async function createAccount(input: {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isApproved?: boolean;
}): Promise<CreateAccountResult> {
  await ensureInitialized();
  const pool = getPool();
  const accountName = trimAccountName(input.name);
  const email = normalizeEmail(input.email);
  validatePasswordInput(input.password);
  if (!email) {
    throw new Error("Email is required");
  }

  const passwordHash = hashPassword(input.password);
  const isAdmin = Boolean(input.isAdmin);
  const isApproved = typeof input.isApproved === "boolean" ? input.isApproved : isAdmin;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = crypto.randomUUID();
    const accessCode = generateAccountAccessCode();
    const accessCodeHash = hashAccountAccessCode(accessCode);
    const createdAt = new Date().toISOString();

    try {
      const result = await pool.query<{
        id: string;
        name: string;
        email: string;
        is_admin: boolean;
        is_approved: boolean;
        created_at: string;
        updated_at: string;
      }>(
        `INSERT INTO accounts (id, name, email, password_hash, is_admin, is_approved, access_code_hash, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8)
         RETURNING id, name, email, is_admin, is_approved, created_at, updated_at`,
        [id, accountName, email, passwordHash, isAdmin, isApproved, accessCodeHash, createdAt]
      );

      const account = mapAccountRow(result.rows[0]);
      return { account };
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      if (code !== "23505") {
        throw error;
      }
    }
  }

  throw new Error("Unable to create account");
}

export async function renameAccount(accountId: string, name: string): Promise<Account> {
  await ensureInitialized();
  const pool = getPool();
  const nextName = trimAccountName(name);

  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
  }>(
    `UPDATE accounts
     SET name = $2,
         updated_at = $3
     WHERE id = $1
    RETURNING id, name, email, is_admin, is_approved, created_at, updated_at`,
    [accountId, nextName, new Date().toISOString()]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Account not found");
  }

  return mapAccountRow(row);
}

export async function listAccountsForAdmin(): Promise<AccountListItem[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, name, email, is_admin, is_approved, created_at, updated_at
     FROM accounts
     ORDER BY created_at DESC`
  );

  return result.rows.map((row) => mapAccountRow(row));
}

export async function updateAccountByAdmin(input: {
  accountId: string;
  name?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
  isApproved?: boolean;
}): Promise<Account> {
  await ensureInitialized();
  const pool = getPool();
  const existing = await getAccountById(input.accountId);
  if (!existing) {
    throw new Error("Account not found");
  }

  const nextName = input.name ? trimAccountName(input.name) : existing.name;
  const nextEmail = input.email ? normalizeEmail(input.email) : existing.email;
  const nextIsAdmin = typeof input.isAdmin === "boolean" ? input.isAdmin : existing.isAdmin;
  const nextIsApproved = typeof input.isApproved === "boolean" ? input.isApproved : existing.isApproved;
  const nextPasswordHash = input.password?.trim()
    ? (() => {
        validatePasswordInput(input.password ?? "");
        return hashPassword(input.password ?? "");
      })()
    : null;

  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
  }>(
    `UPDATE accounts
     SET name = $2,
         email = $3,
         is_admin = $4,
         is_approved = $5,
         password_hash = COALESCE($6, password_hash),
         updated_at = $7
     WHERE id = $1
     RETURNING id, name, email, is_admin, is_approved, created_at, updated_at`,
    [
      input.accountId,
      nextName,
      nextEmail,
      nextIsAdmin,
      nextIsApproved,
      nextPasswordHash,
      new Date().toISOString(),
    ]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Account not found");
  }
  const updated = mapAccountRow(row);
  await insertAuditLog(pool, {
    tableName: "accounts", rowId: input.accountId, action: "UPDATE", by: "admin",
    before: { name: existing.name, email: existing.email, isAdmin: existing.isAdmin, isApproved: existing.isApproved },
    after: { name: updated.name, email: updated.email, isAdmin: updated.isAdmin, isApproved: updated.isApproved, passwordChanged: !!nextPasswordHash },
  });
  return updated;
}

export async function updateAccountCredentials(input: {
  accountId: string;
  email: string;
  currentPassword?: string;
  password?: string;
}): Promise<Account> {
  await ensureInitialized();
  const pool = getPool();

  const nextEmail = normalizeEmail(input.email);
  if (!nextEmail) {
    throw new Error("Email is required");
  }

  if (input.password?.trim()) {
    if (!input.currentPassword) {
      throw new Error("Current password is required");
    }

    const passwordCheck = await pool.query<{ password_hash: string }>(
      `SELECT password_hash FROM accounts WHERE id = $1`,
      [input.accountId]
    );
    const currentHash = passwordCheck.rows[0]?.password_hash;
    if (!currentHash || !verifyPassword(input.currentPassword, currentHash)) {
      throw new Error("Invalid current password");
    }
  }

  const nextPasswordHash = input.password?.trim()
    ? (() => {
        validatePasswordInput(input.password ?? "");
        return hashPassword(input.password ?? "");
      })()
    : null;

  const result = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
  }>(
    `UPDATE accounts
     SET email = $2,
         password_hash = COALESCE($3, password_hash),
         updated_at = $4
     WHERE id = $1
     RETURNING id, name, email, is_admin, is_approved, created_at, updated_at`,
    [input.accountId, nextEmail, nextPasswordHash, new Date().toISOString()]
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Account not found");
  }
  return mapAccountRow(row);
}

export async function createPasswordResetTokenForEmail(email: string): Promise<{
  account: Account | null;
  token: string | null;
}> {
  await ensureInitialized();
  const pool = getPool();
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { account: null, token: null };
  }

  const accountResult = await pool.query<{
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, name, email, is_admin, is_approved, created_at, updated_at
     FROM accounts
     WHERE LOWER(email) = $1`,
    [normalized]
  );

  const accountRow = accountResult.rows[0];
  if (!accountRow) {
    return { account: null, token: null };
  }

  const account = mapAccountRow(accountRow);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashPasswordResetToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

  await pool.query(
    `DELETE FROM account_password_resets
     WHERE account_id = $1 OR expires_at < NOW() OR used_at IS NOT NULL`,
    [account.id]
  );

  await pool.query(
    `INSERT INTO account_password_resets (token_hash, account_id, expires_at, used_at, created_at)
     VALUES ($1, $2, $3, NULL, $4)`,
    [tokenHash, account.id, expiresAt.toISOString(), now.toISOString()]
  );

  return { account, token };
}

export async function resetPasswordWithToken(input: {
  token: string;
  password: string;
}): Promise<boolean> {
  await ensureInitialized();
  validatePasswordInput(input.password);

  const pool = getPool();
  const tokenHash = hashPasswordResetToken(input.token.trim());

  const tokenResult = await pool.query<{
    token_hash: string;
    account_id: string;
    expires_at: string;
    used_at: string | null;
  }>(
    `SELECT token_hash, account_id, expires_at, used_at
     FROM account_password_resets
     WHERE token_hash = $1`,
    [tokenHash]
  );

  const tokenRow = tokenResult.rows[0];
  if (!tokenRow) return false;
  if (tokenRow.used_at) return false;
  if (new Date(tokenRow.expires_at).getTime() < Date.now()) return false;

  const passwordHash = hashPassword(input.password);
  const nowIso = new Date().toISOString();

  await pool.query(
    `UPDATE accounts
     SET password_hash = $2,
         updated_at = $3
     WHERE id = $1`,
    [tokenRow.account_id, passwordHash, nowIso]
  );

  await pool.query(
    `UPDATE account_password_resets
     SET used_at = $2
     WHERE token_hash = $1`,
    [tokenHash, nowIso]
  );

  await pool.query(
    `DELETE FROM account_password_resets
     WHERE account_id = $1 AND token_hash <> $2`,
    [tokenRow.account_id, tokenHash]
  );

  return true;
}

export async function deleteAccountByAdmin(accountId: string): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);

  const before = await getAccountById(accountId);

  // Delete structured relational data (FK order)
  await pool.query(`DELETE FROM event_log WHERE actor_account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM matches WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM player_stats WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM titles WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM stored_teams WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM players WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM stored_rosters WHERE account_id = $1`, [accountId]);

  // Delete blob data
  await pool.query(`DELETE FROM account_rosters_state WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM match_day_selections WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM summaries WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM account_password_resets WHERE account_id = $1`, [accountId]);
  await pool.query(`DELETE FROM accounts WHERE id = $1`, [accountId]);

  if (before) {
    await insertAuditLog(pool, {
      tableName: "accounts", rowId: accountId, action: "DELETE", by: "admin",
      before: { name: before.name, email: before.email, isAdmin: before.isAdmin, isApproved: before.isApproved },
    });
  }
}

export async function getMatchDaySelection(
  accountId: string,
  championship: string,
  matchDay: number
): Promise<MatchDayTeamSelection | null> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  const result = await pool.query<{
    championship: string;
    match_day: number;
    team1_id: string;
    team2_id: string;
    saved_at: string;
  }>(
    `SELECT championship, match_day, team1_id, team2_id, saved_at
     FROM match_day_selections
     WHERE account_id = $1 AND championship = $2 AND match_day = $3`,
    [accountId, championship, matchDay]
  );
  const row = result.rows[0];

  if (!row) return null;
  return {
    accountId,
    championship: row.championship,
    matchDay: row.match_day,
    team1Id: row.team1_id,
    team2Id: row.team2_id,
    savedAt: new Date(row.saved_at).toISOString(),
  };
}

export async function listMatchDaySelections(accountId: string): Promise<MatchDayTeamSelection[]> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  const result = await pool.query<{
    championship: string;
    match_day: number;
    team1_id: string;
    team2_id: string;
    saved_at: string;
  }>(
    `SELECT championship, match_day, team1_id, team2_id, saved_at
     FROM match_day_selections
      WHERE account_id = $1
      ORDER BY saved_at DESC`,
     [accountId]
  );
  const rows = result.rows;

  return rows.map((row) => ({
    accountId,
    championship: row.championship,
    matchDay: row.match_day,
    team1Id: row.team1_id,
    team2Id: row.team2_id,
    savedAt: new Date(row.saved_at).toISOString(),
  }));
}

export async function saveMatchDaySelection(input: {
  accountId: string;
  championship: string;
  matchDay: number;
  team1Id: string;
  team2Id: string;
}): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  await pool.query(
    `INSERT INTO match_day_selections
     (account_id, championship, match_day, team1_id, team2_id, saved_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (account_id, championship, match_day)
     DO UPDATE SET
       team1_id = EXCLUDED.team1_id,
       team2_id = EXCLUDED.team2_id,
       saved_at = EXCLUDED.saved_at`,
    [
      input.accountId,
      input.championship,
      input.matchDay,
      input.team1Id,
      input.team2Id,
      new Date().toISOString(),
    ]
  );
}

export async function listSummaries(accountId: string): Promise<StoredSummary[]> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  const result = await pool.query<{ payload: string }>(
    `SELECT payload FROM summaries
     WHERE account_id = $1
     ORDER BY created_at DESC`,
    [accountId]
  );
  const rows = result.rows;

  return rows
    .map((row) => {
      const parsed = parseJsonOrNull<StoredSummary>(row.payload);
      if (!parsed) return null;
      return {
        ...parsed,
        accountId: parsed.accountId ?? accountId,
      };
    })
    .filter((item): item is StoredSummary => Boolean(item));
}

export async function getSummaryById(summaryId: string, accountId: string): Promise<StoredSummary | null> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  const result = await pool.query<{ payload: string }>(
    `SELECT payload FROM summaries WHERE id = $1 AND account_id = $2`,
    [summaryId, accountId]
  );
  const row = result.rows[0];
  if (!row) return null;
  const parsed = parseJsonOrNull<StoredSummary>(row.payload);
  if (!parsed) return null;
  return {
    ...parsed,
    accountId: parsed.accountId ?? accountId,
  };
}

export async function insertSummary(summary: StoredSummary): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  await pool.query(`INSERT INTO summaries (id, created_at, payload, account_id) VALUES ($1, $2, $3, $4)`, [
    summary.id,
    summary.createdAt,
    JSON.stringify(summary),
    summary.accountId,
  ]);

  // Sync to structured relational tables
  await syncSummaryDataToTables(pool, summary);
}

export async function deleteSummary(summaryId: string, accountId: string): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await cleanupExpiredAnonymousData(pool);
  await pool.query(`DELETE FROM summaries WHERE id = $1 AND account_id = $2`, [summaryId, accountId]);

  // Clean structured data
  await removeSummaryStructuredData(pool, summaryId);
}

function mapLiveMatchRow(row: {
  id: string;
  public_slug: string;
  admin_token: string;
  admin_token_hash: string | null;
  championship: string | null;
  match_day: number | null;
  payload: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  closed_at: string | null;
}): LiveMatchRecord {
  const expiresAt = row.expires_at ? new Date(row.expires_at).toISOString() : new Date(Date.now() + getLiveSessionTtlMs()).toISOString();

  return {
    id: row.id,
    publicSlug: row.public_slug,
    adminToken: "",
    adminTokenHash: row.admin_token_hash ?? "",
    championship: row.championship,
    matchDay: row.match_day,
    state: row.payload ? parseJsonOrNull<LiveSnapshot>(row.payload) : null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    expiresAt,
    closedAt: row.closed_at ? new Date(row.closed_at).toISOString() : null,
  };
}

export async function createLiveMatch(input: {
  id: string;
  publicSlug: string;
  adminToken: string;
  championship?: string;
  matchDay?: number;
  state: LiveSnapshot;
}): Promise<LiveMatchRecord> {
  await ensureInitialized();
  const pool = getPool();
  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + getLiveSessionTtlMs()).toISOString();
  const adminTokenHash = hashLiveAdminToken(input.adminToken);
  const result = await pool.query<{
    id: string;
    public_slug: string;
    admin_token: string;
    admin_token_hash: string | null;
    championship: string | null;
    match_day: number | null;
    payload: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    closed_at: string | null;
  }>(
    `INSERT INTO live_matches
      (id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL)
     RETURNING id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at`,
    [
      input.id,
      input.publicSlug,
      "__redacted__",
      adminTokenHash,
      input.championship ?? null,
      input.matchDay ?? null,
      JSON.stringify(input.state),
      now,
      now,
      expiresAt,
    ]
  );

  return {
    ...mapLiveMatchRow(result.rows[0]),
    adminToken: input.adminToken,
  };
}

export async function getLiveMatchByPublicSlug(publicSlug: string): Promise<LiveMatchRecord | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query<{
    id: string;
    public_slug: string;
    admin_token: string;
    admin_token_hash: string | null;
    championship: string | null;
    match_day: number | null;
    payload: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    closed_at: string | null;
  }>(
    `SELECT id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at
     FROM live_matches
     WHERE public_slug = $1`,
    [publicSlug]
  );

  const row = result.rows[0];
  if (!row) return null;
  return mapLiveMatchRow(row);
}

export async function updateLiveMatchState(input: {
  matchId: string;
  adminToken: string;
  state: LiveSnapshot;
}): Promise<LiveMatchUpdateResult> {
  await ensureInitialized();
  const pool = getPool();

  const existingResult = await pool.query<{
    id: string;
    public_slug: string;
    admin_token: string;
    admin_token_hash: string | null;
    championship: string | null;
    match_day: number | null;
    payload: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    closed_at: string | null;
  }>(
    `SELECT id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at
     FROM live_matches
     WHERE id = $1`,
    [input.matchId]
  );

  const existing = existingResult.rows[0];
  if (!existing) {
    return { record: null, error: "not-found" };
  }

  const storedHash = existing.admin_token_hash;
  const incomingHash = hashLiveAdminToken(input.adminToken);
  const validToken = storedHash
    ? constantTimeEqual(storedHash, incomingHash)
    : constantTimeEqual(existing.admin_token, input.adminToken);

  if (!validToken) {
    return { record: null, error: "invalid-token" };
  }

  const expiresAt = existing.expires_at ? new Date(existing.expires_at).toISOString() : new Date(Date.now() + getLiveSessionTtlMs()).toISOString();
  if (isLiveMatchExpired(expiresAt)) {
    return { record: null, error: "expired" };
  }

  if (existing.closed_at) {
    return { record: null, error: "closed" };
  }

  const shouldCloseNow = input.state.matchEnded;
  const now = new Date().toISOString();

  const result = await pool.query<{
    id: string;
    public_slug: string;
    admin_token: string;
    admin_token_hash: string | null;
    championship: string | null;
    match_day: number | null;
    payload: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    closed_at: string | null;
  }>(
    `UPDATE live_matches
     SET payload = $2,
         updated_at = $3,
         admin_token_hash = COALESCE(admin_token_hash, $4),
         admin_token = CASE WHEN admin_token_hash IS NULL THEN '__redacted__' ELSE admin_token END,
         expires_at = COALESCE(expires_at, $5),
         closed_at = CASE WHEN $6::boolean THEN $3 ELSE closed_at END
     WHERE id = $1
     RETURNING id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at`,
    [input.matchId, JSON.stringify(input.state), now, incomingHash, expiresAt, shouldCloseNow]
  );

  const row = result.rows[0];
  if (!row) {
    return { record: null, error: "not-found" };
  }

  return {
    record: mapLiveMatchRow(row),
    error: null,
  };
}

export async function closeLiveMatchSession(input: {
  matchId: string;
  adminToken: string;
}): Promise<LiveMatchUpdateResult> {
  await ensureInitialized();
  const pool = getPool();

  const existingResult = await pool.query<{
    id: string;
    public_slug: string;
    admin_token: string;
    admin_token_hash: string | null;
    championship: string | null;
    match_day: number | null;
    payload: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    closed_at: string | null;
  }>(
    `SELECT id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at
     FROM live_matches
     WHERE id = $1`,
    [input.matchId]
  );

  const existing = existingResult.rows[0];
  if (!existing) {
    return { record: null, error: "not-found" };
  }

  const storedHash = existing.admin_token_hash;
  const incomingHash = hashLiveAdminToken(input.adminToken);
  const validToken = storedHash
    ? constantTimeEqual(storedHash, incomingHash)
    : constantTimeEqual(existing.admin_token, input.adminToken);

  if (!validToken) {
    return { record: null, error: "invalid-token" };
  }

  const expiresAt = existing.expires_at
    ? new Date(existing.expires_at).toISOString()
    : new Date(Date.now() + getLiveSessionTtlMs()).toISOString();

  if (isLiveMatchExpired(expiresAt)) {
    return { record: null, error: "expired" };
  }

  if (existing.closed_at) {
    return { record: null, error: "closed" };
  }

  const now = new Date().toISOString();
  const parsedState = existing.payload ? parseJsonOrNull<LiveSnapshot>(existing.payload) : null;
  const nextState = parsedState ? { ...parsedState, matchEnded: true, running: false } : null;

  const result = await pool.query<{
    id: string;
    public_slug: string;
    admin_token: string;
    admin_token_hash: string | null;
    championship: string | null;
    match_day: number | null;
    payload: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string | null;
    closed_at: string | null;
  }>(
    `UPDATE live_matches
     SET payload = COALESCE($2, payload),
         updated_at = $3,
         admin_token_hash = COALESCE(admin_token_hash, $4),
         admin_token = CASE WHEN admin_token_hash IS NULL THEN '__redacted__' ELSE admin_token END,
         expires_at = COALESCE(expires_at, $5),
         closed_at = $3
     WHERE id = $1
     RETURNING id, public_slug, admin_token, admin_token_hash, championship, match_day, payload, created_at, updated_at, expires_at, closed_at`,
    [input.matchId, nextState ? JSON.stringify(nextState) : null, now, incomingHash, expiresAt]
  );

  const row = result.rows[0];
  if (!row) {
    return { record: null, error: "not-found" };
  }

  return {
    record: mapLiveMatchRow(row),
    error: null,
  };
}

export function getLiveAvailability(record: LiveMatchRecord): "active" | "expired" | "closed" {
  if (record.closedAt) return "closed";
  if (isLiveMatchExpired(record.expiresAt)) return "expired";
  return "active";
}

// ---------------------------------------------------------------------------
// CRUD — Players (structured tables)
// ---------------------------------------------------------------------------

export interface DbPlayer {
  id: string;
  accountId: string;
  name: string;
  number: number | null;
  positions: string[];
  photoUrl: string | null;
  nationality: string | null;
  club: string | null;
  gender: string | null;
  rosterIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DbPlayerWithStats extends DbPlayer {
  stats: {
    points: number;
    essais: number;
    pied: number;
    tauxTransfo: number;
    cartons: number;
    drops: number;
    matchs2526: number;
    titularisations2526: number;
  } | null;
}

function mapPlayerRow(row: Record<string, unknown>): DbPlayer {
  return {
    id: row.id as string,
    accountId: row.account_id as string,
    name: row.name as string,
    number: (row.number as number) ?? null,
    positions: Array.isArray(row.positions) ? row.positions : JSON.parse((row.positions as string) || "[]"),
    photoUrl: (row.photo_url as string) ?? null,
    nationality: (row.nationality as string) ?? null,
    club: (row.club as string) ?? null,
    gender: (row.gender as string) ?? null,
    rosterIds: Array.isArray(row.roster_ids) ? row.roster_ids as string[] : [],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export async function listPlayers(
  accountId: string,
  options?: { gender?: string | null }
): Promise<DbPlayer[]> {
  await ensureInitialized();
  const pool = getPool();
  const gender = options?.gender;
  const result = await pool.query(
    `SELECT p.*,
       COALESCE(array_agg(m.roster_id) FILTER (WHERE m.roster_id IS NOT NULL), '{}') AS roster_ids
     FROM players p
     LEFT JOIN player_roster_memberships m ON m.account_id = p.account_id AND m.player_id = p.id
     WHERE p.account_id = $1${gender ? " AND p.gender = $2" : ""}
     GROUP BY p.id, p.account_id
     ORDER BY p.name`,
    gender ? [accountId, gender] : [accountId]
  );
  return result.rows.map(mapPlayerRow);
}

export async function getPlayerById(accountId: string, playerId: string): Promise<DbPlayerWithStats | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    `SELECT p.*,
       COALESCE(array_agg(m.roster_id) FILTER (WHERE m.roster_id IS NOT NULL), '{}') AS roster_ids,
       ps.points, ps.essais, ps.pied, ps.taux_transfo, ps.cartons,
       ps.drops, ps.matchs_2526, ps.titularisations_2526
     FROM players p
     LEFT JOIN player_roster_memberships m ON m.account_id = p.account_id AND m.player_id = p.id
     LEFT JOIN player_stats ps ON ps.account_id = p.account_id AND ps.player_id = p.id
     WHERE p.account_id = $1 AND p.id = $2
     GROUP BY p.id, p.account_id, ps.points, ps.essais, ps.pied, ps.taux_transfo,
              ps.cartons, ps.drops, ps.matchs_2526, ps.titularisations_2526`,
    [accountId, playerId]
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    ...mapPlayerRow(row),
    stats: row.points != null ? {
      points: row.points,
      essais: row.essais,
      pied: row.pied,
      tauxTransfo: row.taux_transfo,
      cartons: row.cartons,
      drops: row.drops,
      matchs2526: row.matchs_2526,
      titularisations2526: row.titularisations_2526,
    } : null,
  };
}

export async function createPlayer(accountId: string, input: {
  id: string; name: string; number?: number | null; positions?: string[] | null;
  photoUrl?: string | null; nationality?: string | null; club?: string | null;
  gender?: string | null;
}): Promise<DbPlayer> {
  await ensureInitialized();
  const pool = getPool();
  const now = new Date().toISOString();
  const result = await pool.query(
    `INSERT INTO players (id, account_id, name, number, positions, photo_url, nationality, club, gender, created_at, updated_at, last_modified_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10,$11)
     RETURNING *`,
    [input.id, accountId, input.name, input.number ?? null, JSON.stringify(input.positions ?? []),
     input.photoUrl ?? null, input.nationality ?? null, input.club ?? null, input.gender ?? null, now, accountId]
  );
  const player = mapPlayerRow(result.rows[0]);
  await insertAuditLog(pool, { tableName: "players", rowId: input.id, action: "INSERT", by: accountId, after: player as unknown as Record<string, unknown> });
  return player;
}

export async function updatePlayer(accountId: string, playerId: string, input: {
  name?: string; number?: number | null; positions?: string[] | null;
  photoUrl?: string | null; nationality?: string | null; club?: string | null;
  gender?: string | null;
}): Promise<DbPlayer | null> {
  await ensureInitialized();
  const pool = getPool();
  const before = await getPlayerById(accountId, playerId);
  const now = new Date().toISOString();
  const result = await pool.query(
    `UPDATE players SET
       name = COALESCE($3, name),
       number = CASE WHEN $4::integer IS NULL THEN number ELSE $4 END,
       positions = COALESCE($5, positions),
       photo_url = CASE WHEN $6::text IS NULL THEN photo_url ELSE $6 END,
       nationality = CASE WHEN $7::text IS NULL THEN nationality ELSE $7 END,
       club = CASE WHEN $8::text IS NULL THEN club ELSE $8 END,
       gender = CASE WHEN $10::text IS NULL THEN gender ELSE $10 END,
       updated_at = $9
     WHERE account_id = $1 AND id = $2
     RETURNING *`,
    [accountId, playerId, input.name ?? null, input.number ?? null,
     input.positions ? JSON.stringify(input.positions) : null,
     input.photoUrl ?? null, input.nationality ?? null, input.club ?? null, now,
     input.gender ?? null]
  );
  const row = result.rows[0];
  if (!row) return null;
  const after = mapPlayerRow(row);
  await insertAuditLog(pool, { tableName: "players", rowId: playerId, action: "UPDATE", by: accountId, before: before as unknown as Record<string, unknown>, after: after as unknown as Record<string, unknown> });
  return after;
}

export async function deletePlayer(accountId: string, playerId: string): Promise<boolean> {
  await ensureInitialized();
  const pool = getPool();
  const before = await getPlayerById(accountId, playerId);
  await pool.query("DELETE FROM player_stats WHERE account_id = $1 AND player_id = $2", [accountId, playerId]);
  const result = await pool.query(
    "DELETE FROM players WHERE account_id = $1 AND id = $2",
    [accountId, playerId]
  );
  const deleted = (result.rowCount ?? 0) > 0;
  if (deleted) {
    await insertAuditLog(pool, { tableName: "players", rowId: playerId, action: "DELETE", by: accountId, before: before as unknown as Record<string, unknown> });
  }
  return deleted;
}

export async function searchPlayers(accountId: string, query: string): Promise<DbPlayer[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM players WHERE account_id = $1 AND name ILIKE $2 ORDER BY name LIMIT 50",
    [accountId, `%${query}%`]
  );
  return result.rows.map(mapPlayerRow);
}

// ---------------------------------------------------------------------------
// Player registry — roster memberships
// ---------------------------------------------------------------------------

export async function getPlayerRosterMemberships(
  accountId: string,
  playerId: string
): Promise<string[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query<{ roster_id: string }>(
    `SELECT roster_id FROM player_roster_memberships WHERE account_id = $1 AND player_id = $2`,
    [accountId, playerId]
  );
  return result.rows.map((r) => r.roster_id);
}

export async function linkPlayerToRoster(
  accountId: string,
  playerId: string,
  rosterId: string
): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await pool.query(
    `INSERT INTO player_roster_memberships (account_id, player_id, roster_id)
     VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [accountId, playerId, rosterId]
  );
}

export async function unlinkPlayerFromRoster(
  accountId: string,
  playerId: string,
  rosterId: string
): Promise<void> {
  await ensureInitialized();
  const pool = getPool();
  await pool.query(
    `DELETE FROM player_roster_memberships WHERE account_id = $1 AND player_id = $2 AND roster_id = $3`,
    [accountId, playerId, rosterId]
  );
}

export async function getPlayersForRoster(
  accountId: string,
  rosterId: string
): Promise<DbPlayer[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    `SELECT p.*,
       array_agg(m2.roster_id) FILTER (WHERE m2.roster_id IS NOT NULL) AS roster_ids
     FROM player_roster_memberships m
     JOIN players p ON p.account_id = m.account_id AND p.id = m.player_id
     LEFT JOIN player_roster_memberships m2 ON m2.account_id = p.account_id AND m2.player_id = p.id
     WHERE m.account_id = $1 AND m.roster_id = $2
     GROUP BY p.id, p.account_id
     ORDER BY p.name`,
    [accountId, rosterId]
  );
  return result.rows.map(mapPlayerRow);
}

// ---------------------------------------------------------------------------
// Audit helper
// ---------------------------------------------------------------------------

type AuditableClient = Pick<Pool, "query"> | { query: Pool["query"] };

async function insertAuditLog(
  client: AuditableClient,
  entry: {
    tableName: string;
    rowId: string;
    action: "INSERT" | "UPDATE" | "DELETE";
    by?: string | null;
    before?: Record<string, unknown> | null;
    after?: Record<string, unknown> | null;
  },
): Promise<void> {
  await client.query(
    `INSERT INTO audit_log (table_name, row_id, action, "by", "at", "before", "after")
     VALUES ($1, $2, $3, $4, NOW(), $5, $6)`,
    [
      entry.tableName,
      entry.rowId,
      entry.action,
      entry.by ?? null,
      entry.before ? JSON.stringify(entry.before) : null,
      entry.after ? JSON.stringify(entry.after) : null,
    ],
  );
}

// ---------------------------------------------------------------------------
// CRUD — Coaches
// ---------------------------------------------------------------------------

export interface DbCoach {
  id: number;
  name: string;
  photoUrl: string | null;
  nationality: string | null;
  club: string | null;
}

function mapCoachRow(row: Record<string, unknown>): DbCoach {
  return {
    id: row.id as number,
    name: row.name as string,
    photoUrl: (row.photo_url as string) ?? null,
    nationality: (row.nationality as string) ?? null,
    club: (row.club as string) ?? null,
  };
}

export async function listCoaches(): Promise<DbCoach[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM coaches ORDER BY name");
  return result.rows.map(mapCoachRow);
}

export async function getCoachById(id: number): Promise<DbCoach | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM coaches WHERE id = $1", [id]);
  const row = result.rows[0];
  return row ? mapCoachRow(row) : null;
}

export async function createCoach(input: {
  name: string; photoUrl?: string | null; nationality?: string | null; club?: string | null;
}, modifiedBy?: string): Promise<DbCoach> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO coaches (name, photo_url, nationality, club, last_modified_by)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [input.name, input.photoUrl ?? null, input.nationality ?? null, input.club ?? null, modifiedBy ?? null]
  );
  const coach = mapCoachRow(result.rows[0]);
  await insertAuditLog(pool, { tableName: "coaches", rowId: String(coach.id), action: "INSERT", by: modifiedBy, after: coach as unknown as Record<string, unknown> });
  return coach;
}

export async function updateCoach(id: number, input: {
  name?: string; photoUrl?: string | null; nationality?: string | null; club?: string | null;
}, modifiedBy?: string): Promise<DbCoach | null> {
  await ensureInitialized();
  const pool = getPool();
  const before = await getCoachById(id);
  const result = await pool.query(
    `UPDATE coaches SET
       name = COALESCE($2, name),
       photo_url = COALESCE($3, photo_url),
       nationality = COALESCE($4, nationality),
       club = COALESCE($5, club),
       last_modified_by = COALESCE($6, last_modified_by)
     WHERE id = $1
     RETURNING *`,
    [id, input.name ?? null, input.photoUrl ?? null, input.nationality ?? null, input.club ?? null, modifiedBy ?? null]
  );
  const row = result.rows[0];
  if (!row) return null;
  const after = mapCoachRow(row);
  await insertAuditLog(pool, { tableName: "coaches", rowId: String(id), action: "UPDATE", by: modifiedBy, before: before as unknown as Record<string, unknown>, after: after as unknown as Record<string, unknown> });
  return after;
}

export async function deleteCoach(id: number, modifiedBy?: string): Promise<boolean> {
  await ensureInitialized();
  const pool = getPool();
  const before = await getCoachById(id);
  const result = await pool.query("DELETE FROM coaches WHERE id = $1", [id]);
  const deleted = (result.rowCount ?? 0) > 0;
  if (deleted) {
    await insertAuditLog(pool, { tableName: "coaches", rowId: String(id), action: "DELETE", by: modifiedBy, before: before as unknown as Record<string, unknown> });
  }
  return deleted;
}

export async function searchCoaches(query: string): Promise<DbCoach[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM coaches WHERE name ILIKE $1 ORDER BY name LIMIT 50",
    [`%${query}%`]
  );
  return result.rows.map(mapCoachRow);
}

// ---------------------------------------------------------------------------
// CRUD — Presidents
// ---------------------------------------------------------------------------

export interface DbPresident {
  id: number;
  name: string;
  photoUrl: string | null;
  nationality: string | null;
  club: string | null;
}

function mapPresidentRow(row: Record<string, unknown>): DbPresident {
  return {
    id: row.id as number,
    name: row.name as string,
    photoUrl: (row.photo_url as string) ?? null,
    nationality: (row.nationality as string) ?? null,
    club: (row.club as string) ?? null,
  };
}

export async function listPresidents(): Promise<DbPresident[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM presidents ORDER BY name");
  return result.rows.map(mapPresidentRow);
}

export async function getPresidentById(id: number): Promise<DbPresident | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM presidents WHERE id = $1", [id]);
  const row = result.rows[0];
  return row ? mapPresidentRow(row) : null;
}

export async function createPresident(input: {
  name: string; photoUrl?: string | null; nationality?: string | null; club?: string | null;
}, modifiedBy?: string): Promise<DbPresident> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO presidents (name, photo_url, nationality, club, last_modified_by)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [input.name, input.photoUrl ?? null, input.nationality ?? null, input.club ?? null, modifiedBy ?? null]
  );
  const president = mapPresidentRow(result.rows[0]);
  await insertAuditLog(pool, { tableName: "presidents", rowId: String(president.id), action: "INSERT", by: modifiedBy, after: president as unknown as Record<string, unknown> });
  return president;
}

export async function updatePresident(id: number, input: {
  name?: string; photoUrl?: string | null; nationality?: string | null; club?: string | null;
}, modifiedBy?: string): Promise<DbPresident | null> {
  await ensureInitialized();
  const pool = getPool();
  const before = await getPresidentById(id);
  const result = await pool.query(
    `UPDATE presidents SET
       name = COALESCE($2, name),
       photo_url = COALESCE($3, photo_url),
       nationality = COALESCE($4, nationality),
       club = COALESCE($5, club),
       last_modified_by = COALESCE($6, last_modified_by)
     WHERE id = $1
     RETURNING *`,
    [id, input.name ?? null, input.photoUrl ?? null, input.nationality ?? null, input.club ?? null, modifiedBy ?? null]
  );
  const row = result.rows[0];
  if (!row) return null;
  const after = mapPresidentRow(row);
  await insertAuditLog(pool, { tableName: "presidents", rowId: String(id), action: "UPDATE", by: modifiedBy, before: before as unknown as Record<string, unknown>, after: after as unknown as Record<string, unknown> });
  return after;
}

export async function deletePresident(id: number, modifiedBy?: string): Promise<boolean> {
  await ensureInitialized();
  const pool = getPool();
  const before = await getPresidentById(id);
  const result = await pool.query("DELETE FROM presidents WHERE id = $1", [id]);
  const deleted = (result.rowCount ?? 0) > 0;
  if (deleted) {
    await insertAuditLog(pool, { tableName: "presidents", rowId: String(id), action: "DELETE", by: modifiedBy, before: before as unknown as Record<string, unknown> });
  }
  return deleted;
}

export async function searchPresidents(query: string): Promise<DbPresident[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM presidents WHERE name ILIKE $1 ORDER BY name LIMIT 50",
    [`%${query}%`]
  );
  return result.rows.map(mapPresidentRow);
}

// ---------------------------------------------------------------------------
// CRUD — Competitions
// ---------------------------------------------------------------------------

export interface DbCompetition {
  id: number;
  name: string;
}

function mapCompetitionRow(row: Record<string, unknown>): DbCompetition {
  return { id: row.id as number, name: row.name as string };
}

export async function listCompetitions(): Promise<DbCompetition[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM competitions ORDER BY name");
  return result.rows.map(mapCompetitionRow);
}

export async function getCompetitionById(id: number): Promise<DbCompetition | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM competitions WHERE id = $1", [id]);
  const row = result.rows[0];
  return row ? mapCompetitionRow(row) : null;
}

export async function createCompetition(name: string): Promise<DbCompetition> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO competitions (name) VALUES ($1) RETURNING *",
    [name]
  );
  return mapCompetitionRow(result.rows[0]);
}

export async function updateCompetition(id: number, name: string): Promise<DbCompetition | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "UPDATE competitions SET name = $2 WHERE id = $1 RETURNING *",
    [id, name]
  );
  const row = result.rows[0];
  return row ? mapCompetitionRow(row) : null;
}

export async function deleteCompetition(id: number): Promise<boolean> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("DELETE FROM competitions WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// CRUD — Titles
// ---------------------------------------------------------------------------

export interface DbTitle {
  id: number;
  accountId: string | null;
  rosterId: string | null;
  competition: string | null;
  ranking: string | null;
  year: number | null;
}

function mapTitleRow(row: Record<string, unknown>): DbTitle {
  return {
    id: row.id as number,
    accountId: (row.account_id as string) ?? null,
    rosterId: (row.roster_id as string) ?? null,
    competition: (row.competition as string) ?? null,
    ranking: (row.ranking as string) ?? null,
    year: (row.year as number) ?? null,
  };
}

export async function listTitles(accountId: string): Promise<DbTitle[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM titles WHERE account_id = $1 ORDER BY year DESC, competition",
    [accountId]
  );
  return result.rows.map(mapTitleRow);
}

export async function getTitleById(id: number): Promise<DbTitle | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("SELECT * FROM titles WHERE id = $1", [id]);
  const row = result.rows[0];
  return row ? mapTitleRow(row) : null;
}

export async function createTitle(accountId: string, input: {
  rosterId: string; competition: string; ranking?: string | null; year: number;
}): Promise<DbTitle> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO titles (account_id, roster_id, competition, ranking, year, last_modified_by)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [accountId, input.rosterId, input.competition, input.ranking ?? null, input.year, accountId]
  );
  return mapTitleRow(result.rows[0]);
}

export async function updateTitle(id: number, input: {
  competition?: string; ranking?: string | null; year?: number;
}, modifiedBy?: string): Promise<DbTitle | null> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    `UPDATE titles SET
       competition = COALESCE($2, competition),
       ranking = COALESCE($3, ranking),
       year = COALESCE($4, year),
       last_modified_by = COALESCE($5, last_modified_by)
     WHERE id = $1
     RETURNING *`,
    [id, input.competition ?? null, input.ranking ?? null, input.year ?? null, modifiedBy ?? null]
  );
  const row = result.rows[0];
  return row ? mapTitleRow(row) : null;
}

export async function deleteTitle(id: number, accountId: string): Promise<boolean> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query("DELETE FROM titles WHERE id = $1 AND account_id = $2", [id, accountId]);
  return (result.rowCount ?? 0) > 0;
}

export async function searchTitlesByCompetition(accountId: string, competition: string): Promise<DbTitle[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query(
    "SELECT * FROM titles WHERE account_id = $1 AND competition ILIKE $2 ORDER BY year DESC LIMIT 50",
    [accountId, `%${competition}%`]
  );
  return result.rows.map(mapTitleRow);
}

// ---------------------------------------------------------------------------
// Performance monitoring — pg_stat_statements & index usage
// ---------------------------------------------------------------------------

export interface SlowQueryStat {
  query: string;
  calls: number;
  totalTimeMs: number;
  meanTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  rows: number;
}

export async function getSlowQueries(limit = 20): Promise<SlowQueryStat[]> {
  await ensureInitialized();
  const pool = getPool();
  try {
    await pool.query("CREATE EXTENSION IF NOT EXISTS pg_stat_statements");
    const result = await pool.query<{
      query: string; calls: string; total_exec_time: string;
      mean_exec_time: string; min_exec_time: string; max_exec_time: string; rows: string;
    }>(
      `SELECT query, calls, total_exec_time, mean_exec_time, min_exec_time, max_exec_time, rows
       FROM pg_stat_statements
       WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
       ORDER BY mean_exec_time DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map((r) => ({
      query: r.query,
      calls: Number(r.calls),
      totalTimeMs: Math.round(Number(r.total_exec_time) * 100) / 100,
      meanTimeMs: Math.round(Number(r.mean_exec_time) * 100) / 100,
      minTimeMs: Math.round(Number(r.min_exec_time) * 100) / 100,
      maxTimeMs: Math.round(Number(r.max_exec_time) * 100) / 100,
      rows: Number(r.rows),
    }));
  } catch {
    return [];
  }
}

export interface IndexUsageStat {
  table: string;
  index: string;
  indexScans: number;
  tableSize: string;
  indexSize: string;
}

export async function getIndexUsage(): Promise<IndexUsageStat[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query<{
    relname: string; indexrelname: string; idx_scan: string;
    pg_size_pretty_table: string; pg_size_pretty_index: string;
  }>(
    `SELECT
       s.relname,
       s.indexrelname,
       s.idx_scan,
       pg_size_pretty(pg_relation_size(s.relid)) AS pg_size_pretty_table,
       pg_size_pretty(pg_relation_size(s.indexrelid)) AS pg_size_pretty_index
     FROM pg_stat_user_indexes s
     JOIN pg_index i ON s.indexrelid = i.indexrelid
     WHERE s.schemaname = 'public'
     ORDER BY s.idx_scan ASC, pg_relation_size(s.indexrelid) DESC`
  );
  return result.rows.map((r) => ({
    table: r.relname,
    index: r.indexrelname,
    indexScans: Number(r.idx_scan),
    tableSize: r.pg_size_pretty_table,
    indexSize: r.pg_size_pretty_index,
  }));
}

export interface TableSizeStat {
  table: string;
  rowEstimate: number;
  totalSize: string;
  indexSize: string;
}

export async function getTableSizes(): Promise<TableSizeStat[]> {
  await ensureInitialized();
  const pool = getPool();
  const result = await pool.query<{
    relname: string; n_live_tup: string; total_size: string; index_size: string;
  }>(
    `SELECT
       c.relname,
       s.n_live_tup,
       pg_size_pretty(pg_total_relation_size(c.oid)) AS total_size,
       pg_size_pretty(pg_indexes_size(c.oid)) AS index_size
     FROM pg_class c
     JOIN pg_stat_user_tables s ON c.relname = s.relname
     WHERE c.relkind = 'r' AND s.schemaname = 'public'
     ORDER BY pg_total_relation_size(c.oid) DESC`
  );
  return result.rows.map((r) => ({
    table: r.relname,
    rowEstimate: Number(r.n_live_tup),
    totalSize: r.total_size,
    indexSize: r.index_size,
  }));
}
