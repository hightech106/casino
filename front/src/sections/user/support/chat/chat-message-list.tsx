// @mui
import { Box, Stack } from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import useMessagesScroll from 'src/hooks/use-messages-scroll';
// types
import { API_URL } from 'src/config-global';
import type { ISupportChatMessage } from 'src/types';
import ChatMessageItem from './chat-message-item';

// ----------------------------------------------------------------------

type Props = {
  loading: boolean;
  messages: ISupportChatMessage[];
};

export default function ChatMessageList({ loading, messages = [] }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  const slides: any = messages
    .filter((message) => !!message.attachment)
    .map((message) => ({ src: `${API_URL}/${message.attachment}` }));

  const lightbox = useLightBox(slides);

  return (
    <>
      <Scrollbar 
        ref={messagesEndRef} 
        sx={{ 
          px: 2, 
          py: 3, 
          height: 1,
          bgcolor: '#232626',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Box sx={{ minHeight: '100%' }}>
          {messages.map((message, index) => (
            <ChatMessageItem
              key={index}
              message={message}
              messages={messages}
              onOpenLightbox={() => lightbox.onOpen(`${API_URL}/${message.attachment}`)}
            />
          ))}
          {loading && (
            <Stack 
              direction="row" 
              gap={0.2} 
              sx={{ 
                justifyContent: 'flex-start',
                alignItems: 'center',
                px: 1,
                py: 2
              }}
            >
              <div className='dot' style={{ backgroundColor: '#24ee89' }} />
              <div className='dot' style={{ backgroundColor: '#24ee89' }} />
              <div className='dot' style={{ backgroundColor: '#24ee89' }} />
            </Stack>
          )}
        </Box>
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}
