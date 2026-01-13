// Shared types for match components

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'foul';
  player: string;
  team: 'home' | 'away';
  description: string;
}

export interface Player {
  number: number;
  name: string;
  position: string;
}

export interface Team {
  name: string;
  crest: string;
  players: Player[];
}

export interface MatchStatsData {
  attacks: { home: number; away: number };
  dangerousAttacks: { home: number; away: number };
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface AdditionalStats {
  shotsOffGoal: { home: number; away: number };
  blockedShots: { home: number; away: number };
  shotsInsideBox: { home: number; away: number };
  shotsOutsideBox: { home: number; away: number };
  fouls: { home: number; away: number };
  offsides: { home: number; away: number };
  goalkeeperSaves: { home: number; away: number };
  totalPasses: { home: number; away: number };
  passesAccurate: { home: number; away: number };
  passesPercentage: { home: number; away: number };
  expectedGoals: { home: number; away: number };
  goalsPrevented: { home: number; away: number };
}

export interface GroupTableRow {
  position: number;
  team: string;
  crest: string;
  played: number;
  goalDiff: number;
  points: number;
}

export interface LineupData {
  home: Player[];
  away: Player[];
  homeFormation?: string;
  awayFormation?: string;
  homeStartingXI?: Player[];
  homeSubs?: Player[];
  awayStartingXI?: Player[];
  awaySubs?: Player[];
}

