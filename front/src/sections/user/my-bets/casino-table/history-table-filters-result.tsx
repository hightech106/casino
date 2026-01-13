// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { StackProps } from '@mui/material/Stack';
import { useLocales } from 'src/locales';
// types
import type { ICasinoTableFilters, ICasinoTableFilterValue } from 'src/types';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: ICasinoTableFilters;
  onFilters: (name: string, value: ICasinoTableFilterValue) => void;
  //
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function HistoryTableFiltersResult({
  filters,
  onFilters,
  //
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const { t } = useLocales();

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const handleRemoveRole = (inputValue: string) => {
    const newValue = filters.category.filter((item) => item !== inputValue);
    onFilters('category', newValue);
  };

  return (
    <Stack 
      spacing={2} 
      sx={{ 
        bgcolor: '#2B2F3D',
        p: 3,
        borderBottom: '1px solid #3A3F50'
      }} 
      {...other}
    >
      <Box sx={{ 
        typography: 'body2',
        color: '#FFFFFF',
        fontWeight: 600
      }}>
        <Box component="span" sx={{ color: '#24ee89', fontSize: '16px', fontWeight: 700 }}>
          {results}
        </Box>
        <Box component="span" sx={{ color: '#FFFFFF', ml: 0.5, opacity: 0.8 }}>
          {t("results_found")}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={2} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label={`${t("status")}:`}>
            <Chip 
              size="small" 
              label={filters.status} 
              onDelete={handleRemoveStatus}
              sx={{
                bgcolor: '#24ee89',
                color: '#000',
                fontWeight: 600,
                '& .MuiChip-deleteIcon': {
                  color: '#000',
                  '&:hover': {
                    color: '#FF4444'
                  }
                }
              }}
            />
          </Block>
        )}

        {!!filters.category.length && (
          <Block label={`${t("category")}:`}>
            {filters.category.map((item) => (
              <Chip 
                key={item} 
                label={item} 
                size="small" 
                onDelete={() => handleRemoveRole(item)}
                sx={{
                  bgcolor: '#24ee89',
                  color: '#000',
                  fontWeight: 600,
                  '& .MuiChip-deleteIcon': {
                    color: '#000',
                    '&:hover': {
                      color: '#FF4444'
                    }
                  }
                }}
              />
            ))}
          </Block>
        )}

        <Button
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          sx={{
            bgcolor: '#FF4444',
            color: '#FFFFFF',
            fontWeight: 600,
            textTransform: 'uppercase',
            borderRadius: '8px',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#CC3333',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          {t("clear")}
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1.5}
      direction="row"
      sx={{
        p: 1.5,
        borderRadius: '8px',
        overflow: 'hidden',
        borderStyle: 'dashed',
        borderColor: '#24ee89',
        bgcolor: 'rgba(138, 43, 226, 0.1)',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ 
        typography: 'subtitle2',
        color: '#24ee89',
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
