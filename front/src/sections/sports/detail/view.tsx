import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';

// @mui
import { Avatar, Box, Divider, Grid, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { useResponsive } from 'src/hooks/use-responsive';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { useParams } from 'src/routes/hooks';

import { sportsSocket } from 'src/utils/socket';
import type { IEventDetail, ISportsEvent, ISportsList } from 'src/types';
import BetOption from './bet-option';
import { BetOptionSkeleton } from './skeleton';
import SoccerBetOption from './bet-soccer-option';
import SoccerLiveStream from './soccer-live-stream';
// ----------------------------------------------------------------------

export type ITab = {
  num: number;
  label: string;
  value: string;
};

export type HeaderDataItem = {
  area: string;
  borderBottom?: boolean;
  children: React.ReactNode;
  type: 'title' | 'home' | 'away';
};

export type DetailViewProps = {
  sportsId: string;
  eventId: string;
};

const BlockMarketsLive = [31, 116, 65, 204, 40, 10, 117, 7, 6, 4, 13, 12, 14, 81, 129, 162, 96, 97, 98, 99, 101, 102, 103, 105, 111];
const BlockMarketsPre = [77];

export default function DetailView() {
  useScrollToTop();
  const { t, currentLang } = useLocales();
  const isMobile = useResponsive('down', 'sm');

  const { sportsId, eventId } = useParams();
  const {
    get_sports_event, get_sports_odds, get_sports_markets,
  } = useApi();
  // const [markets, setMarkets] = useState<ISportsMarket[]>([]);
  const [tabValue, setTabValue] = useState<string | number>("main");
  const [loading, setLoading] = useState<boolean>(false);
  const [tabs, setTabs] = useState<ITab[]>([]);
  const [bet365_odds, setBet365_Odds] = useState<any>(null);
  const [sports, setSports] = useState<ISportsList | null>(null);
  const [event, setEvent] = useState<ISportsEvent | null>(null);
  const [marketLang, setMarketLang] = useState<any>(null);
  const [eventsDetail, setEventsDetail] = useState<IEventDetail[]>([]);
  const [metaData, setMetaData] = useState<ISportsEvent | null>(null);

  const handleChangeTab = (e: SyntheticEvent, newValue: string | number) => {
    setTabValue(newValue);
  };

  const getSportsEvent = async () => {
    const res = await get_sports_event(Number(eventId));
    console.log('getSportsEvent API Response:', res);
    if (!res?.data) return;
    setMetaData(res.data.result);
  };

  const getSportsOdds = async () => {
    const res = await get_sports_odds(Number(eventId), currentLang.value);
    console.log('getSportsOdds API Response:', res);
    if (!res?.data) return;
    setSports(res.data.activeSports);
    setEvent(res.data.event);
    const e = res.data.event;
    if (e?.sport_id === 1 && currentLang.value !== "en") {
      const odds = (e.time_status === 1 && e.odds) || (e.time_status === 0 && e.odds[0].bets);
      const langs = odds.reduce((ary: any, row: any) => (row?.name_en ? { ...ary, [row.name_en]: row.name } : ary), {});
      setMarketLang(langs);
      return;
    }
    setMarketLang(null);
  };


  // const getSportsMarkets = async () => {
  //   const res = await get_sports_markets();
  //   if (!res?.data) return;
  //   setMarkets(res.data);
  // };

  // const setBet365Odds = (odds: any) => {
  //   const _tabs: ITab[] = [];
  //   let _bet365_odds: any = {};
  //   markets.forEach((market) => {

  //     const row = odds[market.id];
  //     if (row) {
  //       let temp: any = {};
  //       const num = market.items.reduce((n, item) => {
  //         if (row[item.id] && row[item.id].odds.length) {
  //           n += 1;
  //           temp = { ...temp, [item.id]: row[item.id] };
  //         }
  //         return n;
  //       }, 0);

  //       if (num > 0) {
  //         _tabs.push({
  //           num,
  //           value: market.id,
  //           label: `${market.name} (${num})`,
  //         })
  //         _bet365_odds = { ..._bet365_odds, [market.id]: temp }
  //       }
  //     }
  //   });
  //   setTabs(_tabs);
  //   setBet365_Odds(_bet365_odds);
  // }

  // useEffect(() => {
  //   if (!event?.bet365_odds || !markets.length) return;
  //   setBet365Odds(event.bet365_odds);
  //   // eslint-disable-next-line
  // }, [event?.bet365_odds, markets])

  const filterEventsDetail = (key: string, value: string, teamId?: number) => {
    const filtered = eventsDetail.filter((item: any) =>
      item[key] === value && (teamId ? item.team.id === teamId : true)
    );
    return filtered.length;
  }

  useEffect(() => {
    if (event?.events && event?.events.length)
      setEventsDetail(event.events);
  }, [event]);

  useEffect(() => {
    if (!eventId || Number(sportsId) === 1) return;
    (async () => {
      setLoading(true);
      await getSportsEvent();
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [eventId, sportsId]);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      setLoading(true);
      await getSportsOdds();
      setLoading(false);
    })();
    // eslint-disable-next-line
  }, [eventId, currentLang.value]);

  useEffect(() => {
    if (!sportsId || !event?.odds?.length || event.time_status === 1) return;
    if (Number(sportsId) !== 1) return;
    setTabValue(0);
    // eslint-disable-next-line
  }, [sportsId, event]);

  /* eslint-disable */

  const isSoccer = Number(sportsId) === 1;

  useEffect(() => {
    if (Number(sportsId) !== 1) return;
    if (!eventId) return;

    const getChangedMatches = (data: ISportsEvent[]) => {
      const newChanged = data.find((e) => e.id === Number(eventId));
      if (!newChanged) return;
      setEvent(newChanged);
    }

    sportsSocket.on("changed-matches", getChangedMatches);

    // eslint-disable-next-line
    return () => {
      sportsSocket.off("changed-matches", getChangedMatches);
    };
  }, [sportsId, eventId]);



  const filteredEvents = () => {
    const isLive = !event?.odds[tabValue]?.bets;
    const bets = event?.odds[tabValue]?.bets || event?.odds || [];
    if (isLive)
      return bets.filter((b: any) => !BlockMarketsLive.includes(b.id));
    return bets.filter((b: any) => !BlockMarketsPre.includes(b.id));
  }

  const renderHead = (
    <Stack
      sx={{
        py: 2,
        px: { xs: 1, sm: 8 },
        gap: 1,
        borderRadius: 0.5,
        alignItems: 'center',
        bgcolor: 'background.paper',
        // background: 'linear-gradient(144.14deg, #234d34 -11.44%, #304b9f 123.42%)',
      }}
    >
      <Stack direction="row" gap={2}>
        <Iconify icon="formkit:time" />
        <Typography>{format(new Date((event?.time || 0) * 1000), 'h:mm a')}</Typography>
        <Typography>{format(new Date((event?.time || 0) * 1000), 'dd MMM EEE, yyyy')}</Typography>
      </Stack>
      <Divider sx={{ width: 1 }} />
      <Stack
        my={2}
        gap={2}
        width={1}
        direction={{
          xs: (Number(sportsId) === 1 && event?.time_status === 1) ? "row" : 'column',
          sm: 'row'
        }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ width: 0.5 }}>
          <Typography variant="h4">{event?.home.name || ''}</Typography>
          {(Number(sportsId) !== 1 || event?.time_status !== 1) && (
            <Avatar
              alt={event?.home.name}
              sx={{ ml: 1, width: 70, height: 70, bgcolor: '#65668d' }}
              src={event?.home?.logo || `https://assets.b365api.com/images/team/b/${event?.home.image_id}.png`}
            />
          )}
        </Stack>
        <Box component="img" alt="vs" src="/assets/images/sports/vs.png" sx={{ height: 50 }} />
        <Stack direction="row" alignItems="center" sx={{ width: 0.5 }}>
          {(Number(sportsId) !== 1 || event?.time_status !== 1) && (
            <Avatar
              alt={event?.home.name}
              sx={{ mr: 1, width: 70, height: 70, bgcolor: '#65668d' }}
              src={event?.away?.logo || `https://assets.b365api.com/images/team/b/${event?.away.image_id}.png`}
            />
          )}
          <Typography variant="h4">{event?.away.name || ''}</Typography>
        </Stack>
      </Stack>
      <Divider sx={{ width: 1 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" gap={1}>
        <Typography>{t("league")} : {event?.league.name || ''}</Typography>
        {metaData?.extra?.stadium_data && (
          <>
            {!isMobile && <Divider orientation="vertical" sx={{ height: 19 }} />}
            <Typography>{t("stadium")} : {metaData?.extra?.stadium_data?.name}</Typography>
          </>
        )}
        {event?.extra?.stadium_data && (
          <>
            {!isMobile && <Divider orientation="vertical" sx={{ height: 19 }} />}
            <Typography>{t("stadium")} : {event?.extra?.stadium_data?.name}</Typography>
          </>
        )}
      </Stack>
    </Stack>
  )

  const headerData = [
    {
      area: "competitor_title",
      children: (<>
        <Typography> {event?.f_status?.elapsed || ""}<span className="min-effect" >&apos;</span> </Typography>
        <Typography ml={1} color="#b1bad3" fontSize={"13px !important"} >
          {event?.f_status?.long || ""}
          {event?.f_status?.extra &&
            <Box component="span" color="#1cff98" >
              &nbsp; +{event?.f_status?.extra}<span className="min-effect" >&apos;</span>
            </Box>
          }
        </Typography>
      </>),
      type: "title",
    },
    {
      area: "competitor_home",
      borderBottom: true,
      children: (<>
        <Box component="img" alt="home" src={event?.home?.logo || ""} width={20} height={20} />
        <Typography ml={1} > {event?.home?.name} </Typography>
      </>),
      type: "home",
    },

    {
      area: "competitor_away",
      children: (<>
        <Box component="img" alt="away" src={event?.away?.logo || ""} width={20} height={20} />
        <Typography ml={1} > {event?.away?.name} </Typography>
      </>),
      type: "away",
    },
    // {
    //   area: "corners_title",
    //   children: <Iconify icon="game-icons:corner-flag" width={16} height={16} />,
    //   type: "title",
    // },
    // {
    //   area: "corners_home",
    //   borderBottom: true,
    //   children: 0,
    //   type: "home",
    // },
    // {
    //   area: "corners_away",
    //   children: 0,
    //   type: "away",
    // },
    {
      area: "yellowCards_title",
      children: <Iconify icon="fluent-emoji-flat:yellow-square" width={16} height={16} />,
      type: "title",
    },
    {
      area: "yellowCards_home",
      borderBottom: true,
      children: filterEventsDetail("detail", "Yellow Card", event?.home?.id),
      type: "home",
    },
    {
      area: "yellowCards_away",
      children: filterEventsDetail("detail", "Yellow Card", event?.away?.id),
      type: "away",
    },
    {
      area: "redCards_title",
      children: <Iconify icon="fluent-emoji-flat:red-square" width={16} height={16} />,
      type: "title",
    },
    {
      area: "redCards_home",
      borderBottom: true,
      children: filterEventsDetail("detail", "Red Card", event?.home?.id),
      type: "home",
    },
    {
      area: "redCards_away",
      children: filterEventsDetail("detail", "Red Card", event?.away?.id),
      type: "away",
    },
    {
      area: "period_title_0",
      children: "1st",
      type: "title",
    },
    {
      area: "period_home_0",
      borderBottom: true,
      children: event?.f_score?.halftime.home || 0,
      type: "home",
    },
    {
      area: "period_away_0",
      children: event?.f_score?.halftime.away || 0,
      type: "away",
    },
    {
      area: "matchScore_title",
      children: <Iconify icon="fluent-emoji:soccer-ball" width={16} height={16} />,
      type: "title",
    },
    {
      area: "matchScore_home",
      children: event?.scores?.home || 0,
      type: "home",
    },
    {
      area: "matchScore_away",
      children: event?.scores?.away || 0,
      type: "away",
    },
  ]

  const renderSoccerHead = (
    <Stack
      sx={{
        py: 4,
        px: { xs: 1, sm: 8 },
        gap: 2,
        borderRadius: 0.5,
        alignItems: 'center',
        background: 'linear-gradient(144.14deg, #234d34 -11.44%, #304b9f 123.42%)',
      }}
    >

      <Box sx={{
        boxShadow: "0 4px 6px -1px #0003,0 2px 4px -1px #0505141f",
        minWidth: 250
      }} >
        <Stack sx={{
          display: "grid",
          bgcolor: 'primary.main',
          justifyItems: "center",
          alignItems: "center",
          width: 1,
          borderRadius: ".25rem",
          gridTemplateAreas: `
          "${headerData.reduce((text: string, row) => (row.type === "title" ? `${text} ${row.area}` : text), "")}"
 "${headerData.reduce((text: string, row) => (row.type === "home" ? `${text} ${row.area}` : text), "")}"
 "${headerData.reduce((text: string, row) => (row.type === "away" ? `${text} ${row.area}` : text), "")}"`,
          fontSize: "14px !important",
          "& div": {
            width: 1,
            height: 1,
            p: 1,
            // justifyContent: "center",
            justifyItems: "center",
            alignItems: "center",
          }
        }} >
          {headerData.map((row, index) => (
            <Stack key={index} direction="row"
              gridArea={row.area}
              borderBottom={row.borderBottom ? "1px solid #2f4553" : ""}
              justifyContent={index < 3 ? "flex-start" : "center"}
            >
              {row.children}
            </Stack>
          ))}
        </Stack>
      </Box>

    </Stack>
  )


  const renderContent = (
    <>
      {!isSoccer && (
        <Stack>
          <Grid container spacing={2}>
            {loading
              ? [...Array(6)].map((_, index) => (
                <Grid key={index} item xs={12} md={6}>
                  <BetOptionSkeleton />
                </Grid>
              ))
              : tabValue === "main" ? Object.keys(event?.odds || {}).map((oddkey, index) => (
                <Grid key={index} item xs={12} md={6}>
                  <BetOption event={event} tab={tabValue.toString()} oddkey={oddkey} sportId={Number(sportsId)} />
                </Grid>
              )) : Object.keys(bet365_odds[tabValue] || {}).map((oddkey, index) => (
                <Grid item key={index} xs={12} md={6}>
                  <BetOption event={event} bet365_odds={bet365_odds[tabValue][oddkey]} tab={tabValue.toString()} oddkey={oddkey} sportId={Number(sportsId)} bet365 />
                </Grid>
              ))}
          </Grid>
        </Stack>
      )}

    </>
  );

  const renderSoccerContent = (
    <>
      <Grid container spacing={1}>

        <Grid item xs={12}
          sm={event?.time_status === 1 ? 7 : 12}
          md={event?.time_status === 1 ? 8 : 12}
        >
          {isMobile ? <SoccerLiveStream eventId={event?.id || ""} /> : renderHead}
          <br />
          {(event && event?.odds.length > 0) && (
            <Grid container spacing={2}>
              {loading
                ? [...Array(6)].map((_, index) => (
                  <Grid key={index} item xs={12} md={12}>
                    <BetOptionSkeleton />
                  </Grid>
                ))
                : filteredEvents().map((bets: any, index: number) => (
                  <Grid key={index} item xs={12} md={12}>
                    <SoccerBetOption event={event} marketLang={marketLang} bets={bets} />
                  </Grid>
                ))}
            </Grid>
          )}
        </Grid>

        {(event?.time_status === 1 && !isMobile) && <SoccerLiveStream eventId={event?.id || ""} />}
      </Grid>
    </>
  );

  return (
    <>
      {Number(sportsId) !== 1 && renderHead}

      {/* {(event?.bet365_odds && event?.time_status === 0) && (
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="main" label={`Main (${Object.keys(event?.odds || {}).length})`} />
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                sx={{ textTransform: "capitalize" }} />
            ))}
          </Tabs>
        </Box>
      )} */}

      {/* {(event?.odds?.length && event?.time_status === 0) && (
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {event?.odds.map((tab: any, index: number) => (
              <Tab
                key={index}
                value={index}
                label={tab.name}
                sx={{ textTransform: "capitalize" }} />
            ))}
          </Tabs>
        </Box>
      )} */}

      {isSoccer ? renderSoccerContent : renderContent}


      {/* <Box id="sportmonks-widget" data-widget="match-centre" data-info="6L+W09qe/Nf7nV1LUkiVSPNHZV80w5r58b7bwHi0bJ3CRKB+RN4WgF2D6K/NuNV+FJ9AryRGbzEYDz6x78vplj6X9MtOLADWTOQ8Tz5TtF+C0EW21osvEGmE3L3+Ws0p2pV0AYVEYZfGSndk4zZAE55suzidi5M8BGO9hyJYHr9r2pJ6nqpiZOed1gY45CKy4ZmqbWxWhVcke80qdaKV6EIjqWJTkbg1I5fNbjiJgbfLttY1NRYfbC9L7hD/VLOXfB+hGPOTFnzgq3a36CUwkYposaTs3rAGI5WU+01BTHqluru9hUvr2gcWaaxJFrayC4tFGvBC2yHYBl5iowyiygqKAdjxx7TRy8XscNQf3WtDfOdfmHFZ7bTPt1NZr/JopF3cVUAcCQn+4tuOjWYP1+ywpuptSw2X6+TaDHPcIbuzd8UFFoSgvn/SF2ZoaON/Y+R1tCEs2j0mqwhhCjPHKRXkSc9MncNcZkai6PFRB/w46ZwUJQrT2ivxeuhO/NWFFDRuF4uzXjIVFn/66uBixaul+rmLBhKJ5vyTN33Jwfv6X2jRqLR1HVO+3XcE4d3fZ8djSh5+qTDfx78mPzWpOjlErKhQI/yi+Obe2Ot74/H74EK6H+d5KPuKviNeL78S0pNiJJhHOwasD32uznomlYoHSkxMA/9Qw87cZv41DWo=" data-colors="#0e3e3b,#1893C1,#D0D0D9,#004d4a" data-fixture="18682369" /> */}

    </>
  );
}
