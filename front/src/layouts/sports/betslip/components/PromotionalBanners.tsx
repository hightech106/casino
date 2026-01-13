import { Box, Stack, Typography, Card } from '@mui/material';

interface PromotionalBannerProps {
  id: string;
  title: string;
  subtitle: string;
  actionText: string;
  cardSuit: string;
}

const banners: PromotionalBannerProps[] = [
  {
    id: 'spades',
    title: 'DAILY WHEEL',
    subtitle: 'GET FREE DAILY WHEEL NOW!',
    actionText: 'REGISTER →',
    cardSuit: 'A♠'
  },
  {
    id: 'hearts',
    title: 'DAILY WHEEL',
    subtitle: 'GET FREE DAILY WHEEL NOW!',
    actionText: 'REGISTER →',
    cardSuit: 'A♥'
  },
  {
    id: 'diamonds',
    title: 'DAILY WHEEL',
    subtitle: 'GET FREE DAILY WHEEL NOW!',
    actionText: 'REGISTER →',
    cardSuit: 'A♦'
  }
];

export default function PromotionalBanners() {
  const renderCardIcon = (suit: string) => (
    <Box
      sx={{
        width: 60,
        height: 60,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Playing Cards */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 20,
          height: 28,
          bgcolor: 'white',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#000',
        }}
      >
        {suit}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 8,
          width: 20,
          height: 28,
          bgcolor: 'white',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#000',
        }}
      >
        {suit}
      </Box>
      {/* Gold Chips */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: 12,
          width: 16,
          height: 16,
          bgcolor: '#FFD700',
          borderRadius: '50%',
          border: '2px solid #FFA500',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 12,
          width: 12,
          height: 12,
          bgcolor: '#FFD700',
          borderRadius: '50%',
          border: '2px solid #FFA500',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 24,
          width: 14,
          height: 14,
          bgcolor: '#FFD700',
          borderRadius: '50%',
          border: '2px solid #FFA500',
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 2, borderTop: '1px solid #2B2F3D' }}>
      <Stack
        spacing={2}
        sx={{
          display: { xs: 'none', lg: 'flex' }, // Hide on mobile to save space
        }}
      >
        {banners.map((banner) => (
          <Card
            key={banner.id}
            sx={{
              p: 2,
              bgcolor: '#2B2F3D',
              borderRadius: 1,
              border: '1px solid #3A3F4F',
              '&:hover': {
                borderColor: '#24ee89',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(138, 43, 226, 0.1)',
              },
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ color: 'white', fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}
                >
                  <Box component="span" sx={{ color: 'white' }}>
                    DAILY
                  </Box>{' '}
                  <Box component="span" sx={{ color: '#24ee89' }}>
                    WHEEL
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', mb: 0.5 }}>
                  {banner.subtitle}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem' }}>
                  {banner.actionText}
                </Typography>
              </Box>
              {renderCardIcon(banner.cardSuit)}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
