export type MatchData = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  date: string;
  odds: {
    home: number;
    draw: number;
    away: number;
    homeDraw: number;
    homeAway: number;
    awayDraw: number;
    overUnder: number;
  };
};

export type LiveSportsData = {
  live: Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: string;
    awayScore: string;
    matchTime: string;
    odds: Record<string, string>;
    highlights: Record<string, string>;
  }>;
  '26-september': Array<{
    id: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: string;
    awayScore: string;
    matchTime: string;
    odds: Record<string, string>;
    highlights: Record<string, string>;
  }>;
};

export type AccumulatorMatch = {
  id: string;
  date: string;
  time: string;
  league: string;
  homeTeam: { name: string; logo: string; color: string };
  awayTeam: { name: string; logo: string; color: string };
  odds: string;
  betType: string;
};

// Mock live sports data
export const liveSportsData: LiveSportsData = {
  live: [
    {
      id: 'live-1',
      homeTeam: 'Manchester City',
      awayTeam: 'Manchester United',
      homeScore: '3 | 2 1',
      awayScore: '2 | 0 2',
      matchTime: '75:45 / 2st half / Round 26',
      odds: {
        '1': '4.97',
        X: '5.97',
        '2': '27',
        '1X': '27',
        '12': '1.97',
        '2X': '5.97',
        '+206': '+206',
      },
      highlights: {
        X: 'yellow',
        '1X': 'green-up',
        '2': 'red-down',
      },
    },
  ],
  '26-september': [
    {
      id: 'sep26-1',
      homeTeam: 'Manchester City',
      awayTeam: 'Manchester United',
      homeScore: '0',
      awayScore: '0',
      matchTime: '26 SEMPTEMBER 14:00',
      odds: {
        '1': '4.97',
        X: '5.97',
        '2': '27',
        '1X': '1.97',
        '12': '1.97',
        '2X': '5.97',
        '+206': '+206',
      },
      highlights: {
        '2': 'red-down',
        '12': 'yellow',
      },
    },
    {
      id: 'sep26-2',
      homeTeam: 'Manchester City',
      awayTeam: 'Manchester United',
      homeScore: '0',
      awayScore: '0',
      matchTime: '26 SEMPTEMBER 16:30',
      odds: {
        '1': '4.97',
        X: '5.97',
        '2': '27',
        '1X': '1.97',
        '12': '1.97',
        '2X': '5.97',
        '+206': '+206',
      },
      highlights: {
        '12': 'yellow',
      },
    },
  ],
};

// Live Accumulator data
export const accumulatorMatches: AccumulatorMatch[] = [
  {
    id: 'acc-1',
    date: '26/09',
    time: '09:15',
    league: '199878 / Malaysia. SuperLeague / 2nd half',
    homeTeam: { name: 'Manchester city', logo: 'MC', color: '#1976D2' },
    awayTeam: { name: 'Manchester united', logo: 'MU', color: '#D32F2F' },
    odds: '5.97',
    betType: 'Total Under 1.5',
  },
  {
    id: 'acc-2',
    date: '26/09',
    time: '09:15',
    league: '199878 / Malaysia. SuperLeague / 2nd half',
    homeTeam: { name: 'Manchester city', logo: 'MC', color: '#1976D2' },
    awayTeam: { name: 'Manchester united', logo: 'MU', color: '#D32F2F' },
    odds: '5.97',
    betType: 'Total Under 1.5',
  },
  {
    id: 'acc-3',
    date: '26/09',
    time: '09:15',
    league: '199878 / Malaysia. SuperLeague / 2nd half',
    homeTeam: { name: 'Manchester city', logo: 'MC', color: '#1976D2' },
    awayTeam: { name: 'Manchester united', logo: 'MU', color: '#D32F2F' },
    odds: '5.97',
    betType: 'Total Under 1.5',
  },
];

