import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  Stack,
  Avatar,
  Button,
  useTheme,
  Typography,
  CardHeader,
  CardContent,
} from '@mui/material';
import type { SxProps } from '@mui/material/styles';
import { formatDistanceToNow } from 'date-fns';

import { useResponsive } from 'src/hooks/use-responsive';
import { useDispatch, useSelector } from 'src/store';
import { updateBetSlip } from 'src/store/reducers/sports';

import { PercentIcon, SportsLockIcon } from 'src/assets/icons';
import { addRemoveBetslip, convertBetslipData } from 'src/utils/sports';
import { MARKET_NAMES } from 'src/config-global';
import { IOddTypes } from 'src/types';
import type { IOdds, ISportsEvent } from 'src/types';

// Types
interface BetCardProps {
  sportId: number;
  data: ISportsEvent;
  sx?: SxProps;
}

interface TeamDisplayProps {
  team: {
    id: number;
    name: string;
    image_id: number;
    logo?: string;
    cc: string;
  };
  percent: number;
  isMobile: boolean;
  position: 'home' | 'away';
}

interface BetButtonProps {
  label: string;
  odd: number | null;
  onClick: () => void;
  disabled?: boolean;
}

// Components
const TeamDisplay = ({ team, percent, isMobile, position }: TeamDisplayProps) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!isMobile && (
        <PercentIcon
          percent={percent}
          primeryColor="#24ee89"
          secondaryColor="#CAAE51"
        />
      )}
      <Box
        sx={{
          top: 45,
          mr: 1.2,
          px: 1.2,
          zIndex: 1,
          width: 'auto',
          textAlign: 'center',
          bgcolor: "background.paper",
          ...(!isMobile && {
            position: 'absolute',
          }),
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 38,
            margin: '0 auto',
          }}
        >
          <Avatar
            alt={team.name}
            src={team.logo || `https://assets.b365api.com/images/team/b/${team.image_id}.png`}
          />
        </Box>
        <Box mt={1} textAlign="center">
          <Typography variant="h6">{`${percent}%`}</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          textAlign: 'center',
          position: 'absolute',
          bottom: { xs: -30, sm: -50 },
          height: 50,
        }}
      >
        <Typography>{team.name}</Typography>
      </Box>
    </Box>
  );
};

const BetButton = ({ label, odd, onClick, disabled }: BetButtonProps) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled || !odd}
    onClick={onClick}
  >
    <Typography variant="h6" color="text.disabled">
      {label}
    </Typography>
    <Typography variant="h6" color="white" mt={{ xs: 0, sm: 1 }}>
      {odd || <SportsLockIcon />}
    </Typography>
  </Button>
);

// Custom hooks
const useBetCardLogic = (data: ISportsEvent, sportId: number) => {
  const dispatch = useDispatch();
  const { bet_slips, sports_list } = useSelector((store) => store.sports);
  const [odds, setOdds] = useState<IOdds | null>(null);

  const handleAddSlip = useCallback((oddType: IOddTypes) => {
    if (!data?.odds) return;
    const sports = sports_list.find((e) => e.SportId === sportId);
    if (!sports) return;
    const marketId = Object.keys(data.odds)[0];
    const marketName = MARKET_NAMES[marketId];
    const betslip = convertBetslipData({
      event: data,
      odd: { ...data.odds[marketId], marketId, marketName },
      oddType,
      sports,
    });
    dispatch(updateBetSlip(addRemoveBetslip(bet_slips, betslip)));
  }, [data, sportId, sports_list, bet_slips, dispatch]);

  useEffect(() => {
    if (!data?.odds) return;
    const _odds = data.odds[Object.keys(data.odds)[0]];
    setOdds(_odds);
  }, [data]);

  const { home_od, draw_od, away_od } = useMemo(() => {
    let home = 0;
    let draw = 0;
    let away = 0;

    if (odds && ((odds?.home_od && odds?.home_od !== '-') || (odds?.over_od && odds?.over_od !== '-'))) {
      home = Number(odds?.home_od || odds?.over_od);
    }
    if (odds && odds?.draw_od && odds?.draw_od !== '-') {
      draw = Number(odds?.draw_od || 0);
    }
    if (odds && ((odds?.away_od && odds?.away_od !== '-') || (odds?.under_od && odds?.under_od !== '-'))) {
      away = Number(odds?.away_od || odds?.under_od);
    }

    if (sportId === 1 && data.odds.length && data.odds[0]?.bets?.length) {
      home = Number(data.odds[0]?.bets[0].values[0]?.odd || 0);
      draw = Number(data.odds[0]?.bets[0].values[1]?.odd || 0);
      away = Number(data.odds[0]?.bets[0].values[2]?.odd || 0);
    }

    return { home_od: home, draw_od: draw, away_od: away };
  }, [odds, data.odds, sportId]);

  const getPercent = useCallback((type: number): number => {
    const value = (((type > 0 && home_od) || (type === 0 && draw_od) || (type < 0 && away_od) || 0) * 100) /
      (home_od + draw_od + away_od);
    return Number((value || 0).toFixed(0));
  }, [home_od, draw_od, away_od]);

  return {
    odds,
    home_od,
    draw_od,
    away_od,
    handleAddSlip,
    getPercent,
  };
};

