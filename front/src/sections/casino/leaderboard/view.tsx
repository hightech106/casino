import { Typography, Stack, Avatar, useMediaQuery, Grid, Box, Container } from '@mui/material';

import { useSelector } from 'src/store';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { fCurrency } from 'src/utils/format-number';
import Image from 'src/components/image';
import CupIcon from 'src/assets/icons/cup-icon';
import { API_URL } from 'src/config-global';
import { _contacts } from 'src/_mock';
import BitcoinIcon from 'src/assets/icons/bitcoin-icon';

const LeaderBaordtemp = [
  {
    game: 1,
    username: 'LuckyJackpot',
    totalEarned: 23450,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    highestMultiplier: '12.50x',
  },
  {
    game: 2,
    username: 'BetMaster77',
    totalEarned: 12020,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    highestMultiplier: '8.00x',
  },
  {
    game: 3,
    username: 'SpinAndWin89',
    totalEarned: 5601,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    highestMultiplier: '10.00x',
  },
  {
    game: 4,
    username: 'RoyalFlushRider',
    totalEarned: 3220,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    highestMultiplier: '15.00x',
  },
  {
    game: 5,
    username: 'CoinCrafter2023',
    totalEarned: 2962,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
    highestMultiplier: '7.50x',
  },
  {
    game: 6,
    username: 'WildCardGamer',
    totalEarned: 2548,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
    highestMultiplier: '20.00x',
  },
  {
    game: 7,
    username: 'HighStakesHero',
    totalEarned: 1267,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    highestMultiplier: '9.00x',
  },
  {
    game: 8,
    username: 'JackpotJuggler',
    totalEarned: 1149,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
    highestMultiplier: '11.25x',
  },
  {
    game: 9,
    username: 'FortuneSeeker',
    totalEarned: 1101,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    highestMultiplier: '3.50x',
  },
  {
    game: 10,
    username: 'GambleGuru',
    totalEarned: 1040,
    currency: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    highestMultiplier: '25.00x',
  },
];

export default function LeaderBoardView() {
  useScrollToTop();
  const isSmMobile = useMediaQuery('(max-width:1370px)');

  const banners = useSelector((store) => store.config.banners);

  const banner = banners.filter((b) => b.type === 'casino_leaderboard');

  return (
    <Container>
      <Stack width={1} gap={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <Box px={{ xs: 0, sm: 5 }} pt={{ xs: 2, sm: 10 }}>
              <Grid container>
                <Grid item xs={4} position="relative">
                  <Stack
                    py={8}
                    width={1}
                    textAlign="center"
                    borderRadius="15px 0 0"
                    bgcolor="#357035"
                    position="absolute"
                    alignItems="center"
                    bottom={0}
                  >
                    <Image
                      src="/assets/images/leaderboard2.png"
                      sx={{
                        width: 130,
                        position: 'absolute',
                        top: -70,
                      }}
                    />
                    <Typography variant="h5">Gonh John</Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <BitcoinIcon width={24} height={24} />
                      <Typography>1.2</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item md={4} position="relative">
                  <Stack
                    textAlign="center"
                    py={12}
                    bgcolor="#142214"
                    borderRadius="15px 15px 0 0"
                    alignItems="center"
                  >
                    <Image
                      src="/assets/images/leaderboard1.png"
                      sx={{
                        width: 130,
                        position: 'absolute',
                        top: -70,
                      }}
                    />
                    <Typography variant="h4">Pansa Sancho</Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <BitcoinIcon width={24} height={24} />
                      <Typography>2.345</Typography>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item md={4} position="relative">
                  <Stack
                    py={7}
                    width={1}
                    bottom={0}
                    bgcolor="#357035"
                    textAlign="center"
                    borderRadius="0 15px 0 0"
                    position="absolute"
                    alignItems="center"
                  >
                    <Image
                      src="/assets/images/leaderboard3.png"
                      sx={{
                        width: 130,
                        position: 'absolute',
                        top: -70,
                      }}
                    />
                    <Typography variant="h5">Ahmed1998</Typography>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <BitcoinIcon width={24} height={24} />
                      <Typography>0.56</Typography>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>

              <Stack
                sx={{
                  mt: -2,
                  zIndex: 2,
                  py: 3,
                  position: 'relative',
                  borderRadius: 2.9,
                  bgcolor: '#418741',
                  border: '2px solid #D8BC6B',
                  overflow: 'hidden',
                  boxShadow: '0px -17px 25px 0px rgba(0, 0, 0, 0.25)',
                }}
              >
                <Stack
                  direction="row"
                  px={3}
                  py={1}
                  justifyContent="space-between"
                  borderBottom="1px solid grey"
                  textTransform="uppercase"
                >
                  <Typography width={0.2} fontWeight={900}>
                    Game
                  </Typography>
                  <Typography width={0.3} fontWeight={900} minWidth={170}>
                    Username
                  </Typography>
                  <Typography width={0.3} fontWeight={900}>
                    Total earned
                  </Typography>
                  <Typography width={0.3} fontWeight={900}>
                    Highest mulipller
                  </Typography>
                </Stack>

                <Stack>
                  {LeaderBaordtemp.map((row, index) => (
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                      py={1}
                      px={2}
                      sx={{
                        bgcolor: index % 2 === 1 ? '#0505143b' : 'transparent',
                      }}
                    >
                      <Stack direction="row" alignItems="center" width={0.2}>
                        <CupIcon mr={0.5} width={24} height={24} />
                        {index + 1}
                      </Stack>
                      <Stack direction="row" alignItems="center" width={0.3} minWidth={170}>
                        <Avatar
                          src={_contacts[index].avatarUrl}
                          sx={{ width: 24, height: 24, mr: { xs: 1, sm: 2 } }}
                        />
                        {row.username}
                      </Stack>
                      <Stack
                        direction="row"
                        alignItems="center"
                        width={0.3}
                        fontSize={{ xs: 12, sm: 14 }}
                      >
                        {/* <Avatar src={row.currency} sx={{ width: 24, height: 24, mr: { xs: 0.5, sm: 2 } }} /> */}
                        {/* <BitcoinIcon width={24} height={24} mr={1} /> */}${row.totalEarned}
                      </Stack>
                      <Stack direction="row" textAlign="right" width={0.3}>
                        {fCurrency(row.highestMultiplier, false)}$
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Grid>
          {/* {(!isSmMobile && banner.length > 0) && (
                    <Grid item xs={3} height="100vh" overflow="auto">
                        <Stack width={1} gap={1} >
                            {banner.map((row, i) => (
                                <Image key={i} src={`${API_URL}/${row.image}`} alt="sidebar" width={1} borderRadius={0.5} />
                            ))}
                        </Stack>
                    </Grid>
                )} */}
        </Grid>
      </Stack>
    </Container>
  );
}
