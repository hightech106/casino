/* eslint-disable arrow-body-style */
import { useEffect, useState, useCallback, Fragment, useMemo } from 'react';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
  Collapse,
  LinearProgress,
  Divider,
  Chip,
  Box,
  Button,
  TextField,
  Alert,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useLocales } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import { API_URL } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { debounce } from 'lodash';
import { fCurrency } from 'src/utils/format-number';
import toast from 'react-hot-toast';

type BonusStatus = 'processing' | 'active' | 'finished' | 'expired' | 'canceled';

interface Bonus {
  _id: string;
  status: BonusStatus;
  conditions: {
    deposit: {
      required: boolean;
      amountFrom: number;
      amountTo: number | null;
      userDeposit: number;
      completed: boolean;
    };
    spend: {
      required: boolean;
      amount: number;
      userSpend: number;
      completed: boolean;
    };
    netLoss: {
      required: boolean;
      netloseFrom: number;
      netloseTo: number;
      userNetLoss: number;
      completed: boolean;
    };
  };
  bonusId: {
    _id: string;
    amount_type: 'percentage' | 'fixed';
    amount: number;
    deposit_amount_from: number;
    deposit_amount_to: number;
    up_to_amount: number;
    max_bet_free_spin: number;
    max_bet_bonus_amount: number;
    wager: number;
    wager_amount: number;
    calculatedBonusAmount: number;
    free_spin: number;
    from_date: string;
    to_date: string;
    games: { game_name: string }[];
    games_freespin: { game_name: string }[];
    lang: Array<{
      lang: string;
      title: string;
      rules: string;
      pre_image: string;
    }>;
  };
  added_bonus: number;
  expireProcessingDate: string | null;
  wagerBets?: Array<{ bet_money: number }>;
  createdAt: string; // Added for sorting
}

const getStatusColor = (status: BonusStatus): 'success' | 'info' | 'error' | 'default' => {
  switch (status) {
    case 'active':
    case 'finished':
      return 'success';
    case 'processing':
      return 'info';
    case 'expired':
    case 'canceled':
      return 'error';
    default:
      return 'default';
  }
};

