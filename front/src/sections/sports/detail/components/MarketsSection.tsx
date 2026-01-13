import { Stack, Box, Typography } from '@mui/material';
import type { ISportsEvent } from 'src/types';
import SoccerBetOption from '../bet-soccer-option';
import MarketNavigation from './MarketNavigation';

// ----------------------------------------------------------------------

interface MarketsSectionProps {
  realMarkets: any[];
  filteredMarkets: any[];
  marketCategories: { [key: string]: number };
  activeMarketTab: string;
  onTabChange: (tab: string) => void;
  event: ISportsEvent;
  marketLang: any;
}

export default function MarketsSection({
  realMarkets,
  filteredMarkets,
  marketCategories,
  activeMarketTab,
  onTabChange,
  event,
  marketLang,
}: MarketsSectionProps) {
  return (
    <Box>
      {/* Market Navigation */}
      <MarketNavigation
        marketCategories={marketCategories}
        activeMarketTab={activeMarketTab}
        onTabChange={onTabChange}
      />

      <Stack spacing={1}>
        {realMarkets.length === 0 ? (
          <Box
            sx={{
              bgcolor: '#393E51',
              borderRadius: 1,
              p: 4,
              textAlign: 'center',
              border: '1px solid #3A3D4A',
            }}
          >
            <Typography variant="h6" sx={{ color: '#A0A3A7', mb: 1 }}>
              No Odds Available
            </Typography>
            <Typography variant="body2" sx={{ color: '#5A5D68' }}>
              Betting markets for this match are not available yet. Please check back later.
            </Typography>
          </Box>
        ) : (
          filteredMarkets.map((market: any, index: number) => (
            <SoccerBetOption key={index} event={event} marketLang={marketLang} bets={market} />
          ))
        )}
      </Stack>
    </Box>
  );
}
