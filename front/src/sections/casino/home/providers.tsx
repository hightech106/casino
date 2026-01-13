/* eslint-disable no-nested-ternary */
// react
import { useCallback, useMemo } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useLocales } from 'src/locales';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// components
import type { ICasinoProvider } from 'src/types';
import Image from 'src/components/image';
import ProvidersAry from './providers.json';


// ----------------------------------------------------------------------

interface ProvidersProps {
  selectedProvider: ICasinoProvider | null;
  setSelectedProvider: (provider: ICasinoProvider | null) => void;
  providers: ICasinoProvider[];
  onClose: () => void;
}

const Providers = ({
  selectedProvider,
  setSelectedProvider,
  providers,
  onClose,
}: ProvidersProps) => {
  const { currentLang } = useLocales();
  const isMobile: boolean = useMediaQuery('(max-width:520px)');
  const router = useRouter();

  const filteredProviders = useMemo(() => 
  ProvidersAry.filter((provider) =>
    providers.some((p) => p.value.toLowerCase() === provider.name.toLowerCase().replace(/\s/g, '-'))
  ), [providers]);

  const handleProviderClick = (providerName: string) => {
    const selected = providers.find(
      (p) => p.value.toLowerCase() === providerName.toLowerCase().replace(/\s/g, '-')
    );
    if (selected) {
      setSelectedProvider(selected);
      router.push(`/${currentLang.value}${paths.casino.root}/${selected.value}`);
    }
    onClose();
  };

  const getBackgroundColor = useCallback((isSelected: boolean): string => 
  isMobile ? '#664401' : isSelected ? '#CAAE51' : 'transparent'
, [isMobile]);

  const gridLayout = useMemo(() => {
  const length = filteredProviders.length;
  const columns = Math.ceil(Math.sqrt(length));
  const rows = Math.ceil(length / columns);
  return { columns, rows };
}, [filteredProviders.length]);

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: isMobile ? '70vh' : '90vh',
        overflowY: isMobile ? 'auto' : 'hidden',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: isMobile ? '8px' : 0,
        },
        '&::-webkit-scrollbar-track': {
          background: '#232626',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CAAE51',
          borderRadius: '4px',
        },
      }}
    >
      <Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(4, minmax(0, 1fr))',
      md: `repeat(${gridLayout.columns}, minmax(0, 1fr))`,
    },
    gridTemplateRows: {
      xs: 'repeat(7, auto)',
      md: `repeat(${gridLayout.rows}, auto)`,
    },
    gap: 1,
    p: 1,
    width: '100%',
  }}
>
  {filteredProviders.map((item) => {
    const isSelected = providers.some(
      (p) =>
        p.value.toLowerCase() === item.name.toLowerCase().replace(/\s/g, '-') &&
        p.value === selectedProvider?.value
    );

    return (
      <Stack
        key={item.name}
        alignItems="center"
        justifyContent="center"
        sx={{
          cursor: 'pointer',
          bgcolor: getBackgroundColor(isSelected),
          borderRadius: 1,
          transition: 'background-color 0.3s ease',
          aspectRatio: '1 / 1',
          width: '100%',
          height: isMobile ? 'auto' : '100px',
          p: 1,
          '&:hover': {
            bgcolor: '#CAAE51',
          },
        }}
        onClick={() => handleProviderClick(item.name)}
      >
        <Image
          src={item.image}
          sx={{
            width: isMobile ? 50 : 70,
            height: isMobile ? 50 : 70,
            '& img': {
              objectFit: 'contain',
              width: '100%',
              height: '100%',
            },
          }}
        />
      </Stack>
    );
  })}
</Box>
    </Box>
  );
};

export default Providers;
