import Picker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { useRef, useState, useCallback, useEffect } from 'react';
// @mui
import { Box, Button, LinearProgress, Stack, Typography, TextareaAutosize } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
// routes
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { useSelector } from 'src/store';
// hooks
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// utils
import { getRandomColor } from 'src/utils';
// api
// types
import type { IChatMessage } from 'src/types';
import { chatSocket } from 'src/utils/socket';

// ----------------------------------------------------------------------

const USER_COLOR: any = {};

type Props = {
  disabled: boolean;
  setLoading: (value: boolean) => void;
  agentChat: boolean;
  onAgentChat: () => void;
};

export default function ChatMessageInput({ disabled, agentChat, onAgentChat, setLoading }: Props) {
  const { t } = useLocales();
  const { upload_file } = useApi();

  const { isLoggedIn, user } = useSelector((store) => store.auth);

  const emojiPopover = usePopover();

  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  const [messageText, setMessageText] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<IChatMessage | null>(null);

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);


  const handlePaste = async (event: any) => {
    const items = event.clipboardData.items;
    /* eslint-disable */
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        setAttachment(file);
      }
    }
    /* eslint-enable */
  };

  const fileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await upload_file(formData, {
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        setProgress(percent);
      }
    });
    if (!res?.data) return null;
    setTimeout(() => {
      setProgress(0);
    }, 500);
    return res.data;
  };


  const handleChangeMessage = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(event.target.value);
  }, []);


  const reset = () => {
    setMessageText('');
    setReplyToMessage(null);
    setAttachment(null);
  }

  const send = async (agent: boolean = false) => {
    try {
      if (!isLoggedIn) return;
      if (!messageText.trim()) return;


      const userColor = USER_COLOR[user._id] || getRandomColor();
      USER_COLOR[user._id] = userColor;

      const param: any = {
        userId: user._id,
        text: messageText,
        userColor,
        ...(replyToMessage && {
          replyTo: replyToMessage._id
        }),
        ...(agent && {
          askAgent: true,
        })
      }

      if (attachment) {
        const res = await fileUpload(attachment);
        if (!res) return;
        param.file = res.uri;
      }
      setLoading(true);

      chatSocket.emit("support", param);
      reset();
    } catch (error) {
      console.error(error);
    }
  }

  const handleSendMessage = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await send(agentChat);
    }
  };

  return (
    <>
      {!agentChat && (
        <Box sx={{ textAlign: 'center', py: 2, bgcolor: '#2B2F3D', borderRadius: '8px 8px 0 0' }}>
          <Typography 
            variant='body2'
            sx={{
              color: "#24ee89",
              cursor: "pointer",
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              '&:hover': {
                color: '#A64BFF',
                textDecoration: 'underline'
              },
              transition: 'all 0.2s ease'
            }}
            onClick={onAgentChat}
          >
            🤖 Ask to agent
          </Typography>
        </Box>
      )}
      {attachment && (
        <Stack sx={{ 
          mb: 1, 
          p: 2, 
          bgcolor: '#2B2F3D', 
          border: '1px solid #3A3F50',
          borderRadius: '8px',
          gap: 1 
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
              📎 Attached file: {attachment.name}
            </Typography>
            <Button 
              size="small" 
              sx={{
                bgcolor: '#FF4444',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#CC3333' },
                borderRadius: '6px',
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '11px'
              }}
              onClick={() => setAttachment(null)}
            >
              Delete
            </Button>
          </Box>
          {!!progress && (
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                bgcolor: '#3A3F50',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#24ee89'
                }
              }}
            />
          )}
        </Stack>
      )}
      <Box sx={{ 
        position: 'relative', 
        p: 2, 
        bgcolor: '#2B2F3D',
        borderTop: '1px solid #3A3F50',
        borderRadius: '0 0 8px 8px'
      }}>
        <TextareaAutosize
          value={messageText}
          onKeyDown={handleSendMessage}
          onChange={handleChangeMessage}
          placeholder="Введите сообщение..."
          disabled={disabled}
          onPaste={handlePaste}
          minRows={2}
          maxRows={4}
          style={{
            width: '100%',
            backgroundColor: '#232626',
            color: '#FFFFFF',
            border: '1px solid #3A3F50',
            borderRadius: '8px',
            padding: '12px 120px 12px 16px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none',
            minHeight: '60px',
            transition: 'border-color 0.2s ease',
          }}
        />
        
        {/* Элементы внутри поля ввода */}
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            position: 'absolute',
            bottom: 30,
            right: 30,
            alignItems: 'center'
          }}
        >
          {agentChat && (
            <IconButton 
              component="label" 
              sx={{ 
                position: 'relative', 
                cursor: 'pointer',
                width: 32,
                height: 32,
                color: '#FFFFFF'
              }}
            >
              <input
                type="file"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0];
                  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
                  if (selectedFile) {
                    if (validImageTypes.includes(selectedFile?.type)) {
                      setAttachment(selectedFile);
                    } else {
                      toast.error("Please select a valid image file (jpeg, png, gif).");
                    }
                  }
                }}
              />
              <Iconify icon="mdi:attachment" width={20} />
            </IconButton>
          )}
          <IconButton 
            onClick={emojiPopover.onOpen}
            sx={{ 
              width: 32,
              height: 32,
              p: 0.5
            }}
          >
            <Box
              component="img"
              src="/assets/icons/chat/emodjy.png"
              alt="emoji"
              sx={{ width: 20, height: 20 }}
            />
          </IconButton>
          <Button
            onClick={() => send(agentChat)}
            sx={{
              bgcolor: '#24ee89',
              color: '#050514',
              border: 'none',
              '&:hover': { 
                bgcolor: '#A64BFF',
                transform: 'skew(-5deg) scale(1.05)'
              },
              '&:active': {
                transform: 'skew(-5deg) scale(0.95)'
              },
              height: 36,
              minWidth: 70,
              px: 2,
              borderRadius: '6px',
              boxShadow: '0 2px 8px rgba(138, 43, 226, 0.3)',
              transform: 'skew(-5deg)',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease'
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>

      <input type="file" ref={fileRef} style={{ display: 'none' }} />

      <CustomPopover
        open={emojiPopover.open}
        onClose={emojiPopover.onClose}
        arrow="bottom-right"
      >
        <Picker onEmojiClick={(e) => setMessageText(messageText + e.emoji)} />
      </CustomPopover>
    </>
  );
}