const formatTimeRemaining = (expireDate: string | null): string => {
  if (!expireDate) return '';
  const now = new Date();
  const expire = new Date(expireDate);
  const diffMs = expire.getTime() - now.getTime();

  if (diffMs <= 0) return '00:00:00';

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

const Timer = ({
  expireDate,
  status,
  bonusId,
  t,
}: {
  expireDate: string | null;
  status: BonusStatus;
  bonusId: string;
  t: (key: string) => string;
}) => {
  const [time, setTime] = useState(formatTimeRemaining(expireDate));
  useEffect(() => {
    if (status !== 'processing' || !expireDate) return undefined;
    const interval = setInterval(() => {
      setTime(formatTimeRemaining(expireDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [expireDate, status]);
  return status === 'processing' && time ? (
    <Typography variant="body2" sx={{ color: '#24ee89', fontWeight: 'bold' }}>
      {t('time_to_activate')}: {time}
    </Typography>
  ) : null;
};

const BrandProgress = ({ value }: { value: number }) => {
  const percent = Math.min(100, Math.max(0, value));
  return (
    <Box sx={{ position: 'relative', width: '100%', height: 8, bgcolor: '#313545', borderRadius: 4 }}>
      <Box
        sx={{
          width: `${percent}%`,
          height: '100%',
          bgcolor: '#24ee89',
          borderRadius: 4,
          transition: 'width 0.3s ease',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: `calc(${percent}% - 6px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid #FFFFFF',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.4))',
        }}
      />
    </Box>
  );
};

export default function MySharesView() {
  const { t, currentLang } = useLocales();
  const settings = useSettingsContext();
  const { get_bonuses_for_my_shares, cancel_bonus, activate_bonus_no_deposit } = useApi();
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const confirmCancel = useBoolean(false);
  const cancelBonus = useBoolean(false);
  const [selectedBonusId, setSelectedBonusId] = useState<string | null>(null);
  const [isDepositAction, setIsDepositAction] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'all' | BonusStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const bonusesPerPage = 1;
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining: { [key: string]: string } = {};
      bonuses.forEach((bonus) => {
        if (bonus.status === 'processing' && bonus.expireProcessingDate) {
          newTimeRemaining[bonus._id] = formatTimeRemaining(bonus.expireProcessingDate);
        }
      });
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [bonuses]);

  const fetchBonuses = useCallback(() => {
    return debounce(async () => {
      if (isLoading || hasFetched) return Promise.resolve();
      setIsLoading(true);
      try {
        const res = await get_bonuses_for_my_shares();
        if (res?.data) {
          setBonuses(res.data); // Backend sorts by createdAt desc
        } else {
          setBonuses([]);
        }
      } catch (error) {
        setBonuses([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
      return Promise.resolve();
    }, 500)();
  }, [get_bonuses_for_my_shares, isLoading, hasFetched]);

  useEffect(() => {
    fetchBonuses();
  }, [fetchBonuses]);

  // Filter and sort bonuses
  const filteredBonuses = useMemo(() => {
    let filtered = [...bonuses];
    if (filterStatus !== 'all') {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }
    if (searchQuery) {
      filtered = filtered.filter((b) => {
        const title = b.bonusId.lang.find((l) => l.lang === 'en')?.title || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    // Sorting by createdAt desc is handled by backend, but we can reinforce here if needed
    return filtered;
  }, [bonuses, filterStatus, searchQuery]);

  const handleExpand = useCallback((bonusId: string) => {
    setExpanded((prev) => (prev === bonusId ? null : bonusId));
  }, []);

  const handleRefresh = useCallback(() => {
    setHasFetched(false);
    fetchBonuses();
  }, [fetchBonuses]);

  const handleDeposit = useCallback(
    (bonusId: string) => {
      const selectedBonus = bonuses.find((b) => b._id === bonusId);
      if (!selectedBonus) {
        toast.error(t('bonus_not_found'));
        return;
      }

      const activeBonus = bonuses.find(
        (b) => (b.status === 'active' || b.status === 'processing') && b._id !== bonusId
      );
      if (activeBonus) {
        setSelectedBonusId(bonusId);
        setIsDepositAction(true);
        confirmCancel.onTrue();
      } else {
        router.push(
          `/${currentLang.value}${paths.user.wallet}?bonus=${selectedBonus.bonusId._id}&amt=${selectedBonus.bonusId.deposit_amount_to}`
        );
      }
    },
    [bonuses, t, router, currentLang.value, confirmCancel]
  );

  const handleConfirmActivateNoDeposit = useCallback(
    async (bonusHistoryId: string) => {
      setIsProcessing(true);
      try {
        const res = await activate_bonus_no_deposit(bonusHistoryId);
        if (!res?.data) {
          toast.error(t('failed_to_activate_bonus'));
          return;
        }

        toast.success(t('bonus_activated'));
        confirmCancel.onFalse();
        setHasFetched(false);
        await fetchBonuses();
      } catch (error) {
        toast.error(t('error_activating_bonus'));
      } finally {
        setIsProcessing(false);
        setPassword('');
      }
    },
    [t, confirmCancel, fetchBonuses, activate_bonus_no_deposit]
  );

  const handleActivateNoDeposit = useCallback(
    (bonusHistoryId: string) => {
      const selectedBonus = bonuses.find((b) => b._id === bonusHistoryId);
      if (!selectedBonus) {
        toast.error(t('bonus_not_found'));
        return;
      }

      const activeBonus = bonuses.find(
        (b) => (b.status === 'active' || b.status === 'processing') && b._id !== bonusHistoryId
      );
      if (activeBonus) {
        setSelectedBonusId(bonusHistoryId);
        setIsDepositAction(false);
        confirmCancel.onTrue();
      } else {
        handleConfirmActivateNoDeposit(bonusHistoryId);
      }
    },
    [bonuses, t, confirmCancel, handleConfirmActivateNoDeposit]
  );

  const handleCancelBonus = useCallback(async () => {
    if (!selectedBonusId) {
      return;
    }
    setIsProcessing(true);
    try {
      const selectedBonus = bonuses.find((b) => b._id === selectedBonusId);
      if (!selectedBonus) {
        toast.error(t('bonus_not_found'));
        return;
      }

      const cancelRes = await cancel_bonus(password);
      if (!cancelRes?.data) {
        toast.error(t('failed_to_cancel_bonus'));
        return;
      }

      toast.success(t('bonus_canceled'));
      confirmCancel.onFalse();

      if (isDepositAction) {
        router.push(
          `/${currentLang.value}${paths.user.wallet}?bonus=${selectedBonus.bonusId._id}&amt=${selectedBonus.bonusId.deposit_amount_to}`
        );
      } else {
        await handleConfirmActivateNoDeposit(selectedBonusId);
      }

      setHasFetched(false);
      await fetchBonuses();
    } catch (error) {
      toast.error(t('error_canceling_bonus'));
    } finally {
      setIsProcessing(false);
      setPassword('');
    }
  }, [
    bonuses,
    selectedBonusId,
    password,
    t,
    confirmCancel,
    isDepositAction,
    router,
    currentLang.value,
    handleConfirmActivateNoDeposit,
    fetchBonuses,
    cancel_bonus,
  ]);

  const formatDate = useCallback((date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const calculateDepositProgress = useCallback((bonus: Bonus): number => {
    if (['expired', 'canceled'].includes(bonus.status)) return 0;
    if (!bonus.conditions.deposit.required || bonus.conditions.deposit.completed) return 100; // Fix: 100% for non-required or completed
    const totalRequired = bonus.conditions.deposit.amountFrom;
    const current = bonus.conditions.deposit.userDeposit;
    return totalRequired > 0 ? Math.min((current / totalRequired) * 100, 100) : 100; // 100% for 0-∞
  }, []);

  const calculateSpendProgress = useCallback((bonus: Bonus): number => {
    if (['expired', 'canceled'].includes(bonus.status)) return 0;
    if (!bonus.conditions.spend.required || bonus.conditions.spend.completed) return 100;
    const totalRequired = bonus.conditions.spend.amount;
    const current = bonus.conditions.spend.userSpend;
    return totalRequired > 0 ? Math.min((current / totalRequired) * 100, 100) : 100;
  }, []);

  const calculateNetLossProgress = useCallback((bonus: Bonus): number => {
    if (['expired', 'canceled'].includes(bonus.status)) return 0;
    if (!bonus.conditions.netLoss.required || bonus.conditions.netLoss.completed) return 100;
    const totalRequired = bonus.conditions.netLoss.netloseFrom;
    const current = bonus.conditions.netLoss.userNetLoss;
    return totalRequired > 0 ? Math.min((current / totalRequired) * 100, 100) : 100;
  }, []);

  const calculateWagerProgress = useCallback((bonus: Bonus): number => {
    if (['expired', 'canceled'].includes(bonus.status)) return 0;
    const wagerTotal = bonus.bonusId.wager_amount || 0;
    if (wagerTotal <= 0) return 100; // Fix: 100% if no wager required
    const wagerBets = bonus.wagerBets || [];
    const wagerPlayed = wagerBets.reduce((sum: number, bet: { bet_money: number }) => {
      if (
        bonus.bonusId.max_bet_bonus_amount &&
        bet.bet_money > bonus.bonusId.max_bet_bonus_amount
      ) {
        return sum;
      }
      return sum + bet.bet_money;
    }, 0);
    return Math.min((wagerPlayed / wagerTotal) * 100, 100);
  }, []);

  const calculateTotalProgress = useCallback(
    (bonus: Bonus): number => {
      if (['expired', 'canceled'].includes(bonus.status) || bonus.added_bonus > 0) return 0;
      const depositProgress = calculateDepositProgress(bonus);
      const spendProgress = calculateSpendProgress(bonus);
      const netLossProgress = calculateNetLossProgress(bonus);
      const wagerProgress = calculateWagerProgress(bonus);
      const applicableConditions: number[] = [
        bonus.conditions.deposit.required ? depositProgress : 100,
        bonus.conditions.spend.required ? spendProgress : 100,
        bonus.conditions.netLoss.required ? netLossProgress : 100,
        bonus.bonusId.wager > 0 && bonus.bonusId.calculatedBonusAmount > 0 ? wagerProgress : 100, // Fix: 100% if no wager
      ];
      return applicableConditions.length > 0
        ? applicableConditions.reduce((sum, val) => sum + val, 0) / applicableConditions.length
        : 100; // 100% if no conditions apply
    },
    [
      calculateDepositProgress,
      calculateSpendProgress,
      calculateNetLossProgress,
      calculateWagerProgress,
    ]
  );

  const indexOfLastBonus = currentPage * bonusesPerPage;
  const indexOfFirstBonus = indexOfLastBonus - bonusesPerPage;
  const currentBonuses = filteredBonuses.slice(indexOfFirstBonus, indexOfLastBonus);
  const totalPages = Math.ceil(filteredBonuses.length / bonusesPerPage);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setExpanded(null);
  }, []);

  return (
    <Container maxWidth={false} sx={{ px: 0, py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <CustomBreadcrumbs
          heading={t('myshares')}
          links={[{ name: t('user') }, { name: t('myshares') }]}
          sx={{
            color: 'text.primary',
            '& a': {
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'none',
                color: '#24ee89',
              },
            },
          }}
        />
        <IconButton onClick={handleRefresh} disabled={isLoading}>
          <Iconify icon="mdi:refresh" sx={{ color: '#24ee89' }} />
        </IconButton>
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3} justifyContent="flex-start">
        <FormControl fullWidth sx={{ maxWidth: 200 }}>
          <InputLabel>{t('filter_by_status')}</InputLabel>
          <Select
            value={filterStatus}
            label={t('filter_by_status')}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | BonusStatus)}
          >
            <MenuItem value="all">{t('all')}</MenuItem>
            <MenuItem value="processing">{t('processing')}</MenuItem>
            <MenuItem value="active">{t('active')}</MenuItem>
            <MenuItem value="finished">{t('finished')}</MenuItem>
            <MenuItem value="expired">{t('expired')}</MenuItem>
            <MenuItem value="canceled">{t('canceled')}</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label={t('search_by_title')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ maxWidth: 300 }}
        />
      </Stack>
      <Grid container spacing={3} justifyContent="flex-start">
        {currentBonuses.length > 0 ? (
          currentBonuses
            .map((bonus) => {
              if (!bonus.bonusId || !bonus.bonusId.lang || !Array.isArray(bonus.bonusId.lang)) {
                return null;
              }

              const title =
                bonus.bonusId.lang.find((l) => l.lang === 'en')?.title ||
                bonus.bonusId.lang[0]?.title ||
                'Bonus';
              const rules =
                bonus.bonusId.lang.find((l) => l.lang === 'en')?.rules ||
                bonus.bonusId.lang[0]?.rules ||
                'No rules specified';
              const preImage =
                bonus.bonusId.lang.find((l) => l.lang === 'en')?.pre_image ||
                bonus.bonusId.lang[0]?.pre_image;
              const depositProgress = calculateDepositProgress(bonus);
              const spendProgress = calculateSpendProgress(bonus);
              const netLossProgress = calculateNetLossProgress(bonus);
              const wagerProgress = calculateWagerProgress(bonus);
              const totalProgress = calculateTotalProgress(bonus);
              const isActionable = !['canceled', 'expired'].includes(bonus.status);
              const showDepositButton =
                isActionable &&
                bonus.conditions.deposit.required &&
                !bonus.conditions.deposit.completed;
              const showActivateButton =
                isActionable && bonus.status === 'processing' && !bonus.conditions.deposit.required;

              return (
                <Grid item xs={12} sm={6} md={6} lg={4} key={bonus._id}>
                  <Card
                    sx={{
                      bgcolor: '#2B2F3D',
                      borderRadius: 2,
                      position: 'relative',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      transition: 'transform 0.5s ease-in-out, box-shadow 0.5s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 8px 24px rgba(138,43, 226, 0.3)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, #24ee89 0%, transparent 100%)',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
                        borderTopLeftRadius: 8,
                        borderBottomLeftRadius: 8,
                      },
                    }}
                  >
                    {preImage && (
                      <Box sx={{ p: 2, pt: 3 }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={`${API_URL}/${preImage}`}
                          alt={title}
                          sx={{
                            borderRadius: 2,
                            objectFit: 'cover',
                            width: '100%',
                          }}
                        />
                      </Box>
                    )}
                    <CardHeader
                      title={
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#24ee89',
                            fontFamily: 'Geogrotesque Cyr SemiBold, Arial, sans-serif',
                            fontWeight: 600
                          }}
                        >
                          {title}
                        </Typography>
                      }
                      subheader={
                        <Typography variant="caption" sx={{ color: '#B0BEC5' }}>
                          {bonus.bonusId.from_date && bonus.bonusId.to_date
                            ? `${formatDate(bonus.bonusId.from_date)} - ${formatDate(
                              bonus.bonusId.to_date
                            )}`
                            : 'No date specified'}
                        </Typography>
                      }
                      action={
                        <IconButton
                          onClick={() => handleExpand(bonus._id)}
                          sx={{ color: '#24ee89' }}
                        >
                          <Iconify
                            icon={expanded === bonus._id ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                          />
                        </IconButton>
                      }
                      sx={{ py: 2 }}
                    />
                    <CardContent>
                      <Stack spacing={1}>
                        <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                          {t('amount')}:{' '}
                          <span style={{ color: '#24ee89', fontWeight: 'bold' }}>
                            {bonus.bonusId.amount_type === 'percentage'
                              ? `${bonus.bonusId.amount}%`
                              : fCurrency(bonus.bonusId.calculatedBonusAmount)}
                          </span>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                          {t('bonus_type')}:{' '}
                          {bonus.bonusId.amount_type === 'percentage'
                            ? '%'
                            : bonus.bonusId.amount_type}
                        </Typography>
                        {bonus.bonusId.up_to_amount > 0 && (
                          <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                            {t('up_to')}: {`${fCurrency(bonus.bonusId.up_to_amount, false)}`}
                          </Typography>
                        )}
                        {bonus.bonusId.wager > 0 && (
                          <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                            {t('wager')}:{' '}
                            <span style={{ color: '#24ee89', fontWeight: 'bold' }}>
                              {bonus.bonusId.wager}x
                            </span>
                          </Typography>
                        )}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
                            {t('status')}:
                          </Typography>
                          <Chip
                            label={bonus.status}
                            color={getStatusColor(bonus.status)}
                            sx={{
                              textTransform: 'capitalize',
                              fontWeight: 'bold',
                              ...(bonus.status === 'finished' && {
                                bgcolor: '#4CAF50',
                                color: '#FFFFFF',
                              }),
                              ...(bonus.status === 'processing' && {
                                bgcolor: '#0288D1',
                                color: '#FFFFFF',
                              }),
                              ...(bonus.status === 'expired' || bonus.status === 'canceled'
                                ? { bgcolor: '#F44336', color: '#FFFFFF' }
                                : {}),
                            }}
                            size="small"
                          />
                        </Stack>
                        {bonus.status === 'processing' && timeRemaining[bonus._id] && (
                          <Typography variant="body2" sx={{ color: '#24ee89', fontWeight: 'bold' }}>
                            {t('time_to_activate')}: {timeRemaining[bonus._id]}
                          </Typography>
                        )}
                        {showActivateButton && (
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: '#24ee89',
                              border: '2px solid #664401',
                              color: '#050514',
                              '&:hover': { bgcolor: '#A64BFF', border: '2px solid #664401' },
                            }}
                            onClick={() => handleActivateNoDeposit(bonus._id)}
                          >
                            {t('activate_bonus')}
                          </Button>
                        )}
                        {bonus.bonusId.amount_type === 'percentage' && (
                          <Typography
                            variant="body2"
                            sx={{ color: '#24ee89', fontStyle: 'italic' }}
                          >
                            {t('bonus_formula')}: {t('deposit')} / 100 * {bonus.bonusId.amount}%
                          </Typography>
                        )}
                      </Stack>
                      <Collapse
                        in={expanded === bonus._id}
                        timeout={500}
                        sx={{
                          transition: 'height 0.5s ease-in-out, opacity 0.5s ease-in-out',
                          opacity: expanded === bonus._id ? 1 : 0,
                        }}
                      >
                        <Divider sx={{ my: 2, borderColor: 'rgba(138,43, 226, 0.3)' }} />
                        <Stack spacing={2}>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#24ee89', fontWeight: 'bold' }}
                          >
                            {t('rules')}:
                          </Typography>
                          <Stack spacing={1}>
                            {bonus.bonusId.up_to_amount > 0 && (
                              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                                {t('max_bonus_amount')}:{' '}
                                {fCurrency(bonus.bonusId.up_to_amount, false)}
                              </Typography>
                            )}
                            {bonus.bonusId.max_bet_free_spin > 0 && (
                              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                                {t('max_bet_free_spin')}: {bonus.bonusId.max_bet_free_spin}
                              </Typography>
                            )}
                            {bonus.bonusId.max_bet_bonus_amount > 0 && (
                              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                                {t('max_bet_bonus_amount')}: {bonus.bonusId.max_bet_bonus_amount}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                              {rules}
                            </Typography>
                          </Stack>

                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#24ee89', fontWeight: 'bold' }}
                          >
                            {t('how_to_get_bonus')}:
                          </Typography>
                          <Stack spacing={1}>
                            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                              {t('deposit_requirement')}: {bonus.conditions.deposit.amountFrom} -{' '}
                              {bonus.conditions.deposit.amountTo || '∞'}
                            </Typography>
                            {showDepositButton && (
                              <Button
                                variant="contained"
                                sx={{
                                  bgcolor: '#24ee89',
                                  border: '2px solid #664401',
                                  color: '#050514',
                                  '&:hover': { bgcolor: '#A64BFF', border: '2px solid #664401' },
                                }}
                                onClick={() => handleDeposit(bonus._id)}
                              >
                                {t('deposit_now')}
                              </Button>
                            )}
                            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                              {t('spend_requirement')}: {bonus.conditions.spend.amount}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                              {t('net_loss_requirement')}: {bonus.conditions.netLoss.netloseFrom} -{' '}
                              {bonus.conditions.netLoss.netloseTo}
                            </Typography>
                            {bonus.bonusId.wager > 0 && bonus.bonusId.calculatedBonusAmount > 0 ? (
                              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                                {t('need_to_played_on')}{' '}
                                {fCurrency(bonus.bonusId.wager_amount, false)}{' '}
                                {bonus.bonusId.games?.length > 0 && (
                                  <>
                                    {t('in_games')}:{' '}
                                    {bonus.bonusId.games.map((game) => game.game_name).join(', ')}
                                  </>
                                )}
                              </Typography>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                                {t('need_to_played_on')}: N/A
                              </Typography>
                            )}
                            {bonus.bonusId.free_spin > 0 && (
                              <Typography variant="body2" sx={{ color: '#B0BEC5' }}>
                                {t('free_spins')}: {bonus.bonusId.free_spin}{' '}
                                {bonus.bonusId.games_freespin?.length > 0 && (
                                  <>
                                    {t('in_games_for_free_spins')}:{' '}
                                    {bonus.bonusId.games_freespin
                                      .map((game) => game.game_name)
                                      .join(', ')}
                                  </>
                                )}
                              </Typography>
                            )}
                          </Stack>

                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#24ee89', fontWeight: 'bold' }}
                          >
                            {t('progress')}:
                          </Typography>
                          <Stack spacing={1}>
                            <Stack spacing={0.5}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify
                                  icon={
                                    bonus.conditions.deposit.completed
                                      ? 'mdi:check-circle'
                                      : 'mdi:circle-outline'
                                  }
                                  sx={{
                                    color: bonus.conditions.deposit.completed
                                      ? '#24ee89'
                                      : '#B0BEC5',
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#B0BEC5',
                                    textDecoration: bonus.conditions.deposit.completed
                                      ? 'line-through'
                                      : 'none',
                                  }}
                                >
                                  1. {t('deposit')}: {bonus.conditions.deposit.amountFrom} -{' '}
                                  {bonus.conditions.deposit.amountTo || '∞'} ({t('current')}:{' '}
                                  {bonus.conditions.deposit.userDeposit})
                                </Typography>
                              </Stack>
                              <Box>
                                <BrandProgress value={depositProgress} />
                                <Typography
                                  variant="caption"
                                  sx={{ alignSelf: 'flex-end', color: '#24ee89' }}
                                >
                                  {Math.round(depositProgress)}%
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack spacing={0.5}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify
                                  icon={
                                    bonus.conditions.spend.completed
                                      ? 'mdi:check-circle'
                                      : 'mdi:circle-outline'
                                  }
                                  sx={{
                                    color: bonus.conditions.spend.completed ? '#24ee89' : '#B0BEC5',
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#B0BEC5',
                                    textDecoration: bonus.conditions.spend.completed
                                      ? 'line-through'
                                      : 'none',
                                  }}
                                >
                                  2. {t('spend_amount')}: {bonus.conditions.spend.amount} (
                                  {t('current')}: {bonus.conditions.spend.userSpend})
                                </Typography>
                              </Stack>
                              <Box>
                                <BrandProgress value={spendProgress} />
                                <Typography
                                  variant="caption"
                                  sx={{ alignSelf: 'flex-end', color: '#24ee89' }}
                                >
                                  {Math.round(spendProgress)}%
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack spacing={0.5}>
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Iconify
                                  icon={
                                    bonus.conditions.netLoss.completed
                                      ? 'mdi:check-circle'
                                      : 'mdi:circle-outline'
                                  }
                                  sx={{
                                    color: bonus.conditions.netLoss.completed
                                      ? '#24ee89'
                                      : '#B0BEC5',
                                  }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#B0BEC5',
                                    textDecoration: bonus.conditions.netLoss.completed
                                      ? 'line-through'
                                      : 'none',
                                  }}
                                >
                                  3. {t('net_loss')}: {bonus.conditions.netLoss.netloseFrom} -{' '}
                                  {bonus.conditions.netLoss.netloseTo} ({t('current')}:{' '}
                                  {bonus.conditions.netLoss.userNetLoss})
                                </Typography>
                              </Stack>
                              <Box>
                                <BrandProgress value={netLossProgress} />
                                <Typography
                                  variant="caption"
                                  sx={{ alignSelf: 'flex-end', color: '#24ee89' }}
                                >
                                  {Math.round(netLossProgress)}%
                                </Typography>
                              </Box>
                            </Stack>
                            {bonus.bonusId.wager > 0 && bonus.bonusId.calculatedBonusAmount > 0 && (
                              <Stack spacing={0.5}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Iconify
                                    icon={
                                      wagerProgress === 100
                                        ? 'mdi:check-circle'
                                        : 'mdi:circle-outline'
                                    }
                                    sx={{ color: wagerProgress === 100 ? '#24ee89' : '#B0BEC5' }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: '#B0BEC5',
                                      textDecoration:
                                        wagerProgress === 100 ? 'line-through' : 'none',
                                    }}
                                  >
                                    4. {t('wager')}: {fCurrency(bonus.bonusId.wager_amount, false)}
                                  </Typography>
                                </Stack>
                                <Box>
                                  <BrandProgress value={wagerProgress} />
                                  <Typography
                                    variant="caption"
                                    sx={{ alignSelf: 'flex-end', color: '#24ee89' }}
                                  >
                                    {Math.round(wagerProgress)}%
                                  </Typography>
                                </Box>
                              </Stack>
                            )}

                            <Box mt={2}>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: '#24ee89', fontWeight: 'bold' }}
                              >
                                {t('total_progress')}:
                              </Typography>
                              <BrandProgress value={totalProgress} />
                              <Typography
                                variant="caption"
                                sx={{ alignSelf: 'flex-end', color: '#24ee89' }}
                              >
                                {Math.round(totalProgress)}%
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </Collapse>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
            .filter(Boolean)
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left', color: '#B0BEC5' }}>
              {t('no_bonuses_available')}
            </Typography>
          </Grid>
        )}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#24ee89',
                '&:hover': {
                  backgroundColor: '#A68B3C',
                },
                '&.Mui-selected': {
                  backgroundColor: '#CAAE51',
                  color: '#050514',
                },
              },
            }}
          />
        </Box>
      )}

      <ConfirmDialog
        open={confirmCancel.value}
        onClose={() => {
          confirmCancel.onFalse();
          setPassword('');
          cancelBonus.onFalse();
        }}
        title={
          <Typography variant="h4" sx={{ textTransform: 'uppercase', color: '#CAAE51' }}>
            {t('active')}
          </Typography>
        }
        content={
          <>
            <Typography sx={{ color: '#FFFFFF' }}>
              {t('cancel_bonus_desc')
                .split('<br/>')
                .map((text, ind) => (
                  <Fragment key={ind}>
                    {text}
                    <br />
                  </Fragment>
                ))}
            </Typography>
            {cancelBonus.value && (
              <>
                <Alert
                  variant="outlined"
                  severity="warning"
                  sx={{
                    my: 2,
                    borderStyle: 'dashed',
                    borderColor: '#CAAE51',
                    color: '#FFFFFF',
                    bgcolor: '#CAAE51',
                  }}
                >
                  {t('cancel_bonus_warning')
                    .split('<br/>')
                    .map((text, ind) => (
                      <Fragment key={ind}>
                        {text}
                        <br />
                      </Fragment>
                    ))}
                </Alert>
                <TextField
                  type="password"
                  variant="outlined"
                  label={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: '#2B2F3D',
                      border: '1px solid #664401',
                      color: '#FFFFFF',
                    },
                    '& .MuiInputLabel-root': {
                      color: '#CAAE51',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#664401',
                    },
                  }}
                />
              </>
            )}
          </>
        }
        action={
          !cancelBonus.value ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#CAAE51',
                border: '2px solid #664401',
                color: '#050514',
                '&:hover': {
                  bgcolor: '#A68B3C',
                  border: '2px solid #664401',
                },
              }}
              onClick={cancelBonus.onTrue}
            >
              {t('agree')}
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              sx={{
                bgcolor: '#CAAE51',
                border: '2px solid #664401',
                color: '#050514',
                '&:hover': {
                  bgcolor: '#A68B3C',
                  border: '2px solid #664401',
                },
              }}
              loading={isProcessing}
              onClick={handleCancelBonus}
            >
              {t('verify')}
            </LoadingButton>
          )
        }
        sx={{ bgcolor: '#2B2F3D', border: '2px solid #CAAE51' }}
      />
    </Container>
  );
}
