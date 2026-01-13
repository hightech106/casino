import { useEffect, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import {
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Chip,
} from '@mui/material';
// components
import Iconify from 'src/components/iconify';

// store
import { useSelector } from 'src/store';
// hooks
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import TextMaxLine from 'src/components/text-max-line';
import EmptyContent from 'src/components/empty-content';
// utils
import { fDateTime } from 'src/utils/format-time';
// config
import { _bookingNew } from 'src/_mock';
import { API_URL } from 'src/config-global';

interface TicketProps {
  _id: string;
  number: string;
  player: string;
  agent: {
    avatar: string;
    username: string;
    email: string;
  };
  description: string;
  image: string;
  category: string;
  status: string;
  resolution: string;
  priority: string;
  createdAt: string;
}

const TicketList = () => {
  const { t } = useLocales();
  const { get_tickets } = useApi();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [tickets, setTickets] = useState<TicketProps[]>([]);
  const [selected, setSelected] = useState<TicketProps | null>(null);

  const getTickets = async () => {
    setLoading(true);
    const res = await get_tickets();
    setLoading(false);
    if (!res?.data) return;
    setTickets(res?.data);
  };

  useEffect(() => {
    if (!user) return;
    getTickets();
    // eslint-disable-next-line
  }, [user]);

  const onSelect = (data: TicketProps) => {
    setSelected(data);
  };

  const onClose = () => {
    setSelected(null);
  };

  if (loading) return <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '18px' }} />;

  if (!tickets.length)
    return (
      <EmptyContent
        title={t('no_data')}
        sx={{
          py: 10,
          height: '65vh',
        }}
      />
    );

  return (
    <>
      <Stack
        sx={{
          py: 2,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 3,
          ...(tickets.length > 2 && {
            justifyContent: 'space-around',
          }),
        }}
      >
        {tickets.map((item) => (
          <TicketCard key={item._id} item={item} onSelect={() => onSelect(item)} />
        ))}
      </Stack>
      <Dialog open={!!selected} onClose={onClose} aria-labelledby="ticket-dialog">
        <DialogTitle id="ticket-dialog">{t('ticket')}</DialogTitle>
        <DialogContent>
          <Typography variant="h6" mt={2}>
            {t('description')}
          </Typography>
          <DialogContentText>{selected?.description}</DialogContentText>
          <Typography variant="h6" mt={2}>
            {t('priority')}
          </Typography>
          <DialogContentText>{selected?.priority}</DialogContentText>
          <Typography variant="h6" mt={2}>
            {t('resolution')}
          </Typography>
          <DialogContentText>{selected?.resolution}</DialogContentText>
          {selected?.image && (
            <Stack justifyContent="center" alignItems="center">
              <Image src={`${API_URL}/${selected?.image}`} mt={2} sx={{ maxHeight: 350 }} />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined" color="info">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// ----------------------------------------------------------------------

type TicketCardProps = {
  item: TicketProps;
  onSelect: () => void;
};

function TicketCard({ item, onSelect }: TicketCardProps) {
  const { t } = useLocales();
  const { agent, description, createdAt, number, status, category } = item;

  return (
    <Paper
      sx={{
        width: 300,
        maxWidth: 300,
        borderRadius: 2,
        position: 'relative',
        cursor: 'pointer',
        bgcolor: '#2B2F3D',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, #24ee89 0%, transparent 100%)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '1px',
          background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        },
      }}
      onClick={onSelect}
    >
      <Stack
        spacing={2}
        sx={{
          px: 2,
          pb: 1,
          pt: 2.5,
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1}>
            <Label variant="filled" color="primary" sx={{ minWidth: 'auto', alignSelf: 'flex-start' }}>
              {status}
            </Label>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar alt={agent.username} src={`${API_URL}/${agent.avatar}`} />
              <ListItemText
                primary={agent.username}
                secondary={fDateTime(createdAt)}
                secondaryTypographyProps={{
                  mt: 0.5,
                  component: 'span',
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />
            </Stack>
          </Stack>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/assets/icons/chat/ticket/ticket.svg" 
              alt="ticket" 
              style={{ width: 32, height: 32 }}
            />
          </Box>
        </Stack>

        <Typography textAlign="center" variant="h5" sx={{ color: '#24ee89', fontWeight: 'bold' }}>
          {number}
        </Typography>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          sx={{
            color: 'text.secondary',
            typography: 'caption',
          }}
        >
          <TextMaxLine variant="body2" line={1}>
            {description}
          </TextMaxLine>

          <Stack direction="row" alignItems="center">
            <Chip 
              label={t(category)} 
              size="small" 
              variant="filled"
              sx={{
                bgcolor: '#232626',
                color: '#24ee89',
                border: '1px solid #24ee89',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#232626',
                }
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      {/* <Box sx={{ p: 1, position: 'relative' }}>
        <Image alt={image} src={`${API_URL}/${image}`} ratio="1/1" sx={{ borderRadius: 0.6 }} />
      </Box> */}
    </Paper>
  );
}

export default TicketList;