// Mock data for demonstration
export const matches: MatchData[] = [
  {
    id: '1',
    league: 'Ukraine Premier Liga',
    homeTeam: 'Manchester City',
    awayTeam: 'Manchester United',
    homeScore: 3,
    awayScore: 2,
    status: 'live',
    time: '2nd half, 75 minutes',
    date: '26 SEPTEMBER',
    odds: {
      home: 4.97,
      draw: 5.97,
      away: 27,
      homeDraw: 27,
      homeAway: 1.97,
      awayDraw: 5.97,
      overUnder: 206,
    },
  },
  {
    id: '2',
    league: 'English Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Manchester United',
    homeScore: 1,
    awayScore: 1,
    status: 'upcoming',
    time: '1st half, 75 minutes / Round 26',
    date: '26 SEPTEMBER',
    odds: {
      home: 4.97,
      draw: 5.97,
      away: 27,
      homeDraw: 27,
      homeAway: 1.97,
      awayDraw: 5.97,
      overUnder: 206,
    },
  },
  {
    id: '3',
    league: 'English Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Manchester United',
    homeScore: 1,
    awayScore: 1,
    status: 'upcoming',
    time: '1st half, 75 minutes / Round 26',
    date: '26 SEPTEMBER',
    odds: {
      home: 4.97,
      draw: 5.97,
      away: 27,
      homeDraw: 27,
      homeAway: 1.97,
      awayDraw: 5.97,
      overUnder: 206,
    },
  },
  // Spain La Liga
  {
    id: '4',
    league: 'Spain La Liga',
    awayTeam: 'Barcelona',
    homeTeam: 'PSG',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 20:00',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.8,
      draw: 3.4,
      away: 2.5,
      homeDraw: 1.6,
      homeAway: 1.4,
      awayDraw: 1.7,
      overUnder: 206,
    },
  },
  {
    id: '5',
    league: 'Spain La Liga',
    homeTeam: 'PSG',
    awayTeam: 'Sevilla',
    homeScore: 1,
    awayScore: 0,
    status: 'live',
    time: '2nd half, 67 minutes',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.1,
      draw: 3.3,
      away: 3.6,
      homeDraw: 1.4,
      homeAway: 1.25,
      awayDraw: 1.8,
      overUnder: 206,
    },
  },
  // Germany Bundesliga
  {
    id: '6',
    league: 'Germany Bundesliga',
    homeTeam: 'PSG',
    awayTeam: 'Borussia Dortmund',
    homeScore: 3,
    awayScore: 1,
    status: 'live',
    time: '2nd half, 82 minutes',
    date: '26 SEPTEMBER',
    odds: {
      home: 1.45,
      draw: 4.2,
      away: 7.5,
      homeDraw: 1.15,
      homeAway: 1.05,
      awayDraw: 2.8,
      overUnder: 206,
    },
  },
  {
    id: '7',
    league: 'Germany Bundesliga',
    homeTeam: 'PSG',
    awayTeam: 'Bayer Leverkusen',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 15:30',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.3,
      draw: 3.4,
      away: 3.1,
      homeDraw: 1.45,
      homeAway: 1.3,
      awayDraw: 1.8,
      overUnder: 206,
    },
  },
  // Italy Serie A
  {
    id: '8',
    league: 'Italy Serie A',
    homeTeam: 'PSG',
    awayTeam: 'AC Milan',
    homeScore: 1,
    awayScore: 1,
    status: 'live',
    time: '2nd half, 58 minutes',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.2,
      draw: 3.1,
      away: 3.4,
      homeDraw: 1.35,
      homeAway: 1.25,
      awayDraw: 1.75,
      overUnder: 206,
    },
  },
  {
    id: '9',
    league: 'Italy Serie A',
    homeTeam: 'PSG',
    awayTeam: 'Napoli',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 18:45',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.5,
      draw: 3.2,
      away: 2.8,
      homeDraw: 1.5,
      homeAway: 1.35,
      awayDraw: 1.85,
      overUnder: 206,
    },
  },
  // France Ligue 1
  {
    id: '10',
    league: 'France Ligue 1',
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    homeScore: 2,
    awayScore: 0,
    status: 'live',
    time: '1st half, 35 minutes',
    date: '26 SEPTEMBER',
    odds: {
      home: 1.6,
      draw: 3.8,
      away: 5.5,
      homeDraw: 1.2,
      homeAway: 1.1,
      awayDraw: 2.5,
      overUnder: 206,
    },
  },
  {
    id: '11',
    league: 'France Ligue 1',
    homeTeam: 'Lyon',
    awayTeam: 'Monaco',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 21:00',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.7,
      draw: 3.4,
      away: 2.6,
      homeDraw: 1.55,
      homeAway: 1.4,
      awayDraw: 1.85,
      overUnder: 206,
    },
  },
  // Champions League
  {
    id: '12',
    league: 'Champions League',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 21:00',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.8,
      draw: 3.4,
      away: 2.5,
      homeDraw: 1.6,
      homeAway: 1.4,
      awayDraw: 1.7,
      overUnder: 206,
    },
  },
  {
    id: '13',
    league: 'Champions League',
    homeTeam: 'Barcelona',
    awayTeam: 'Bayern Munich',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 21:00',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.6,
      draw: 3.3,
      away: 2.7,
      homeDraw: 1.5,
      homeAway: 1.35,
      awayDraw: 1.8,
      overUnder: 206,
    },
  },
  // NBA
  {
    id: '14',
    league: 'NBA',
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    homeScore: 98,
    awayScore: 95,
    status: 'live',
    time: '4th Quarter, 2:34',
    date: '26 SEPTEMBER',
    odds: {
      home: 1.85,
      draw: 0,
      away: 1.95,
      homeDraw: 0,
      homeAway: 0,
      awayDraw: 0,
      overUnder: 206,
    },
  },
  {
    id: '15',
    league: 'NBA',
    homeTeam: 'Celtics',
    awayTeam: 'Heat',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 20:00',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.1,
      draw: 0,
      away: 1.75,
      homeDraw: 0,
      homeAway: 0,
      awayDraw: 0,
      overUnder: 206,
    },
  },
  // NFL
  {
    id: '16',
    league: 'NFL',
    homeTeam: 'Chiefs',
    awayTeam: 'Bills',
    homeScore: 24,
    awayScore: 21,
    status: 'live',
    time: '4th Quarter, 8:45',
    date: '26 SEPTEMBER',
    odds: {
      home: 1.9,
      draw: 0,
      away: 1.9,
      homeDraw: 0,
      homeAway: 0,
      awayDraw: 0,
      overUnder: 206,
    },
  },
  {
    id: '17',
    league: 'NFL',
    homeTeam: 'Cowboys',
    awayTeam: 'Eagles',
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming',
    time: '26 SEPTEMBER 20:20',
    date: '26 SEPTEMBER',
    odds: {
      home: 2.2,
      draw: 0,
      away: 1.7,
      homeDraw: 0,
      homeAway: 0,
      awayDraw: 0,
      overUnder: 206,
    },
  },
];

export const sportTypes = [
  { name: 'Football', icon: 'material-symbols:sports-soccer' },
  { name: 'Tennis', icon: 'material-symbols:sports-tennis' },
  { name: 'Basketball', icon: 'material-symbols:sports-basketball' },
  { name: 'Ice Hockey', icon: 'material-symbols:sports-hockey' },
  { name: 'Volleyball', icon: 'material-symbols:sports-volleyball' },
  { name: 'Cricket', icon: 'material-symbols:sports-cricket' },
  { name: 'Esports', icon: 'material-symbols:sports-esports' },
];
