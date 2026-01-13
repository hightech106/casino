// @mui
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Skeleton,
} from '@mui/material';

export default function MyBetsSportsSkeleton() {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ borderRadius: 0.5 }}>
        <CardHeader
          sx={{ py: 2, bgcolor: '#2B2F3D' }}
          title={
            <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
              <Stack flexDirection="row" alignItems="center" gap={1}>
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton width={40} height={20} />
              </Stack>
              <Skeleton width={100} height={20} />
            </Stack>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <Box px={2} pt={2}>
            <Stack direction="row" justifyContent="space-between">
              <Stack gap={1}>
                <Skeleton width={80} height={18} />
                <Skeleton width={85} height={18} />
                <Skeleton width={65} height={18} />
              </Stack>
              <Stack gap={1}>
                <Skeleton width={20} height={18} />
                <Skeleton width={20} height={18} />
                <Skeleton width={20} height={18} />
              </Stack>
            </Stack>
          </Box>
          <Stack width={1} flexDirection="row" justifyContent="space-between" mt={1.8} px={2}>
            <Button variant="outlined" color="primary" size="small">
              <Skeleton width={30} height={20} />
            </Button>
            <Skeleton variant="circular" width={20} height={20} />
          </Stack>

          <Divider sx={{ my: 1 }} />
        </CardContent>
      </Card>
    </Grid>
  );
}
