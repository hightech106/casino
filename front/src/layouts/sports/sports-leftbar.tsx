import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Stack,
  Typography,
  Collapse,
  IconButton,
  Chip,
  Button,
  useTheme,
  alpha,
  Drawer,
  useMediaQuery,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { useDispatch, useSelector } from 'src/store';
import { setLiveFilter, updateSportsList } from 'src/store/reducers/sports';
import { useFavorites } from 'src/hooks/use-favorites';
import { useSportsData } from 'src/hooks/use-sports-data';
// types
import type { ISportsList, ISportsMatch, ISportsEvent } from 'src/types/sports';
import gift from '../../assets/sports/gift.png';
import star from '../../assets/sports/star.png';
import englandPremier from '../../assets/sports/england premier.png';
import mc from '../../assets/sports/mc.png';
import mu from '../../assets/sports/mu.png';
import league from '../../assets/sports/league.png';
import china from '../../assets/sports/china.png';
import ukraine from '../../assets/sports/ukraine.png';
import Footer from '../global/footer';

// ----------------------------------------------------------------------

type MatchData = {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
};

type SportCategory = {
  id: string;
  name: string;
  icon: string;
  count: number;
  expanded?: boolean;
  matches?: MatchData[];
};

type Props = {
  openNav?: boolean;
  onCloseNav?: VoidFunction;
};

