import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';

import { AnimateButton } from 'src/components/animate';
// @mui
import { Stack, Typography, Button, Collapse, Tooltip, Box } from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
import { useLocales } from 'src/locales';

import Iconify from 'src/components/iconify';
import { SportsLockIcon } from 'src/assets/icons';
import { sportsSocket } from 'src/utils/socket';
import { IOddTypes } from 'src/types';
import type { BetslipProps, IOdds, ISportsEvent, SportsHistoryProps } from 'src/types';
import { MARKET_NAMES } from 'src/config-global';
import { addRemoveBetslip, convertBetslipData, getoddTypeData } from 'src/utils/sports';

// ----------------------------------------------------------------------
type Props = {
  oddkey: string;
  sportId: number;
  event: any;
  tab: string;
  bet365_odds?: any;
  bet365?: boolean;
};

const customStyle = {
  p: 1,
  gap: 1,
  width: 1,
  flexDirection: 'row',
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
}

export default function BetOption({ event, tab, oddkey, sportId, bet365_odds, bet365 = false }: Props) {
  // if (bet365)
  //   console.log(event, "===>envent")
  const { t } = useLocales();
  const dispatch = useDispatch();
  const [history, setHistory] = useState<BetslipProps[]>([]);
  const { bet_slips, sports_list, active_history } = useSelector((store) => store.sports);

  const actived = bet_slips.filter(
    // @ts-ignore
    (e) => e.SportId === sportId && e.eventId === event.id && e.marketId === oddkey
  );

  const [isDown, setIsDown] = useState<boolean>(true);
  const [odds, setOdds] = useState<IOdds | null>(null);
  const [oddsBet365, setOddsBet365] = useState<any>(null);

  const getMarketName = (params: string) => {
    /* eslint-disable */
    const name = MARKET_NAMES[params];
    if (name) {
      return t(params);
    } else if (params.indexOf('_1') > -1) {
      return t("match_winner_2_way");
    } else if (params.indexOf('_2') > -1) {
      return t('handicap');
    } else if (params.indexOf('_3') > -1) {
      return t('over_under');
    } else {
      return '';
    }
    /* eslint-enable */
  };

  const handleAddSlip = (oddType: IOddTypes) => {
    if (!event?.odds) return;
    const sports = sports_list.find((e) => e.SportId === sportId);
    if (!sports) return;
    const marketName = getMarketName(oddkey);
    const betslip = convertBetslipData({
      event,
      sports,
      oddType,
      odd: { ...event.odds[oddkey], marketId: oddkey, marketName },
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  };

  const handleAddSlipBet365 = (oddData: any) => {
    if (!bet365_odds.odds) return;
    console.log(oddData);

    const sports = sports_list.find((e) => e.SportId === sportId);
    if (!sports) return;
    const _name = oddData.name && getoddTypeData(oddData.name).toLocaleLowerCase();
    const _header = oddData.header && getoddTypeData(oddData.header)?.toLocaleLowerCase();
    const oddType = ((_name === IOddTypes.Home || _name === IOddTypes.Away || _name === IOddTypes.Draw || _name === IOddTypes.Over || _name === IOddTypes.Under) && _name
      || (_header === IOddTypes.Home || _header === IOddTypes.Away || _header === IOddTypes.Draw || _header === IOddTypes.Over || _header === IOddTypes.Under) && _header) || "bet365";

    const betslip = convertBetslipData({
      event,
      sports,
      oddType,
      odd: { ...oddData, pId: tab, marketId: oddkey, marketName: bet365_odds.name },
      isBet365: true
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  };



  useEffect(() => {
    if (!bet365) {
      if (!event?.odds) return;
      const _odds = event.odds[oddkey];
      setOdds(_odds);
    } else {
      if (!bet365_odds.odds.length) return;
      const groupedByHeader = bet365_odds.odds.reduce((acc: any, obj: any) => {
        const key = bet365_odds.odds.length > 3 && obj?.header ? obj?.header : 1;
        acc[key] = acc[key] || [];
        acc[key].push(obj);
        return acc;
      }, {});
      setOddsBet365(groupedByHeader);
    }

    const getChangedMatches = (data: ISportsEvent[]) => {
      const newChanged = data.find((e) => e.id === event.id);
      if (!newChanged) return;
      if (!bet365) {
        if (!newChanged?.odds) return;
        const changedOdds = newChanged.odds[oddkey];
        setOdds(changedOdds);
      } else {
        if (!newChanged?.bet365_odds || !newChanged.bet365_odds[tab][oddkey]?.odds) return;
        const groupedByHeader = newChanged.bet365_odds[tab][oddkey].odds.reduce((acc: any, obj: any) => {
          const key = bet365_odds.odds.length > 3 && obj?.header ? obj?.header : 1;
          acc[key] = acc[key] || [];
          acc[key].push(obj);
          return acc;
        }, {});
        setOddsBet365(groupedByHeader);
      }
    }

    sportsSocket.on("changed-matches", getChangedMatches);

    // eslint-disable-next-line
    return () => {
      sportsSocket.off("changed-matches", getChangedMatches);
    };
  }, [event, tab, oddkey, bet365, bet365_odds]);


  useEffect(() => {
    if (!active_history.length || !event?.id) return;
    const _history = active_history.reduce((ary: BetslipProps[], row: SportsHistoryProps) => {
      if (!row.bettings.length) return [];
      const temp = row.bettings.filter(
        (e: BetslipProps) => e.SportId === sportId && e.eventId === event.id && e.marketId === oddkey
      );
      return [...ary, ...temp];
    }, []);
    setHistory(_history);
  }, [active_history, event?.id, oddkey, sportId]);


  const renderContent = (
    <Stack
      sx={customStyle}
    >
      <AnimateButton className="oddbtn">
        <Button
          onClick={() => {
            if (
              odds &&
              ((odds?.home_od && odds?.home_od !== '-') ||
                (odds?.over_od && odds?.over_od !== '-'))
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
          <Typography fontSize={14}>
            {(odds?.home_od && event?.home.name) || (odds?.over_od && 'Over') || ''}
            {odds?.handicap && ` (${odds?.handicap})`}
          </Typography>
          {odds &&
            ((odds?.home_od && odds?.home_od !== '-') ||
              (odds?.over_od && odds?.over_od !== '-')) ? (
            <Typography color="success.main">
              {Number(odds?.home_od || odds?.over_od)}
            </Typography>
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
            onClick={() => {
              if (odds.draw_od) handleAddSlip(IOddTypes.Draw);
            }}
            className={
              actived.length && actived.some((e) => e.oddType === IOddTypes.Draw)
                ? 'active'
                : ''
            }
          >
            <Typography fontSize={14}>{t("draw")}</Typography>
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
          <Typography fontSize={14}>
            {(odds?.away_od && event?.away.name) || (odds?.under_od && 'Under') || ''}
            {odds?.handicap && ` (${odds?.handicap})`}
          </Typography>
          {odds &&
            ((odds?.away_od && odds?.away_od !== '-') ||
              (odds?.under_od && odds?.under_od !== '-')) ? (
            <Typography color="success.main">
              {Number(odds?.away_od || odds?.under_od)}
            </Typography>
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
    </Stack>
  )

  const renderContentBet365 = (
    <>
      {oddsBet365 && Object.keys(oddsBet365).map((key) => (
        <Stack
          key={key}
          sx={{
            ...customStyle,
            ...(oddsBet365[key].length <= 5 ? {
              flexDirection: 'row',
              justifyContent: 'space-between',
            } : {
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
            }),

          }}
        >
          {oddsBet365[key].map((odd: any, index: number) => (
            <AnimateButton key={index} className="oddbtn">
              <Tooltip title={`${getoddTypeData(odd.name) || odd.handicap}${odd.header ? ` (${getoddTypeData(odd.header)})` : ""}`} arrow placement="top">
                <Button
                  onClick={() => handleAddSlipBet365(odd)}
                  className={
                    actived.length && actived.some((e) => e.isBet365 && e.oddData.id === odd.id)
                      ? 'active'
                      : ''
                  }
                >
                  <Typography fontSize={14}>
                    {`${getoddTypeData(odd.name) || odd.handicap}${odd.header ? ` (${getoddTypeData(odd.header)})` : ""}`}
                  </Typography>
                  <Typography color="success.main">{Number(odd.odds)}</Typography>
                  {history.some((e) => e.isBet365 && e.oddData.id === odd.id) && (
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
              </Tooltip>

            </AnimateButton>
          ))}
        </Stack>
      ))}
    </>
  )

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
        <Typography>{!bet365 ? getMarketName(oddkey) : bet365_odds.name}</Typography>
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
        {!bet365 ? renderContent : renderContentBet365}

      </Collapse>
    </Stack>
  );
}
