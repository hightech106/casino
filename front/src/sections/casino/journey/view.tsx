import { styled } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'src/components/image';

const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontStyle: 'italic',
}));

const StyledSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  fontStyle: 'italic',
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: '"Geogrotesque Cyr Regular", Arial, sans-serif !important',
  fontWeight: '400 !important',
}));

export default function JourneyView() {
  return (
    <Stack gap={{ xs: 2, sm: 3 }} py={{ xs: 3, sm: 4 }}>
      {/* Main Banner */}
      <Box
        sx={{
          position: 'relative',
          width: 1,
          height: { xs: 500, sm: 600, md: 500 },
          borderRadius: 1.5,
          overflow: 'hidden',
        }}
      >
        <Image
          src="/assets/images/vipclub/main-banner.png"
          sx={{
            width: 1,
            height: 1,
            display: { xs: 'none', md: 'block' },
            '& img': { 
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            },
          }}
        />
        
        <Image
          src="/assets/images/vipclub/main-banner-mb.png"
          sx={{
            width: 1,
            height: 1,
            display: { xs: 'block', md: 'none' },
            '& img': { 
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            },
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 16, md: 32 },
            left: 16,
            right: { xs: 16, md: 32 },
            bottom: 16,
            border: { xs: 'none', md: '3px solid #24ee89' },
            borderRadius: 1.5,
            pointerEvents: 'none',
          }}
        />

        <Stack
          sx={{
            position: 'absolute',
            left: { xs: 0, md: 48, lg: 64 },
            top: { xs: 'auto', md: 48, lg: 64 },
            bottom: { xs: 40, sm: 50, md: 'auto' },
            right: { xs: 0, md: 48, lg: 64 },
            width: { xs: '100%', md: 'auto' },
            maxWidth: { xs: '100%', md: '45%' },
            maxHeight: { xs: '30%', sm: '25%', md: '50%', lg: '60%' },
            px: { xs: 4, sm: 5, md: 0 },
            py: { xs: 2, sm: 3, md: 0 },
            gap: { xs: 1, sm: 1.5, md: 1.5, lg: 2 },
            justifyContent: { xs: 'center', md: 'flex-start' },
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <StyledTitle
            variant="h2"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2rem', lg: '2.8rem', xl: '3.2rem' },
              lineHeight: 1.1,
              whiteSpace: { xs: 'nowrap', md: 'normal' },
            }}
          >
            <Box component="span" sx={{ color: '#24ee89' }}>LUCKVERSE777</Box>
            <Box 
              component="span" 
              sx={{ 
                color: '#FFFFFF',
                display: { xs: 'inline', md: 'block' },
              }}
            >
              {' '}PRESTIGE CIRCLE
            </Box>
          </StyledTitle>
          <Box
            sx={{
              bgcolor: '#24ee89',
              px: { xs: 2, sm: 2.5, md: 1.5, lg: 2 },
              py: { xs: 0.75, sm: 1, md: 0.5, lg: 0.75 },
              borderRadius: 1,
              display: 'inline-block',
              alignSelf: { xs: 'center', md: 'flex-start' },
            }}
          >
            <StyledSubtitle
              variant="h4"
              sx={{
                color: '#050514',
                fontSize: { xs: '1rem', sm: '1.3rem', md: '1rem', lg: '1.4rem', xl: '1.6rem' },
                lineHeight: 1.1,
              }}
            >
              THE VIP EXPERIENCE REDEFINED
            </StyledSubtitle>
          </Box>

          {/* Description */}
          <StyledDescription
            variant="body1"
            sx={{
              color: '#FFFFFF',
              fontSize: { xs: '0.9rem', sm: '1rem', md: '0.85rem', lg: '1rem', xl: '1.1rem' },
              lineHeight: 1.4,
              maxWidth: '100%',
            }}
          >
            At LuckVerse777, we believe loyalty should be rewarded with more than just points. 
            The Prestige Circle is our exclusive VIP program, crafted for our most valued players 
            who seek elevated experiences, personalized rewards, and unmatched service.
          </StyledDescription>
        </Stack>
      </Box>

      {/* Core Benefits Section */}
      <Box sx={{ mt: { xs: 4, sm: 5, md: 6 } }}>
        {/* Section Title */}
        <StyledTitle
          variant="h2"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
            lineHeight: 1.2,
            textAlign: 'left',
            mb: { xs: 3, sm: 4, md: 5 },
            px: { xs: 2, sm: 0 },
          }}
        >
          <Box component="span" sx={{ color: '#FFFFFF' }}>Core </Box>
          <Box component="span" sx={{ color: '#24ee89' }}>Benefits</Box>
          <Box component="span" sx={{ color: '#FFFFFF' }}> of the Prestige Circle</Box>
        </StyledTitle>

        {/* Benefits Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 3, sm: 4, md: 3, lg: 4 },
            px: { xs: 2, sm: 0 },
          }}
        >
          {/* Benefit Card 1 */}
          <Box
            sx={{
              bgcolor: '#2B2F3D',
              borderRadius: 2,
              borderTopLeftRadius: 0,
              p: { xs: 4, sm: 5, md: 4, lg: 5 },
              minHeight: { xs: 180, sm: 200, md: 160, lg: 180 },
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 3, lg: 4 },
              position: 'relative',
              overflow: 'hidden',

              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, #24ee89 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, #24ee89 100%)',
              },
            }}
          >

            <Box sx={{ flex: 1 }}>
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Dedicated VIP Account Manager
              </StyledSubtitle>
              <StyledDescription
                variant="body1"
                sx={{
                  color: '#CCCCCC',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '0.9rem', lg: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                At LuckVerse777, we believe loyalty should be rewarded with more than just points. The Prestige Circle is our exclusive VIP program, crafted for our most valued players who seek elevated experiences, personalized rewards, and unmatched service.
              </StyledDescription>
            </Box>

            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 150, sm: 160, md: 200, lg: 250 },
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/assets/images/vipclub/1.png"
                sx={{
                  width: 1,
                  height: 'auto',
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Benefit Card 2 */}
          <Box
            sx={{
              bgcolor: '#2B2F3D',
              borderRadius: 2,
              borderTopLeftRadius: 0,
              p: { xs: 4, sm: 5, md: 4, lg: 5 },
              minHeight: { xs: 180, sm: 200, md: 160, lg: 180 },
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 3, lg: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, #24ee89 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, #24ee89 100%)',
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Customized Promotions & Cashback
              </StyledSubtitle>
              <StyledDescription
                variant="body1"
                sx={{
                  color: '#CCCCCC',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '0.9rem', lg: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                Receive bespoke bonuses, higher-value free bets, and personalized cashback offers based on your playing habits and preferences.
              </StyledDescription>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 150, sm: 160, md: 200, lg: 250 },
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/assets/images/vipclub/2.png"
                sx={{
                  width: 1,
                  height: 'auto',
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Benefit Card 3 */}
          <Box
            sx={{
              bgcolor: '#2B2F3D',
              borderRadius: 2,
              borderTopLeftRadius: 0,
              p: { xs: 4, sm: 5, md: 4, lg: 5 },
              minHeight: { xs: 180, sm: 200, md: 160, lg: 180 },
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 3, lg: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, #24ee89 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, #24ee89 100%)',
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Priority Withdrawals & Higher Limits
              </StyledSubtitle>
              <StyledDescription
                variant="body1"
                sx={{
                  color: '#CCCCCC',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '0.9rem', lg: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                Enjoy accelerated withdrawal processing times, higher deposit/withdrawal limits, and enhanced transaction flexibility.
              </StyledDescription>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 150, sm: 160, md: 200, lg: 250 },
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/assets/images/vipclub/3.png"
                sx={{
                  width: 1,
                  height: 'auto',
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Benefit Card 4 */}
          <Box
            sx={{
              bgcolor: '#2B2F3D',
              borderRadius: 2,
              borderTopLeftRadius: 0,
              p: { xs: 4, sm: 5, md: 4, lg: 5 },
              minHeight: { xs: 180, sm: 200, md: 160, lg: 180 },
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 3, lg: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, #24ee89 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, #24ee89 100%)',
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Exclusive Gifts & Experiences
              </StyledSubtitle>
              <StyledDescription
                variant="body1"
                sx={{
                  color: '#CCCCCC',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '0.9rem', lg: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                From top-tier electronics to luxury travel packages and VIP event tickets, rewards go beyond the screen—direct to your doorstep.
              </StyledDescription>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 150, sm: 160, md: 200, lg: 250 },
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/assets/images/vipclub/4.png"
                sx={{
                  width: 1,
                  height: 'auto',
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Benefit Card 5 */}
          <Box
            sx={{
              bgcolor: '#2B2F3D',
              borderRadius: 2,
              borderTopLeftRadius: 0,
              p: { xs: 4, sm: 5, md: 4, lg: 5 },
              minHeight: { xs: 180, sm: 200, md: 160, lg: 180 },
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 3, lg: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, #24ee89 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, #24ee89 100%)',
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Private Tournaments & Events
              </StyledSubtitle>
              <StyledDescription
                variant="body1"
                sx={{
                  color: '#CCCCCC',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '0.9rem', lg: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                Compete in invitation-only tournaments with boosted prize pools, and get access to special promotions unavailable to regular users.
              </StyledDescription>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 150, sm: 160, md: 200, lg: 250 },
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/assets/images/vipclub/5.png"
                sx={{
                  width: 1,
                  height: 'auto',
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Benefit Card 6 */}
          <Box
            sx={{
              bgcolor: '#2B2F3D',
              borderRadius: 2,
              borderTopLeftRadius: 0,
              p: { xs: 4, sm: 5, md: 4, lg: 5 },
              minHeight: { xs: 180, sm: 200, md: 160, lg: 180 },
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, sm: 4, md: 3, lg: 4 },
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #24ee89 0%, #24ee89 100%)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'linear-gradient(180deg, #24ee89 0%, #24ee89 100%)',
              },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#FFFFFF',
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: 1.2,
                  mb: { xs: 2, sm: 2.5 },
                }}
              >
                Enhanced Gaming Access
              </StyledSubtitle>
              <StyledDescription
                variant="body1"
                sx={{
                  color: '#CCCCCC',
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '0.9rem', lg: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                Unlock exclusive games, early access to new features, and premium tables with higher betting limits and fewer restrictions.
              </StyledDescription>
            </Box>
            <Box
              sx={{
                flexShrink: 0,
                width: { xs: 150, sm: 160, md: 200, lg: 250 },
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Image
                src="/assets/images/vipclub/6.png"
                sx={{
                  width: 1,
                  height: 'auto',
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* VIP Levels Section */}
      <Box sx={{ mt: { xs: 6, sm: 7, md: 8 } }}>
        {/* Section Title */}
        <StyledTitle
          variant="h2"
          sx={{
            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
            lineHeight: 1.2,
            textAlign: 'left',
            mb: { xs: 4, sm: 5, md: 6 },
            px: { xs: 2, sm: 0 }, 
          }}
        >
          <Box component="span" sx={{ color: '#FFFFFF' }}>Levels of the </Box>
          <Box component="span" sx={{ color: '#24ee89' }}>Prestige Circle</Box>
        </StyledTitle>

        {/* VIP Levels Grid */}
        <Box
          sx={{
            px: { xs: 2, sm: 0 },
          }}
        >
          {/* Desktop Layout - все в один ряд */}
          <Box
            sx={{
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: { md: 2, lg: 3 },
              mb: 4,
            }}
          >
            {/* Bronze */}
            <Box
              sx={{
                aspectRatio: '4/5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/assets/images/vipclub/bronze.png"
                sx={{
                  width: 1,
                  height: 1,
                  '& img': {
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </Box>

            {/* Silver */}
            <Box
              sx={{
                aspectRatio: '4/5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/assets/images/vipclub/silver.png"
                sx={{
                  width: 1,
                  height: 1,
                  '& img': {
                    objectFit: 'contain', 
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </Box>

            {/* Gold */}
            <Box
              sx={{
                aspectRatio: '4/5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/assets/images/vipclub/gold.png"
                sx={{
                  width: 1,
                  height: 1,
                  '& img': {
                    objectFit: 'contain', 
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </Box>

            {/* Platinum */}
            <Box
              sx={{
                aspectRatio: '4/5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/assets/images/vipclub/platinum.png"
                sx={{
                  width: 1,
                  height: 1,
                  '& img': {
                    objectFit: 'contain', 
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </Box>

            {/* Diamond */}
            <Box
              sx={{
                aspectRatio: '4/5', 
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Image
                src="/assets/images/vipclub/diamond.png"
                sx={{
                  width: 1,
                  height: 1,
                  '& img': {
                    objectFit: 'contain', 
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </Box>
          </Box>

          {/* Mobile Layout - 2+2+1 */}
          <Box
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {/* Первый ряд: Bronze + Silver */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: { xs: 2, sm: 3 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Box
                sx={{
                  aspectRatio: '4/5', 
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/assets/images/vipclub/bronze-mb.png"
                  sx={{
                    width: 1,
                    height: 1,
                    '& img': {
                      objectFit: 'contain', 
                      width: '100%',
                      height: '100%',
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  aspectRatio: '4/5', 
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/assets/images/vipclub/silver-mb.png"
                  sx={{
                    width: 1,
                    height: 1,
                    '& img': {
                      objectFit: 'contain', 
                      width: '100%',
                      height: '100%',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Второй ряд: Gold + Platinum */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: { xs: 2, sm: 3 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              <Box
                sx={{
                  aspectRatio: '4/5', 
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/assets/images/vipclub/gold-mb.png"
                  sx={{
                    width: 1,
                    height: 1,
                    '& img': {
                      objectFit: 'contain', 
                      width: '100%',
                      height: '100%',
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  aspectRatio: '4/5', 
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/assets/images/vipclub/platinum-mb.png"
                  sx={{
                    width: 1,
                    height: 1,
                    '& img': {
                      objectFit: 'contain', 
                      width: '100%',
                      height: '100%',
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Третий ряд: Diamond */}
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                width: '100%', 
              }}
            >
              <Image
                src="/assets/images/vipclub/diamond-mb.png"
                sx={{
                  width: 1,
                  height: 1,
                  '& img': {
                    objectFit: 'contain', 
                    width: '100%',
                    height: '100%',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* How to Qualify Section */}
      <Box sx={{ mt: { xs: 6, sm: 7, md: 8 } }}>
        <Box
          sx={{
            position: 'relative',
            width: 1,
            height: { xs: 500, sm: 600, md: 500 },
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          {/* Background Image - Desktop */}
          <Image
            src="/assets/images/vipclub/vip-invite.png"
            sx={{
              width: 1,
              height: 1,
              display: { xs: 'none', lg: 'block' },
              '& img': { 
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              },
            }}
          />

          {/* Background Image - Laptop */}
          <Image
            src="/assets/images/vipclub/vip-invite-laptop.png"
            sx={{
              width: 1,
              height: 1,
              display: { xs: 'none', md: 'block', lg: 'none' },
              '& img': { 
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              },
            }}
          />
          
          {/* Background Image - Mobile */}
          <Image
            src="/assets/images/vipclub/vip-invite-mb.png"
            sx={{
              width: 1,
              height: 1,
              display: { xs: 'block', md: 'none' },
              '& img': { 
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              },
            }}
          />

          {/* VIP Ticket Image - Desktop and Laptop only */}
          <Box
            sx={{
              position: 'absolute',
              right: { md: 48, lg: 64 },
              top: { md: '50%', lg: '50%' },
              transform: { md: 'translateY(-50%)', lg: 'translateY(-50%)' },
              width: { md: 350, lg: 390 },
              height: { md: 280, lg: 320 },
              display: { xs: 'none', md: 'block' },
              zIndex: 2,
            }}
          >
            <Image
              src="/assets/images/vipclub/vip-tiket.png"
              sx={{
                width: 1,
                height: 1,
                '& img': {
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                },
              }}
            />
          </Box>

          {/* Text Content - Desktop: left, Mobile: bottom lower */}
          <Stack
            sx={{
              position: 'absolute',
             
              left: { xs: 0, md: 48, lg: 64 },
              top: { xs: 'auto', md: 48, lg: 64 },
              bottom: { xs: '2%', md: 'auto' },
              right: { xs: 0, md: 48, lg: 64 },
              width: { xs: '100%', md: 'auto' },
              maxWidth: { xs: '100%', md: '45%' },
              maxHeight: { xs: '60%', sm: '60%', md: '50%', lg: '60%' },
             
              px: { xs: 4, sm: 5, md: 0 },
              py: { xs: 2, sm: 3, md: 0 },
              gap: { xs: 1, sm: 1.5, md: 1.5, lg: 2 },
              justifyContent: { xs: 'center', md: 'flex-start' },
              alignItems: { xs: 'center', md: 'flex-start' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {/* Main Title */}
            <StyledTitle
              variant="h2"
              sx={{
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2rem', lg: '2.8rem', xl: '3.2rem' },
                lineHeight: 1.1,
                whiteSpace: { xs: 'nowrap', md: 'normal' },
              }}
            >
              <Box component="span" sx={{ color: '#FFFFFF' }}>How to </Box>
              <Box 
                component="span" 
                sx={{ 
                  color: '#24ee89',
                  display: { xs: 'inline', md: 'block' },
                }}
              >
                Qualify
              </Box>
            </StyledTitle>

            {/* Subtitle with yellow background */}
            <Box
              sx={{
                bgcolor: '#24ee89',
                px: { xs: 2, sm: 2.5, md: 1.5, lg: 2 },
                py: { xs: 0.75, sm: 1, md: 0.5, lg: 0.75 },
                borderRadius: 1,
                display: 'inline-block',
                alignSelf: { xs: 'center', md: 'flex-start' },
              }}
            >
              <StyledSubtitle
                variant="h4"
                sx={{
                  color: '#050514',
                  fontSize: { xs: '1rem', sm: '1.3rem', md: '1rem', lg: '1.4rem', xl: '1.6rem' },
                  lineHeight: 1.1,
                }}
              >
                The Prestige Circle is invitation-based
              </StyledSubtitle>
            </Box>

            {/* Description */}
            <StyledDescription
              variant="body1"
              sx={{
                color: '#FFFFFF',
                fontSize: { xs: '0.9rem', sm: '1rem', md: '0.85rem', lg: '1rem', xl: '1.1rem' },
                lineHeight: 1.4,
                maxWidth: '100%',
              }}
            >
              Our VIP team regularly reviews player engagement, activity, and loyalty to identify candidates. Play consistently, bet smartly, and you might receive a personal invite to enter the Circle.
            </StyledDescription>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
}
