// @mui
import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import type { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

type BetOptionSkeletonProps = StackProps & {
  variant?: 'vertical' | 'horizontal';
};

export default function BetOptionSkeleton({
  variant = 'vertical',
  sx,
  ...other
}: BetOptionSkeletonProps) {
  return (
    <Card
      sx={{
        height: 130,
        borderRadius: 0.5,
      }}
    >
      <CardHeader
        sx={{
          py: 2,
          px: 1.5,
        }}
        title={
          <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
            <Skeleton sx={{ width: 0.5, height: 25 }} />
            <Skeleton sx={{ width: 25, height: 25 }} />
          </Stack>
        }
      />
      <CardContent sx={{ p: 1, borderTop: '1px solid #8080805e' }}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Skeleton sx={{ width: 1, height: 51, borderRadius: 0.5 }} />
          <Skeleton sx={{ width: 1, height: 51, borderRadius: 0.5 }} />
          <Skeleton sx={{ width: 1, height: 51, borderRadius: 0.5 }} />
        </Stack>
      </CardContent>
    </Card>
  );
}
