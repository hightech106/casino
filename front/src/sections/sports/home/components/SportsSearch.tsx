import type { ChangeEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useLocales } from 'src/locales';
import {
  Stack,
  Select,
  Paper,
  MenuItem,
  InputBase,
  Typography,
  IconButton,
  FormControl,
} from '@mui/material';
import Iconify from 'src/components/iconify';

interface SportsSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  startIn: 'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL';
  onStartInChange: (value: 'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL') => void;
}

export default function SportsSearch({
  search,
  onSearchChange,
  startIn,
  onStartInChange,
}: SportsSearchProps) {
  const { t, currentLang } = useLocales();

  const handleChangeStartIn = (event: SelectChangeEvent<'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL'>) => {
    onStartInChange(event.target.value as 'PRE' | 'TODAY' | 'HOUR' | 'LIVE' | 'ALL');
  };

  return (
    <Stack
      sx={{
        gap: 1,
        width: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: { xs: "stretch", sm: 'center' },
      }}
    >
      <FormControl sx={{ minWidth: 171, position: 'relative' }} color="primary">
        <Typography sx={{ position: 'absolute', fontSize: 14, opacity: 0.8, top: 18, left: 10 }}>
          {t("starts_in")}:
        </Typography>
        <Select
          value={startIn}
          onChange={handleChangeStartIn}
          sx={{ pl: currentLang.value === "en" ? 9 : 15 }}
          color="primary"
        >
          <MenuItem value="ALL" color="primary">
            {t("all") || "All"}
          </MenuItem>
          <MenuItem value="LIVE" color="primary">
            {t("live") || "Live"}
          </MenuItem>
          <MenuItem value="HOUR" color="primary">
            1 {t("hour")}
          </MenuItem>
          <MenuItem value="TODAY" color="primary">
            24 {t("hour")}
          </MenuItem>
          <MenuItem value="PRE" color="primary">
            {t("future")}
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: { xs: 1, sm: 300 }, height: 1 }}>
          <IconButton sx={{ p: '10px' }} aria-label="menu">
            <Iconify icon="mdi:search" />
          </IconButton>
          <InputBase
            value={search}
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("search_event")}
            onChange={(e) => onSearchChange(e.target.value)}
            inputProps={{ 'aria-label': 'search event' }}
          />
        </Paper>
      </FormControl>
    </Stack>
  );
} 