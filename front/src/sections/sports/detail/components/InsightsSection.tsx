import { Box, Stack, Typography, Chip } from '@mui/material';

// ----------------------------------------------------------------------

interface Insight {
  title: string;
  description: string;
  odds: string[];
  selected: string;
  type: string;
}

interface InsightsSectionProps {
  insights: Insight[];
}

export default function InsightsSection({ insights }: InsightsSectionProps) {
  return (
    <Box>
      <Stack direction="row" spacing={3} sx={{ pb: 2, mb: 2, overflowX: 'auto' }}>
        {insights.map((insight, index) => (
          <Box
            key={index}
            sx={{
              minWidth: 300,
              maxWidth: 320,
              width: '100%',
              p: 1.5,
              bgcolor: '#393E51',
              borderRadius: 1,
              border: '1px solid #3A3D4A',
              display: 'flex',
              flexDirection: 'column',
              flex: '0 0 auto',
              height: '200px', // Fixed height for consistency
              justifyContent: 'space-between',
            }}
          >
            <Chip
              label="INSIGHTS"
              sx={{
                color: '#232626',
                bgcolor: '#24ee89',
                mb: 2,
                fontWeight: '600',
                fontSize: '10px !important',
                width: 'fit-content',
              }}
            />
            <Typography variant="h6" sx={{ color: 'grey', mb: 2, fontWeight: 600 }}>
              {insight.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                mb: 2,
                fontSize: '0.8rem',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                flex: '1 1 auto',
                minHeight: '60px', // Ensure minimum height for consistency
              }}
            >
              {insight.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
