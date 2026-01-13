// @mui
import { Avatar, Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import type { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

type BetCardSkeletonProps = StackProps & {
  variant?: 'vertical' | 'horizontal';
};

export default function BetCardSkeleton({
  variant = 'vertical',
  sx,
  ...other
}: BetCardSkeletonProps) {
  // if (variant === 'horizontal') {
  //   return (
  //     <Stack
  //       component={Paper}
  //       direction="row"
  //       variant="outlined"
  //       sx={{
  //         borderRadius: 2,
  //         ...sx,
  //       }}
  //       {...other}
  //     >
  //       <Stack spacing={2} flexGrow={1} sx={{ p: 3 }}>
  //         <Stack direction="row" alignItems="center" justifyContent="space-between">
  //           <Skeleton variant="circular" sx={{ width: 40, height: 40 }} />
  //           <Skeleton sx={{ width: 24, height: 12 }} />
  //         </Stack>

  //         <Skeleton sx={{ width: 1, height: 10 }} />
  //         <Skeleton sx={{ width: `calc(100% - 40px)`, height: 10 }} />
  //         <Skeleton sx={{ width: `calc(100% - 80px)`, height: 10 }} />
  //       </Stack>

  //       <Stack sx={{ p: 1 }}>
  //         <Skeleton sx={{ width: 170, height: 240, flexShrink: 0 }} />
  //       </Stack>
  //     </Stack>
  //   );
  // }

  return (
    <Card
      sx={{
        mb: 1,
        px: { xs: 1, sm: 5 },
        py: { xs: 0.5, sm: 2.5 },
        margin: '0 7px',
        width: '100%',
        background: '#094045',
        borderRadius: '10px',
        ...sx,
      }}
    >
      <CardHeader
        sx={{
          p: 1.5,
        }}
        title={
          <Stack flexDirection="row" justifyContent="center" alignItems="center">
            <Skeleton sx={{ width: 0.6, height: 25 }} />
          </Stack>
        }
      />
      <CardContent sx={{ p: { xs: 0, sm: 1.25 } }}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Skeleton variant="circular" sx={{ width: 100, height: 100 }} />
          <Skeleton variant="circular" sx={{ width: 65, height: 65 }} />
          <Skeleton variant="circular" sx={{ width: 100, height: 100 }} />
        </Stack>

        <Stack
          flexDirection="row"
          justifyContent="space-between"
          sx={{
            alignItems: 'center',
            gap: '30px',
            '& .MuiSkeleton-root': {
              width: 1,
              height: 80,
              borderRadius: 0.5,
              flexDirection: 'column',
            },
          }}
        >
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Stack>
      </CardContent>
    </Card>
  );
}
