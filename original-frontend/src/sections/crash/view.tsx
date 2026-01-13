import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// @mui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

import { useSelector } from 'src/store';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { cutDecimalPoints, parseCommasToThousands } from 'src/utils/custom';

import { CircleIcon } from 'src/assets/icons';

import GameContent from './game-content';
import { authenticateSockets, crashSocket } from './socket';
import { GameEndType } from './types';

// ----------------------------------------------------------------------

export default function CrashView() {
  // const settings = useSettingsContext();

  const { isLoggedIn, token } = useSelector((store) => store.auth);

  const [histories, setHistories] = useState<GameEndType[]>([]);

  useEffect(() => {
    if (!crashSocket.connected) {
      console.log('Crash Socket connecting...');
      crashSocket.connect();
    } else if (token) authenticateSockets(token);

    // Connection successful
    crashSocket.on('connect', () => {
      console.log('Connected successfully');
      if (token) authenticateSockets(token);
    });

    // Connection error
    crashSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    // Handle disconnect
    crashSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    // Cleanup
    return () => {
      crashSocket.off('connect');
      crashSocket.off('connect_error');
      crashSocket.off('disconnect');

      crashSocket.disconnect();
      console.log('Crash Socket disconnected');
    };
  }, [isLoggedIn, token]);

  return (
    <Scrollbar sx={{ height: `100%` }}>
      <Stack gap={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems="flex-start"
          px={1}
        >
          <Stack
            sx={{
              gap: 1,
              bgcolor: 'secondary.main',
              p: '12px 16px',
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 0.5,
              width: { xs: 1, sm: 'auto' },
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: '#8199B4', fontSize: 14 }}>
              Home
            </Link>
            <Iconify icon="lsicon:right-filled" sx={{ color: '#8199B4', fontSize: 16 }} />
            <Typography fontSize={14} fontWeight={500} noWrap>
              Crash Game
            </Typography>
          </Stack>

          <Stack position="relative" height={42} width={{ xs: 1, sm: '65vw' }} overflow="hidden">
            <Stack
              className={histories.length ? 'past-bets' : ''}
              direction="row-reverse"
              position="absolute"
              right={0}
              top={0}
              gap={1}
              px={2}
            >
              {histories.map((history, index) => (
                <Button
                  key={index}
                  sx={{
                    px: 2,
                    py: 0,
                    height: 40,
                    borderRadius: 50,
                    bgcolor: '#1D3E6B',
                    border: '2px solid #2B4C79',
                    boxShadow: `0px 0px 2px 0px rgba(0, 0, 0, 0.25)`,
                  }}
                >
                  <Stack>
                    <Typography fontSize={12} color="#8199B4">
                      86641
                    </Typography>
                    <Stack direction="row" gap={0.5} alignItems="center">
                      <CircleIcon
                        width={9}
                        height={9}
                        color={history.crashPoint > 2.5 ? '#16DA7D' : '#FFF'}
                      />
                      <Typography
                        fontSize={14}
                        fontWeight={700}
                        color={history.crashPoint > 2.5 ? '#16DA7D' : '#FFF'}
                      >
                        {parseCommasToThousands(cutDecimalPoints(history.crashPoint.toFixed(2)))}x
                      </Typography>
                    </Stack>
                  </Stack>
                </Button>
              ))}
            </Stack>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 1,
                height: 1,
                zIndex: 2,
                background:
                  'linear-gradient(270deg, #13244B 0%, rgba(23, 39, 86, 0.10) 9%, rgba(80, 58, 117, 0.14) 92.5%, #523A75 100%)',
              }}
            />
          </Stack>
        </Stack>
        <Grid container spacing={5} sx={{ px: 1, py: 1 }}>
          <Grid item xs={12}>
            <GameContent histories={histories} setHistories={setHistories} />
          </Grid>
        </Grid>
      </Stack>
    </Scrollbar>
  );
}