export default function SportsLeftbar({ openNav = false, onCloseNav }: Props) {
  const theme = useTheme();
  const { t, currentLang } = useLocales();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { get_sports_list } = useApi();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const isMobile = useMediaQuery('(max-width: 1024px)');

  // Use sports data from hook instead of direct API calls
  const { matches, loading: sportsLoading } = useSportsData();

  // State
  const [sportToggle, setSportToggle] = useState<'live' | 'sport'>('live');
  const [topGamesPage, setTopGamesPage] = useState(1);
  const [sportCategories, setSportCategories] = useState<SportCategory[]>([]);
  const [liveEventCount, setLiveEventCount] = useState(0);
  const [favoriteMatchesOpen, setFavoriteMatchesOpen] = useState(false);
  const [recommendedOpen, setRecommendedOpen] = useState(false);
  const [topGamesOpen, setTopGamesOpen] = useState(true);
  const [topGame, setTopGame] = useState<ISportsEvent | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch sports list for Redux store (still needed for sports navigation)
  const fetchSportsList = useCallback(async () => {
    try {
      const sportsListRes = await get_sports_list('ALL', currentLang.value);
      if (sportsListRes?.data) {
        dispatch(updateSportsList(sportsListRes.data));
      }
    } catch (error) {
      console.error('Error fetching sports list:', error);
    }
  }, [get_sports_list, currentLang.value, dispatch]);

  useEffect(() => {
    fetchSportsList();
  }, [fetchSportsList]);

  // Process live matches data from hook
  useEffect(() => {
    setLiveEventCount(matches.length);

    // Set the first live match as top game
    setTopGame(matches[0]);

    // Create sport categories from the data
    const categories: SportCategory[] = [
      {
        id: 'football',
        name: 'Football',
        icon: 'sports:soccer',
        count: matches.length,
        expanded: true,
        matches: matches.map((event: any) => ({
          id: event.id.toString(),
          league: event.league?.name || 'Unknown League',
          homeTeam: event.home?.name || 'Home Team',
          awayTeam: event.away?.name || 'Away Team',
          homeScore: event.scores?.home ?? 0,
          awayScore: event.scores?.away ?? 0,
          status: event.time_status === 1 ? ('live' as const) : ('upcoming' as const),
          time: event.f_status?.elapsed
            ? `${event.f_status.elapsed}' ${event.f_status.short}`
            : 'Match Time',
          odds: {
            home: (() => {
              const matchWinnerMarket = event.odds?.find(
                (m: any) => m.id === 1 || m.name === 'Match Winner'
              );
              return matchWinnerMarket?.values?.find((v: any) => v.value === 'Home')?.odd || '1.85';
            })(),
            draw: (() => {
              const matchWinnerMarket = event.odds?.find(
                (m: any) => m.id === 1 || m.name === 'Match Winner'
              );
              return matchWinnerMarket?.values?.find((v: any) => v.value === 'Draw')?.odd || '3.20';
            })(),
            away: (() => {
              const matchWinnerMarket = event.odds?.find(
                (m: any) => m.id === 1 || m.name === 'Match Winner'
              );
              return matchWinnerMarket?.values?.find((v: any) => v.value === 'Away')?.odd || '4.50';
            })(),
          },
        })),
      },
      {
        id: 'tennis',
        name: 'Tennis',
        icon: 'sports:tennis',
        count: 0,
        expanded: false,
      },
      {
        id: 'basketball',
        name: 'Basketball',
        icon: 'sports:basketball',
        count: 0,
        expanded: false,
      },
      {
        id: 'hockey',
        name: 'Ice Hockey',
        icon: 'sports:hockey',
        count: 0,
        expanded: false,
      },
      {
        id: 'volleyball',
        name: 'Volleyball',
        icon: 'sports:volleyball',
        count: 0,
        expanded: false,
      },
      {
        id: 'table-tennis',
        name: 'Table Tennis',
        icon: 'sports:table-tennis',
        count: 0,
        expanded: false,
      },
      {
        id: 'cricket',
        name: 'Cricket',
        icon: 'sports:cricket',
        count: 0,
        expanded: false,
      },
      {
        id: 'american-football',
        name: 'American Football',
        icon: 'sports:american-football',
        count: 0,
        expanded: false,
      },
      {
        id: 'esports',
        name: 'Esports',
        icon: 'sports:esports',
        count: 0,
        expanded: false,
      },
      {
        id: 'badminton',
        name: 'Badminton',
        icon: 'sports:badminton',
        count: 0,
        expanded: false,
      },
    ];

    setSportCategories(categories);
  }, [matches]);

  useEffect(() => {
    // change sportLiveFilter
    dispatch(setLiveFilter(sportToggle === 'live'));
  }, [sportToggle,dispatch]);

  const handleCategoryToggle = (categoryId: string) => {
    setSportCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat))
    );
  };

  const handleTopGamesPageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && topGamesPage > 1) {
      setTopGamesPage((prev) => prev - 1);
    } else if (direction === 'next' && topGamesPage < 5) {
      setTopGamesPage((prev) => prev + 1);
    }
  };

  const handleImageError = (imageId: string) => {
    setImageErrors((prev) => new Set(Array.from(prev).concat(imageId)));
  };

  const renderFavoriteMatches = () => (
    <Box sx={{ mb: 1, bgcolor: '#2B2F3D', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={() => setFavoriteMatchesOpen(!favoriteMatchesOpen)}
        sx={{
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          background: favoriteMatchesOpen
            ? 'linear-gradient(180deg,rgba(204, 185, 14, 0.77) 0%, rgba(26, 29, 41, 0.8) 100%)'
            : 'transparent',
          '&:hover': {
            bgcolor: alpha('#24ee89', 0.05),
          },
        }}
      >
        <Box component="img" src={gift} sx={{ width: 16 }} />
        <Typography
          variant="subtitle2"
          sx={{ color: '#A0A3A7', fontWeight: 400, fontSize: 14, fontStyle: 'italic' }}
        >
          FAVORITE MATCHES
        </Typography>
        {favorites.length > 0 && (
          <Chip
            label={favorites.length}
            size="small"
            sx={{
              bgcolor: '#24ee89',
              color: '#232626',
              fontSize: '0.6rem',
              height: 16,
              minWidth: 16,
              '& .MuiChip-label': {
                px: 0.5,
              },
            }}
          />
        )}
        <div
          style={{
            flexGrow: 1,
            alignSelf: 'flex-end',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Iconify
            icon={
              favoriteMatchesOpen
                ? 'material-symbols:keyboard-arrow-up'
                : 'material-symbols:keyboard-arrow-down'
            }
            sx={{ color: 'text.secondary', fontSize: 16 }}
          />
        </div>
      </Stack>

      <Collapse in={favoriteMatchesOpen}>
        <Box sx={{ pl: 3, pr: 1, py: 1 }}>
          {favorites.length === 0 ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              No favorite matches yet
            </Typography>
          ) : (
            <Stack spacing={1}>
              {favorites.slice(0, 5).map((matchId) => (
                <Stack
                  key={matchId}
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  onClick={() => navigate(`/${currentLang.value}/sports/match/${matchId}`)}
                  sx={{
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                    '&:hover': {
                      bgcolor: alpha('#24ee89', 0.05),
                    },
                  }}
                >
                  <Iconify
                    icon={
                      isFavorite(matchId)
                        ? 'material-symbols:star'
                        : 'material-symbols:star-outline'
                    }
                    sx={{
                      width: 12,
                      height: 12,
                      color: '#24ee89',
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: 11 }}>
                    Match #{matchId}
                  </Typography>
                </Stack>
              ))}
              {favorites.length > 5 && (
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontSize: 10, textAlign: 'center' }}
                >
                  +{favorites.length - 5} more matches
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  );

  const renderRecommended = () => (
    <Box sx={{ mb: 1, bgcolor: '#2B2F3D', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        onClick={() => setRecommendedOpen(!recommendedOpen)}
        sx={{
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          background: recommendedOpen
            ? 'linear-gradient(180deg,rgba(204, 185, 14, 0.77) 0%, rgba(26, 29, 41, 0.8) 100%)'
            : 'transparent',
          '&:hover': {
            bgcolor: alpha('#24ee89', 0.05),
          },
        }}
      >
        <Box component="img" src={gift} sx={{ width: 16 }} />
        <Typography
          variant="subtitle2"
          sx={{ color: '#A0A3A7', fontWeight: 400, fontSize: 14, fontStyle: 'italic' }}
        >
          RECOMMENDED
        </Typography>
        <div
          style={{
            flexGrow: 1,
            alignSelf: 'flex-end',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Iconify
            icon={
              recommendedOpen
                ? 'material-symbols:keyboard-arrow-up'
                : 'material-symbols:keyboard-arrow-down'
            }
            sx={{ color: 'text.secondary', fontSize: 16 }}
          />
        </div>
      </Stack>

      <Collapse in={recommendedOpen}>
        <Box sx={{ pl: 3, pr: 1, py: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            No recommendations available
          </Typography>
        </Box>
      </Collapse>
    </Box>
  );

  const renderTopGames = () => (
    <Box sx={{ mb: 2, bgcolor: '#2B2F3D', borderRadius: 1 }}>
      <Stack
        onClick={() => setTopGamesOpen(!topGamesOpen)}
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          background: topGamesOpen
            ? 'linear-gradient(180deg,rgba(204, 185, 14, 0.77) 0%, rgba(26, 29, 41, 0.8) 100%)'
            : 'transparent',
          '&:hover': {
            bgcolor: alpha('#24ee89', 0.05),
          },
        }}
      >
        <Box
          component="img"
          src={star}
          sx={{ width: 16 }}
          onClick={() => setTopGamesOpen(!topGamesOpen)}
        />
        <Typography
          variant="subtitle2"
          sx={{ color: 'text.primary', fontWeight: 600 }}
          onClick={() => setTopGamesOpen(!topGamesOpen)}
        >
          TOP GAMES
        </Typography>
        {/* <div
          style={{
            flexGrow: 1,
            alignSelf: 'flex-end',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleTopGamesPageChange('prev');
              }}
              disabled={topGamesPage === 1}
              sx={{ color: 'text.secondary' }}
            >
              <Iconify icon="material-symbols:chevron-left" />
            </IconButton>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {topGamesPage}/5
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleTopGamesPageChange('next');
              }}
              disabled={topGamesPage === 5}
              sx={{ color: 'text.secondary' }}
            >
              <Iconify icon="material-symbols:chevron-right" />
            </IconButton>
          </Stack>
        </div> */}
      </Stack>

      <Collapse in={topGamesOpen}>
        <Box>
          {/* Featured Match */}
          <Box
            onClick={() =>
              topGame &&
              navigate(`/${currentLang.value}/sports/match/${topGame.id}`, {
                state: {
                  matchData: topGame,
                  leagueInfo: {
                    id: topGame.league?.id || 0,
                    name: topGame.league?.name || 'League',
                    logo: topGame.league?.logo || '',
                  },
                },
              })
            }
            sx={{
              p: 1.5,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: alpha('#24ee89', 0.05),
              },
            }}
          >
            {/* League Header */}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                {(() => {
                  const leagueLogo = (topGame?.league as any)?.logo;
                  const logoId = `topgame-league-${topGame?.id}`;

                  if (leagueLogo && !imageErrors.has(logoId)) {
                    return (
                      <Box
                        component="img"
                        src={leagueLogo}
                        onError={() => handleImageError(logoId)}
                        sx={{ width: 16, height: 16, objectFit: 'contain' }}
                      />
                    );
                  }

                  return <Box component="img" src={league} sx={{ width: 16, height: 16 }} />;
                })()}
                <Typography
                  variant="body2"
                  sx={{ color: '#24ee89', fontWeight: 500, fontSize: 12 }}
                >
                  {topGame?.league?.name || 'Premier League'}
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify
                  icon="material-symbols:play-arrow"
                  sx={{ color: 'text.secondary', fontSize: 16 }}
                />
                <Box component="img" src={star} sx={{ width: 14, height: 14 }} />
              </Stack>
            </Stack>

            {/* Match Status */}
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}
            >
              {(() => {
                if (topGame?.f_status?.elapsed) {
                  return `${topGame.f_status.elapsed}' ${topGame.f_status.short}`;
                }
                if (topGame?.time) {
                  return new Date(topGame.time * 1000).toLocaleTimeString();
                }
                return 'Match Time';
              })()}
            </Typography>

            {/* Teams and Scores */}
            <Stack spacing={1} sx={{ mb: 1.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    component="img"
                    src={topGame?.home?.logo || mc}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {topGame?.home?.name || 'Home Team'}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ color: '#24ee89', fontWeight: 700 }}>
                  {topGame?.scores?.home ?? 0}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    component="img"
                    src={topGame?.away?.logo || mu}
                    sx={{ width: 20, height: 20 }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {topGame?.away?.name || 'Away Team'}
                  </Typography>
                </Stack>
                <Typography variant="h6" sx={{ color: '#24ee89', fontWeight: 700 }}>
                  {topGame?.scores?.away ?? 0}
                </Typography>
              </Stack>
            </Stack>

            {/* Divider */}
            <Box sx={{ height: 1, bgcolor: 'divider', mb: 1 }} />

            {/* Match Info */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Match Info
              </Typography>
              <Iconify
                icon="material-symbols:keyboard-arrow-up"
                sx={{ color: 'text.secondary', fontSize: 12 }}
              />
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {topGame?.f_status?.long || 'Match Status'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {topGame?.league?.cc || 'Country'}
              </Typography>
            </Stack>

            {/* Betting Odds */}
            {/* <Stack direction="row" spacing={1}>
              <Chip
                label={`W1 ${(() => {
                  const matchWinner = topGame?.odds?.[0]?.bets?.find((bet: any) => bet.id === 1);
                  return matchWinner?.values?.find((v: any) => v.value === 'Home')?.odd || '1.85';
                })()}`}
                size="small"
                sx={{
                  py: 1,
                  cursor: 'pointer',
                  borderRadius: 0.5,
                  bgcolor: '#24ee89',
                  color: 'black',
                  fontWeight: 600,
                }}
              />
              <Chip
                label={`X ${(() => {
                  const matchWinner = topGame?.odds?.[0]?.bets?.find((bet: any) => bet.id === 1);
                  return matchWinner?.values?.find((v: any) => v.value === 'Draw')?.odd || '3.20';
                })()}`}
                size="small"
                sx={{
                  py: 1,
                  cursor: 'pointer',
                  borderRadius: 0.5,
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <Chip
                label={`W2 ${(() => {
                  const matchWinner = topGame?.odds?.[0]?.bets?.find((bet: any) => bet.id === 1);
                  return matchWinner?.values?.find((v: any) => v.value === 'Away')?.odd || '4.50';
                })()}`}
                size="small"
                sx={{
                  py: 1,
                  cursor: 'pointer',
                  borderRadius: 0.5,
                  bgcolor: 'transparent',
                  color: 'text.secondary',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </Stack> */}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );

  const renderLiveSportToggle = () => (
    <Box sx={{ mb: 2, borderRadius: 1, pb: 2 }}>
      {/* NavBetslip2 and My Bets Buttons */}
      <Box
        sx={{
          display: 'flex',
          borderRadius: { xs: '6px 6px 0 0', sm: '8px 8px 0 0' },
          border: '1px solid #24ee89',
          overflow: 'hidden',
          bgcolor: 'transparent',
          height: { xs: 48, sm: 40 },
          width: '100%',
          mb: { xs: 1.5, sm: 2 },
        }}
      >
        {/* Live - Selected/Active */}
        <Button
          onClick={() => setSportToggle('live')}
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1,
            background:
              sportToggle === 'live'
                ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
                : 'transparent',
            borderRight: '1px solid #24ee89',
            borderRadius: 0,
            minWidth: { xs: 80, sm: 93 },
            height: '100%',
            textTransform: 'uppercase',
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Arial, sans-serif',
            fontWeight: 600,
            fontSize: { xs: '14px', sm: '16px' },
            color: sportToggle === 'live' ? '#24ee89' : 'text.secondary',
            fontStyle: 'italic !important',
            lineHeight: '100%',
            flex: 1,
            minHeight: { xs: 44, sm: 40 }, // Touch target
            '&:hover': {
              background: 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          <span style={{ fontStyle: 'italic !important', transform: 'skew(-15deg)' }}>Live</span>
        </Button>

        {/* Sport - Unselected/Inactive */}
        <Button
          onClick={() => setSportToggle('sport')}
          sx={{
            px: { xs: 1.5, sm: 2 },
            flex: 1,
            py: 1,
            background:
              sportToggle === 'sport'
                ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
                : 'transparent',
            borderRadius: 0,
            minWidth: { xs: 80, sm: 93 },
            height: '100%',
            textTransform: 'uppercase',
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, Arial, sans-serif',
            fontWeight: 600,
            fontSize: { xs: '14px', sm: '16px' },
            color: sportToggle === 'sport' ? '#24ee89' : 'text.secondary',
            fontStyle: 'italic !important',
            lineHeight: '100%',
            minHeight: { xs: 44, sm: 40 }, // Touch target
            '&:hover': {
              background:
                sportToggle === 'sport'
                  ? 'linear-gradient(180deg, #3a4142 20.69%, rgba(25, 25, 55, 0) 79.31%)'
                  : 'transparent',
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          <span style={{ fontStyle: 'italic !important', transform: 'skew(-15deg)' }}>Sport</span>
        </Button>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ bgcolor: '#393E51', p: 1 }}
      >
        <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: 16 }}>
          {liveEventCount.toLocaleString()} Events
        </Typography>
        <Iconify
          icon="material-symbols:notifications"
          sx={{ color: 'text.primary', fontSize: 16 }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1, bgcolor: '#2B2F3D' }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#24ee89', fontWeight: 900, fontSize: 16, fontStyle: 'italic' }}
        >
          TOP EVENTS
        </Typography>
      </Stack>

      {sportCategories.slice(0, 5).map((category) => (
        <Box key={category.id}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            onClick={() => handleCategoryToggle(category.id)}
            sx={{
              cursor: 'pointer',
              bgcolor: '#393E51',
              p: 1,
              '&:hover': {
                bgcolor: alpha('#24ee89', 0.05),
              },
            }}
          >
            <Iconify icon={category.icon} sx={{ color: '#24ee89', fontSize: 16 }} />
            <Typography variant="body2" sx={{ color: 'text.primary', flex: 1 }}>
              {category.name} {category.count}
            </Typography>
            <Iconify
              icon={
                category.expanded
                  ? 'material-symbols:keyboard-arrow-up'
                  : 'material-symbols:keyboard-arrow-down'
              }
              sx={{ color: 'text.secondary', fontSize: 16 }}
            />
          </Stack>

          <Collapse in={category.expanded}>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {category.matches?.slice(0,5).map((match) => (
                <Button
                  key={match.id}
                  fullWidth
                  onClick={() => navigate(`/${currentLang.value}/sports/match/${match.id}`)}
                  sx={{
                    py: 1,
                    px: 2,
                    borderRadius: 0,
                    borderBottom: '1px solid #2B2F3D',
                    bgcolor: '#2B2F3D',
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: alpha('#24ee89', 0.1),
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.primary', flex: 1, textAlign: 'left' }}
                    >
                      {match.homeTeam} - {match.awayTeam}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: match.status === 'live' ? '#24ee89' : 'text.secondary' }}
                    >
                      {match.homeScore}-{match.awayScore}
                    </Typography>
                  </Stack>
                </Button>
              ))}
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );

  const renderContent = () => (
    <Scrollbar
      sx={{
        height: '100%',
        overflow: 'auto',
        '& .simplebar-content': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
        '&::-webkit-scrollbar': {
          width: { xs: '4px', sm: '6px' },
        },
        '&::-webkit-scrollbar-track': {
          background: '#232626',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#24ee89',
          borderRadius: { xs: '2px', sm: '3px' },
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#FFD700',
        },
      }}
    >
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          flex: 1,
          minHeight: 0,
          // Better mobile spacing
          '& > *': {
            mb: { xs: 1.5, sm: 2 },
          },
        }}
      >
        {renderFavoriteMatches()}
        {renderRecommended()}
        {renderTopGames()}
        {renderLiveSportToggle()}
      </Box>
      <Footer />
    </Scrollbar>
  );

  if (isMobile) {
    return (
      <Drawer
        open={openNav}
        onClose={onCloseNav}
        anchor="left"
        PaperProps={{
          sx: {
            width: { xs: '100vw', sm: 320 },
            height: '100vh',
            bgcolor: '#232626',
            borderRight: '1px solid #2B2F3D',
            overflow: 'hidden',
            top: 0,
            zIndex: 1300,
            // Better mobile styling
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: 320 },
            height: '100vh',
            top: 0,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          // Better backdrop
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
          },
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        transitionDuration={300}
      >
        {renderContent()}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        height: 'calc(100vh - 80px)', // Subtract header height (80px)
        bgcolor: '#232626',
        borderRight: '1px solid #2B2F3D',
        overflow: 'auto', // Allow scrolling
        position: 'fixed',
        top: 80, // Position under the header
        left: 0,
        zIndex: 1000,
      }}
    >
      {renderContent()}
    </Box>
  );
}
