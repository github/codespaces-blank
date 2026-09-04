import type { Event } from "~/types/tracker";

export interface LiveTeamView {
  id: string;
  name: string;
  nickname?: string;
}

export interface LiveSnapshot {
  currentTime: number;
  running: boolean;
  currentHalf: 1 | 2;
  matchEnded: boolean;
  events: Event[];
  teams: LiveTeamView[];
  team1Id: string;
  team2Id: string;
  scores: number[];
  penalties: number[];
  enAvant: number[];
  touchePerdue: number[];
  meleePerdue: number[];
  turnover: number[];
  jeuAuPied: number[];
}

export interface LiveStreamMessage {
  type: "snapshot";
  payload: LiveSnapshot;
  updatedAt: string;
  availability?: "active" | "closed" | "expired";
}
