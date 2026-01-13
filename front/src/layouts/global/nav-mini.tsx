// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// theme
import { hideScroll } from 'src/theme/css';
// hooks
import { useMockedUser } from 'src/hooks/use-mocked-user';
// components
import { NavSectionMini } from 'src/components/nav-section';
import type { NavListProps } from 'src/components/nav-section';
import Scrollbar from 'src/components/scrollbar';
//
import { HEADER, NAV } from '../config-layout';
import { NavToggleButton } from '../_common';

// ----------------------------------------------------------------------
type Props = {
  navData: {
    subheader: string;
    items: NavListProps[];
  }[];
};

export default function NavMini({ navData }: Props) {
  const { user } = useMockedUser();

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <NavToggleButton
        sx={{
          left: NAV.W_MINI - 12,
          top: 22 + HEADER.H_DESKTOP,
        }}
      />

      <Stack
        sx={{
          pt: 1,
          pb: 2,
          position: 'sticky',
          width: NAV.W_MINI,
          top: `${HEADER.H_DESKTOP}px`,
          mt: `${HEADER.H_DESKTOP - 26}px`,
          height: `calc(100vh - ${HEADER.H_DESKTOP + 1}px)`,
          bgcolor: '#142214',
          borderRight: '2px solid #CAAE51',
          ...hideScroll.x,
        }}
      >
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column',
            },
            '& .simplebar-track.simplebar-vertical': {
              backgroundColor: '#664401',
            },
            '& .simplebar-scrollbar:before': {
              backgroundColor: '#142214',
            },
          }}
        >
          <NavSectionMini
            data={navData}
            config={{
              currentRole: user?.role || 'admin',
            }}
            sx={{
              bgcolor: 'transparent',
              '& .MuiList-root': {
                bgcolor: 'transparent',
              },
              '& .MuiListItemButton-root': {
                bgcolor: 'transparent',
                color: '#FFFFFF',
                '&:hover': {
                  bgcolor: '#CAAE51',
                },
              },
              '& .MuiListItemIcon-root': {
                color: '#FFFFFF',
              },
              '& .MuiTypography-root': {
                color: '#FFFFFF',
              },

              '& .MuiMenu-root': {
                '& .MuiPaper-root': {
                  bgcolor: '#142214',
                  border: '2px solid #CAAE51',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
                '& .MuiList-root': {
                  bgcolor: '#142214',
                },
                '& .MuiMenuItem-root': {
                  bgcolor: '#142214',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#CAAE51',
                  },
                },
              },

              '& .MuiPopper-root': {
                '& .MuiPaper-root': {
                  bgcolor: '#142214',
                  border: '2px solid #CAAE51',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                },
                '& .MuiList-root': {
                  bgcolor: '#142214',
                },
                '& .MuiMenuItem-root': {
                  bgcolor: '#142214',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#CAAE51',
                  },
                },
              },
            }}
          />
        </Scrollbar>
      </Stack>
    </Box>
  );
}
