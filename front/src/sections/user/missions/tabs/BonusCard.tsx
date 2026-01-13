/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Stack, 
  IconButton, 
  Divider, 
  Chip, 
  Box, 
  Button, 
  Autocomplete, 
  TextField, 
  CircularProgress, 
  Collapse 
} from '@mui/material';
import { useLocales } from 'src/locales';
import Iconify from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { useEffect } from 'react';

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
  currencies?: { currency: string; games: { game: string; max_bet: number }[] }[];
  game_code: string | null;
  status: 'paid' | 'activated';
  activate: boolean;
  createdAt: string;
}

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

interface BonusCardProps {
  item: Purchase | WheelHistory;
  index: number;
  currentPage: number;
  expanded: { [page: number]: { [key: string]: boolean } };
  handleExpand: (uniqueKey: string) => void;
  isLoadingGames: { [key: string]: boolean };
  gamesByItem: { [key: string]: Game[] };
  searchQuery: { [key: string]: string };
  selectedGame: { [key: string]: string };
  setSearchQuery: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setSelectedGame: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  handleActivate: (itemId: string) => Promise<void>;
  fetchGamesByPurchaseId: (itemId: string, search?: string) => Promise<void>;
  debouncedFetchGames: (itemId: string, search: string) => void;
}

const getStatusColor = (status: string, activate: boolean) => {
  if (activate) {
    return 'success';
  }
  switch (status) {
    case 'paid':
      return 'info';
    case 'not_paid':
      return 'error';
    default:
      return 'default';
  }
};

const preventDefaultInteractions = (e: React.SyntheticEvent) => {
  e.preventDefault();
};

