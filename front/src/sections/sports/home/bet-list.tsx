import { useEffect, useState, useCallback, useMemo, memo } from 'react';

import {
  Box,
  Chip,
  Stack,
  Avatar,
  Button,
  Divider,
  Collapse,
  Typography,
  Skeleton,
} from '@mui/material';
import { format } from 'date-fns';

import { useResponsive } from 'src/hooks/use-responsive';
import { useSelector, useDispatch } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { AnimateButton } from 'src/components/animate';

import { paths } from 'src/routes/paths';
import { MARKET_NAMES } from 'src/config-global';
import { SportsLockIcon } from 'src/assets/icons';
import { useLocales } from 'src/locales';

import { addRemoveBetslip, convertBetslipData, convertSoccerBetslipData } from 'src/utils/sports';
import { sportsSocket } from 'src/utils/socket';
import { getOddType } from 'src/utils';
import {
  BetslipProps,
  IOddTypes,
  IOdds,
  ISportsEvent,
  ISportsMatch,
  SportsHistoryProps,
} from 'src/types';

// Types
type Props = {
  index: number;
  sportId: number;
  data: ISportsMatch;
  loading?: boolean;
};

type LeagueHeaderProps = {
  data: ISportsMatch;
  loading?: boolean;
  sportId: number;
  isDown: boolean;
  onToggle: () => void;
};

type EventItemProps = {
  event: ISportsEvent;
  index: number;
  times: string[];
  sportId: number;
  loading?: boolean;
  onAddSlip: (oddType: IOddTypes, event: ISportsEvent) => void;
  onAddSoccerSlip: (odd: any, event: ISportsEvent) => void;
  onDetailClick: (eventId: number, eventData: ISportsEvent) => void;
};

