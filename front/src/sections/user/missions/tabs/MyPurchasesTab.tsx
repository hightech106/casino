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

interface Purchase {
  _id: string;
  shopId: string;
  shopName: string;
  shopDescription: string;
  type_gift: 'free_spins' | 'cash_bonus' | 'free_bet';
  type_pay: 'fiat' | 'points';
  cost: number;
  payout: number;
  games: { game: string; max_bet: number }[];
  game_code: string | null;
  status: 'paid' | 'activated';
  activate: boolean;
  createdAt: string;
}

interface Game {
  name: string;
  game_code: string;
}

const MyPurchasesTab: React.FC = () => {
  const { t } = useLocales();
  const { get_purchases, activate_purchase, get_games_by_purchase_id, get_purchases_free_bets } = useApi();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [expanded, setExpanded] = useState<{ [page: number]: { [key: string]: boolean } }>({});
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [hasFetchedPurchases, setHasFetchedPurchases] = useState(false);
  const [selectedGame, setSelectedGame] = useState<{ [key: string]: string }>({});
  const [gamesByPurchase, setGamesByPurchase] = useState<{ [key: string]: Game[] }>({});
  const [isLoadingGames, setIsLoadingGames] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const isTablet = useMediaQuery('(min-width: 900px) and (max-width: 1199px)');
  const purchasesPerPage = isTablet ? 4 : 3;

  const fetchPurchases = useCallback(async () => {
    if (isLoadingPurchases || hasFetchedPurchases) return;
    setIsLoadingPurchases(true);
    try {
      const res = await get_purchases();
      const res2 = await get_purchases_free_bets();
      console.log('Response from get_user_vouchers:', res2);
      let data: Purchase[] = [];
      if (Array.isArray(res?.data?.data)) {
        data = res.data.data;
      } else if (Array.isArray(res?.data)) {
        data = res.data;
      }
      data.sort((a, b) => {
        const aNeedsActivation = a.status === 'paid' && !a.activate;
        const bNeedsActivation = b.status === 'paid' && !b.activate;
        if (aNeedsActivation && !bNeedsActivation) return -1;
        if (!aNeedsActivation && bNeedsActivation) return 1;
        return 0;
      });
      setPurchases(data);
    } catch (error) {
      toast.error(t('failed_to_fetch_purchases'));
    } finally {
      setIsLoadingPurchases(false);
      setHasFetchedPurchases(true);
    }
  }, [get_purchases, isLoadingPurchases, hasFetchedPurchases, t]);

  const fetchGamesByPurchaseId = useCallback(
    async (purchaseId: string, search: string = '') => {
      if (isLoadingGames[purchaseId]) return;
      setIsLoadingGames((prev) => ({ ...prev, [purchaseId]: true }));
      try {
        const response = await get_games_by_purchase_id(purchaseId, search.trim());
        const games = Array.isArray(response) ? response : [];
        setGamesByPurchase((prev) => ({ ...prev, [purchaseId]: games }));
      } catch (error) {
        toast.error(t('failed_to_fetch_games'));
      } finally {
        setIsLoadingGames((prev) => ({ ...prev, [purchaseId]: false }));
      }
    },
    [get_games_by_purchase_id]
  );

  const debouncedFetchGames = useCallback(
    debounce<(purchaseId: string, search: string) => void>(
      (purchaseId, search) => {
        fetchGamesByPurchaseId(purchaseId, search);
      },
      500
    ),
    [fetchGamesByPurchaseId]
  );

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  useEffect(() => {
    const totalPages: number = Math.ceil(purchases.length / purchasesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [purchases, currentPage, purchasesPerPage]);

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
    setHasFetchedPurchases(false);
    setGamesByPurchase({});
    setSearchQuery({});
    setExpanded({});
    fetchPurchases();
  };

  const handleActivatePurchase = async (purchaseId: string) => {
    const purchase = purchases.find((p) => p._id === purchaseId);
    if (!purchase || purchase.type_gift !== 'free_spins' || purchase.activate) {
      toast.error(t('invalid_purchase'));
      return;
    }
    const gameCode = selectedGame[purchaseId];
    if (!gameCode) {
      toast.error(t('select_game'));
      return;
    }
    try {
      const res = await activate_purchase(purchaseId, gameCode);
      if (!res?.data) {
        toast.error(t('failed_to_activate_purchase'));
        return;
      }
      toast.success(t('purchase_activated'));
      setHasFetchedPurchases(false);
      setGamesByPurchase({});
      setSearchQuery({});
      setExpanded({});
      await fetchPurchases();
    } catch (error) {
      toast.error(t('error_activating_purchase'));
    }
  };

  const indexOfLastPurchase = currentPage * purchasesPerPage;
  const indexOfFirstPurchase = indexOfLastPurchase - purchasesPerPage;
  const currentPurchases = Array.isArray(purchases)
    ? purchases.slice(indexOfFirstPurchase, indexOfLastPurchase)
    : [];
  const totalPages = Math.ceil(purchases.length / purchasesPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setExpanded((prev) => ({
      ...prev,
      [page]: {},
    }));
  };

  const renderContent = () => {
    if (isLoadingPurchases) {
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
        {currentPurchases.length > 0 ? (
          currentPurchases.map((purchase, index) => (
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
              key={`${purchase._id}:${index}`}
            >
              <BonusCard
                item={purchase}
                index={index}
                currentPage={currentPage}
                expanded={expanded}
                handleExpand={handleExpand}
                isLoadingGames={isLoadingGames}
                gamesByItem={gamesByPurchase}
                searchQuery={searchQuery}
                selectedGame={selectedGame}
                setSearchQuery={setSearchQuery}
                setSelectedGame={setSelectedGame}
                handleActivate={handleActivatePurchase}
                fetchGamesByPurchaseId={fetchGamesByPurchaseId}
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
              {t('no_purchases_available')}
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
            {t('purchases')}
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={isLoadingPurchases} sx={{ color: '#24ee89' }}>
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

export default MyPurchasesTab;