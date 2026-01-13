import { useEffect, useState } from 'react';

import { Box, Chip, Stack, Avatar, Button, Divider, Collapse, Typography } from '@mui/material';

import useApi from 'src/hooks/use-api';
import { useSelector, useDispatch } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
import { useNavigate } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { AnimateButton } from 'src/components/animate';
import Image from 'src/components/image';

import { paths } from 'src/routes/paths';
import { MARKET_NAMES } from 'src/config-global';
import { SportsLockIcon } from 'src/assets/icons';
import { addRemoveBetslip, convertBetslipData, convertSoccerBetslipData } from 'src/utils/sports';
import { sportsSocket } from 'src/utils/socket';
import { getOddType } from 'src/utils';
import { useLocales } from 'src/locales';
import {
  BetslipProps,
  IOddTypes,
  IOdds,
  ISportsEvent,
  ISportsMatch,
  SportsHistoryProps,
} from 'src/types';

// --------------------------------

type Props = {
  index: number;
  sportId: number;
  data: ISportsMatch;
};

const customStyle = {
  gap: 1,
  width: { xs: 1, sm: 0.5, md: 0.4 },
  alignItems: 'center',
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
};

const Livelist = ({ sportId, index, data }: Props) => {
  const dispatch = useDispatch();
  const { bet_slips, sports_list } = useSelector((store) => store.sports);

  const [isDown, setIsDown] = useState<boolean>(index === 0);

  const addSlip = (oddType: IOddTypes, event: ISportsEvent) => {
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
  };

  const addSoccerSlip = (odd: any, event: ISportsEvent) => {
    if (!event?.odds) return;
    const sports = sports_list.find((e) => e.SportId === sportId);
    if (!sports) return;
    const betslip = convertSoccerBetslipData({
      event,
      odd,
      sports,
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  };

  return (
    <Stack>
      <Button
        onClick={() => {
          setIsDown(!isDown);
        }}
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
                '& img': {
                  objectFit: 'contain',
                },
              }}
              alt={data.LeagueName}
            />
          ) : (
            <Box component="i" className={`sportsicons sportsicon-${sportId}`} />
          )}
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="h6" sx={{ ml: 1, cursor: 'pointer' }}>
              {data.LeagueName}
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
        {data.events.map((event, i) => (
          <BetEventComponent
            key={i}
            event={event}
            sportId={sportId}
            index={i}
            addSlip={(oddType) => {
              if (sportId === 1) addSoccerSlip(oddType, event);
              else addSlip(oddType, event);
            }}
          />
        ))}
      </Collapse>
    </Stack>
  );
};

export default Livelist;

interface ISoccerOdd {
  id: number;
  name: string;
  values: any[];
}

type BetOddsProps = {
  index: number;
  sportId: number;
  event: ISportsEvent;
  addSlip: (oddType: any) => void;
};

