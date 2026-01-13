import { IconButton, Box, Typography, Avatar, Stack, Tooltip } from '@mui/material';
import { useSelector } from 'src/store';

import Iconify from 'src/components/iconify';

import { API_URL } from 'src/config-global';

interface ChatMessage {
  _id: string;
  text: string;
  userId: string;
  user: {
    username: string;
    avatar?: string;
    role: string;
  };
  userColor: string;
  replyTo?: string;
  casino_game_id?: string;
  game_name?: string;
  game_banner?: string;
  attachment?: string;
  createdAt: string;
}

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/219/219983.png';
const urlRegex = /(https?:\/\/[^\s]+)/g;

type Props = {
  messages: ChatMessage[];
  handleReply: (message: ChatMessage) => void;
  onOpenLightbox: (url: string) => void;
  currentUserId?: string;
};
const ChatMessages = ({ messages, handleReply, onOpenLightbox, currentUserId }: Props) => {
  let lastDate: Date | null = null;
  const { user } = useSelector((store) => store.auth);

  const renderText = (message: string) => {
    const parts = message.split(urlRegex);
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              fontFamily: 'Geogrotesque Cyr, CircularStd, Public Sans, sans-serif',
              fontWeight: 500,
              fontSize: '12.12px',
              lineHeight: '100%',
              letterSpacing: '0%',
              overflowWrap: 'anywhere',
              color: '#B1B6C6',
              textDecoration: 'underline'
            }}
          >
            {part}
          </a>
        );
      }
      return (
        <span
          key={index}
          style={{
            fontFamily: 'Geogrotesque Cyr, CircularStd, Public Sans, sans-serif',
            fontWeight: 500,
            fontSize: '12.12px',
            lineHeight: '100%',
            letterSpacing: '0%',
            wordWrap: 'break-word',
            overflowWrap: 'anywhere',
            color: '#B1B6C6',
          }}
        >
          {part}
        </span>
      );
    });
  };

  const renderMessageContent = (data: ChatMessage) => {
    const repliedMessage = data?.replyTo ? messages.find((msg) => msg._id === data?.replyTo) : null;
    const isOwnMessage = currentUserId && data.userId === currentUserId;

    return (
      <Box
        sx={{
          mb: 1, // Уменьшили расстояние между сообщениями
          p: 1, // Уменьшили padding
          borderRadius: 1,
          background: '#222532', // Новый фон сообщений
          border: isOwnMessage ? '0.76px solid #24ee89' : '1px solid #222532', // Желтая граница только для своих
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'flex-start',
            gap: 1,
          }}
        >
          <Avatar
            src={data?.user?.avatar ? `${API_URL}/${data?.user.avatar}` : DEFAULT_AVATAR}
            alt={data?.user?.username || ''}
            sx={{
              width: 32,
              height: 32,
              borderRadius: 50,
              border: isOwnMessage ? '0.76px solid #24ee89' : 'none',
            }}
          />

          <Stack sx={{ flex: 1, minWidth: 0 }}>
            {repliedMessage && (
              <Box
                sx={{ 
                  bgcolor: 'rgba(177, 182, 198, 0.2)', 
                  p: 1, 
                  borderRadius: 0.5, 
                  mb: 1,
                  borderLeft: '3px solid #B1B6C6'
                }}
              >
                <Typography variant="body2" sx={{ fontSize: 10, color: '#FFFFFF', mb: 0.5 }}>
                  Replying to {repliedMessage?.user?.username}
                </Typography>
                <Typography variant="body2" sx={{ color: '#B1B6C6', fontSize: 12 }}>
                  {repliedMessage?.text}
                </Typography>
                {repliedMessage?.attachment && (
                  <Box
                    component="img"
                    src={`${API_URL}/${repliedMessage?.attachment}`}
                    alt="attachment"
                    mt={1}
                    borderRadius={0.5}
                    maxWidth={150}
                  />
                )}
              </Box>
            )}

            <Box
              sx={{
                wordWrap: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              {/* Никнейм отдельно */}
              <Tooltip 
                title={(data?.user?.username || 'me').length > 20 ? (data?.user?.username || 'me') : ''} 
                arrow
                disableHoverListener={(data?.user?.username || 'me').length <= 20}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isOwnMessage ? '#24ee89' : '#FFFFFF',
                    fontFamily: 'Geogrotesque Cyr, CircularStd, Public Sans, sans-serif !important',
                    fontWeight: 500,
                    fontSize: '12.12px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    mb: 0.25,
                  }}
                >
                  {data?.user?.username || 'me'}:
                </Typography>
              </Tooltip>
              
              {/* Сообщение под никнеймом */}
              <Box>
                {renderText(data?.text)}
              </Box>

              {data?.attachment && (
                <Box
                  component="img"
                  alt="attachment"
                  src={`${API_URL}/${data?.attachment}`}
                  onClick={() => onOpenLightbox(`${API_URL}/${data?.attachment}`)}
                  sx={{
                    mt: 1,
                    borderRadius: 0.5,
                    cursor: 'pointer',
                    maxWidth: '100%',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                />
              )}
            </Box>
          </Stack>

          <IconButton
            onClick={() => handleReply(data)}
            title="Reply"
            sx={{
              p: '4px',
              width: 24,
              height: 24,
              color: '#B1B6C6',
              '&:hover': {
                bgcolor: 'rgba(177, 182, 198, 0.1)',
              },
            }}
          >
            <Iconify icon="mdi:reply" width={14} />
          </IconButton>
        </Stack>
      </Box>
    );
  };

  return messages.map((message, index) => {
    const messageDate = new Date(message.createdAt);
    const showDateSeparator = !lastDate || messageDate.toDateString() !== lastDate.toDateString();
    lastDate = messageDate;

    return (
      <Box key={index}>
        {showDateSeparator && (
          <Box sx={{ textAlign: 'center', my: 1.25 }}>
            {messageDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
          </Box>
        )}
        {renderMessageContent(message)}
      </Box>
    );
  });
};

export default ChatMessages;
