import { useEffect, useState, useMemo, useCallback, memo } from 'react';

// @mui
import { Box, Button, Collapse, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { useParams } from 'src/routes/hooks';
import { AnimateButton } from 'src/components/animate';
import { dispatch, useSelector } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';
import { getOddType } from 'src/utils';
import { addRemoveBetslip, convertSoccerBetslipData } from 'src/utils/sports';
import { SportsLockIcon } from 'src/assets/icons';
import { NOT_TRANSLATE } from 'src/config-global';
import type { BetslipProps, ISportsEvent, SportsHistoryProps } from 'src/types';

// ----------------------------------------------------------------------

import pin from '../../../assets/sports/pin.png';

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
};

const Grid2PreIds = [4, 5, 6, 16, 17, 19, 26, 50, 72, 131, 45];
const Grid2LiveIds = [1, 39, 49, 33, 18, 36, 58, 17, 24, 25, 47, 54, 90, 95];
const Grid3PreIds = [85];
const Grid3LiveIds = [20, 21, 26];
const Grid4LiveIds = [29, 46, 53, 60, 63, 148, 153, 155, 23, 55, 64, 5, 8];
const Grid4PreIds = [
  92, 93, 94, 79, 47, 38, 40, 41, 42, 46, 78, 25, 24, 9, 18, 31, 10, 7, 80, 97, 49,
];

const SPLIT_NUM = 4;

interface Props {
  event: ISportsEvent;
  marketLang: any;
  bets: any;
}

