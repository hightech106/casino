// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import { useLocales } from 'src/locales';
// components
import Iconify from 'src/components/iconify';
// utils
import { fToNow } from 'src/utils/format-time';
// types
import type { IChatParticipant } from '../chat.type';

// ----------------------------------------------------------------------

export default function ChatHeaderDetail() {
  const { t } = useLocales();
  // const group = participants.length > 1;

  const singleParticipant: any = {
    "id": "8864c717-587d-472a-929a-8e5f298024da-0",
    "role": t("admin"),
    "status": t("online"),
    "name": "Support",
    "email": "support@luckverse777.com",
    "address": "90210 Broadway Blvd",
    "avatarUrl": "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-25.webp",
    "lastActivity": "2024-09-25T15:54:15+00:00",
  };

  // const renderGroup = (
  //   <AvatarGroup
  //     max={3}
  //     sx={{
  //       [`& .${avatarGroupClasses.avatar}`]: {
  //         width: 32,
  //         height: 32,
  //       },
  //     }}
  //   >
  //     {participants.map((participant) => (
  //       <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
  //     ))}
  //   </AvatarGroup>
  // );

  const renderSingle = (
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={singleParticipant.status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar src={singleParticipant.avatarUrl} alt={singleParticipant.name} />
      </Badge>

      <ListItemText
        primary={singleParticipant.name}
        secondary={
          singleParticipant.status === 'offline'
            ? fToNow(singleParticipant.lastActivity)
            : singleParticipant.status
        }
        secondaryTypographyProps={{
          component: 'span',
          ...(singleParticipant.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  return (
    <>
      {/* {group ? renderGroup : renderSingle} */}
      {renderSingle}
      <Stack flexGrow={1} />
      
      {/* 
      <IconButton>
        <Iconify icon="solar:phone-bold" />
      </IconButton>
      <IconButton>
        <Iconify icon="solar:videocamera-record-bold" />
      </IconButton> */}
      {/* <IconButton>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton> */}
    </>
  );
}
