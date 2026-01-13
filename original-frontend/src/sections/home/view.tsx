// @mui
import { Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
// components
import { useSettingsContext } from 'src/components/settings';
import Image from 'src/components/image';
// hooks
import { useRouter } from 'src/routes/hooks';
// routes
import { paths } from 'src/routes/paths';

import HomeCarousel from './home-carousel';
import HomeNav from './home-nav';
import HomeGallery from './home-gallery';

// ----------------------------------------------------------------------

const GAME_LIST = [
  {
    id: 1,
    name: 'Crash',
    image:
      'https://mediumrare.imgix.net/c830595cbd07b2561ac76a365c2f01869dec9a8fe5e7be30634d78c51b2cc91e?w=180&h=236&fit=min&auto=format',
    link: paths.crash.root,
  },
  // {
  //   id: 2,
  //   name: 'Coinflip',
  //   image:
  //     'https://mediumrare.imgix.net/1c0de2ee0ce713086ff7735697ad2b5385bc974f206b857c724a5ec84467a73b?w=180&h=236&fit=min&auto=format',
  //   link: paths.coinflip.root,
  // },
  {
    id: 3,
    name: 'Plinko',
    image:
      'https://mediumrare.imgix.net/5cbb2498c956527e6584c6af216489b85bbb7a909c7d3c4e131a3be9bd1cc6bf?w=180&h=236&fit=min&auto=format',
    link: paths.plinko.root,
  },
  {
    id: 4,
    name: 'Mines',
    image:
      'https://mediumrare.imgix.net/15a51a2ae2895872ae2b600fa6fe8d7f8d32c9814766b66ddea2b288d04ba89c?w=180&h=236&fit=min&auto=format',
    link: paths.mine.root,
  },
  {
    id: 5,
    name: 'Dice',
    image:
      'https://mediumrare.imgix.net/30688668d7d2d48d472edd0f1e2bca0758e7ec51cbab8c04d8b7f157848640e0?w=180&h=236&fit=min&auto=format',
    link: paths.dice.root,
  },
  {
    id: 6,
    name: 'Wheel',
    image:
      'https://mediumrare.imgix.net/e0a4131a16c28a1c1516958c93ec90c6f0f1bb00f41de87f72f6800c535b9c6f?w=180&h=236&fit=min&auto=format',
    link: paths.wheel.root,
  },
  {
    id: 7,
    name: 'Blackjack',
    image:
      'https://mediumrare.imgix.net/5fcbd552a53b9be85428ecd7fa0ef663f9d763bd8a504dd0de222bc873b79887?w=180&h=236&fit=min&auto=format',
    link: paths.blackjack.root,
  },
  {
    id: 8,
    name: 'Roulette',
    image:
      'https://mediumrare.imgix.net/86cd89b12ec34439c0d1a6e32b06c971efc86091e09ba466182abe173c3d3f7d?w=180&h=236&fit=min&auto=format',
    link: paths.roulette.root,
  },
  {
    id: 9,
    name: 'Slide',
    image:
      'https://mediumrare.imgix.net/08512fbdc9c4163e9fae5917c47ade43a7bfe8253de88d8d16296540eab0f0a1?w=180&h=236&fit=min&auto=format',
    link: paths.slide.root,
  },
  {
    id: 10,
    name: 'Keno',
    image:
      'https://mediumrare.imgix.net/102cf3d7c840018b939cd787bf013e080b996d80e604f3008f21dddf1f1aa201?w=180&h=236&fit=min&auto=format',
    link: paths.keno.root,
  },
  {
    id: 11,
    name: 'Hilo',
    image:
      'https://mediumrare.imgix.net/7324297ac3a60dd5705db514330c5c363aca538432fda98be261bef8df232a77?w=180&h=236&fit=min&auto=format',
    link: paths.hilo.root,
  },
  // {
  //   id: 11,
  //   name: 'Hilo (Multiplayer)',
  //   image:
  //     'https://mediumrare.imgix.net/7324297ac3a60dd5705db514330c5c363aca538432fda98be261bef8df232a77?w=180&h=236&fit=min&auto=format',
  //   link: paths.hilo_m.root,
  // },
  {
    id: 12,
    name: 'Diamonds',
    image:
      'https://mediumrare.imgix.net/59d1df22a2931a965fc241a436a398f460e71ea9d0214f66780a52b56655d392?w=180&h=236&fit=min&auto=format',
    link: paths.diamonds.root,
  },
  {
    id: 13,
    name: 'Video Poker',
    image:
      'https://mediumrare.imgix.net/3b0d5a4dbc8395fc39ebce15a0eaf21373004f428fb266abebe934428f598256?w=180&h=236&fit=min&auto=format',
    link: paths.videopoker.root,
  },
  // {
  //   id: 14,
  //   name: 'Flower Poker',
  //   image:
  //     'https://mediumrare.imgix.net/60928952fc20aee74e08a46e4feeabc3beddf68e8505cc6b31140ab22c36d379?w=180&h=236&fit=min&auto=format',
  //   link: paths.flowerpoker.root,
  // },
  {
    id: 15,
    name: 'Limbo',
    image:
      'https://mediumrare.imgix.net/11caec5df20098884ae9071848e1951b8b34e5ec84a7241f2e7c5afd4b323dfd?w=180&h=236&fit=min&auto=format',
    link: paths.limbo.root,
  },
  {
    id: 17,
    name: 'Baccarat',
    image:
      'https://mediumrare.imgix.net/64f71f2f8c1bde6a66c98ab399c846c8e9921f424559737d0a3879414b69b4b8?w=180&h=236&fit=min&auto=format',
    link: paths.baccarat_s.root,
  },
  // {
  //   id: 18,
  //   name: 'Baccarat (Multiplayer)',
  //   image:
  //     'https://mediumrare.imgix.net/64f71f2f8c1bde6a66c98ab399c846c8e9921f424559737d0a3879414b69b4b8?w=180&h=236&fit=min&auto=format',
  //   link: paths.baccarat_m.root,
  // },
  {
    id: 16,
    name: 'Goal',
    image:
      'https://mediumrare.imgix.net/60f870c4ea1d5c23474b6cf72d210b3f8b3fcb1ab3e181673ddc9b19ac5bb663?w=180&h=236&fit=min&auto=format',
    link: paths.goal.root,
  },
];

export default function OneView() {
  const settings = useSettingsContext();

  const router = useRouter();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={2}>
        {GAME_LIST.map((game, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <Stack
              sx={{
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-4%)',
                },
              }}
              onClick={() => router.push(game.link)}
            >
              <Image
                src={game.image}
                alt="image"
                sx={{
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                {game.name}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
