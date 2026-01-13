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
          {
            title: 'Keno',
            path: paths.keno.root,
            icon: ICONS.keno,
          },
        ],
      },
    ],
    []
  );

  return data;
}
