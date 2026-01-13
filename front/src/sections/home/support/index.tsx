import React, { useState } from 'react';
import { Box, Container, Stack, Typography, styled } from '@mui/material';
import { useLocales } from 'src/locales';
import Image from 'src/components/image';

// Import section components
import HelpCenter from './help-center';
import ResponsibleGambling from './responsible-gambling';
import GambleAware from './gamble-aware';
import Fairness from './fairness';
import SelfExclusion from './self-exclusion';
import LiveSupport from './live-support';

// ----------------------------------------------------------------------

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontStyle: 'italic',
}));

export default function SupportView() {
  const { t } = useLocales();
  const [activeSection, setActiveSection] = useState('help-center');

  const supportSections = [
    { key: 'help-center', title: t('help_center'), component: HelpCenter },
    { key: 'live-support', title: t('live_support'), component: LiveSupport },
    { key: 'responsible-gambling', title: t('responsible_gambling'), component: ResponsibleGambling },
    { key: 'gamble-aware', title: t('gamble_aware'), component: GambleAware },
    { key: 'fairness', title: t('fairness'), component: Fairness },
    { key: 'self-exclusion', title: t('self_exclusion'), component: SelfExclusion },
  ];

  const ActiveComponent = supportSections.find(section => section.key === activeSection)?.component || HelpCenter;

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Banner Section - копируем дизайн из промоушинс */}
        <Box
          sx={{
            position: 'relative',
            width: 1,
            height: { xs: 140, sm: 200 },
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          <Image
            src="/assets/promotion/header.png"
            sx={{
              width: 1,
              height: 1,
              '& img': { 
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              },
              filter: 'brightness(0.9)',
            }}
          />
          {/* Inset yellow border */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              p: 1.5, // inset padding
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ border: '3px solid #24ee89', borderRadius: 1.5, width: '100%', height: '100%' }} />
          </Box>

          {/* Center title with gradient lines */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              width: '80%',
              maxWidth: 600,
            }}
          >
            {/* Left gradient line */}
            <Box
              sx={{
                flex: 1,
                height: '3px',
                background: 'linear-gradient(to right, transparent, #24ee89)',
                marginRight: 3,
              }}
            />
            
            <StyledTitle
              variant="h3"
              sx={{
                color: '#FFFFFF',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                whiteSpace: 'nowrap',
                fontSize: { xs: '1.8rem', sm: '2.5rem' },
              }}
            >
              SUPPORT
            </StyledTitle>
            
            {/* Right gradient line */}
            <Box
              sx={{
                flex: 1,
                height: '3px',
                background: 'linear-gradient(to left, transparent, #24ee89)',
                marginLeft: 3,
              }}
            />
          </Box>
        </Box>

        {/* Horizontal Menu - копируем стиль из top_games */}
        <Box>
          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 4 }}
            sx={{
              justifyContent: 'flex-start',
              py: 2,
              px: { xs: 2, sm: 0 },
              borderBottom: '1px solid #2B2F3D',
              pb: 2,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none',
            }}
          >
            {supportSections.map((section, index) => {
              const isActive = activeSection === section.key;
              return (
                <Typography
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  sx={{
                    cursor: 'pointer',
                    fontFamily: '"FONTSPRING DEMO - Blunt Con It", "Impact", sans-serif !important',
                    fontWeight: '400 !important',
                    fontStyle: 'italic !important',
                    fontSize: { xs: '14px', sm: '16px' },
                    lineHeight: '100% !important',
                    letterSpacing: '0.05em !important',
                    textTransform: 'uppercase !important',
                    color: isActive ? '#24ee89' : '#A0A3A7',
                    position: 'relative',
                    pb: 1,
                    zIndex: 1,
                    transform: 'skew(-5deg) !important',
                    transformOrigin: 'left center !important',
                    transition: 'color 0.3s ease',
                    whiteSpace: 'nowrap',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -2,
                      height: 16,
                      background:
                        'linear-gradient(0deg, rgba(255,231,26,0.6) 0%, rgba(255,231,26,0) 100%)',
                      opacity: isActive ? 1 : 0,
                      pointerEvents: 'none',
                      transition: 'opacity 0.3s ease',
                      zIndex: 0,
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: -2,
                      height: '2px',
                      background: '#24ee89',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: 0,
                    },
                    '&:hover': {
                      color: '#24ee89',
                      '&::before': { opacity: 1 },
                      '&::after': { opacity: 1 },
                    },
                  }}
                >
                  {section.title}
                </Typography>
              );
            })}
          </Stack>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            border: '2px solid #2B2F3D',
            borderRadius: 2,
            bgcolor: 'transparent',
            p: { xs: 2, md: 4 },
          }}
        >
          <ActiveComponent />
        </Box>
      </Stack>
    </Container>
  );
}