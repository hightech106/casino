import React, { forwardRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { CardProps } from '@mui/material/Card';
import { useLocales } from 'src/locales';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';

interface Props extends CardProps {
  onCrypto: () => void;
  onClose: () => void;
  onFiat: (type: string) => void;
}

const SelectModal = forwardRef(
  ({ onCrypto, onClose, onFiat }: Props, ref: React.Ref<HTMLDivElement>) => {
    const { t } = useLocales();

    return (
      <div ref={ref} tabIndex={-1}>
        <Card
          sx={{
            position: 'absolute',
            width: { xs: 1, sm: 400, lg: 450 },
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CardHeader
            title={t('select_option')}
            action={
              <IconButton onClick={onClose}>
                <Iconify icon="mdi:close" />
              </IconButton>
            }
            sx={{ py: 2 }}
          />
          <CardContent sx={{ mb: 2, pt: 0 }}>
            <Stack gap={3}>
              {/* <Card
              component={Button}
              sx={{ p: 3, height: 118, fontSize: 24, justifyContent: "space-between", textAlign: "left" }}
              onClick={() => onFiat("fiat")}
            >
              <Box>
                <Box fontSize={22} >
                  {t("payment_methods")}
                </Box>
                <Typography variant='subtitle2' sx={{ opacity: 0.5 }}>
                  SEPA, INTERAC, CARD ...
                </Typography>

              </Box>
              <Iconify icon="formkit:usdc"
                sx={{
                  mr: -1,
                  mt: -4,
                  width: 36,
                  height: 36,
                  color: `warning.main`
                }} />
              <Box
                sx={{
                  top: -44,
                  width: 160,
                  zIndex: -1,
                  height: 160,
                  right: -104,
                  opacity: 0.5,
                  borderRadius: 3,
                  position: "absolute",
                  transform: "rotate(40deg)",
                  background: "linear-gradient(to right, #FFAB00 0%, rgba(255 171 0 / 0) 100%)",
                }} />
            </Card> */}

              <Card
                component={Button}
                sx={{
                  p: 3,
                  height: 118,
                  fontSize: 24,
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  bgcolor: '#2B2F3D',
                  color: '#FFFFFF',
                  border: '1px solid rgba(189, 200, 240, 0.12)',
                  '&:hover': {
                    bgcolor: '#323645',
                  },
                }}
                onClick={onCrypto}
              >
                <Box>
                  <Box fontSize={22}>{t('crypto')}</Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.5 }}>
                    BTC, ETH, LTC ...
                  </Typography>
                </Box>
                <Iconify
                  icon="simple-icons:tether"
                  sx={{
                    mr: -1,
                    mt: -4,
                    width: 36,
                    height: 36,
                    color: '#24ee89',
                  }}
                />
                <Box
                  sx={{
                    top: -44,
                    width: 160,
                    zIndex: -1,
                    height: 160,
                    right: -104,
                    opacity: 0.15,
                    borderRadius: 3,
                    position: 'absolute',
                    transform: 'rotate(40deg)',
                    background: 'linear-gradient(to right, #24ee89 0%, #24ee89 100%)',
                  }}
                />
              </Card>

              <Card
                component={Button}
                sx={{
                  p: 3,
                  height: 118,
                  fontSize: 24,
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  bgcolor: '#2B2F3D',
                  color: '#FFFFFF',
                  border: '1px solid rgba(189, 200, 240, 0.12)',
                  '&:hover': {
                    bgcolor: '#323645',
                  },
                }}
                onClick={() => onFiat('card')}
              >
                <Box>
                  <Box fontSize={22}>{t('card')}</Box>
                  <Typography variant="subtitle2" sx={{ opacity: 0.5 }}>
                    CARD ...
                  </Typography>
                </Box>
                <Iconify
                  icon="solar:card-bold-duotone"
                  sx={{
                    mr: -1,
                    mt: -4,
                    width: 36,
                    height: 36,
                    color: '#24ee89',
                  }}
                />
                <Box
                  sx={{
                    top: -44,
                    width: 160,
                    zIndex: -1,
                    height: 160,
                    right: -104,
                    opacity: 0.15,
                    borderRadius: 3,
                    position: 'absolute',
                    transform: 'rotate(40deg)',
                    background: 'linear-gradient(to right, #24ee89 0%, #24ee89 100%)',
                  }}
                />
              </Card>
            </Stack>
          </CardContent>
        </Card>
      </div>
    );
  }
);

export default SelectModal;
