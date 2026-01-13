import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useLocales } from 'src/locales';
// types
import type { ITxTableFilters } from 'src/types';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  filters: ITxTableFilters;
  onFilters: (name: string, value: string | string[]) => void;
  //
  coinOptions: string[];
};

export default function HistoryTableToolbar({
  filters,
  onFilters,
  //
  coinOptions,
}: Props) {

  const { t } = useLocales();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('paymentId', event.target.value);
    },
    [onFilters]
  );

  const handleFilter = useCallback(
    (event: SelectChangeEvent<string[]>) => {
      onFilters(
        'coin',
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
      );
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          py: 2.5,
        }}
      >
        <FormControl
          sx={{
            flexShrink: 0,
            width: { xs: 1, md: 200 },
          }}
        >
          <InputLabel>{t("coin")}</InputLabel>

          <Select
            multiple
            value={filters.coin}
            onChange={handleFilter}
            input={<OutlinedInput label={t("coin")} />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            sx={{
              bgcolor: '#232626', 
              color: '#FFFFFF', 
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(189,200,240,0.2)'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#24ee89',
              },
              '& .MuiInputLabel-root': {
                color: '#24ee89',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#1E212B', 
                  '& .MuiMenuItem-root': {
                    color: '#FFFFFF', 
                    '&:hover': {
                      bgcolor: '#2B2F3D', 
                    },
                    '&.Mui-selected': {
                      bgcolor: '#2B2F3D', 
                      color: '#FFFFFF',
                    },
                  },
                  '& .MuiCheckbox-root': {
                    color: '#24ee89', 
                  },
                },
              },
            }}
          >
            {coinOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox disableRipple size="small" checked={filters.coin.includes(option)} />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.paymentId}
            onChange={handleFilterName}
            placeholder={`${t("search_id")}...`}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#232626',
                color: '#FFFFFF',
                '& fieldset': {
                  borderColor: 'rgba(189,200,240,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#24ee89',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#24ee89',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>

    </>
  );
}