// Custom hooks
const useTimeFormat = (events: ISportsEvent[]) => {
  const [times, setTimes] = useState<string[]>([]);

  const formatTime = useCallback((ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    if (!events.length) return;

    const updateTimes = () => {
      const date = new Date().getTime();
      const _time = events.map((e) => `in ${formatTime(e.time * 1000 - date)}`);
      setTimes(_time);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [events, formatTime]);

  return times;
};

const useBetSlipManagement = (sportId: number) => {
  const dispatch = useDispatch();
  const { bet_slips, sports_list } = useSelector((store) => store.sports);

  const addSlip = useCallback((oddType: IOddTypes, event: ISportsEvent) => {
    if (!event?.odds) return;
    const sports = sports_list.find((e) => e.SportId === sportId);
    if (!sports) return;

    const marketId = Object.keys(event.odds)[0];
    const marketName = MARKET_NAMES[marketId];
    const betslip = convertBetslipData({
      event,
      odd: { ...event.odds[marketId], marketId, marketName },
      oddType,
      sports,
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  }, [sportId, sports_list, bet_slips, dispatch]);

  const addSoccerSlip = useCallback((odd: any, event: ISportsEvent) => {
    if (!event?.odds) return;
    const sports = sports_list.find((e) => e.SportId === sportId);
    if (!sports) return;

    const betslip = convertSoccerBetslipData({
      event,
      odd,
      sports,
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  }, [sportId, sports_list, bet_slips, dispatch]);

  return { addSlip, addSoccerSlip };
};

// Components
const LeagueHeader = memo(({ data, loading, sportId, isDown, onToggle }: LeagueHeaderProps) => {
  const skelton = useMemo(() => (
    <Skeleton sx={{ width: 100, height: 26, borderRadius: 0.5 }} />
  ), []);

  return (
    <Button
      onClick={onToggle}
      sx={{
        fontSize: 15,
        p: '15px 21px',
        borderRadius: `3px 3px ${!isDown ? '3px 3px' : '0 0'}`,
        bgcolor: 'background.paper',
        justifyContent: 'space-between',
      }}
    >
      <Stack direction="row" alignItems="center">
        {data?.LeagueLogo ? (
          <Image
            src={data?.LeagueLogo}
            sx={{
              width: 24,
              height: 24,
              borderRadius: 0.5,
              lineHeight: 'none',
            }}
            alt={data.LeagueName}
          />
        ) : (
          <Box component="i" className={`sportsicons sportsicon-${sportId}`} />
        )}
        <Stack direction="row" gap={1} alignItems="center">
          <Typography variant="h6" sx={{ ml: 1, cursor: 'pointer' }}>
            {loading ? skelton : data.LeagueName}
          </Typography>
          <Chip
            label={data.events.length}
            color="secondary"
            sx={{ borderRadius: 50, height: 22 }}
          />
        </Stack>
      </Stack>
      <Iconify icon={`ri:arrow-${isDown ? 'down' : 'left'}-s-line`} />
    </Button>
  );
});

const EventItem = memo(({
  event,
  index,
  times,
  sportId,
  loading,
  onAddSlip,
  onAddSoccerSlip,
  onDetailClick
}: EventItemProps) => {
  const smDown = useResponsive('down', 'sm');
  const now = useMemo(() => new Date().getTime(), []);
  const check = event.time * 1000 - now;
  const market = sportId === 1 && event?.odds[0]?.bets;
  const skelton = useMemo(() => (
    <Skeleton sx={{ width: 100, height: 26, borderRadius: 0.5 }} />
  ), []);

  if (check <= 0) return null;

  return (
    <Stack
      sx={{
        ...(check <= 0 && {
          display: 'none',
        }),
      }}
    >
      <Stack direction="row" px={1.25} alignItems="center" justifyContent="space-between">
        <Typography fontSize={12} sx={{ opacity: 0.5, width: 95 }}>
          {times[index]}
        </Typography>
        <Divider sx={{ width: { xs: 0.1, sm: 0.6 }, opacity: index }} />
        <Typography fontSize={12} sx={{ opacity: 0.5 }}>
          {loading
            ? skelton
            : (event?.odds &&
              (market && market.length
                ? market[0]?.name
                : MARKET_NAMES[Object.keys(event?.odds)[0]])) ||
            'Winner'}
        </Typography>
        <Divider sx={{ width: 0.15, opacity: index }} />
        {smDown && (
          <Typography fontSize={14} fontWeight="bold" color="text.disabled">
            +{event.markets}
          </Typography>
        )}
      </Stack>
      <Stack
        sx={{
          pt: 0.5,
          px: 1.25,
          pb: 1.25,
          width: 1,
          alignItems: 'center',
          gap: { xs: 1, sm: 0 },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          '& div': {
            alignItems: 'center',
            ...(sportId !== 2 && {
              flexDirection: 'row',
            }),
          },
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.5} width={130}>
          <Typography color="warning.main" fontSize={{ xs: 14, sm: 14, md: 16 }}>
            {format(new Date(event.time * 1000), 'MMM dd')}
          </Typography>
          <Typography sx={{ opacity: 0.6, fontSize: { xs: 14, sm: 14, md: 16 } }}>
            {format(new Date(event.time * 1000), 'h:mm a')}
          </Typography>
        </Stack>
        <Stack
          sx={{
            gap: 1,
            width: { xs: 1, sm: 0.5 },
            cursor: 'pointer',
            justifyContent: 'center',
            '&:hover': {
              color: 'info.light',
            },
          }}
          onClick={() => onDetailClick(event.id, event)}
        >
          <Stack sx={{ width: 0.5, gap: 1, justifyContent: 'flex-end' }}>
            <Stack sx={{ gap: '7px', flexDirection: sportId !== 2 ? 'row' : 'column' }}>
              {sportId !== 2 && (
                <Typography variant="h6" fontSize={{ sm: 16, md: 18 }} textAlign="right">
                  {loading ? skelton : event.home.name}
                </Typography>
              )}
              <Avatar
                alt={event.home.name}
                sx={{ bgcolor: 'background.default', p: 0.5 }}
                src={
                  event.home?.logo ||
                  `https://assets.b365api.com/images/team/b/${event.home.image_id}.png`
                }
              />
              {sportId === 2 && (
                <Typography variant="h6" fontSize={{ sm: 16, md: 18 }} textAlign="right">
                  {loading ? skelton : event.home.name}
                </Typography>
              )}
            </Stack>
          </Stack>
          {sportId !== 2 && event.away && (
            <>
              <Stack sx={{ gap: 1 }}>
                <Stack sx={{ gap: '7px' }}>
                  <Typography fontSize={14} fontWeight="700">
                    VS
                  </Typography>
                </Stack>
              </Stack>
              <Stack sx={{ width: 0.5, justifyContent: 'flex-start', gap: 1 }}>
                <Stack sx={{ gap: '7px' }}>
                  <Avatar
                    alt={event.away.name}
                    sx={{ bgcolor: 'background.default', p: 0.5 }}
                    src={
                      event.away?.logo ||
                      `https://assets.b365api.com/images/team/b/${event.away.image_id}.png`
                    }
                  />
                  <Typography variant="h6" fontSize={{ sm: 16, md: 18 }}>
                    {loading ? skelton : event.away.name}
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>

        {sportId === 1 ? (
          <SoccerBetOddComponent
            event={event}
            sportId={sportId}
            addSlip={(odd) => onAddSoccerSlip(odd, event)}
          />
        ) : (
          <BetOddComponent
            event={event}
            sportId={sportId}
            addSlip={(oddType) => onAddSlip(oddType, event)}
          />
        )}
      </Stack>
    </Stack>
  );
});

// Main Component
const BetList = ({ sportId, index, data, loading }: Props) => {
  const navigate = useNavigate();
  const { currentLang } = useLocales();
  const [isDown, setIsDown] = useState<boolean>(index === 0);

  const times = useTimeFormat(data.events);
  const { addSlip, addSoccerSlip } = useBetSlipManagement(sportId);

  const handleToggle = useCallback(() => {
    setIsDown((prev) => !prev);
  }, []);

  const handleDetailClick = useCallback((eventId: number, eventData: ISportsEvent) => {
    // Navigate to match detail page with event data
    navigate(`/${currentLang.value}/sports/match/${eventId}`, {
      state: {
        matchData: eventData,
        leagueInfo: {
          id: data.LeagueId,
          name: data.LeagueName,
          logo: data.LeagueLogo,
        }
      }
    });
  }, [currentLang.value, navigate, data]);

  return (
    <Stack>
      <LeagueHeader
        data={data}
        loading={loading}
        sportId={sportId}
        isDown={isDown}
        onToggle={handleToggle}
      />
      <Collapse
        in={isDown}
        timeout="auto"
        unmountOnExit
        sx={{
          borderTop: '1px solid #8080805e',
          bgcolor: 'background.paper',
          borderRadius: '0 0 3px 3px',
          pt: 1,
        }}
      >
        {data.events.map((event, index_e) => (
          <EventItem
            key={event.id}
            event={event}
            index={index_e}
            times={times}
            sportId={sportId}
            loading={loading}
            onAddSlip={addSlip}
            onAddSoccerSlip={addSoccerSlip}
            onDetailClick={handleDetailClick}
          />
        ))}
      </Collapse>
    </Stack>
  );
};

export default memo(BetList);

type BetOddsProps = {
  sportId: number;
  event: ISportsEvent;
  addSlip: (oddType: IOddTypes) => void;
};

const BetOddComponent = ({ event, sportId, addSlip }: BetOddsProps) => {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const [odds, setOdds] = useState<IOdds | null>(null);
  const [marketId, setMarketId] = useState<string>('');
  const [history, setHistory] = useState<BetslipProps[]>([]);
  const { bet_slips, active_history } = useSelector((store) => store.sports);

  const actived = bet_slips.filter(
    (e) => e.SportId === sportId && e.eventId === event.id && e.marketId === marketId
  );

  const handleAddSlip = (oddType: IOddTypes) => {
    addSlip(oddType);
  };

  useEffect(() => {
    if (!event?.odds) return;
    const _marketId = Object.keys(event?.odds)[0];
    const _odds = event.odds[Object.keys(event?.odds)[0]];
    setMarketId(_marketId);
    setOdds(_odds);
    const getChangedMatches = (data: ISportsEvent[]) => {
      const newChanged = data.find((e) => e.id === event.id);
      if (!newChanged) return;
      const changedOdds = newChanged.odds[_marketId];
      setOdds(changedOdds);
    };

    sportsSocket.on('changed-matches', getChangedMatches);

    // eslint-disable-next-line
    return () => {
      sportsSocket.off('changed-matches', getChangedMatches);
    };
  }, [event]);

  useEffect(() => {
    if (!active_history.length) return;
    const _history = active_history.reduce((ary: BetslipProps[], row: SportsHistoryProps) => {
      if (!row.bettings.length) return [];
      const temp = row.bettings.filter(
        (e) => e.SportId === sportId && e.eventId === event.id && e.marketId === marketId
      );
      return [...ary, ...temp];
    }, []);
    setHistory(_history);
  }, [active_history, event.id, marketId, sportId]);

  if (sportId === 2) {
    return (
      <Stack
        sx={{
          gap: 1,
          width: { xs: 1, sm: 0.3, md: 0.2 },
          justifyContent: 'space-between',
          '& button': {
            width: 1,
            margin: '0 auto',
            bgcolor: 'common.black',
            borderRadius: '5px',
            alignItems: 'flex-start',
            padding: '3px 10px',
            transition: 'all 0.3s',
            flexDirection: 'column',
            whiteSpace: 'nowrap',
            '& p': {
              width: 1,
              textAlign: 'left',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          },
          '& .oddbtn': {
            width: 1,
            display: 'grid',
          },
        }}
      >
        <AnimateButton className="oddbtn">
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (odds && odds?.od !== '-') {
                if (odds.od) handleAddSlip(IOddTypes.Home);
              }
            }}
            className={
              actived.length && actived.some((e) => e.oddType === IOddTypes.Home) ? 'active' : ''
            }
          >
            <Typography fontSize={14}>{event.home.name}</Typography>
            {odds && odds?.od !== '-' ? (
              <Typography color="success.main">{Number(odds?.od || '')}</Typography>
            ) : (
              <SportsLockIcon />
            )}

            {history.some((e) => e.oddType === IOddTypes.Home) && (
              <Iconify
                icon="mdi:check"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
              />
            )}
          </Button>
        </AnimateButton>
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        gap: 1,
        width: { xs: 1, sm: 0.5, md: 0.4 },
        justifyContent: 'space-between',
        '& button': {
          width: 1,
          margin: '0 auto',
          bgcolor: 'common.black',
          borderRadius: '5px',
          alignItems: 'flex-start',
          padding: '3px 10px',
          transition: 'all 0.3s',
          flexDirection: 'column',
          whiteSpace: 'nowrap',
          '& p': {
            width: 1,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
        '& .oddbtn': {
          width: 1,
          display: 'grid',
        },
      }}
    >
      <AnimateButton className="oddbtn">
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (
              odds &&
              ((odds?.home_od && odds?.home_od !== '-') || (odds?.over_od && odds?.over_od !== '-'))
            ) {
              if (odds.home_od) handleAddSlip(IOddTypes.Home);
              if (odds.over_od) handleAddSlip(IOddTypes.Over);
            }
          }}
          className={
            actived.length &&
              actived.some((e) => e.oddType === IOddTypes.Home || e.oddType === IOddTypes.Over)
              ? 'active'
              : ''
          }
        >
          <Typography fontSize={14}>{event.home.name}</Typography>
          {odds &&
            ((odds?.home_od && odds?.home_od !== '-') || (odds?.over_od && odds?.over_od !== '-')) ? (
            <Typography color="success.main">{Number(odds?.home_od || odds?.over_od)}</Typography>
          ) : (
            <SportsLockIcon />
          )}

          {history.some((e) => e.oddType === IOddTypes.Home || e.oddType === IOddTypes.Over) && (
            <Iconify
              icon="mdi:check"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
            />
          )}
        </Button>
      </AnimateButton>

      {odds && odds?.draw_od && odds?.draw_od !== '-' && (
        <AnimateButton className="oddbtn">
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              if (odds.draw_od) handleAddSlip(IOddTypes.Draw);
            }}
            className={
              actived.length && actived.some((e) => e.oddType === IOddTypes.Draw) ? 'active' : ''
            }
          >
            <Typography fontSize={14}>{t('draw')}</Typography>
            <Typography color="success.main">{Number(odds?.draw_od || 0)}</Typography>
            {history.some((e) => e.oddType === IOddTypes.Draw) && (
              <Iconify
                icon="mdi:check"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
              />
            )}
          </Button>
        </AnimateButton>
      )}

      <AnimateButton className="oddbtn">
        <Button
          variant="contained"
          color="info"
          onClick={() => {
            if (
              odds &&
              ((odds?.away_od && odds?.away_od !== '-') ||
                (odds?.under_od && odds?.under_od !== '-'))
            ) {
              if (odds.away_od) handleAddSlip(IOddTypes.Away);
              if (odds.under_od) handleAddSlip(IOddTypes.Under);
            }
          }}
          className={
            actived.length &&
              actived.some((e) => e.oddType === IOddTypes.Away || e.oddType === IOddTypes.Under)
              ? 'active'
              : ''
          }
        >
          <Typography fontSize={14}>{event?.away ? event.away.name : ''}</Typography>
          {odds &&
            ((odds?.away_od && odds?.away_od !== '-') ||
              (odds?.under_od && odds?.under_od !== '-')) ? (
            <Typography color="success.main">{Number(odds?.away_od || odds?.under_od)}</Typography>
          ) : (
            <SportsLockIcon />
          )}
          {history.some((e) => e.oddType === IOddTypes.Away || e.oddType === IOddTypes.Under) && (
            <Iconify
              icon="mdi:check"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
            />
          )}
        </Button>
      </AnimateButton>

      {!smDown && (
        <Typography fontSize={14} fontWeight="bold" color="text.disabled">
          +{event.markets}
        </Typography>
      )}
    </Stack>
  );
};

interface ISoccerOdd {
  id: number;
  name: string;
  values: any[];
}

type BetSoccerOddsProps = {
  sportId: number;
  event: ISportsEvent;
  addSlip: (odd: any) => void;
};

const SoccerBetOddComponent = ({ event, sportId, addSlip }: BetSoccerOddsProps) => {
  const { t } = useLocales();

  const smDown = useResponsive('down', 'sm');
  const [markets, setMarkets] = useState<ISoccerOdd | null>(null);
  const [history, setHistory] = useState<BetslipProps[]>([]);
  const { bet_slips, active_history } = useSelector((store) => store.sports);

  const actived = bet_slips.filter(
    (e) =>
      e.SportId === sportId &&
      e.eventId === event.id &&
      e.marketId === (markets?.id || '').toString()
  );

  const handleAddSlip = (odd: any) => {
    if (!markets) return;
    console.log(odd, '===>odd', markets);
    const param = {
      marketId: markets.id.toString(),
      marketName: markets.name,
      oddId: odd.value,
      oddName: odd.value,
      oddType: getOddType(odd.value),
      odds: Number(odd.odd),
      oddData: markets.values,
    };
    addSlip(param);
  };

  useEffect(() => { }, [event]);

  useEffect(() => {
    if (!event?.odds?.length || !event?.odds[0]?.bets?.length) return;
    setMarkets(event.odds[0]?.bets[0] || null);
    const getChangedMatches = (data: ISportsEvent[]) => {
      const newChanged = data.find((e) => e.id === event.id && e.sport_id === 1);
      if (!newChanged) return;
      if (newChanged.time_status === 1) {
        setMarkets(null);
        return;
      }
      if (newChanged.odds.length && newChanged.odds[0].bets) {
        const changedOdds = newChanged.odds[0]?.bets[0];
        setMarkets(changedOdds);
      }
    };

    sportsSocket.on('changed-matches', getChangedMatches);

    // eslint-disable-next-line
    return () => {
      sportsSocket.off('changed-matches', getChangedMatches);
    };
  }, [event]);

  useEffect(() => {
    if (!active_history.length || !markets) return;
    const _history = active_history.reduce((ary: BetslipProps[], row: SportsHistoryProps) => {
      if (!row.bettings.length) return [];
      const temp = row.bettings.filter(
        (e) =>
          e.SportId === sportId && e.eventId === event.id && e.marketId === markets.id.toString()
      );
      return [...ary, ...temp];
    }, []);
    setHistory(_history);
  }, [active_history, event.id, markets, sportId]);

  const replaceOddName = (name: string | number) =>
    name
      .toString()
      .replaceAll('Home', event.home.name)
      .replaceAll('Away', event.away.name)
      .replaceAll('Draw', t('draw'));

  return (
    <Stack
      sx={{
        gap: 1,
        width: { xs: 1, sm: 0.5, md: 0.4 },
        justifyContent: 'space-between',
        '& button': {
          width: 1,
          margin: '0 auto',
          bgcolor: 'common.black',
          borderRadius: '5px',
          alignItems: 'flex-start',
          padding: '3px 10px',
          transition: 'all 0.3s',
          flexDirection: 'column',
          whiteSpace: 'nowrap',
          '& p': {
            width: 1,
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        },
        '& .oddbtn': {
          width: 1,
          display: 'grid',
        },
      }}
    >
      {!markets &&
        [1, 2].map((_, ind) => (
          <AnimateButton className="oddbtn" key={ind}>
            <Button variant="contained" color="info">
              <Typography fontSize={14}>{ind === 0 ? event.home.name : event.away.name}</Typography>
              <SportsLockIcon />
            </Button>
          </AnimateButton>
        ))}

      {markets?.values.map((odd, index) => (
        <AnimateButton key={index} className="oddbtn">
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              handleAddSlip(odd);
            }}
            className={actived.length && actived.some((e) => e.oddId === odd.value) ? 'active' : ''}
          >
            <Typography fontSize={14}>{replaceOddName(odd.value)}</Typography>
            <Typography color="success.main">{odd.odd}</Typography>
            {history.some((e) => e.oddId === odd.value) && (
              <Iconify
                icon="mdi:check"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                }}
              />
            )}
          </Button>
        </AnimateButton>
      ))}

      {!smDown && (
        <Typography fontSize={14} fontWeight="bold" color="text.disabled">
          +{event.markets}
        </Typography>
      )}
    </Stack>
  );
};
