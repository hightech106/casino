import Picker from 'emoji-picker-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { isMobile } from 'react-device-detect';
import { matchPath, useLocation } from 'react-router';
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  IconButton,
  Box,
  Typography,
  Button,
  Badge,
  Select,
  MenuItem,
  Stack,
  FormControl,
  InputAdornment,
  OutlinedInput,
  CircularProgress,
  LinearProgress,
  Drawer,
  Chip,
} from '@mui/material';
import { useSelector } from 'src/store';
import useApi from 'src/hooks/use-api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import toast from 'react-hot-toast';
import { AnimateButton } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import bgImage from 'src/assets/images/bg_chat.jpg';
import { chatSocket } from 'src/utils/socket';
import { getRandomColor, LANGUAGES } from 'src/utils';
import { API_URL } from 'src/config-global';
import type { IChatMessage } from 'src/types';
import ChatMessages from './chat-message';

const USER_COLOR: any = {};

const inputEmailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const inputUrlRegex = /https?:\/\/(?!localhost|luckverse777\.io)\S+/;
const inputPhoneRegex = /(\+?\d{9,})/;

type Props = {
  onClose?: () => void;
};

export const ChatContent = ({ onClose }: Props) => {
  const { pathname } = useLocation();
  const isCasinoLink = !!matchPath({ path: 'casino', end: false }, pathname);

  const { get_chat_messages, upload_file } = useApi();
  const { isLoggedIn, user } = useSelector((store) => store.auth);

  const emojiPopover = usePopover();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [isBottom, setIsBottom] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<string>('');

  const [messageText, setMessageText] = useState<string>('');
  const [newMessagesCount, setNewMessagesCount] = useState<number>(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('EN');
  const [onlineCount, setOnlineCount] = useState<number>(0);

  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<IChatMessage | null>(null);
  const [isListenersInitialized, setIsListenersInitialized] = useState<boolean>(false);

  const fileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await upload_file(formData, {
      onUploadProgress: (progressEvent: any) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        setProgress(percent);
      },
    });
    if (!res?.data) return null;
    setTimeout(() => {
      setProgress(0);
    }, 500);
    return res.data;
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = messagesEndRef.current;
    if (!element) return;

    const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 10;
    setIsBottom(isAtBottom);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const element = messagesEndRef.current;
      if (!element) return;

      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
      setNewMessagesCount(0);
    }, 200);
  };

  const handleReply = (message: IChatMessage) => {
    setReplyToMessage(message);
  };

  const getList = useCallback(async () => {
    setIsLoading('list');
    const res = await get_chat_messages(selectedLanguage);
    setIsLoading('');
    if (!res?.data) return;
    if (!res.data.length) return;
    setMessages(res.data);
    res.data.forEach((row: any) => {
      USER_COLOR[row.userId] = row.userColor;
    });
    scrollToBottom();
  }, [selectedLanguage, get_chat_messages]);

  useEffect(() => {
    if (!isLoggedIn) return;
    getList();
  }, [selectedLanguage, isLoggedIn, getList]);

  useEffect(() => {
    chatSocket.emit('language', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    const element = messagesEndRef.current;
    if (!element) return () => {};
    // @ts-ignore
    element.addEventListener('scroll', handleScroll);
    return () => {
      // @ts-ignore
      element.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Предотвращаем множественную инициализацию
    if (isListenersInitialized || !chatSocket.connected) {
      return;
    }

    console.log(
      '[CHAT] 🎯 Initializing event listeners ONCE. Socket connected:',
      chatSocket.connected
    );
    setIsListenersInitialized(true);

    const delMessage = (msgId: string) => {
      if (msgId === 'all') setMessages([]);
      else setMessages((prevMessages) => prevMessages.filter((e) => e._id !== msgId));
      return undefined;
    };

    const getSupportChat = (newMsg: IChatMessage) => {
      if (isLoggedIn) return undefined;

      USER_COLOR[newMsg.userId] = newMsg.userColor;
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      if (isLoading === 'chat') setIsLoading('');

      if (isBottom) {
        scrollToBottom();
        return undefined;
      }
      setNewMessagesCount(newMessagesCount + 1);
      return undefined;
    };

    const getNewMessage = (newMsg: IChatMessage) => {
      USER_COLOR[newMsg.userId] = newMsg.userColor;
      setMessages((prevMessages) => [...prevMessages, newMsg]);

      if (isLoading === 'chat') setIsLoading('');

      if (isBottom) {
        scrollToBottom();
        return undefined;
      }
      setNewMessagesCount(newMessagesCount + 1);
      return undefined;
    };

    const updateAlert = ({
      msg,
      type,
    }: {
      msg: string;
      type: 'default' | 'error' | 'success' | 'warning' | 'info';
    }) => {
      setIsLoading('');
      if (type === 'success') toast.success(msg);
      else if (type === 'error') toast.error(msg);
      else if (type === 'warning') toast(msg, { icon: '⚠️' });
      else toast(msg);
      return undefined;
    };

    const updateOnlineCount = (data: { count: number }) => {
      console.log('[ONLINE] 📊 Received count:', data.count);
      setOnlineCount(data.count);
      return undefined;
    };

    chatSocket.on('remove', delMessage);
    chatSocket.on('support_ai', getSupportChat);
    chatSocket.on('message', getNewMessage);
    chatSocket.on('alert', updateAlert);
    chatSocket.on('online-count', updateOnlineCount);

    // Запрашиваем текущий счетчик онлайна через задержку
    console.log('[CHAT] 🔄 Requesting current online count...');
    setTimeout(() => {
      if (chatSocket.connected) {
        console.log('[CHAT] 🔄 Emitting request for online count...');
        chatSocket.emit('language', selectedLanguage); // Это может триггернуть отправку online-count
      }
    }, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      console.log('[CHAT] 🧹 Cleaning up event listeners');
      chatSocket.off('remove', delMessage);
      chatSocket.off('support_ai', getSupportChat);
      chatSocket.off('message', getNewMessage);
      chatSocket.off('alert', updateAlert);
      chatSocket.off('online-count', updateOnlineCount);
      setIsListenersInitialized(false);
      // eslint-disable-next-line consistent-return
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSocket.connected]);

  const reset = () => {
    setMessageText('');
    setReplyToMessage(null);
    setAttachment(null);
  };

  const handleSendMessage = async (isSharedLink = false) => {
    if (!isLoggedIn) {
      const param: any = {
        text: messageText,
        userId: 'temp_user',
        createdAt: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, param]);

      setIsLoading('chat');
      chatSocket.emit('support_ai', param);
      reset();
      return;
    }
    if (!isSharedLink && !messageText.trim()) return;
    if (!user.chat) {
      toast('You are blocked for send message. Please contact to support team!', { icon: '⚠️' });
      return;
    }

    if (
      inputEmailRegex.test(messageText) ||
      inputUrlRegex.test(messageText) ||
      inputPhoneRegex.test(messageText)
    ) {
      toast('Emails, Links and Phone number are not allowed in the message', { icon: '⚠️' });
      return;
    }

    setIsLoading('chat');

    const userColor = USER_COLOR[user._id] || getRandomColor();
    USER_COLOR[user._id] = userColor;

    const param: any = {
      userId: user._id,
      text: isSharedLink ? window.location.href : messageText,
      userColor,
      ...(replyToMessage && {
        replyTo: replyToMessage._id,
      }),
    };

    if (attachment) {
      const res = await fileUpload(attachment);
      if (!res) return;
      param.file = res.uri;
    }

    chatSocket.emit('message', param);
    reset();
  };

  const handleReportMessage = async () => {
    if (!replyToMessage) return;
    const param: any = {
      text: messageText,
      replyTo: replyToMessage,
    };
    chatSocket.emit('report', param);
    reset();
  };

  const slides = messages.reduce(
    (ary: any, message) =>
      message?.attachment ? [...ary, { src: `${API_URL}/${message.attachment}` }] : ary,
    []
  );

  const lightbox = useLightBox(slides);

  const onOpenLightbox = (url: string) => {
    lightbox.onOpen(url);
  };

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

  return (
    <Box
      sx={{
        p: 2,
        height: 1,
        borderRadius: 1,
        bgcolor: '#232626', // Основной фон чата
        overflow: 'hidden',
      }}
    >
      {/* Chat Header */}
      <Stack
        direction="row"
        sx={{
          py: 2,
          borderBottom: '1px solid rgba(177, 182, 198, 0.2)',
          mb: 1,
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        {/* Левая колонка: CHAT + язык и онлайн под ним */}
        <Stack direction="column" alignItems="flex-start" gap={1}>
          {/* CHAT заголовок */}
          <Typography
            sx={{
              fontFamily: 'CircularStd, Public Sans, sans-serif !important',
              fontWeight: 700,
              fontSize: '18.18px',
              lineHeight: '100%',
              letterSpacing: '0%',
              textTransform: 'uppercase',
              color: '#FFFFFF',
            }}
          >
            CHAT
          </Typography>

          {/* Язык и онлайн в одну строчку */}
          <Stack direction="row" alignItems="center" gap={2}>
            {/* Language Selector */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiSelect-select': {
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: '#B1B6C6',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#B1B6C6',
                    fontSize: '14px',
                    marginLeft: '4px',
                  },
                }}
                renderValue={(value) => {
                  const selectedLang = LANGUAGES.find((lang) => lang.code === value);
                  return (
                    <Stack direction="row" gap={1} alignItems="center">
                      <Image
                        src={selectedLang?.flag || LANGUAGES[0].flag}
                        alt={selectedLang?.label || 'flag'}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 0.5,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '12px' }}>
                        {selectedLang?.code || 'EN'}
                      </Typography>
                    </Stack>
                  );
                }}
              >
                {LANGUAGES.map((option, i) => (
                  <MenuItem value={option.code} key={i} sx={{ py: 1.5 }}>
                    <Stack direction="row" gap={1.5} alignItems="center">
                      <Image
                        src={option.flag}
                        alt={option.label}
                        sx={{ width: 24, height: 24, borderRadius: 0.5 }}
                      />
                      <Typography variant="body2" sx={{ fontSize: '13px' }}>
                        {option.label}
                      </Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Online Status */}
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#00F47F',
                }}
              />
              <Typography
                sx={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                }}
              >
                {onlineCount}
              </Typography>
              <Typography
                sx={{
                  fontSize: '11px',
                  color: '#B1B6C6',
                }}
              >
                online
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Кнопка закрыть справа */}
        {onClose && (
          <IconButton
            sx={{
              bgcolor: '#2B2F3D',
              color: '#B1B6C6',
              width: 24,
              height: 24,
              border: '1px solid #2B2F3D',
              '&:hover': {
                bgcolor: '#3C4047',
                color: '#FFFFFF',
              },
            }}
            onClick={onClose}
          >
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '7px solid currentColor', // Меньший треугольник
              }}
            />
          </IconButton>
        )}
      </Stack>

      <Box
        sx={{
          p: 1.25,
          height: 0.79,
          borderRadius: 1.25,
          position: 'relative',
          bgcolor: '#232626', // Фон контейнера сообщений
        }}
      >
        <Scrollbar ref={messagesEndRef} sx={{ height: 1 }}>
          <Box sx={{ pb: 3 }}>
            {' '}
            {/* Добавляем отступ снизу для последнего сообщения */}
            <ChatMessages
              messages={messages}
              handleReply={handleReply}
              onOpenLightbox={onOpenLightbox}
              currentUserId={user?._id}
            />
          </Box>
        </Scrollbar>

        {isLoading === 'list' && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!isBottom && (
          <IconButton
            onClick={scrollToBottom}
            sx={{
              position: 'absolute',
              bottom: 120, // Поднимаем кнопку выше поля ввода (было 10, стало 120)
              right: 5,
              bgcolor: '#2B2F3D',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                bgcolor: '#24ee89',
                color: '#000',
              },
            }}
          >
            <Badge badgeContent={newMessagesCount} color="warning">
              <Iconify icon="mdi:arrow-down-circle" width={24} />
            </Badge>
          </IconButton>
        )}
      </Box>

      <Stack
        sx={{
          p: 1,
          gap: 1,
          left: 0,
          width: 1,
          bottom: 0,
          position: 'absolute',
          bgcolor: '#232626', // Фон блока ввода
        }}
      >
        {replyToMessage && (
          <Box
            sx={{
              mb: 1,
              p: 1,
              backgroundColor: '#222532',
              border: '1px solid #B1B6C6',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="body2" sx={{ color: '#FFFFFF', fontSize: 12 }}>
                Replying to {replyToMessage.user.username}:
              </Typography>
              <Typography variant="body1" sx={{ color: '#B1B6C6', fontSize: 14 }}>
                {replyToMessage.text}
              </Typography>
              {replyToMessage.attachment && (
                <Box
                  component="img"
                  src={`${API_URL}/${replyToMessage.attachment}`}
                  alt="attachment"
                  mt={1}
                  borderRadius={0.5}
                  maxWidth={150}
                />
              )}
            </Box>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => setReplyToMessage(null)}
              sx={{
                bgcolor: '#24ee89',
                color: '#141722',
                '&:hover': {
                  bgcolor: '#E6D117',
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        )}

        {attachment && (
          <Stack
            sx={{
              mb: 1,
              p: 1,
              bgcolor: '#222532',
              border: '1px solid #B1B6C6',
              borderRadius: 1,
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#B1B6C6', fontSize: 12 }}>
                Attached file: {attachment.name}
              </Typography>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => setAttachment(null)}
                sx={{
                  bgcolor: '#24ee89',
                  color: '#141722',
                  '&:hover': {
                    bgcolor: '#E6D117',
                  },
                }}
              >
                Delete
              </Button>
            </Box>
            {!!progress && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  backgroundColor: 'rgba(177, 182, 198, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#24ee89',
                  },
                }}
              />
            )}
          </Stack>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
          <OutlinedInput
            fullWidth
            multiline
            maxRows={4}
            disabled={isLoading === 'list'}
            placeholder="Message"
            value={messageText}
            onChange={(e) => e.target.value.length <= 100 && setMessageText(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{
              bgcolor: '#2B2F3D', // Фон поля ввода
              minHeight: '80px', // Увеличиваем высоту поля ввода
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#2B2F3D',
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF',
                pr: '180px', // Увеличиваем место для кнопок справа (больше места для крупных кнопок)
                pb: '50px', // Добавляем padding снизу для кнопок
              },
              '& .MuiInputBase-input::placeholder': {
                fontFamily: 'Geogrotesque Cyr, CircularStd, Public Sans, sans-serif !important',
                fontWeight: 500,
                fontSize: '12.12px',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#B1B6C6',
              },
              position: 'relative',
            }}
            endAdornment={
              <InputAdornment position="end">
                {/* Контейнер для кнопок справа внизу */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {/* Кнопки attachment и emoji */}
                  {isLoggedIn && (
                    <IconButton
                      component="label"
                      sx={{
                        cursor: 'pointer',
                        border: '0.76px solid #24ee89', // Желтая граница
                        borderRadius: '4px',
                        width: 40,
                        height: 40,
                        bgcolor: '#232626',
                        color: '#24ee89', // Желтая иконка
                        '&:hover': {
                          bgcolor: '#2B2F3D',
                          color: '#24ee89',
                        },
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
                              toast.error('Please select a valid image file (jpeg, png, gif).');
                            }
                          }
                        }}
                      />
                      <Iconify icon="mdi:attachment" width={24} />
                    </IconButton>
                  )}

                  <IconButton
                    onClick={emojiPopover.onOpen}
                    sx={{
                      border: '0.76px solid #24ee89', // Желтая граница
                      borderRadius: '4px',
                      width: 40,
                      height: 40,
                      bgcolor: '#232626',
                      color: '#24ee89', // Желтая иконка
                      '&:hover': {
                        bgcolor: '#2B2F3D',
                        color: '#24ee89',
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/icons/chat/emodjy.png"
                      alt="emoji"
                      sx={{ width: 24, height: 24 }}
                    />
                  </IconButton>

                  {/* Кнопка Send */}
                  <AnimateButton>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      disabled={isLoading === 'list'}
                      onClick={() => handleSendMessage()}
                      sx={{
                        minWidth: 'auto',
                        width: 'auto',
                        height: 40,
                        padding: '8px 16px',
                        bgcolor: '#24ee89',
                        color: '#141722',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        '&:hover': {
                          bgcolor: '#E6D117',
                          color: '#141722',
                        },
                        '&:disabled': {
                          bgcolor: 'rgba(138, 43, 226, 0.3)',
                          color: 'rgba(20, 23, 34, 0.5)',
                        },
                      }}
                      loading={isLoading === 'chat'}
                      title={replyToMessage ? 'Reply' : 'Send'}
                    >
                      Send
                    </LoadingButton>
                  </AnimateButton>
                </Box>
              </InputAdornment>
            }
            onPaste={handlePaste}
          />

          {/* {isLoggedIn && (
            <AnimateButton>
              <LoadingButton
                variant="contained"
                color={replyToMessage && replyToMessage?.userId !== user._id ? 'error' : 'info'}
                onClick={() => {
                  if (replyToMessage && replyToMessage?.userId !== user._id) handleReportMessage();
                  else handleSendMessage(true);
                }}
                disabled={!isCasinoLink || isLoading === 'list'}
                sx={{
                  width: 43,
                  height: 43,
                  minWidth: 43,
                  bgcolor: '#24ee89',
                  color: '#000',
                  '&:hover': {
                    bgcolor: '#CAAE51',
                    color: '#fff',
                  },
                }}
                loading={isLoading === 'chat'}
                title={replyToMessage && replyToMessage?.userId !== user._id ? 'Report' : 'Share'}
              >
                <Iconify
                  icon={
                    replyToMessage && replyToMessage?.userId !== user._id
                      ? 'material-symbols:block'
                      : 'ic:twotone-share'
                  }
                />
              </LoadingButton>
            </AnimateButton>
          )} */}
        </Box>
      </Stack>
      <CustomPopover open={emojiPopover.open} onClose={emojiPopover.onClose} arrow="bottom-right">
        <Picker onEmojiClick={(e) => setMessageText(messageText + e.emoji)} />
      </CustomPopover>
      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </Box>
  );
};

export const ChatWidget = ({ onClose }: Props) => (
  <Box
    component="nav"
    sx={{
      flexShrink: { lg: 0 },
      width: { lg: 380 }, // Ширина как у правого сайдбара (NAV.W_VERTICAL)
    }}
  >
    <Box
      sx={{
        right: isMobile ? 0 : 16, // На десктопе отступ 16px справа (как padding правого сайдбара)
        top: isMobile ? 0 : 80, // Учитываем высоту хедера на десктопе (80px)
        bottom: 0, // На мобильной версии убираем отступ снизу для полного экрана
        width: { xs: '100vw', md: 348 }, // Ширина = 380px - 32px (16px отступ слева и справа от контента)
        position: 'fixed',
        zIndex: isMobile ? 9999 : 1300, // Высокий z-index на мобильных, чтобы скрыть хедер
        height: isMobile ? '100vh' : 'calc(100vh - 80px)', // Полный экран на мобильных
        transition: 'height 0.3s ease',
        border: isMobile ? 'none' : '2px solid #2B2F3D', // Убираем границы на мобильных
        borderRadius: { xs: 0, md: '8px 0 0 8px' },
        boxShadow: isMobile ? 'none' : '-4px 0 20px rgba(25, 25, 55, 0.3)', // Убираем тень на мобильных
      }}
    >
      <ChatContent onClose={onClose} />
    </Box>
  </Box>
);
