// @mui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// config
import { ASSETS_API } from 'src/config-global';

// components
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';
import { useNavigate } from 'react-router';

const StyledText = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: theme.spacing(15),
  right: 0,
  top: 0,
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '1.4rem',
  '& > h3': {
    fontSize: 26,
    lineHeight: 1,
  },
}));

const HomeNav = () => {
  const smUp = useResponsive('up', 'sm');
  const navigate = useNavigate();

  return (
    <Stack
      direction={{
        xs: 'column',
        md: 'row',
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Stack direction="row" spacing={2}>
        <Box position="relative">
          <Image
            alt="nav-01"
            src={`assets/images/casino/nav/${smUp ? 'desktop' : 'mobile'}/sport.${smUp ? 'png' : 'png'
              }`}
          />
          <StyledText>
            <Typography variant="h3">SPORT</Typography>
          </StyledText>
        </Box>
        <Box
          position="relative"
        // onClick={() => navigate('casino')} sx={{ cursor: 'pointer' }}
        >
          <Image
            alt="nav-01"
            src={`assets/images/casino/nav/${smUp ? 'desktop' : 'mobile'}/casino.${smUp ? 'png' : 'png'
              }`}
          />
          <StyledText>
            <Typography variant="h3">CASINO</Typography>
          </StyledText>
        </Box>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Box position="relative">
          <Image
            alt="nav-01"
            src={`assets/images/casino/nav/${smUp ? 'desktop' : 'mobile'}/mini_games.${smUp ? 'png' : 'png'
              }`}
          />
          <StyledText>
            <Typography variant="h3">MINI GAMES</Typography>
          </StyledText>
        </Box>
        <Box
          position="relative"
        // onClick={() => navigate('live-casino')} sx={{ cursor: 'pointer' }}
        >
          <Image
            alt="nav-01"
            src={`assets/images/casino/nav/${smUp ? 'desktop' : 'mobile'}/live_casino.${smUp ? 'png' : 'png'
              }`}
          />
          <StyledText>
            <Typography variant="h3">LIVE CASINO</Typography>
          </StyledText>
        </Box>
      </Stack>
    </Stack>
  );
};

export default HomeNav;
