import { useCallback, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router';

// @mui
import { Box, Card, Stack, Typography, Tab, Tabs, Badge, Skeleton } from '@mui/material';
import { useLocales } from 'src/locales';

import useApi from 'src/hooks/use-api';
import { sportsSocket } from 'src/utils/socket';

import type { ISportsEvent, ISportsList, ISportsMatch } from 'src/types';
import Livelist from './live-list';
// ----------------------------------------------------------------------
let interval: NodeJS.Timeout | 0 = 0;

const activeIds = [20, 39, 19, 41, 18, 49, 64, 31, 33, 57, 116, 61, 21, 36, 60, 23, 29, 27, 46, 58, 38, 78, 25, 24, 30, 17, 32, 35, 45, 16, 73, 44, 59, 72, 66, 42, 68, 55, 76, 48, 82, 50, 65, 52, 69, 43, 56, 83, 53, 62, 204, 47, 26, 79, 28, 54, 22, 80, 70, 40, 10, 34, 37, 63, 8, 67, 90, 156, 154, 118, 148, 153, 85, 113, 95, 115, 119, 155, 151, 150, 117, 149, 152, 91, 109, 112, 92, 94, 127, 125, 128, 130, 131, 132, 77, 134, 135, 136, 140, 1, 11, 5, 7, 6, 4, 13, 2, 9, 3, 250, 12, 14, 81, 139, 145, 129, 146, 157, 162, 138, 137, 96, 97, 98, 99, 100, 101, 102, 103, 104, 106, 107, 144, 158, 159, 161, 105, 111];

export default function LiveView() {
  const { currentLang } = useLocales();
  const { get_sports_list, get_sports_matchs } = useApi();
  const { pathname } = useLocation();
  const isSportsLink = !!matchPath({ path: 'sports', end: false }, pathname);

  const [loading, setLoading] = useState<boolean>(false);
  const [activeSport, setActiveSport] = useState<number>(1);
  const [sportsList, setSportsList] = useState<ISportsList[]>([]);
  const [sportsMatchsTemp, setSportsMatchsTemp] = useState<ISportsMatch[]>([]);
  const [sportsMatchs, setSportsMatchs] = useState<ISportsMatch[]>([]);

  const getSportsList = async () => {
    setLoading(true);
    const res = await get_sports_list('LIVE', currentLang.value);
    setLoading(false);
    if (!res?.data) return;
    setSportsList(res.data);
    if (res.data.length)
      setActiveSport(res.data[0].SportId);
  };

  const getSportsMatchs = async () => {
    setLoading(true);
    const res = await get_sports_matchs({
      SportId: activeSport.toString(),
      EventStatus: "LIVE",
      lang: currentLang.value,
    });
    setLoading(false);
    if (!res?.data) return;
    setSportsMatchsTemp(res.data);
    setSportsMatchs(res.data);
  };

  useEffect(() => {
    getSportsMatchs();
    // eslint-disable-next-line
  }, [activeSport, currentLang.value]);

  useEffect(() => {
    getSportsList();
    // eslint-disable-next-line
  }, [currentLang.value]);

  const getSportsListsTimer = async (lang: string) => {
    const res = await get_sports_list('LIVE', lang);
    if (!res?.data) return;
    setSportsList(res.data);
  };

  useEffect(() => {
    if (!isSportsLink) return;
    if (interval) clearInterval(interval);

    interval = setInterval(async () => {
      await getSportsListsTimer(currentLang.value);
    }, 60 * 1000);
    // eslint-disable-next-line
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [isSportsLink, currentLang.value]);

  useEffect(() => {

    const getChangedMatches = (data: ISportsEvent[]) => {
      const newChanged = data.filter((e) => e.sport_id === activeSport && e.time_status === 1);

      const newMatchs = sportsMatchsTemp.map((row) => {
        const changed = newChanged.filter((e) => e.league.id === row.LeagueId);
        const events = changed.map((event) => ({
          ...event,
          home: row.events.find((e) => e.id === event.id)?.home || event.home,
          away: row.events.find((e) => e.id === event.id)?.away || event.away,
        }))
        return { ...row, events }
      }).filter((e) => e.events.length > 0);

      setSportsMatchs(newMatchs);
      setSportsList((pre) => pre.map((e) =>
        ({ ...e, count: e.SportId === activeSport ? newChanged.length : e.count })));
      // eslint-disable-next-line
      // console.log(newChanged, "==>data", sportsMatchs);
      // if (!newChanged) return;
      // const changedOdds = newChanged.odds[_marketId];
    }

    sportsSocket.on("changed-matches", getChangedMatches);

    // eslint-disable-next-line
    return () => {
      sportsSocket.off("changed-matches", getChangedMatches);
    };
  }, [activeSport, sportsMatchsTemp]);


  useEffect(() => {
    if (!sportsMatchs.length || activeSport !== 1) return;
    let temp: any[] = [];
    sportsMatchs.forEach((data: any) => {
      data.events.forEach((row: any) => {
        if (row?.odds?.length) {
          const ids = row.odds.filter((e: any) => !activeIds.includes(e.id) && !temp.some((_e) => _e.id === e.id));
          temp = [...temp, ...ids];
        }
      });
    })
    console.log(temp, "===>temp==>live");
    // eslint-disable-next-line
  }, [sportsMatchs]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveSport(newValue);
  };

  return (
    <>
      <Card
        sx={{
          py: 2,
          px: { xs: 1, sm: 2 },
          borderRadius: '13px',
          "& .MuiTabs-indicator": {
            top: 0,
            // ml: "2.5%",
            height: 3,
            bgcolor: '#1475e1',
            // width: `16px !important`,
            borderRadius: "0px 0px 100% 100%",
          }
        }}
      >
        <Tabs value={activeSport} onChange={handleChange} >
          {sportsList.map((list, index) => (
            <Tab
              key={index}
              value={list.SportId}
              label={
                <Stack sx={{
                  p: 1.5,
                  pb: 0,
                  alignItems: "center",
                }}>
                  <Badge badgeContent={list.count} color="secondary">
                    <Box component="i" className={`sportsicons sportsicon-${list.SportId}`} sx={{ fontSize: 30 }} />
                  </Badge>
                  <Typography sx={{ fontSize: 12 }}>{list.SportName}</Typography>
                </Stack>
              } sx={{ mr: "10px !important" }} />
          ))}
        </Tabs>
      </Card>
      <br />
      <Stack gap={1}>
        {!loading ?
          sportsMatchs.map((match, index) => (
            <Livelist key={index} index={index} sportId={activeSport} data={match} />
          )) : (
            <Stack gap={2}>
              {[...Array(3)].map((_, index: number) => (
                <Skeleton key={index} sx={{ width: 1, height: 58, borderRadius: 0.5 }} />
              ))}
            </Stack>
          )}
      </Stack>
      <br />

    </>
  );
}
