import { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Image from 'src/components/image';
import { API_URL } from 'src/config-global';
import useApi from 'src/hooks/use-api';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { useLocales } from 'src/locales';
import { useRouter } from 'src/routes/hooks';
import { dispatch, useSelector } from 'src/store';
import { ChangePage } from 'src/store/reducers/menu';
import { paths } from 'src/routes/paths';

const TournamentView = () => {
  useScrollToTop();
  const { currentLang } = useLocales();
  const router = useRouter();
  const { get_casino_game } = useApi();

  const { isLoggedIn } = useSelector((store) => store.auth);
  const banners = useSelector((store) => store.config.banners);

  const onGameClick = async (game: any) => {
    try {
      if (!isLoggedIn) {
        dispatch(ChangePage('login'));
        return;
      }

      const res = await get_casino_game(game.id.toString());
      if (!res?.data) return;
      console.log(`/${game.type}/${res.data.provider_code}/${res.data.game_code}/play`, '==:url');
      router.push(
        `/${currentLang.value}${paths.casino.root}/${game.type}/${res.data.provider_code}/${res.data.game_code}/play`
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* eslint-disable */
  const renderFactory = () => {
    // @ts-ignore
    if (!document?.factory) {
      console.error('factory not found');
      setTimeout(() => {
        renderFactory();
      }, 1000);
      return;
    }
    // @ts-ignore
    document.factory.fetch('tournament').then((Tournament: any) => {
      new Tournament({
        el: 'tournament',
        onGameClick,
        filter: {
          status: ['ACTIVE', 'PENDING'],
          limit: 5,
        },
        navigation: {
          view: 'compact', // | 'leaderboard',
          id: '66d61941c3c5501b4e8ac181',
        },
      });

      const app = new Tournament();

      // app.on("TOURNAMENTS_ADDED", (tournaments: any) => {
      //     tournaments.forEach((tournament: any) => {
      //         console.log("tournament added: " + tournament.name);

      //         // player points updated / player added to leaderboard
      //         tournament.on("PLAYER_UPDATE", (player: any) => {
      //             console.log(
      //                 "player " + player.name +
      //                 " updated on tournament " + tournament.name +
      //                 "\nleading players: \n  " +
      //                 tournament.players.slice(0, 4).map((p: any, i: number) => (i + 1) + ". " + p.wallet + ": " + p.points).join("\n  ")
      //             );
      //         });

      //         // triggered on touurnament state update, player's list update...
      //         tournament.on("UPDATE", () => {
      //             console.log("tournament " + tournament.name + " updated: " + tournament.status);
      //             console.log(
      //                 "leading players: \n  " +
      //                 tournament.players.slice(0, 4).map((p: any, i: number) => (i + 1) + ". " + p.wallet + ": " + p.points).join("\n  ")
      //             );
      //         });

      //     });
      // });
    });
  };

  useEffect(() => {
    renderFactory();
  }, [document]);
  /* eslint-enable */

  const banner = banners.find((b) => b.type === 'casino_tournament');

  return (
    <Container>
      {/* <Image alt="banner" src="/assets/images/tourney_bg.png" width={1} /> */}

      <Box
        id="tournament"
        sx={{
          ...(banner && {
            '& .tt-cv-head .tt-cv-wrapper': {
              background: `url(${API_URL}/${banner?.image}) no-repeat`,
              backgroundSize: '100% 300px',
              backgroundPositionY: '100%',
            },
          }),
        }}
      />
    </Container>
  );
};

export default TournamentView;
