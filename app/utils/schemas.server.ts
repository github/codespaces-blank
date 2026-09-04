import { z } from "zod";

// ---------------------------------------------------------------------------
// Safe string — strips HTML tags to prevent stored-XSS
// ---------------------------------------------------------------------------

const STRIP_HTML = /<[^>]*>/g;

/** z.string() that strips HTML tags on parse. Use for user-visible text fields. */
export const safeString = () => z.string().transform((v) => v.replace(STRIP_HTML, "").trim());

// ---------------------------------------------------------------------------
// Primitives & reusable atoms
// ---------------------------------------------------------------------------

const playerPositionSchema = z.string();

const playerStatsSchema = z.object({
  points: z.number(),
  essais: z.number(),
  pied: z.number(),
  tauxTransfo: z.number(),
  cartons: z.number(),
  drops: z.number(),
  matchs2526: z.number(),
  titularisations2526: z.number(),
}).partial().passthrough();

const playerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  number: z.number().nullable().optional(),
  positions: z.array(playerPositionSchema).nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  club: z.string().nullable().optional(),
  stats: playerStatsSchema.nullable().optional(),
}).passthrough();

const compositionEntrySchema = z.object({
  player: playerSchema,
  number: z.number(),
}).passthrough();

const coachSchema = z.object({
  name: z.string().min(1),
  photoUrl: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  club: z.string().nullable().optional(),
}).passthrough();

const presidentSchema = z.object({
  name: z.string().min(1),
  photoUrl: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  club: z.string().nullable().optional(),
}).passthrough();

const titleSchema = z.object({
  competition: z.string().min(1),
  ranking: z.string().min(1),
  year: z.number(),
}).passthrough();

const matchFixtureSchema = z.object({
  date: z.string().min(1),
  time: z.string().nullable().optional(),
  opponent: z.string().min(1),
  competition: z.string().nullable().optional(),
  isHome: z.boolean(),
  location: z.string().nullable().optional(),
  scoreHome: z.number().nullable().optional(),
  scoreAway: z.number().nullable().optional(),
  status: z.string().nullable().optional(),
}).passthrough();

const seasonDataSchema = z.object({
  players: z.array(playerSchema),
  coach: z.string().nullable().optional(),
  calendar: z.array(matchFixtureSchema).nullable().optional(),
}).passthrough();

const rosterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nickname: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  coach: z.string().nullable().optional(),
  coachData: coachSchema.nullable().optional(),
  coachesData: z.array(coachSchema).nullable().optional(),
  president: z.string().nullable().optional(),
  presidentData: presidentSchema.nullable().optional(),
  players: z.array(playerSchema),
  seasons: z.record(z.string(), seasonDataSchema).nullable().optional(),
  category: z.string().nullable().optional(),
  founded_in: z.number().nullable().optional(),
  titles: z.array(titleSchema).nullable().optional(),
}).passthrough();

const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nickname: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  rosterId: z.string().min(1),
  captainPlayerId: z.string().nullable().optional(),
  starters: z.array(compositionEntrySchema),
  substitutes: z.array(compositionEntrySchema),
}).passthrough();

// ---------------------------------------------------------------------------
// API payload schemas
// ---------------------------------------------------------------------------

// POST /api/rosters
export const rosterStatePayloadSchema = z.object({
  rosters: z.array(rosterSchema),
  teams: z.array(teamSchema),
  activeRosterId: z.string().nullable(),
  matchDay: z.string().optional(),
  season: z.string().optional(),
  sport: z.enum(["Rugby", "Football"]).optional(),
  championship: z.enum(["Top 14", "Pro D2", "Elite 1", "Women's Six Nations", "World Series"]).optional(),
});

// POST /api/account — discriminated union by intent
const accountCreateSchema = z.object({
  intent: z.literal("create"),
  name: safeString().pipe(z.string().min(1)),
  email: z.string().email(),
  password: z.string().min(6),
});

const accountLoginSchema = z.object({
  intent: z.literal("login"),
  email: z.string().email(),
  password: z.string().min(1),
});

const accountRenameSchema = z.object({
  intent: z.literal("rename"),
  name: safeString().pipe(z.string().min(1)),
});

const accountUpdateProfileSchema = z.object({
  intent: z.literal("update-profile"),
  email: z.string().email(),
  currentPassword: z.string().optional(),
  password: z.string().optional(),
});

const accountForgotPasswordSchema = z.object({
  intent: z.literal("forgot-password"),
  email: z.string().email(),
});

const accountResetPasswordSchema = z.object({
  intent: z.literal("reset-password"),
  token: z.string().min(1),
  password: z.string().min(6),
});

const accountLogoutSchema = z.object({
  intent: z.literal("logout"),
});

export const accountActionSchema = z.discriminatedUnion("intent", [
  accountCreateSchema,
  accountLoginSchema,
  accountRenameSchema,
  accountUpdateProfileSchema,
  accountForgotPasswordSchema,
  accountResetPasswordSchema,
  accountLogoutSchema,
]);

// PATCH /api/admin-accounts
export const adminPatchSchema = z.object({
  accountId: z.string().min(1),
  name: safeString().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  isAdmin: z.boolean().optional(),
  isApproved: z.boolean().optional(),
});

// DELETE /api/admin-accounts
export const adminDeleteSchema = z.object({
  accountId: z.string().min(1),
});

// POST /api/match-day-teams
export const matchDayTeamsSchema = z.object({
  championship: z.string().min(1),
  matchDay: z.union([z.number(), z.string()]).transform((v) => {
    const n = Number(v);
    if (Number.isNaN(n)) throw new Error("matchDay must be a number");
    return n;
  }),
  team1Id: z.string().min(1),
  team2Id: z.string().min(1),
});

