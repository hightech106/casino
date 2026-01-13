import { useCallback, useEffect, useState, memo } from 'react';
// @mui
import { Box, Container, Stack, Typography, useMediaQuery, Grid } from '@mui/material';
import { TimelineSeparator, TimelineConnector } from '@mui/lab';
import { useTheme } from '@mui/material/styles';

// components
import { useSettingsContext } from 'src/components/settings';
// import useSocketEvents from 'src/hooks/use-socket-events';
import useApi from 'src/hooks/use-api';
// import { SOCKET_PATH } from 'src/config-global';
import { useSelector } from 'src/store';

import { coinflipSocket, authenticateSockets } from './socket';
import GameDialog from './game-dialog';
import CreateComponent from './create';
import GameListComponent from './game-list';
import { ICoinflipRoom } from './types';

export default function CoinflipView() {
  const { isLoggedIn, user, token } = useSelector((state) => state.auth);
  const { initialize, getCoinFlipApi } = useApi();
  const settings = useSettingsContext();
  const theme = useTheme();
  const mediaDown = useMediaQuery(theme.breakpoints.down('lg'));
  const [totalValue, setTotalValue] = useState(0);
  const [gamesCount, setGamesCount] = useState(0);
  const [joinable, setJoinable] = useState(0);
  const [games, setGames] = useState<ICoinflipRoom[]>([]);
  const [selectedItem, setSelectedItem] = useState<ICoinflipRoom | null>(null);

  const setDialog = (selected: ICoinflipRoom) => {
    setSelectedItem(selected);
  };


  const InitialRooms = useCallback(async () => {
    const res = await getCoinFlipApi();
    if (!res?.data) return;
    setGames(res.data);
  }, []);

  const getGlobalData = useCallback(() => {
    let _total = 0;
    let _joinable = 0;
    games.forEach((row) => {
      _total += row.amount;
      if (row.state === 'not') _joinable += 1;
    });

    setTotalValue(Number(_total.toFixed(2)));
    setJoinable(_joinable);
    setGamesCount(games.length);
  }, [games]);

  useEffect(() => {
    setTimeout(() => {
      if (!coinflipSocket.connected) {
        coinflipSocket.connect();
      }
    }, 1000);
    return () => {
      coinflipSocket.disconnect();
      console.log('Coinflip Socket disconnected');
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) authenticateSockets(token);
  }, [isLoggedIn, token]);

  useEffect(() => {
    InitialRooms();
  }, []);

  useEffect(() => {
    getGlobalData();
  }, [games.length]);

  // socket.on
  // const events: Event[] = [
  //   {
  //     name: SOCKET_PATH.COINFLIP_CREATE,
  //     handler: onUpdateRoomList,
  //   },
  // ];

  // useSocketEvents(events, [games]);

  useEffect(() => {

    const onUpdateRoomList = (data: ICoinflipRoom) => {
      console.log(data, "===>data");

      if (data.state === 'end') {
        const updatedGames = games.map((row) => (row._id === data._id ? data : row));
        setGames(updatedGames);

        setTimeout(
          () => {
            const index = games.findIndex((row) => row._id === data._id);
            games.splice(index, 1);
            setGames(games);
          },
          1000 * 60 * 3
        );
      } else setGames((pre: ICoinflipRoom[]) => [...pre, { ...data }]);

      if (selectedItem && selectedItem._id === data._id) {
        setSelectedItem(data);
      }

      if (!isLoggedIn) return;

      if ((data.creator._id === user._id && data.state === 'not') || data?.joiner?._id === user._id)
        setDialog(data);

      setTimeout(
        () => {
          initialize();
        },
        data.state === 'end' ? 1000 : 10
      );
    };

    coinflipSocket.on('update-game', onUpdateRoomList);
    return () => {
      coinflipSocket.off('update-game', onUpdateRoomList);
    }

  }, [games, isLoggedIn, selectedItem]);

  console.log(':start');

  return (
    <Stack sx={{ height: `100%` }}>
      <Stack
        sx={{
          pb: 1,
          alignItems: 'center',
          borderBottom: `1px solid #272951`,
        }}
      >
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ p: 1 }}>
          <Stack sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Stack
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: "space-between"
              }}
              width={1}
            >
              <Typography sx={{ fontSize: 24, fontWeight: 400 }}>Coinflip</Typography>

              <Stack direction="row" gap={0.5}>
                <Stack>
                  <Typography>${totalValue}</Typography>
                  <Box
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: `linear-gradient(268deg, #C8CAFF -5.8%, #7C83C5 137%)`,
                      backgroundClip: `text`,
                      WebkitBackgroundClip: `text`,
                      WebkitTextFillColor: `transparent`,
                    }}
                  >
                    TOTAL VALUE
                  </Box>
                </Stack>
                <TimelineSeparator sx={{ height: `33%` }}>
                  <TimelineConnector />
                </TimelineSeparator>
                <Stack>
                  <Typography>{gamesCount}</Typography>
                  <Box
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: `linear-gradient(268deg, #C8CAFF -5.8%, #7C83C5 137%)`,
                      backgroundClip: `text`,
                      WebkitBackgroundClip: `text`,
                      WebkitTextFillColor: `transparent`,
                    }}
                  >
                    GAMES
                  </Box>
                </Stack>
                <TimelineSeparator sx={{ height: `33%` }}>
                  <TimelineConnector />
                </TimelineSeparator>
                <Stack>
                  <Typography>{joinable}</Typography>
                  <Box
                    component="span"
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      background: `linear-gradient(268deg, #C8CAFF -5.8%, #7C83C5 137%)`,
                      backgroundClip: `text`,
                      WebkitBackgroundClip: `text`,
                      WebkitTextFillColor: `transparent`,
                    }}
                  >
                    JOINABLE
                  </Box>
                </Stack>
              </Stack>

            </Stack>
          </Stack>
          <CreateComponent />
        </Container>
      </Stack>

      <Box
        sx={{
          mt: 1,
          px: 1,
          width: 1,
          height: '85%',
          borderRadius: 0.5,
        }}
      >
        <GameListComponent games={games} openView={setDialog} />
      </Box>

      {selectedItem && (
        <GameDialog
          open={!!selectedItem}
          data={selectedItem}
          onClose={() => {
            setSelectedItem(null);
          }}
        />
      )}
    </Stack>
  );
}
