import { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import { Alert, TextField, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// store
import { dispatch, useSelector } from 'src/store';
// hooks
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fToNow } from 'src/utils/format-time';
// components
import Label from 'src/components/label';
import Image from 'src/components/image';
import { ConfirmDialog } from 'src/components/custom-dialog';
import TextMaxLine from 'src/components/text-max-line';
import { UpdateActiveBonus, UpdateBonus, UpdateNotification } from 'src/store/reducers/auth';
import { API_URL } from 'src/config-global';
import type { INotification } from 'src/types';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  notification: INotification;
};

function daysSinceCreated(date: string) {
  // Parse the last minted date
  const lastMinted = new Date(date).getTime();

  // Get the current date
  const now = Date.now();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = now - lastMinted;

  // Convert milliseconds to days
  const millisecondsInADay = 1000 * 60 * 60 * 24; // number of milliseconds in a day
  const daysDifference = Math.floor(differenceInMilliseconds / millisecondsInADay);

  return daysDifference;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isActive, setIsActive] = useState(false);

  const renderAvatar = (
    <ListItemAvatar>
      <Tooltip title="Admin" arrow>
        <Avatar
          src="https://assets.minimals.cc/public/assets/images/mock/avatar/avatar-2.webp"
          sx={{ bgcolor: 'background.neutral' }}
        />
      </Tooltip>
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.createdAt)}
          <Box 
            component="span" 
            sx={{ 
              color: '#B1B6C6', 
              ml: 0.5,
              fontFamily: 'Geogrotesque Cyr Medium, sans-serif',
              fontWeight: 500
            }}
          >
            {format(new Date(notification.createdAt), 'MM-dd h:mm:ss')}
          </Box>
        </Stack>
      }
    />
  );

  const renderUnReadBadge = notification.isUnRead && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button 
        size="small" 
        variant="contained"
        sx={{
          bgcolor: '#24ee89',
          color: '#000',
          '&:hover': {
            bgcolor: '#E6D117',
          },
        }}
      >
        Accept
      </Button>
      <Button 
        size="small" 
        variant="outlined"
        sx={{
          borderColor: '#24ee89',
          color: '#24ee89',
          '&:hover': {
            bgcolor: '#24ee89',
            color: '#000',
          },
        }}
      >
        Decline
      </Button>
    </Stack>
  );

  const projectAction = (
    <Stack alignItems="flex-start">
      <Box
        sx={{
          p: 1.5,
          my: 1.5,
          borderRadius: 1.5,
          color: isActive ? '#000' : 'text.primary',
          bgcolor: isActive ? '#24ee89' : '#232626',
          border: 'none',
        }}
      >
        {reader(notification.description, isActive)}
      </Box>

      {/* <Button size="small" variant="contained">
        Reply
      </Button> */}
    </Stack>
  );

  const tagsAction = (
    <Stack direction="row" spacing={0.75} flexWrap="wrap" sx={{ mt: 1.5 }}>
      <Label variant="outlined" color="info">
        Design
      </Label>
      <Label variant="outlined" color="warning">
        Dashboard
      </Label>
      <Label variant="outlined">Design system</Label>
    </Stack>
  );

  const paymentAction = (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
      <Button 
        size="small" 
        variant="contained"
        sx={{
          bgcolor: '#24ee89',
          color: '#000',
          '&:hover': {
            bgcolor: '#E6D117',
          },
        }}
      >
        Pay
      </Button>
      <Button 
        size="small" 
        variant="outlined"
        sx={{
          borderColor: '#24ee89',
          color: '#24ee89',
          '&:hover': {
            bgcolor: '#24ee89',
            color: '#000',
          },
        }}
      >
        Decline
      </Button>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: 'none',
        bgcolor: isActive ? '#232626' : 'transparent',
        border: isActive ? '1px solid #24ee89' : 'none',
        borderRadius: isActive ? 1 : 0,
        '&:hover': {
          bgcolor: isActive ? '#232626' : '#2B2F3D',
        },
        flexDirection: isMobile ? 'column' : 'row',
      }}
      onClick={() => setIsActive(!isActive)}
    >
      {renderUnReadBadge}

      {isMobile ? (
        // Mobile layout: avatar and text stacked
        <Stack sx={{ width: '100%' }}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', mb: 1 }}>
            {renderAvatar}
            <Stack sx={{ flexGrow: 1 }}>
              {renderText}
            </Stack>
          </Stack>
          {projectAction}
          {notification.param &&
            notification.param.key === 'bonus' &&
            notification.param.data.length > 0 &&
            notification.param.data.map((row, index) => (
              <BonusAction
                data={row}
                key={index}
                createdAt={notification.createdAt}
                _id={notification._id}
              />
            ))}
        </Stack>
      ) : (
        // Desktop layout: avatar and text side by side
        <>
          {renderAvatar}
          <Stack sx={{ flexGrow: 1 }}>
            {renderText}
            {projectAction}
            {notification.param &&
              notification.param.key === 'bonus' &&
              notification.param.data.length > 0 &&
              notification.param.data.map((row, index) => (
                <BonusAction
                  data={row}
                  key={index}
                  createdAt={notification.createdAt}
                  _id={notification._id}
                />
              ))}
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}

const BonusAction = ({ data, createdAt, _id }: any) => {
  const { t } = useLocales();
  const { active_bonus } = useApi();

  const activeBonus = useSelector((store) => store.auth.activeBonus);

  const confirm = useBoolean(false);
  const cancelBonus = useBoolean(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  const days = daysSinceCreated(createdAt);

  const getBonus = async () => {
    const param = {
      notificationId: _id,
      bonusId: data._id,
      password,
    };
    setLoading(true);
    const res = await active_bonus(param);
    setLoading(false);
    if (!res?.data) return;
    dispatch(UpdateActiveBonus(res.data));
    dispatch(UpdateBonus(res.data.amount));
    toast.success('success');
    if (confirm.value) confirm.onFalse();
  };

  const handleGetBonus = async () => {
    if (days > data.activate_day) return;
    if (activeBonus) return;

    if (activeBonus) confirm.onTrue();
    else await getBonus();
  };

  return (
    <Stack
      spacing={1}
      direction="row"
      sx={{
        pl: 1,
        p: 1.5,
        mt: 1.5,
        borderRadius: 1.5,
        bgcolor: '#2B2F3D',
      }}
    >
      <Image src={`${API_URL}/${data.image}`} sx={{ minWidth: 40, width: 40, height: 40 }} />

      <Stack
        spacing={1}
        direction={{ xs: 'column', sm: 'row' }}
        flexGrow={1}
        alignItems="center"
        sx={{ minWidth: 0 }}
      >
        <ListItemText
          disableTypography
          primary={
            <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }} noWrap>
              {data.title}
            </Typography>
          }
          secondary={
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', color: 'text.disabled' }}
              divider={
                <Box
                  sx={{
                    mx: 0.5,
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    bgcolor: 'currentColor',
                  }}
                />
              }
            >
              <TextMaxLine line={1} variant="body2">
                {data.description}
              </TextMaxLine>
            </Stack>
          }
        />

        <LoadingButton
          size="small"
          variant="outlined"
          sx={{ 
            whiteSpace: 'nowrap', 
            minWidth: 82,
            borderColor: '#24ee89',
            color: '#24ee89',
            '&:hover': {
              bgcolor: '#24ee89',
              color: '#000',
            },
          }}
          loading={loading}
          disabled={days > data.activate_day || !!activeBonus}
          onClick={handleGetBonus}
        >
          {data._id === activeBonus?.bonusId?._id && t('actived')}
          {data._id !== activeBonus?.bonusId?._id &&
            t(days > data.activate_day ? 'expired' : 'get_bonus')}
        </LoadingButton>
      </Stack>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={
          <Typography variant="h4" sx={{ textTransform: 'uppercase' }}>
            {t('active')}
          </Typography>
        }
        content={
          <>
            <Typography>
              {t('cancel_bonus_desc')
                .split('<br/>')
                .map((text, ind) => (
                  <Fragment key={ind}>
                    {text}
                    <br />
                  </Fragment>
                ))}
            </Typography>
            {cancelBonus.value && (
              <>
                <Alert
                  variant="outlined"
                  severity="warning"
                  sx={{
                    my: 2,
                    borderStyle: 'dashed',
                    borderColor: (theme) => theme.palette.warning.main,
                  }}
                >
                  {t('cancel_bonus_warning')
                    .split('<br/>')
                    .map((text, ind) => (
                      <Fragment key={ind}>
                        {text}
                        <br />
                      </Fragment>
                    ))}
                </Alert>
                <TextField
                  type="password"
                  variant="outlined"
                  label={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
              </>
            )}
          </>
        }
        action={
          !cancelBonus.value ? (
            <Button variant="contained" color="error" onClick={cancelBonus.onTrue}>
              {t('agree')}
            </Button>
          ) : (
            <LoadingButton variant="contained" color="success" loading={loading} onClick={getBonus}>
              {t('verify')}
            </LoadingButton>
          )
        }
      />
    </Stack>
  );
};

// ----------------------------------------------------------------------

const linkRegex = /https?:\/\/[^\s]+/g;

// Function to convert text with links into components
const parseLinks = (input: string, isActive: boolean = false) => {
  const parts = input.split(linkRegex);
  const links = input.match(linkRegex) || [];

  return parts.reduce((acc: any[], part: string, index) => {
    // Highlight numbers in text parts
    // eslint-disable-next-line no-useless-escape
    const highlighted = part.replace(/(\d+[\d.,]*)/g, '<span class="number">$1</span>');
    acc.push(<span dangerouslySetInnerHTML={{ __html: highlighted }} />);

    if (index < links.length) {
      acc.push(
        <Button
          key={index}
          component="a"
          href={links[index]}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{
            bgcolor: '#24ee89',
            color: '#000',
            fontFamily: 'FONTSPRING DEMO - Blunt Con It, sans-serif',
            fontWeight: 400,
            fontStyle: 'italic',
            textTransform: 'none',
            transform: 'skew(-5deg)',
            borderRadius: 1,
            px: 2,
            py: 0.5,
            mx: 0.5,
            minWidth: 60,
            '&:hover': {
              bgcolor: '#E6D117',
              color: '#000',
            },
          }}
        >
          Visit
        </Button>
      );
    }
    return acc;
  }, []);
};

function reader(data: string, isActive: boolean = false) {
  return (
    <Typography
      sx={{
        mb: 0.5,
        whiteSpace: 'pre-wrap',
        color: isActive ? '#000' : '#FFFFFF',
        '& p': { typography: 'body2', m: 0 },
        '& strong': { typography: 'subtitle2' },
        '& .number': { 
          color: isActive ? '#000' : '#24ee89', 
          fontWeight: 700 
        },
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      {parseLinks(data, isActive)}
    </Typography>
  );
}