// Main component
const BetCard = ({ data, sportId, sx }: BetCardProps) => {
  const isMobile = useResponsive('down', 'sm');
  const theme = useTheme();
  
  const {
    odds,
    home_od,
    draw_od,
    away_od,
    handleAddSlip,
    getPercent,
  } = useBetCardLogic(data, sportId);

  return (
    <Card
      sx={{
        mb: 1,
        px: { xs: 1, sm: 5 },
        py: { xs: 0.5, sm: 2.5 },
        margin: '0 7px',
        width: '100%',
        bgcolor: "background.paper",
        borderRadius: '10px',
        ...sx,
      }}
    >
      <CardHeader
        sx={{
          p: { xs: 0, sm: 1.5 },
          pt: { xs: 1 },
          '& .MuiCardHeader-title': {
            fontSize: '14px',
          },
          '& svg': {
            fontSize: '16px',
          },
        }}
        title={
          <Stack flexDirection="row" justifyContent="center" alignItems="center">
            <Box component="i" className={`sportsicons sportsicon-${sportId}`} />
            <Typography variant="h6" sx={{ ml: 1, cursor: 'pointer' }}>
              {data.league.name}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ p: { xs: 0, sm: 1.25 }, pb: { xs: '8px !important' } }}>
        <Stack flexDirection="row" justifyContent="space-between" mb={{ xs: 4, sm: 8 }}>
          <TeamDisplay
            team={data.home}
            percent={getPercent(1)}
            isMobile={isMobile}
            position="home"
          />
          
          <Box
            position="relative"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              ':before': {
                top: 60,
                width: 40,
                right: '85%',
                height: '1px',
                content: "' '",
                position: 'absolute',
                bgcolor: theme.palette.mode === 'dark' ? '#767676' : '#d3d3d3',
              },
              ':after': {
                position: 'absolute',
                top: 60,
                width: 40,
                left: '80%',
                height: '1px',
                content: "' '",
                bgcolor: theme.palette.mode === 'dark' ? '#767676' : '#d3d3d3',
              },
            }}
          >
            <Box
              sx={{
                width: 65,
                height: 65,
                margin: '30px',
                borderRadius: '50%',
                backgroundColor: 'white',
                overflow: 'hidden',
              }}
            >
              <Box
                position="relative"
                sx={{
                  ':before': {
                    inset: 0,
                    width: 65,
                    height: 65,
                    content: "' '",
                    bgcolor: '#FF8A00',
                    position: 'absolute',
                    clipPath: `polygon(83% 104%, ${((183 - 290) * getPercent(0)) / 100}% -52%, -161% 40%)`,
                  },
                }}
              >
                <Box
                  sx={{
                    top: 2,
                    left: 2,
                    zIndex: 1,
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    position: 'absolute',
                    bgcolor: "background.paper"
                  }}
                />
              </Box>
            </Box>
            <Stack
              sx={{
                mt: 1,
                top: 45,
                zIndex: 1,
                width: 40,
                height: 45,
                padding: '0 5px',
                position: 'absolute',
                alignItems: 'center',
                bgcolor: "background.paper"
              }}
            >
              <Typography variant="h6">Vs</Typography>
            </Stack>
            <Stack sx={{ position: 'absolute', mb: -3, bottom: 0 }}>
              <Typography textAlign="center" sx={{ fontSize: 12 }}>
                {`Start ${formatDistanceToNow(new Date(data.time * 1000), { addSuffix: true })}`}
              </Typography>
            </Stack>
          </Box>

          <TeamDisplay
            team={data.away}
            percent={getPercent(-1)}
            isMobile={isMobile}
            position="away"
          />
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          sx={{
            alignItems: 'center',
            gap: '30px',
            '& button': {
              textAlign: 'center',
              margin: '0 auto',
              bgcolor: "common.black",
              borderRadius: '4px',
              width: 1,
              padding: { xs: '0 20px', sm: '10px 30px' },
              transition: 'all 0.3s',
              flexDirection: 'column',
              border: '1px solid #67F962',
            },
          }}
        >
          <BetButton
            label="1"
            odd={home_od}
            onClick={() => {
              if (home_od) {
                if (odds?.home_od) handleAddSlip(IOddTypes.Home);
                if (odds?.over_od) handleAddSlip(IOddTypes.Over);
              }
            }}
            disabled={!odds}
          />

          {odds && odds?.draw_od && (
            <BetButton
              label="X"
              odd={draw_od}
              onClick={() => {
                if (odds.draw_od) handleAddSlip(IOddTypes.Draw);
              }}
              disabled={!odds || !odds?.draw_od}
            />
          )}

          <BetButton
            label="2"
            odd={away_od}
            onClick={() => {
              if (away_od) {
                if (odds?.away_od) handleAddSlip(IOddTypes.Away);
                if (odds?.under_od) handleAddSlip(IOddTypes.Under);
              }
            }}
            disabled={!odds}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BetCard;
