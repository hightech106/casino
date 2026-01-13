import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------
const iconify = (name: string) => <Iconify icon={name} width={24} height={24} />;

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

export const ICONS = {
  home: iconify('famicons:home'),
  crash: iconify('bx:rocket'),
  coinflip: iconify('pepicons-print:coins'),
  plinko: iconify('game-icons:ball-pyramid'),
  profile: iconify('iconamoon:profile-bold'),
  flowerpoker: iconify('mdi:flower'),
  mine: iconify('mdi:mine'),
  blackjack: iconify('tabler:play-card-j-filled'),
  wheel: iconify('mdi:wheel'),
  dice: iconify('mdi:dice'),
  diamonds: iconify('icon-park-outline:diamonds'),
  limbo: iconify('bi:rocket'),
  keno: iconify('mdi:number-1-box-multiple-outline'),
  hilo: iconify('token:hilo'),
  videopoker: iconify('icon-park-twotone:poker'),
  slide: iconify('fluent:slide-transition-24-regular'),
  baccarat_s: iconify('tabler:play-card'),
  baccarat_m: iconify('mdi:card-multiple-outline'),
  goal: iconify('emojione:goal-net'),
  roulette: iconify('arcticons:buckshot-roulette'),
  hilo_m: iconify('token-branded:hilo'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'orignial games',
        items: [
          { title: 'Crash', path: paths.crash.root, icon: ICONS.crash },
          { title: 'Coinflip', path: paths.coinflip.root, icon: ICONS.coinflip },
          {
            title: 'Plinko',
            path: paths.plinko.root,
            icon: ICONS.plinko,
          },
          {
            title: 'Flower Poker',
            path: paths.flowerpoker.root,
            icon: ICONS.flowerpoker,
          },
          {
            title: 'Mine',
            path: paths.mine.root,
            icon: ICONS.mine,
          },
          {
            title: 'Blackjack',
            path: paths.blackjack.root,
            icon: ICONS.blackjack,
          },
          {
            title: 'Wheel',
            path: paths.wheel.root,
            icon: ICONS.wheel,
          },
          {
            title: 'Dice',
            path: paths.dice.root,
            icon: ICONS.dice,
          },
          {
            title: 'Diamonds',
            path: paths.diamonds.root,
            icon: ICONS.diamonds,
          },
          {
            title: 'Limbo',
            path: paths.limbo.root,
            icon: ICONS.limbo,
          },
          {
            title: 'Keno',
            path: paths.keno.root,
            icon: ICONS.keno,
          },
          {
            title: 'Hilo',
            path: paths.hilo.root,
            icon: ICONS.hilo,
          },
          {
            title: 'Video Poker',
            path: paths.videopoker.root,
            icon: ICONS.videopoker,
          },
          {
            title: 'Slide',
            path: paths.slide.root,
            icon: ICONS.slide,
          },
          {
            title: 'Baccarat (single)',
            path: paths.baccarat_s.root,
            icon: ICONS.baccarat_s,
          },
          {
            title: 'Baccarat (multi)',
            path: paths.baccarat_m.root,
            icon: ICONS.baccarat_m,
          },
          {
            title: 'Goal',
            path: paths.goal.root,
            icon: ICONS.goal,
          },
          {
            title: 'Roulette',
            path: paths.roulette.root,
            icon: ICONS.roulette,
          },
          {
            title: 'Hilo (multi)',
            path: paths.hilo_m.root,
            icon: ICONS.hilo_m,
          },
        ],
      },

      // // MANAGEMENT
      // // ----------------------------------------------------------------------
      // {
      //   subheader: 'management',
      //   items: [
      //     {
      //       title: 'user',
      //       path: paths.dashboard.group.root,
      //       icon: ICONS.user,
      //       children: [
      //         { title: 'four', path: paths.dashboard.group.root },
      //         { title: 'five', path: paths.dashboard.group.five },
      //         { title: 'six', path: paths.dashboard.group.six },
      //       ],
      //     },
      //   ],
      // },
    ],
    []
  );

  return data;
}