// POST /api/summaries
const summaryTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const summaryCreateSchema = z.object({
  currentTime: z.number(),
  summary: z.record(z.string(), z.number()),
  events: z.array(z.record(z.string(), z.unknown())),
  teams: z.array(summaryTeamSchema).optional(),
  matchDay: z.number().optional(),
  matchDate: z.string().optional(),
  matchField: z.string().optional(),
  matchReferee: z.string().optional(),
});

// DELETE /api/summaries
export const summaryDeleteSchema = z.object({
  id: z.string().min(1),
});

// LiveSnapshot (for live-matches & live-match-update)
const liveTeamViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string().optional(),
});

const eventSummaryTableStatSchema = z.object({
  label: z.string(),
  value: z.number(),
});

const eventSummaryTableTeamSchema = z.object({
  teamName: z.string(),
  stats: z.array(eventSummaryTableStatSchema),
});

const eventSummaryTableSchema = z.object({
  halfLabel: z.string(),
  teams: z.tuple([eventSummaryTableTeamSchema, eventSummaryTableTeamSchema]),
});

const eventSchema = z.object({
  type: z.string(),
  time: z.number(),
  timelineHalf: z.union([z.literal(1), z.literal(2)]).optional(),
  timelineMinute: z.number().optional(),
  timelineAdditionalMinute: z.number().optional(),
  timelineSecond: z.number().optional(),
  team: teamSchema.optional(),
  videoReason: z.enum(["essai", "jeu déloyal"]).optional(),
  player: playerSchema.optional(),
  playerNumber: z.number().optional(),
  ref: z.string().optional(),
  concussion: z.boolean().optional(),
  playerOut: playerSchema.optional(),
  playerOutNumber: z.number().optional(),
  playerIn: playerSchema.optional(),
  playerInNumber: z.number().optional(),
  summary: z.string().optional(),
  summaryTable: eventSummaryTableSchema.optional(),
});

export const liveSnapshotSchema = z.object({
  currentTime: z.number(),
  running: z.boolean(),
  currentHalf: z.union([z.literal(1), z.literal(2)]),
  matchEnded: z.boolean(),
  events: z.array(eventSchema),
  teams: z.array(liveTeamViewSchema),
  team1Id: z.string(),
  team2Id: z.string(),
  scores: z.array(z.number()),
  penalties: z.array(z.number()),
  enAvant: z.array(z.number()),
  touchePerdue: z.array(z.number()),
  meleePerdue: z.array(z.number()),
  turnover: z.array(z.number()),
  jeuAuPied: z.array(z.number()),
});

// POST /api/live-matches
export const liveMatchCreateSchema = z.object({
  championship: z.string().optional(),
  matchDay: z.union([z.string(), z.number()]).optional(),
  state: liveSnapshotSchema,
});

// PATCH /api/live-matches/:matchId
export const liveMatchUpdateSchema = z.object({
  state: liveSnapshotSchema,
});

// ---------------------------------------------------------------------------
// CRUD — Players
// ---------------------------------------------------------------------------

export const playerCreateApiSchema = z.object({
  id: z.string().min(1),
  name: safeString().pipe(z.string().min(1)),
  number: z.number().nullable().optional(),
  positions: z.array(z.string()).nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  nationality: safeString().nullable().optional(),
  club: safeString().nullable().optional(),
});

export const playerUpdateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)).optional(),
  number: z.number().nullable().optional(),
  positions: z.array(z.string()).nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  nationality: safeString().nullable().optional(),
  club: safeString().nullable().optional(),
});

// ---------------------------------------------------------------------------
// CRUD — Coaches
// ---------------------------------------------------------------------------

export const coachCreateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)),
  photoUrl: z.string().nullable().optional(),
  nationality: safeString().nullable().optional(),
  club: safeString().nullable().optional(),
});

export const coachUpdateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)).optional(),
  photoUrl: z.string().nullable().optional(),
  nationality: safeString().nullable().optional(),
  club: safeString().nullable().optional(),
});

// ---------------------------------------------------------------------------
// CRUD — Presidents
// ---------------------------------------------------------------------------

export const presidentCreateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)),
  photoUrl: z.string().nullable().optional(),
  nationality: safeString().nullable().optional(),
  club: safeString().nullable().optional(),
});

export const presidentUpdateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)).optional(),
  photoUrl: z.string().nullable().optional(),
  nationality: safeString().nullable().optional(),
  club: safeString().nullable().optional(),
});

// ---------------------------------------------------------------------------
// CRUD — Competitions
// ---------------------------------------------------------------------------

export const competitionCreateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)),
});

export const competitionUpdateApiSchema = z.object({
  name: safeString().pipe(z.string().min(1)),
});

// ---------------------------------------------------------------------------
// CRUD — Titles
// ---------------------------------------------------------------------------

export const titleCreateApiSchema = z.object({
  rosterId: z.string().min(1),
  competition: safeString().pipe(z.string().min(1)),
  ranking: safeString().nullable().optional(),
  year: z.number(),
});

export const titleUpdateApiSchema = z.object({
  competition: safeString().pipe(z.string().min(1)).optional(),
  ranking: safeString().nullable().optional(),
  year: z.number().optional(),
});

// ---------------------------------------------------------------------------
// Helper: parse with Zod and return a formatted error response or parsed data
// ---------------------------------------------------------------------------

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; response: Response };

export function parsePayload<T>(
  schema: z.ZodType<T>,
  raw: unknown
): ParseResult<T> {
  const result = schema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const issues = result.error.issues.map(
    (i) => `${i.path.join(".")}: ${i.message}`
  );
  console.error("[parsePayload] Validation failed:", issues);
  return {
    success: false,
    response: Response.json(
      { ok: false, error: "validation-error", details: issues },
      { status: 400 }
    ),
  };
}
