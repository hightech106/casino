import { useEffect, useState } from 'react';

// @mui
import { Box, Stack, Typography, Button, alpha, Skeleton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSelector } from 'src/store';
import { useLocales } from 'src/locales';

import useApi from 'src/hooks/use-api';
import { useParams, useRouter } from 'src/routes/hooks';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { paths } from 'src/routes/paths';

import type { ISportsMatch } from 'src/types';

import BetList from '../home/bet-list';
// ----------------------------------------------------------------------

export default function LeagueView() {
  useScrollToTop();
  const { t, currentLang } = useLocales();
  const router = useRouter();

  const { sportsId } = useParams();
  const { get_sports_matchs } = useApi();
  const { sports_list } = useSelector((store) => store.sports);

  const [loading, setLoading] = useState<boolean>(false);
  const [sportsMatchs, setSportsMatchs] = useState<ISportsMatch[]>([]);

  const getSportsMatchs = async () => {
    setLoading(true);
    if (!sportsId) return;
    const checked = sports_list.some((e) => e.SportId === Number(sportsId));
    if (!checked) {
      router.back();
      return;
    }

    const res = await get_sports_matchs({
      SportId: sportsId || '1',
      EventStatus: 'PRE',
      lang: currentLang.value,
    });
    setLoading(false);
    if (!res?.data) return;
    setSportsMatchs(res.data);
  };

  useEffect(() => {
    getSportsMatchs();
    // eslint-disable-next-line
  }, [sportsId, currentLang.value]);

  const renderContent = (
    <Box
      sx={{
        overflowX: 'auto',
      }}
    >
      <Stack minWidth={{ xs: 1, sm: 830 }} gap={2}>
        {sportsMatchs.map((matchs, index: number) => (
          <BetList
            key={index}
            data={matchs}
            index={index}
            sportId={Number(sportsId)}
            loading={loading}
          />
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      <Stack
        sx={{
          borderRadius: 0.5,
          backgroundImage: `url(/assets/images/banners/league/soccer-bets-bg.png), url(/assets/images/banners/league/soccer-bets-banner-bg.png)`,
          bgcolor: '#1F2340',
        }}
        className="overlay"
      >
        <Box>
          <Box
            component="img"
            src="/assets/images/banners/league/winner-cup.png"
            className="obj-1"
            alt="image"
          />
          <Box
            component="img"
            src="/assets/images/banners/league/coin-5.png"
            className="obj-2"
            alt="image"
          />
          <Box
            component="img"
            src="/assets/images/banners/league/coin-3.png"
            className="obj-3"
            alt="image"
          />
          <Box
            component="img"
            src="/assets/images/banners/league/coin-6.png"
            className="obj-4"
            alt="image"
          />
          <Box
            component="img"
            src="/assets/images/banners/league/coin-9.png"
            className="obj-5"
            alt="image"
          />
          <Box
            component="img"
            src="/assets/images/banners/league/coin-8.png"
            className="obj-6"
            alt="image"
          />
          <Box
            component="img"
            src="/assets/images/banners/league/coin-7.png"
            className="obj-7"
            alt="image"
          />
        </Box>
        <Stack sx={{ py: 18, px: 5 }}>
          <Typography variant="h1">{`${sports_list.find((e) => e.SportId === Number(sportsId))
            ?.SportName} Bet`}</Typography>
          <Stack direction="row" gap={1}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.back()}
              sx={{ minWidth: 20, bgcolor: 'background.default', borderRadius: 0.3 }}
            >
              <Iconify icon="ion:chevron-back-outline" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push(`/${currentLang.value}${paths.sports.root}`)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
                borderRadius: 0.3,
              }}
            >
              {t('home')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.background.default, 0.7),
                borderRadius: 0.3,
              }}
            >
              {sports_list.find((e) => e.SportId === Number(sportsId))?.SportName}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <br />

      {sportsMatchs.length > 0 && renderContent}

      {loading && !sportsMatchs.length && (
        <Stack gap={2}>
          {[...Array(3)].map((_, index: number) => (
            <Skeleton key={index} sx={{ width: 1, height: 58, borderRadius: 0.5 }} />
          ))}
        </Stack>
      )}
    </>
  );
}
