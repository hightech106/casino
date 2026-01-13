import { useEffect, useState, useMemo, useCallback } from 'react';
import { styled, alpha } from '@mui/material/styles';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  Typography,
  LinearProgress,
  Box,
  InputBase,
} from '@mui/material';
import type { LinearProgressProps } from '@mui/material/LinearProgress';
import { useLocales } from 'src/locales';
import Image from 'src/components/image';
import { useResponsive } from 'src/hooks/use-responsive';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { getImageUrl } from 'src/utils';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--Grey-Text, #A0A3A7)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'var(--Grey-Text, #A0A3A7)',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    '&::placeholder': {
      color: 'var(--Grey-Text, #A0A3A7)',
      opacity: 1,
    },
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

interface Props {
  title?: string;
  open: boolean;
  onClose: () => void;
  games: any;
  playGame: (type: string, provider_code: string, game_code: string, game_name: string) => void;
}

export default function ViewGameModal({ title, open, onClose, games, playGame }: Props) {
  const { t } = useLocales();
  const isMobile = useResponsive('down', 'md');

  const [progress, setProgress] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (!games.length) {
      setPage(0);
      setProgress(0);
      setSearch('');
    } else {
      setPage(40);
      setSearch('');
      const percent = 100 / (games.length || 1);
      setProgress(games.length > 40 ? percent * 40 : 100);
    }
  }, [games]);

  const filteredGames = useMemo(
    () =>
      games?.filter((event: any) => event.game_name.toLowerCase().includes(search.toLowerCase())) ||
      [],
    [games, search]
  );

  const LinearProgressWithLabel = useCallback(
    (props: LinearProgressProps & { value: number }) => (
      <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: 0.45, sm: 0.25 } }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{
              backgroundColor: 'var(--Grey-Text, #A0A3A7)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#24ee89',
              },
            }}
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            <span style={{ color: 'white' }}>{page}</span> /{' '}
            <span style={{ color: 'var(--Grey-Text, #A0A3A7)' }}>{filteredGames.length}</span>
          </Typography>
        </Box>
      </Box>
    ),
    [page, filteredGames]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 0.5,
          maxWidth: 1,
          width: { xs: 1, sm: 0.7 },
          backgroundColor: 'transparent',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {title || 'Games'}

        <Search>
          <SearchIconWrapper>
            <Iconify icon="f7:search" />
          </SearchIconWrapper>
          <StyledInputBase
            maxRows={1}
            value={search}
            placeholder="Search…"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: 'transparent' }}>
        <Stack direction="row" flexWrap="wrap" justifyContent="space-around">
          {filteredGames.slice(0, page).map((game: any, index: number) => (
            <Paper
              component={Stack}
              key={index}
              sx={{
                m: 1,
                mb: 2.5,
                p: 1,
                width: 125,
                cursor: 'pointer',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
              onClick={() =>
                playGame(game.type, game.provider_code, game.game_code, game.game_name)
              }
              className="luckverse777-card"
            >
              <Image
                src={getImageUrl(game.banner)}
                sx={{ width: 112, height: 145, borderRadius: 1 }}
                className="img3d"
              />
              <Typography
                fontSize={12}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {game.game_name}
              </Typography>
              <Typography fontSize={10} color="text.disabled" textTransform="capitalize">
                {game.details.vendor.replaceAll('-', ' ')}
              </Typography>
            </Paper>
          ))}
        </Stack>
        {!filteredGames.length && <EmptyContent title={t('no_data')} sx={{ py: 10 }} />}
        {filteredGames.length > page && (
          <Stack
            sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}
            className="view-more"
          >
            <LinearProgressWithLabel value={progress} />
            <Button
              variant="outlined"
              sx={{
                gap: 1,
                color: 'var(--Grey-Text, #A0A3A7)',
                borderColor: 'transparent',
                backgroundColor: 'transparent',
                '&:hover': {
                  color: 'var(--Grey-Text, #A0A3A7)',
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  boxShadow: 'none',
                },
              }}
              onClick={() => setPage(page + 40)}
            >
              <Stack direction="column" alignItems="center">
                <Typography
                  sx={{
                    fontFamily: '"FONTSPRING DEMO - Blunt Con It"',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: 16,
                    lineHeight: '100%',
                    letterSpacing: '5%',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    color: 'var(--Grey-Text, #A0A3A7)',
                  }}
                >
                  {!isMobile ? t('view_more') : t('more')}
                </Typography>
                <Iconify icon="mingcute:down-line" sx={{ color: '#929599' }} />
              </Stack>
            </Button>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'transparent' }}>
        <Button onClick={onClose} sx={{ color: 'white' }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
