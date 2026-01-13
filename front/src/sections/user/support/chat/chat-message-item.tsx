import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Chip, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
// components
import Iconify from 'src/components/iconify';
import { useSelector } from 'src/store';
import { chatSocket } from 'src/utils/socket';
import { API_URL } from 'src/config-global';
// types
import type { ISupportChatMessage } from 'src/types';
//
import { useGetMessage } from './hooks';

// ----------------------------------------------------------------------

type Props = {
  messages: ISupportChatMessage[];
  message: ISupportChatMessage;
  onOpenLightbox: () => void;
};

export default function ChatMessageItem({ message, messages, onOpenLightbox }: Props) {
  const { user } = useSelector((store) => store.auth);

  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    currentUserId: `${user?._id}`,
  });

  const { firstName, avatarUrl } = senderDetails;

  const { text, attachment, replyTo, createdAt } = message;
  const repliedMessage = messages.find((msg) => msg._id === replyTo);

  const handleSendAgent = () => {
    const param: any = {
      ...message,
      askAgent: true,
    }
    chatSocket.emit("support", param);
  }

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        color: '#9CA3AF',
        fontSize: '11px',
        fontWeight: 500,
        mb: 0.5,
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {!me && `${firstName},`} &nbsp;
      {formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
      })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 2,
        minWidth: 48,
        borderRadius: '12px',
        typography: 'body2',
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
        bgcolor: '#2B2F3D',
        border: '1px solid #3A3F50',
        color: '#FFFFFF',
        maxWidth: '70%',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        ...(me && {
          color: '#050514',
          bgcolor: '#24ee89',
          border: '1px solid #A64BFF',
          boxShadow: '0 2px 12px rgba(138, 43, 226, 0.2)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            right: '-8px',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid #24ee89',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
          }
        }),
        ...(!me && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '-8px',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderRight: '8px solid #2B2F3D',
            borderTop: '6px solid transparent',
            borderBottom: '6px solid transparent',
          }
        }),
      }}
    >
      {repliedMessage && (
        <Box sx={{ bgcolor: `${repliedMessage.userColor}80`, p: 0.5, borderRadius: 0.5, mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontSize: 10, color: '#FFFFFF' }}>
            {repliedMessage.sender?.username}
          </Typography>
          <Typography variant="body2" sx={{ color: '#FFFFFF', ml: 0.3, fontSize: 12 }}>
            {repliedMessage.text}
          </Typography>
          {repliedMessage?.attachment && (
            <Box component="img" src={`${API_URL}/${repliedMessage.attachment}`} alt="attachment" mt={1} ml={0.3} borderRadius={0.5} maxWidth={150} />
          )}
        </Box>
      )}
      {text}
      {attachment && (
        <Box
          component="img"
          alt="attachment"
          src={`${API_URL}/${attachment}`}
          onClick={onOpenLightbox}
          sx={{
            mt: 1,
            borderRadius: 0.5,
            cursor: 'pointer',
            maxWidth: 300,
            '&:hover': {
              opacity: 0.8,
            },
          }}
        />
      )}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        // pt: 0.5,
        // opacity: 0,
        top: '100%',
        left: 0,
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && {
          left: 'unset',
          right: 0,
        }),
      }}
    >
      {/* <Chip label="Ask to Dealer" color="primary" variant='outlined' size="small" onClick={() => { }} /> */}
      <IconButton size="small" onClick={handleSendAgent}>
        <Iconify icon="hugeicons:question" width={16} />
      </IconButton>
      {/* <IconButton size="small">
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>
      <IconButton size="small">
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton> */}
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 2, px: 1 }}>
      {!me && (
        <Avatar 
          alt={firstName} 
          src={avatarUrl} 
          sx={{ 
            width: 36, 
            height: 36, 
            mr: 2,
            border: '2px solid #3A3F50',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }} 
        />
      )}

      <Stack alignItems={`flex-${me ? "end" : "start"}`} sx={{ maxWidth: '85%' }}>
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            alignItems: "flex-end",
            ...(me && {
              justifyContent: "flex-end"
            })
          }}
        >
          {renderBody}
        </Stack>
      </Stack>
    </Stack>
  );
}