const BetEventComponent = ({ event, index, sportId, addSlip }: BetOddsProps) => {
  const navigate = useNavigate();
  const { t, currentLang } = useLocales();

  const { bet_slips, active_history } = useSelector((store) => store.sports);

  const [odds, setOdds] = useState<IOdds | null>(null);
  const [markets, setMarkets] = useState<ISoccerOdd | null>(null);
  const [marketId, setMarketId] = useState<string>('');
  const [timeMin, setTimeMin] = useState<number>(0);
  const [history, setHistory] = useState<BetslipProps[]>([]);

  const actived = bet_slips.filter(
    (e) => e.SportId === sportId && e.eventId === event.id && e.marketId === marketId.toString()
  );

  const handleAddSlip = (oddType: IOddTypes) => {
    addSlip(oddType);
  };

  const handleSoccerAddSlip = (odd: any) => {
    if (!markets) return;
    if (odd.suspended) return;
    const param = {
      marketId: markets.id.toString(),
      marketName: markets.name,
      oddId: odd.value,
      oddName: odd.value,
      oddType: getOddType(odd.value),
      odds: Number(odd.odd),
      oddData: odd,
    };
    addSlip(param);
  };

  useEffect(() => {
    if (!event?.odds || !sportId) return;
    if (sportId === 1 && event.odds.length) {
      const market = event.odds.find((e: any) => e.id === 59); // FullTime Result
      if (!market) return;
      setMarkets(market);
      setMarketId(market.id);
      return;
    }
    const _marketId = Object.keys(event?.odds)[0];
    const _odds = event.odds[Object.keys(event?.odds)[0]];
    setTimeMin(Number(event.timer?.tm || 0));
    setMarketId(_marketId);
    setOdds(_odds);
    // const getChangedMatches = (data: ISportsEvent[]) => {
    //     const newChanged = data.find((e) => e.id === event.id);
    //     if (!newChanged) return;
    //     const changedOdds = newChanged.odds[_marketId];
    //     console.log(newChanged, "==>changed", changedOdds, _odds);
    //     setTimeMin(Number(newChanged.timer?.tm || 0));
    //     setOdds(changedOdds);
    // }

    // sportsSocket.on("changed-matches", getChangedMatches);

    // // eslint-disable-next-line
    // return () => {
    //     sportsSocket.off("changed-matches", getChangedMatches);
    // };
  }, [event, sportId]);

  useEffect(() => {
    if (!active_history.length) return;
    const _history = active_history.reduce((ary: BetslipProps[], row: SportsHistoryProps) => {
      if (!row.bettings.length) return [];
      const temp = row.bettings.filter(
        (e) => e.SportId === sportId && e.eventId === event.id && e.marketId === marketId.toString()
      );
      return [...ary, ...temp];
    }, []);
    setHistory(_history);
  }, [active_history, event.id, marketId, sportId]);

  const handleClickDetail = () => {
    if (event?.f_status?.short === 'P') return;
    navigate(`/${currentLang.value}/sports/match/${event.id}`, {
      state: {
        matchData: event,
        leagueInfo: {
          id: event.league?.id || 0,
          name: event.league?.name || 'League',
          logo: event.league?.logo || '',
        }
      }
    });
  };

  const replaceOddName = (name: string | number) =>
    name
      .toString()
      .replaceAll('Home', event.home.name)
      .replaceAll('Away', event.away.name)
      .replaceAll('Draw', t('draw'));

  const BetOddsComponent = (
    <Stack direction="row" sx={customStyle}>
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
          <Typography fontSize={14}>{event.away.name}</Typography>
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

      <Typography fontSize={14} fontWeight="bold" color="text.disabled">
        +{event.markets}
      </Typography>
    </Stack>
  );

  const BetSoccerOddsComponent = (
    <Stack direction="row" sx={customStyle}>
      {(!markets?.values || !markets?.values.length) &&
        [1, 2].map((_, ind) => (
          <AnimateButton className="oddbtn" key={ind}>
            <Button variant="contained" color="info">
              <Typography fontSize={14}>{ind === 0 ? event.home.name : event.away.name}</Typography>
              <SportsLockIcon />
            </Button>
          </AnimateButton>
        ))}
      {markets?.values?.map((odd: any, ind: number) => (
        <AnimateButton className="oddbtn" key={ind}>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              handleSoccerAddSlip(odd);
            }}
            className={actived.length && actived.some((e) => e.oddId === odd.value) ? 'active' : ''}
          >
            <Typography fontSize={14}>{replaceOddName(odd.value)}</Typography>
            {!odd.suspended ? (
              <Typography color="success.main">{odd.odd}</Typography>
            ) : (
              <SportsLockIcon />
            )}
            {history.some((e) => e.oddId === odd.value) && (
              <Iconify
                icon="icon-park:check-one"
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

      <Typography fontSize={14} fontWeight="bold" color="text.disabled">
        +{event.odds.length}
      </Typography>
    </Stack>
  );
  return (
    <Stack gap={1}>
      <Stack direction="row" px={1.25} alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            size="small"
            label="Live"
            color="error"
            sx={{
              fontSize: 12,
              borderRadius: 0.4,
              '& .MuiChip-label': {
                px: 0.5,
              },
            }}
          />
          <Typography>
            {`${sportId === 1 ? event?.f_status?.elapsed || '' : timeMin}`}
            <span className="min-effect">&apos;</span>

            {event?.f_status?.extra && (
              <Box component="span" color="#1cff98">
                &nbsp; +{event?.f_status?.extra}
                <span className="min-effect">&apos;</span>
              </Box>
            )}
          </Typography>
          {/* {sportId === 1 && (
                        <>
                            <Typography fontSize={12} color="grey">
                                {(timeMin < 45 && "1st Half") || (timeMin === 45 && "Half Time") || (timeMin > 45 && "2nd Half")}
                            </Typography>
                        </>
                    )} */}

          {sportId === 1 && (
            <Typography fontSize={12} color="grey" sx={{ whiteSpace: 'nowrap' }}>
              {event?.f_status?.long}
            </Typography>
          )}
        </Stack>
        <Divider sx={{ width: { xs: 0.2, sm: 0.6 }, opacity: index }} />
        <Typography fontSize={12} sx={{ opacity: 0.5, whiteSpace: 'nowrap' }}>
          {(MARKET_NAMES[marketId] && t(marketId)) ||
            t(sportId === 1 ? 'fulltime_result' : 'winner')}
        </Typography>
        <Divider sx={{ width: 0.1, opacity: index }} />
      </Stack>
      <Stack
        sx={{
          pt: 0.5,
          px: 1.25,
          pb: 1.25,
          width: 1,
          cursor: 'pointer',
          alignItems: 'center',
          gap: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          '&:hover': {
            color: 'info.light',
          },
        }}
      >
        <Stack width={0.5} onClick={handleClickDetail}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography fontSize={{ xs: 14, sm: 14, md: 16 }}>{event.home.name}</Typography>
            <Avatar
              alt={event.home.name}
              sx={{
                borderRadius: 0.3,
                height: 16,
                width: 30,
                '& img': {
                  objectFit: 'contain',
                },
              }}
              src={
                event.home?.logo ||
                `https://assets.b365api.com/images/team/b/${event.home.image_id}.png`
              }
            />
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography fontSize={{ xs: 14, sm: 14, md: 16 }}>{event.away.name}</Typography>
            <Avatar
              alt={event.away.name}
              sx={{
                borderRadius: 0.3,
                height: 16,
                width: 30,
                '& img': {
                  objectFit: 'contain',
                },
              }}
              src={
                event.away?.logo ||
                `https://assets.b365api.com/images/team/b/${event.away.image_id}.png`
              }
            />
          </Stack>
        </Stack>
        <Stack color="warning.main" textAlign="center" alignItems="flex-end" width={0.1}>
          <Stack direction="row" gap={1}>
            {event?.ss &&
              event?.ss.split(',').map((ss: any, ind: number) => (
                <Box key={ind}>
                  <Typography>{ss.split('-')[0]}</Typography>
                  <Typography>{ss.split('-')[1]}</Typography>
                </Box>
              ))}
          </Stack>
        </Stack>

        {sportId === 1 ? BetSoccerOddsComponent : BetOddsComponent}
      </Stack>
    </Stack>
  );
};