const BonusCard: React.FC<BonusCardProps> = ({
  item,
  index,
  currentPage,
  expanded,
  handleExpand,
  isLoadingGames,
  gamesByItem,
  searchQuery,
  selectedGame,
  setSearchQuery,
  setSelectedGame,
  handleActivate,
  fetchGamesByPurchaseId,
  debouncedFetchGames,
}) => {
  const { t } = useLocales();
  const uniqueKey = `${item._id}:${index}`;
  const games = Array.isArray(gamesByItem[item._id]) ? gamesByItem[item._id] : [];
  const isLoading = isLoadingGames[item._id] || false;
  const search = searchQuery[item._id] || '';
  const isPurchase = 'shopName' in item;
  const isNeedActivate = item.status === 'paid' && !item.activate;
  const activatedGame = item.activate && item.game_code
    ? games.find((g) => g.game_code === item.game_code)
    : null;
  const typeGift = isPurchase ? item.type_gift : 'free_spins';
  const title = isPurchase ? item.shopName : t('wheel_bonus');
  const typeGiftLabel = {
    free_spins: 'Free Spin',
    cash_bonus: 'Cash Bonus',
    free_bet: 'Free Bet',
  }[typeGift] || typeGift;

  console.log(`Rendering BonusCard for ${item._id}, currencies:`, item.currencies, 'game_code:', item.game_code, 'activatedGame:', activatedGame);

  useEffect(() => {
    if ((isPurchase && typeGift === 'free_spins' || !isPurchase) && !item.activate) {
      fetchGamesByPurchaseId(item._id);
    }
    if (item.activate && item.game_code && !activatedGame) {
      fetchGamesByPurchaseId(item._id);
    }
  }, [item.activate, item.game_code, activatedGame, fetchGamesByPurchaseId, item._id, typeGift, isPurchase]);

  return (
    <Card
      key={uniqueKey}
      sx={{
        bgcolor: '#2B2F3D',
        border: '1px solid #232626',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        borderRadius: 0.6,
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 24px rgba(138, 43, 226, 0.15)',
        },
        minHeight: { xs: 300, sm: 320, md: 340, lg: 350 },
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'visible',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onDragStart={preventDefaultInteractions}
      onTouchStart={preventDefaultInteractions}
      onTouchMove={preventDefaultInteractions}
    >
      <CardHeader
        title={
          <Typography
            variant="h5"
            sx={{
              color: '#24ee89',
              fontWeight: 700,
              fontStyle: 'italic',
              fontFamily: 'Impact, sans-serif',
              fontSize: { xs: 18, sm: 20, md: 22, lg: 24 },
              textTransform: 'uppercase',
              letterSpacing: 1,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {title}
          </Typography>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              fontWeight: 700,
              fontSize: { xs: 10, sm: 11, md: 12, lg: 12 },
              mt: 0.5,
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Typography>
        }
        action={
          <IconButton onClick={() => handleExpand(uniqueKey)} sx={{ color: '#CAAE51' }}>
            <Iconify
              icon={expanded[currentPage]?.[uniqueKey] ? 'mdi:chevron-up' : 'mdi:chevron-down'}
              width={20}
              height={20}
              sx={{
                transition: 'transform 0.3s ease-in-out',
                transform: expanded[currentPage]?.[uniqueKey] ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </IconButton>
        }
        sx={{ 
          py: { xs: 1, sm: 1.5 },
          px: { xs: 1, sm: 2 },
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Typography
            variant="body2"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              fontWeight: 700,
              fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
              textTransform: 'uppercase',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {t('type')}: <span style={{ color: '#24ee89', fontWeight: 700 }}>{typeGiftLabel}</span>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#E0E0E0',
              fontFamily: 'Cera Pro, sans-serif',
              fontWeight: 700,
              fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
              textTransform: 'uppercase',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
          >
            {t('payout')}: <span style={{ color: '#24ee89', fontWeight: 700 }}>{fCurrency(item.payout)}</span>
          </Typography>
          {!item.activate && ( // Only show status if not activated
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  color: '#E0E0E0',
                  fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                  fontWeight: 500,
                  fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
                  textTransform: 'uppercase',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                {t('status')}:
              </Typography>
              <Chip
                label={item.status}
                sx={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontFamily: 'Cera Pro, sans-serif',
                  fontSize: { xs: 10, sm: 11, md: 12, lg: 14 },
                  background: 'linear-gradient(180deg, rgba(255,231,26,0.25) 0%, rgba(255,231,26,0.05) 100%)',
                  border: '1px solid #24ee89',
                  color: '#24ee89',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
                size="small"
              />
            </Stack>
          )}
          {isNeedActivate && (
            <Typography
              variant="body2"
              sx={{
                color: '#24ee89',
                fontStyle: 'italic',
                fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                fontWeight: 500,
                fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
                textTransform: 'uppercase',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              }}
            >
              {t('need_to_activate_bonus')}
            </Typography>
          )}
          {(typeGift === 'free_spins' || !isPurchase) && !item.activate && (
            <>
              <Autocomplete
                fullWidth
                options={games}
                getOptionLabel={(option) => option.name || ''}
                value={games.find((g) => g.game_code === selectedGame[item._id]) || null}
                onChange={(event, newValue) =>
                  setSelectedGame({
                    ...selectedGame,
                    [item._id]: newValue?.game_code || '',
                  })
                }
                onInputChange={(event, newInputValue, reason) => {
                  setSearchQuery((prev) => ({ ...prev, [item._id]: newInputValue }));
                  if (reason === 'input') {
                    if (newInputValue.trim()) {
                      debouncedFetchGames(item._id, newInputValue);
                    } else if (!games.length && !isLoading) {
                      fetchGamesByPurchaseId(item._id);
                    }
                  }
                }}
                onOpen={() => {
                  if (!games.length && !isLoading) {
                    fetchGamesByPurchaseId(item._id);
                  }
                }}
                loading={isLoading}
                disabled={(isPurchase && typeGift !== 'free_spins') || !isNeedActivate}
                clearOnEscape
                disablePortal
                slotProps={{
                  popper: {
                    placement: 'bottom-start',
                    modifiers: [
                      {
                        name: 'flip',
                        enabled: false,
                      },
                      {
                        name: 'preventOverflow',
                        enabled: true,
                        options: {
                          boundariesElement: 'viewport',
                        },
                      },
                    ],
                  },
                }}
                sx={{
                  mt: 2,
                  '& .MuiAutocomplete-popupIndicator': {
                    color: '#24ee89',
                    '&:hover': {
                      color: '#24ee89',
                    },
                  },
                  '& .MuiAutocomplete-clearIndicator': {
                    color: '#24ee89',
                    '&:hover': {
                      color: '#24ee89',
                    },
                  },
                  '& .MuiAutocomplete-popper': {
                    zIndex: 9999,
                    '& .MuiPaper-root': {
                      marginTop: '2px',
                      transform: 'translateY(0px) !important',
                    },
                  },
                }}
                renderInput={(params) => {
                  const selected = games.find((g) => g.game_code === selectedGame[item._id]);
                  return (
                    <TextField
                      {...params}
                      label={t('select_game')}
                      value={selected ? selected.name : search}
                      onChange={(e) => setSearchQuery((prev) => ({ ...prev, [item._id]: e.target.value }))}
                      sx={{
                        mt: 2,
                        bgcolor: '#232626',
                        borderRadius: 0.6,
                        '& .MuiInputLabel-root': {
                          color: '#24ee89',
                          fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                          fontWeight: 500,
                          fontSize: { xs: 10, sm: 11, md: 12, lg: 14 },
                          textTransform: 'uppercase',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                        },
                        '& .MuiInputBase-root': {
                          color: '#E0E0E0',
                          fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                          fontWeight: 500,
                          fontSize: { xs: 10, sm: 11, md: 12, lg: 14 },
                          bgcolor: '#232626',
                          borderRadius: 0.6,
                          textTransform: 'uppercase',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#232626',
                          borderWidth: 1,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#232626',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#24ee89',
                          borderWidth: 1,
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#24ee89',
                        },
                        '& .MuiAutocomplete-endAdornment': {
                          right: 9,
                        },
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading ? (
                              <CircularProgress size={20} sx={{ color: '#CAAE51' }} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  );
                }}
                PaperComponent={({ children }) => (
                  <Box
                    sx={{
                      bgcolor: '#2B2F3D',
                      color: '#E0E0E0',
                      border: '1px solid #232626',
                      borderRadius: 0.6,
                      '& .MuiAutocomplete-option': {
                        fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                        fontWeight: 500,
                        fontSize: { xs: 10, sm: 11, md: 12, lg: 14 },
                        padding: '8px 16px',
                        textTransform: 'uppercase',
                        '&:hover': {
                          bgcolor: 'rgba(255,231,26,0.08)',
                          color: '#24ee89',
                        },
                        '&[aria-selected="true"]': {
                          bgcolor: 'rgba(255,231,26,0.12)',
                          color: '#24ee89',
                        },
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        MozUserSelect: 'none',
                        msUserSelect: 'none',
                      },
                    }}
                  >
                    {children}
                  </Box>
                )}
                noOptionsText={
                  <Typography
                    sx={{
                      fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                      fontWeight: 500,
                      fontSize: { xs: 10, sm: 11, md: 12, lg: 14 },
                      color: '#E0E0E0',
                      textAlign: 'center',
                      py: 1,
                      textTransform: 'uppercase',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                    }}
                  >
                    {t('no_games_available')}
                  </Typography>
                }
              />
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#24ee89',
                  color: '#FFF',
                  border: '1px solid #292929ff',
                  '&:hover': {
                    backgroundColor: '#a3961dff',
                    borderColor: '#2e2e2eff',
                  },
                  mt: 2,
                  fontWeight: 400,
                  fontFamily: 'Impact, sans-serif',
                  fontSize: { xs: 10, sm: 11, md: 12, lg: 14 },
                  textTransform: 'uppercase',
                  borderRadius: 0.6,
                  py: { xs: 0.5, sm: 0.75 },
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
                onClick={() => handleActivate(item._id)}
                disabled={isLoading || !selectedGame[item._id]}
              >
                {t('activate_bonus')}
              </Button>
            </>
          )}
          {(typeGift === 'free_spins' || !isPurchase) && item.activate && item.game_code && (
            <Typography
              variant="body2"
              sx={{
                color: '#CAAE51',
                fontWeight: 500,
                fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
                textTransform: 'uppercase',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
              }}
            >
              {t('activated_on')}: {activatedGame ? activatedGame.name : `Game ${item.game_code}`}
            </Typography>
          )}
        </Stack>
        <Collapse in={expanded[currentPage]?.[uniqueKey]} timeout={300}>
          <Box key={`details-${uniqueKey}`}>
            <Divider sx={{ my: { xs: 1, sm: 2 }, borderColor: '#786023' }} />
            <Stack spacing={2}>
              {isPurchase && (
                <>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: '#CAAE51',
                      fontWeight: 400,
                      fontFamily: 'Impact, sans-serif',
                      fontSize: { xs: 14, sm: 15, md: 16, lg: 18 },
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                    }}
                  >
                    {t('description')}:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#E0E0E0',
                      fontFamily: 'Geogrotesque Cyr, Cera Pro, sans-serif',
                      fontWeight: 500,
                      fontSize: { xs: 12, sm: 13, md: 14, lg: 16 },
                      textTransform: 'uppercase',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                    }}
                  >
                    {item.shopDescription}
                  </Typography>
                </>
              )}
            </Stack>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default BonusCard;