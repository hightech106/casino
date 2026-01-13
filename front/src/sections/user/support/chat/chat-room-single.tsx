// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
// components
import Iconify from 'src/components/iconify';
// hooks
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

type Props = {
  participant: any;
};

export default function ChatRoomSingle({ participant }: Props) {
  const { t } = useLocales();
  const collapse = useBoolean(true);

  const { name, avatarUrl, role, address, phoneNumber, email } = participant;

  const renderInfo = (
    <Stack alignItems="center" sx={{ py: 4, bgcolor: '#2B2F3D', borderRadius: '8px 8px 0 0' }}>
      <Avatar 
        alt={name} 
        src={avatarUrl} 
        sx={{ 
          width: 80, 
          height: 80, 
          mb: 2,
          border: '3px solid #24ee89',
          boxShadow: '0 4px 12px rgba(138, 43, 226, 0.3)'
        }} 
      />
      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: '#24ee89', mt: 0.5, fontWeight: 500 }}>
        {role}
      </Typography>
    </Stack>
  );

  const renderBtn = (
    <ListItemButton
      onClick={collapse.onToggle}
      sx={{
        pl: 2.5,
        pr: 1.5,
        height: 48,
        flexShrink: 0,
        flexGrow: 'unset',
        typography: 'subtitle2',
        color: '#FFFFFF',
        bgcolor: '#3A3F50',
        borderTop: '1px solid #4A4F60',
        borderBottom: '1px solid #4A4F60',
        '&:hover': {
          bgcolor: '#4A4F60',
        },
        transition: 'all 0.2s ease'
      }}
    >
      <Box component="span" sx={{ flexGrow: 1, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {t("information")}
      </Box>
      <Iconify
        width={18}
        icon={collapse.value ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
        sx={{ color: '#24ee89' }}
      />
    </ListItemButton>
  );

  const renderContent = (
    <Stack
      spacing={2.5}
      sx={{
        px: 2.5,
        py: 3,
        bgcolor: '#2B2F3D',
        borderRadius: '0 0 8px 8px',
        '& svg': {
          mr: 1.5,
          flexShrink: 0,
          color: '#24ee89',
          width: 20,
          height: 20,
        },
      }}
    >
      <Stack direction="row">
        <Iconify icon="mingcute:location-fill" />
        <Typography variant="body2">
          <Typography component="span" sx={{ fontFamily: 'Geogrotesque Cyr', color: '#FFFFFF' }}>
            Location: 
          </Typography>
          <Typography component="span" sx={{ fontFamily: 'Geogrotesque Cyr', color: '#24ee89' }}>
            {address}
          </Typography>
        </Typography>
      </Stack>

      {/* <Stack direction="row">
        <Iconify icon="solar:phone-bold" />
        <Typography variant="body2">{phoneNumber}</Typography>
      </Stack> */}

      <Stack direction="row">
        <Iconify icon="fluent:mail-24-filled" />
        <Typography variant="body2" noWrap>
          <Typography component="span" sx={{ fontFamily: 'Geogrotesque Cyr', color: '#FFFFFF' }}>
            Email: 
          </Typography>
          <Typography component="span" sx={{ fontFamily: 'Geogrotesque Cyr', color: '#24ee89' }}>
            {email}
          </Typography>
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {renderInfo}

      {renderBtn}

      <div>
        <Collapse in={collapse.value}>{renderContent}</Collapse>
      </div>
    </>
  );
}