function SoccerBetOption({ event, marketLang, bets }: Props) {
  useScrollToTop();
  const { t } = useLocales();
  const isMobile = useResponsive('down', 'sm');

  const { bet_slips, sports_list, active_history } = useSelector((store) => store.sports);

  const [isDown, setIsDown] = useState<boolean>(false);
  const [history, setHistory] = useState<BetslipProps[]>([]);
  
  // Memoize getId function
  const getId = useCallback((odd: any) => `${odd.value}${odd?.handicap ? `-${odd?.handicap}` : ''}`, []);
  
  // Memoize active list
  const activeList = useMemo(() => 
    bet_slips.filter(
      (e) => e.SportId === 1 && e.eventId === event.id && e.marketId === bets.id.toString()
    ),
    [bet_slips, event.id, bets.id]
  );

  const handleAddSlip = useCallback((odd: any) => {
    if (!event?.odds || !bets) return;
    if (odd?.suspended) return;
    const sports = sports_list.find((e) => e.SportId === 1);
    if (!sports) return;
    const oddData = event.time_status === 0 ? bets.values : odd;
    const param = {
      marketId: bets.id.toString(),
      marketName: bets.name,
      oddId: getId(odd),
      oddName: odd.value,
      oddType: getOddType(odd.value),
      odds: Number(odd.odd),
      handicap: Number(odd?.handicap || 0),
      oddData,
    };
    const betslip = convertSoccerBetslipData({
      event,
      odd: param,
      sports,
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  }, [event, bets, sports_list, bet_slips, getId]);

  // Memoize table type checks
  const isTable2 = useMemo(
    () => (event.time_status === 0 && Grid2PreIds.includes(bets.id)) ||
          (event.time_status === 1 && Grid2LiveIds.includes(bets.id)),
    [event.time_status, bets.id]
  );
  const isTable3 = useMemo(
    () => (event.time_status === 0 && Grid3PreIds.includes(bets.id)) ||
          (event.time_status === 1 && Grid3LiveIds.includes(bets.id)),
    [event.time_status, bets.id]
  );
  const isTable4 = useMemo(
    () => (event.time_status === 0 && Grid4PreIds.includes(bets.id)) ||
          (event.time_status === 1 && Grid4LiveIds.includes(bets.id)),
    [event.time_status, bets.id]
  );

  const replaceOddName = useCallback((name: string | number) => {
    const str = name.toString();
    if (!isTable2 && !isTable3)
      return str.replaceAll('Home', event.home.name).replaceAll('Away', event.away.name);

    if (str.includes('Over')) return str.replaceAll('Over', '');
    if (str.includes('Under')) return str.replaceAll('Under', '');
    if (str.includes('Home')) return str.replaceAll('Home', '');
    if (str.includes('Away')) return str.replaceAll('Away', '');
    if (str.includes('Yes')) return str.replaceAll('Yes', '');
    if (str.includes('No')) return str.replaceAll('No', '');
    if (str.includes('Exactly') && isTable3) return str.replaceAll('Exactly', '');
    if (str.includes('Draw') && isTable3) return str.replaceAll('Draw', '');
    return str;
  }, [isTable2, isTable3, event.home.name, event.away.name]);

  const replaceHeadName = useCallback((name: string | number) => {
    const str = name.toString();
    if (str.includes('Over')) return 'Over';
    if (str.includes('Under')) return 'Under';
    if (str.includes('Home')) return event.home.name;
    if (str.includes('Away')) return event.away.name;
    return str;
  }, [event.home.name, event.away.name]);

  useEffect(() => {
    if (!active_history.length || !event?.id) return;
    if (!bets?.values?.length) return;
    const _history = active_history.reduce((ary: BetslipProps[], row: SportsHistoryProps) => {
      if (!row.bettings.length) return [];
      const temp = row.bettings.filter(
        (e: BetslipProps) => e.SportId === 1 && e.eventId === event.id && e.marketId === bets.id
      );
      return [...ary, ...temp];
    }, []);
    setHistory(_history);
  }, [active_history, event?.id, bets]);

  // Memoize market display name
  const displayMarketName = useMemo(
    () => (NOT_TRANSLATE.includes(bets.name) && t(bets.name)) ||
          (marketLang && marketLang[bets.name]) ||
          bets.name,
    [bets.name, marketLang, t]
  );

  return (
    <Stack>
      <Button
        onClick={() => {
          setIsDown(!isDown);
        }}
        sx={{
          fontSize: 15,
          p: '15px 21px',
          border: isDown ? '1px solid rgb(138, 43, 226)' : '1px solid #3A3D4A',
          borderRadius: `3px 3px ${!isDown ? '3px 3px' : '0 0'}`,
          background: isDown
            ? 'linear-gradient(to bottom,#3a4142 0%, transparent 100%)'
            : 'transparent',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <img src={pin} alt="pin" />
          <Typography
            textAlign="left"
            fontStyle="normal"
            fontWeight={600}
            fontSize={14}
            color={isDown ? 'yellow' : '#fff'}
          >
            {displayMarketName}
          </Typography>
        </Box>
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
        <Stack
          sx={{
            ...customStyle,
            ...(bets?.values?.length > SPLIT_NUM && {
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              '& .oddbtn': {
                width: 'fit-content',
                display: 'grid',
              },
            }),
            ...((isTable2 || isTable3) && {
              display: 'grid',
              gridTemplateColumns: `repeat(${isTable2 ? 2 : 3}, 1fr)`,
              '& .oddbtn': {
                width: 1,
              },
            }),
            ...(isTable4 && {
              display: 'grid',
              gridTemplateColumns: {
                xs: `repeat(1, 1fr)`,
                sm: `repeat(3, 1fr)`,
                md: `repeat(4, 1fr)`,
              },
              '& .oddbtn': {
                width: 1,
              },
            }),
          }}
        >
          {(isTable2 || isTable3) &&
            (bets?.values || []).slice(0, isTable2 ? 2 : 3).map((odd: any, ind: number) => (
              <Typography textAlign="center" fontSize={12} color="#b1bad3" key={ind}>
                {replaceHeadName(odd.value)}
              </Typography>
            ))}
          {(bets?.values || []).map((odd: any, ind: number) => {
            const generatedId = getId(odd);
            // Use oddData.oddId for comparison since top-level oddId is wrong
            const isActive = activeList.some((e: any) => e.oddData?.oddId === generatedId);
            
            return (
              <AnimateButton className="oddbtn" key={ind}>
                <Button
                  sx={{
                    bgcolor: isActive ? '#24ee89 !important' : 'common.black',
                    color: isActive ? '#232626 !important' : 'inherit',
                    border: isActive ? '1px solid #24ee89' : 'none',
                    '&:hover': {
                      bgcolor: isActive ? '#FFD700 !important' : undefined,
                    },
                    ...(bets?.values?.length > SPLIT_NUM && {
                      minWidth: { xs: 80, sm: 200 },
                    }),
                    ...((isTable2 || isTable3 || isTable4) && {
                      py: '7px !important',
                      flexDirection: 'row !important',
                      justifyContent: 'space-between !important',
                      '& p': {
                        width: 'auto !important',
                      },
                    }),
                  }}
                  onClick={() => {
                    handleAddSlip(odd);
                  }}
                >
                  <Typography fontSize={14} color={isActive ? '#232626' : 'inherit'}>
                    {`${replaceOddName(odd.value)}${odd.handicap ? odd.handicap : ''}`}
                  </Typography>
                  {!odd?.suspended ? (
                    <Typography color={isActive ? '#232626' : 'success.main'}>
                      {odd.odd}
                    </Typography>
                  ) : (
                    <SportsLockIcon />
                  )}
                  {history.some((e) => e.oddData?.oddId === generatedId) && (
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
            );
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
}

export default memo(SoccerBetOption);
