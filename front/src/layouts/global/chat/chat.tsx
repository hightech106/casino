import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { Box, Button } from '@mui/material';

import Iconify from 'src/components/iconify';
import { ChatWidget } from './chat-widget';

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      {!open ? (
        <Button
          sx={{
            right: isMobile ? 16 : 32, // На десктопе отступ больше, чтобы кнопка была на уровне контента правого сайдбара
            bottom: isMobile ? 68 : 16,
            zIndex: 9999,
            borderRadius: 50,
            color: '#FFFFFF',
            position: 'fixed',
            bgcolor: '#2B2F3D',
            padding: '12px 24px',
            '&:hover': { bgcolor: '#CAAE51' },
          }}
          onClick={() => setOpen(true)}
          startIcon={<Iconify icon="mdi:message" width={24} />}
        >
          Chat
        </Button>
      ) : (
        <ChatWidget onClose={() => setOpen(false)} />
      )}
    </Box>
  );
};

export default ChatButton;
