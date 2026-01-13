/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Typography,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import toast from 'react-hot-toast';
import debounce from 'lodash/debounce';
import Iconify from 'src/components/iconify';
import BonusCard from './BonusCard';

interface WheelHistory {
  _id: string;
  userId: string;
  type_pay: 'fiat' | 'points';
  cost: number;
  payout: number;
  currencies: { currency: string; games: { game: string; max_bet: number }[] }[];
  game_code: string | null;
  status: 'paid' | 'not_paid';
  activate: boolean;
  minigameId: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

interface Game {
  name: string;
  game_code: string;
}

const WheelBonusesTab: React.FC = () => {
  const { t } = useLocales();
  const { get_history_wheels, activate_wheel_bonus, get_games_by_wheel_history_id } = useApi();
  const [histories, setHistories] = useState<WheelHistory[]>([]);
  const [expanded, setExpanded] = useState<{ [page: number]: { [key: string]: boolean } }>({});
  const [isLoadingHistories, setIsLoadingHistories] = useState(false);
  const [hasFetchedHistories, setHasFetchedHistories] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{ [key: string]: string }>({});
  const [gamesByHistory, setGamesByHistory] = useState<{ [key: string]: Game[] }>({});
  const [isLoadingGames, setIsLoadingGames] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const isTablet = useMediaQuery('(min-width: 900px) and (max-width: 1199px)');
  const itemsPerPage = isTablet ? 4 : 3;

  const fetchHistories = useCallback(async () => {
    if (isLoadingHistories || hasFetchedHistories) return;
    setIsLoadingHistories(true);
    try {
      const res = await get_history_wheels();
      let data: WheelHistory[] = [];
      if (res?.data?.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      } else {
        console.warn('Unexpected response structure:', res);
        throw new Error('Invalid response structure from API');
      }

      data.sort((a, b) => {
        const aNeedsActivation = a.status === 'paid' && !a.activate;
        const bNeedsActivation = b.status === 'paid' && !b.activate;
        if (aNeedsActivation && !bNeedsActivation) return -1;
        if (!aNeedsActivation && bNeedsActivation) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setHistories(data);
    } catch (error) {
      console.error('Error fetching histories:', error);
      toast.error(t('failed_to_fetch_histories') + (error.message ? `: ${error.message}` : ''));
    } finally {
      setIsLoadingHistories(false);
      setHasFetchedHistories(true);
    }
  }, [get_history_wheels, isLoadingHistories, hasFetchedHistories, t]);

  const fetchGamesByWheelHistoryId = useCallback(
    async (wheelHistoryId: string, search: string = '') => {
      if (isLoadingGames[wheelHistoryId]) return;
      setIsLoadingGames((prev) => ({ ...prev, [wheelHistoryId]: true }));
      try {
        console.log('Fetching games for wheelHistoryId:', wheelHistoryId, 'with search:', search); // Отладка
        const response = await get_games_by_wheel_history_id(wheelHistoryId, search.trim());
        const games = Array.isArray(response) ? response : [];
        setGamesByHistory((prev) => ({ ...prev, [wheelHistoryId]: games }));
        console.log('Fetched games:', games); // Отладка
      } catch (error) {
        console.error('Error fetching games:', error); // Отладка
        toast.error(t('failed_to_fetch_games'));
      } finally {
        setIsLoadingGames((prev) => ({ ...prev, [wheelHistoryId]: false }));
      }
    },
    [get_games_by_wheel_history_id]
  );

  const debouncedFetchGames = useCallback(
    debounce<(wheelHistoryId: string, search: string) => void>(
      (wheelHistoryId, search) => {
        fetchGamesByWheelHistoryId(wheelHistoryId, search);
      },
      500
    ),
    [fetchGamesByWheelHistoryId]
  );

  useEffect(() => {
    fetchHistories();
  }, [fetchHistories]);

  useEffect(() => {
    const totalPages: number = Math.ceil(histories.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [histories, currentPage, itemsPerPage]);

  const handleExpand = (uniqueKey: string) => {
    setExpanded((prev) => {
      const currentPageExpanded = prev[currentPage] || {};
      const newState = {
        ...prev,
        [currentPage]: {
          ...currentPageExpanded,
          [uniqueKey]: !currentPageExpanded[uniqueKey],
        },
      };
      return newState;
    });
  };

  const handleRefresh = () => {
    setHasFetchedHistories(false);
    setGamesByHistory({});
    setSearchQuery({});
    setExpanded({});
    fetchHistories();
  };

  const handleActivateHistory = async (historyId: string) => {
    const history = histories.find((h) => h._id === historyId);
    if (!history || history.activate) {
      toast.error(t('invalid_history'));
      return;
    }
    const gameCode = selectedGame[historyId];
    if (!gameCode) {
      toast.error(t('select_game'));
      return;
    }
    try {
      const res = await activate_wheel_bonus(historyId, gameCode);
      if (!res) {
        toast.error(t('failed_to_activate_history'));
        return;
      }
      toast.success(t('history_activated'));
      setHasFetchedHistories(false);
      setGamesByHistory({});
      setSearchQuery({});
      setExpanded({});
      await fetchHistories();
    } catch (error) {
      toast.error(t('error_activating_history'));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHistories = Array.isArray(histories)
    ? histories.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(histories.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setExpanded((prev) => ({
      ...prev,
      [page]: {},
    }));
  };

  const renderContent = () => {
    if (isLoadingHistories) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress sx={{ color: '#24ee89' }} />
        </Box>
      );
    }
    return (
      <Grid
        container
        spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }}
        sx={{
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 1, sm: 2 },
        }}
      >
        {currentHistories.length > 0 ? (
          currentHistories.map((history, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={isTablet ? 6 : 4}
              lg={4}
              sx={{
                '@media (min-width: 700px) and (max-width: 959px)': {
                  flex: '0 0 100%',
                  maxWidth: '100%',
                },
                '@media (min-width: 960px) and (max-width: 1199px)': {
                  flex: '0 0 50%',
                  maxWidth: '50%',
                },
              }}
              key={`${history._id}:${index}`}
            >
              <BonusCard
                item={history}
                index={index}
                currentPage={currentPage}
                expanded={expanded}
                handleExpand={handleExpand}
                isLoadingGames={isLoadingGames}
                gamesByItem={gamesByHistory}
                searchQuery={searchQuery}
                selectedGame={selectedGame}
                setSearchQuery={setSearchQuery}
                setSelectedGame={setSelectedGame}
                handleActivate={handleActivateHistory}
                fetchGamesByPurchaseId={fetchGamesByWheelHistoryId}
                debouncedFetchGames={debouncedFetchGames}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#E0E0E0',
                fontFamily: 'Cera Pro, sans-serif',
                fontWeight: 700,
                fontSize: { xs: 12, sm: 14, md: 16, lg: 16 },
                textTransform: 'uppercase',
              }}
            >
              {t('no_histories_available')}
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        pt: { xs: 0, sm: 1 },
        px: { xs: 1, sm: 2, md: 3 },
        pb: { xs: 5, sm: 7 },
        backgroundColor: '#232626',
        minHeight: '100vh',
      }}
    >
      <Stack direction="row" alignItems="center" mb={{ xs: 1, sm: 2 }} justifyContent="space-between">
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, mb: { xs: 1, sm: 2 } }}>
          <Typography
            variant="h5"
            sx={{
              color: '#A0A3A7',
              fontFamily: 'Impact, sans-serif',
              fontSize: { xs: 20, sm: 24, md: 26, lg: 28 },
              textTransform: 'uppercase',
              letterSpacing: 1,
              fontWeight: 700,
              fontStyle: 'italic',
              mt:'20px'
            }}
          >
            {t('wheel_bonuses')}
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={isLoadingHistories} sx={{ color: '#24ee89' }}>
          <Iconify icon="mdi:refresh" width={{ xs: 20, sm: 24 }} height={{ xs: 20, sm: 24 }} />
        </IconButton>
      </Stack>
      {renderContent()}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 1, sm: 2 },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            '& .MuiPaginationItem-root': {
              color: '#24ee89',
              fontFamily: 'Impact, sans-serif',
              fontWeight: 400,
              fontSize: { xs: 10, sm: 12, md: 13, lg: 14 },
              textTransform: 'uppercase',
              '&:hover': {
                backgroundColor: '#2B2F3D',
              },
              '&.Mui-selected': {
                backgroundColor: '#2B2F3D',
                color: '#FFF',
                fontWeight: 400,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default WheelBonusesTab;