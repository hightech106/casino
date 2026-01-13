import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function PaymentConfirmation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  const isSuccess = status === 'COMPLETED';

  return (
    <Container
      maxWidth="sm"
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Card sx={{ bgcolor: '#2B2F3D' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Box>
            {isSuccess ? (
              <Iconify icon="mdi:check-circle" color="#24ee89" width={100} height={100} />
            ) : (
              <Iconify icon="mdi:close-circle" color="red" width={100} height={100} />
            )}
          </Box>
          <Typography variant="h4" sx={{ mt: 2 }}>
            {isSuccess
              ? 'Thank you, your payment was successful!'
              : "The payment didn't go through"}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
