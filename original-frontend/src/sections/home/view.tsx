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
    id: 10,
    name: 'Keno',
    image:
      'https://mediumrare.imgix.net/102cf3d7c840018b939cd787bf013e080b996d80e604f3008f21dddf1f1aa201?w=180&h=236&fit=min&auto=format',
    link: paths.keno.root,
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
