import type { MatchFixture } from "~/types/tracker";

interface IcsEvent {
  summary: string;
  dtstart: string;
  location: string;
  description: string;
}

/**
 * Fetch and parse a .ics calendar URL into raw ICS events.
 */
export async function fetchIcsEvents(icsUrl: string): Promise<IcsEvent[]> {
  // Convert webcal:// to https://
  const url = icsUrl.replace(/^webcal:\/\//, "https://");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`ICS fetch failed: ${res.status}`);
  const text = await res.text();
  return parseIcsText(text);
}

function parseIcsText(text: string): IcsEvent[] {
  const events: IcsEvent[] = [];
  // Unfold lines (RFC 5545: continuation lines start with space/tab)
  const unfolded = text.replace(/\r?\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);

  let inEvent = false;
  let current: Partial<IcsEvent> = {};

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      inEvent = true;
      current = {};
    } else if (line === "END:VEVENT") {
      inEvent = false;
      if (current.summary) {
        events.push({
          summary: current.summary ?? "",
          dtstart: current.dtstart ?? "",
          location: current.location ?? "",
          description: current.description ?? "",
        });
      }
    } else if (inEvent) {
      const colonIdx = line.indexOf(":");
      if (colonIdx < 0) continue;
      const key = line.slice(0, colonIdx).split(";")[0]; // strip params like DTSTART;VALUE=DATE
      const value = line.slice(colonIdx + 1);
      switch (key) {
        case "SUMMARY":
          current.summary = value;
          break;
        case "DTSTART":
          current.dtstart = value;
          break;
        case "LOCATION":
          current.location = value;
          break;
        case "DESCRIPTION":
          current.description = value;
          break;
      }
    }
  }
  return events;
}

function unescapeIcsText(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\\\/g, "\\")
    .replace(/\\;/g, ";");
}

function parseIcsDtstart(dtstart: string): { date: string; time?: string } {
  // Format: 20260326T200000Z or 20260326
  const match = dtstart.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})\d{2}Z?)?$/);
  if (!match) return { date: dtstart };
  const [, year, month, day, hour, minute] = match;
  const date = `${year}-${month}-${day}`;
  if (hour && minute) {
    // Convert UTC to Europe/Paris
    const utcDate = new Date(`${date}T${hour}:${minute}:00Z`);
    const parisTime = utcDate.toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const parisDate = utcDate.toLocaleDateString("fr-CA", {
      timeZone: "Europe/Paris",
    }); // YYYY-MM-DD
    return { date: parisDate, time: parisTime };
  }
  return { date };
}

function extractCompetition(description: string): string | undefined {
  const unescaped = unescapeIcsText(description);
  // e.g. "Championnat Pro D2, Journée 24 ..."
  const match = unescaped.match(/^(Championnat [^,\n]+),\s*([^\n]+)/);
  if (match) return `${match[1].trim()}, ${match[2].trim()}`;
  return undefined;
}

function parseTeams(summary: string): { home: string; away: string } | null {
  // e.g. "🏉 Team A vs Team B" or "🏉 Team A vs Team B (Time TBC)"
  const cleaned = summary.replace(/^🏉\s*/, "").replace(/\s*\(Time TBC\)\s*$/, "").trim();
  const parts = cleaned.split(/\s+vs\s+/);
  if (parts.length !== 2) return null;
  return { home: parts[0].trim(), away: parts[1].trim() };
}

/**
 * Normalize a team name for fuzzy matching.
 * Strips common suffixes, accents, and lowercases.
 */
function normalizeTeamName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+rugby$/i, "")
    .replace(/\s+pb$/i, "")
    .replace(/\s+xv$/i, "")
    .trim();
}

function teamMatches(rosterName: string, icsTeamName: string): boolean {
  const normRoster = normalizeTeamName(rosterName);
  const normIcs = normalizeTeamName(icsTeamName);
  // Exact match after normalization
  if (normRoster === normIcs) return true;
  // One contains the other
  if (normRoster.includes(normIcs) || normIcs.includes(normRoster)) return true;
  return false;
}

/**
 * Build MatchFixture array from an ICS feed for a specific team.
 */
export async function buildCalendarForTeam(
  icsUrl: string,
  teamName: string,
): Promise<MatchFixture[]> {
  const events = await fetchIcsEvents(icsUrl);
  const fixtures: MatchFixture[] = [];

  for (const ev of events) {
    const teams = parseTeams(ev.summary);
    if (!teams) continue;

    const isHome = teamMatches(teamName, teams.home);
    const isAway = teamMatches(teamName, teams.away);
    if (!isHome && !isAway) continue;

    const { date, time } = parseIcsDtstart(ev.dtstart);
    const opponent = isHome ? teams.away : teams.home;
    const competition = extractCompetition(ev.description);

    fixtures.push({
      date,
      time,
      opponent,
      competition,
      isHome,
      location: ev.location || undefined,
      status: "upcoming",
    });
  }

  return fixtures.sort((a, b) => a.date.localeCompare(b.date));
}
