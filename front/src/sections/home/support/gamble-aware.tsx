import React from 'react';
import { Box, Typography, Stack, Button, Link } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function GambleAware() {
  const { t } = useLocales();

  return (
    <Stack spacing={4}>
      <Typography
        variant="h3"
        sx={{
          color: '#24ee89',
          fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif',
          fontWeight: '400 !important',
          fontStyle: 'italic !important',
          transform: 'skew(-5deg)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          mb: 2,
        }}
      >
        GambleAware Partnership
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#fff',
          fontFamily: '"Geogrotesque Cyr", sans-serif',
          fontWeight: '400',
          fontSize: 16,
          lineHeight: 1.6,
        }}
      >
        We are proud to partner with GambleAware, the leading charity in Great Britain committed to minimizing gambling-related harm.
      </Typography>

      <Box
        sx={{
          bgcolor: 'rgba(138, 43, 226, 0.1)',
          border: '1px solid #24ee89',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
          <Box
            sx={{
              width: { xs: 80, md: 120 },
              height: { xs: 80, md: 120 },
              bgcolor: '#24ee89',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Iconify icon="mdi:shield-check" sx={{ fontSize: { xs: 40, md: 60 }, color: '#000' }} />
          </Box>
          
          <Stack spacing={2} flex={1}>
            <Typography
              variant="h5"
              sx={{
                color: '#24ee89',
                fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif',
                fontWeight: '400 !important',
                fontStyle: 'italic !important',
                transform: 'skew(-5deg)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              About GambleAware
            </Typography>
            
            <Typography
              sx={{
                color: '#fff',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              GambleAware is an independent charity that champions a public health approach to preventing gambling harms. 
              They provide information, advice and support to anyone affected by gambling problems.
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Stack spacing={3}>
        <Typography
          variant="h5"
          sx={{
            color: '#24ee89',
            fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif',
            fontWeight: '400 !important',
            fontStyle: 'italic !important',
            transform: 'skew(-5deg)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Services Available
        </Typography>

        <Stack spacing={2}>
          <Box
            sx={{
              bgcolor: 'rgba(25, 25, 55, 0.3)',
              border: '1px solid #2B2F3D',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#24ee89',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontWeight: 600,
                mb: 1,
              }}
            >
              National Gambling Helpline
            </Typography>
            <Typography
              sx={{
                color: '#A0A3A7',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Free, confidential advice and support for anyone affected by gambling problems. Available 24/7.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: 'rgba(25, 25, 55, 0.3)',
              border: '1px solid #2B2F3D',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#24ee89',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Online Support
            </Typography>
            <Typography
              sx={{
                color: '#A0A3A7',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Access online chat support, self-assessment tools, and educational resources on their website.
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: 'rgba(25, 25, 55, 0.3)',
              border: '1px solid #2B2F3D',
              borderRadius: 2,
              p: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#24ee89',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Treatment Services
            </Typography>
            <Typography
              sx={{
                color: '#A0A3A7',
                fontFamily: '"Geogrotesque Cyr", sans-serif',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Information about local treatment services and specialist support for gambling addiction.
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => window.open('https://www.gambleaware.org/', '_blank')}
          sx={{
            bgcolor: '#24ee89',
            color: '#000',
            fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            px: 4,
            py: 1.5,
            '&:hover': {
              bgcolor: '#E6D017',
            },
          }}
          startIcon={<Iconify icon="eva:external-link-fill" />}
        >
          Visit GambleAware.org
        </Button>
      </Box>
    </Stack>
  );
}