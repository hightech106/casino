// @mui
import { alpha, styled } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
//
import type { NavItemProps, NavConfigProps } from '../types';

// ----------------------------------------------------------------------

type StyledItemProps = Omit<NavItemProps, 'item'> & {
  config: NavConfigProps;
};

export const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledItemProps>(({ active, depth, config, theme }) => {
  const subItem = depth !== 1;

  const deepSubItem = depth > 2;

  const activeStyles = {
    root: {
      color:
        theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
      backgroundColor: '#324532', // Фон для активного элемента
      '&:hover': {
        backgroundColor: '#324532', // Тот же фон при наведении
      },
    },
    sub: {
      color: theme.palette.text.primary,
      backgroundColor: '#324532', // Фон для активного подэлемента
      '&:hover': {
        backgroundColor: '#324532', // Тот же фон при наведении
      },
    },
  };

  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 4px', // Уменьшенные отступы для лучшего размещения
    marginBottom: config.itemGap,
    borderRadius: '8px',
    minHeight: subItem ? 60 : 80,
    width: '100%',
    border: 'none', // Убираем границы по умолчанию
    backgroundColor: '#2B2F3D',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    color: theme.palette.common.white,
    textAlign: 'center', // Центровка текста

    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 20px rgba(138, 43, 226, 0.3)',
      backgroundColor: '#2B2F3D',
      border: '1px solid #24ee89',
      '& .MuiListItemIcon-root': {
        color: '#24ee89 !important',
        '& svg': {
          color: '#24ee89 !important',
          fill: '#24ee89 !important',
        },
        '& *': {
          color: '#24ee89 !important',
          fill: '#24ee89 !important',
        },
      },
    },

    // Active root item
    ...(active && !subItem && {
      backgroundColor: '#2B2F3D',
      border: '2px solid #24ee89', // Желтая граница только у активных
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30px',
        background: 'linear-gradient(to bottom, rgba(138, 43, 226, 0.6), transparent)',
        borderRadius: '6px 6px 0 0',
        zIndex: 1,
      },
    }),

    // Sub item
    ...(subItem && {
      minHeight: 60,
      // Active sub item
      ...(active && {
        backgroundColor: '#2B2F3D',
        border: '1px solid #24ee89', // Желтая граница только у активных подпунктов
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '20px',
          background: 'linear-gradient(to bottom, rgba(138, 43, 226, 0.5), transparent)',
          borderRadius: '4px 4px 0 0',
          zIndex: 1,
        },
      }),
    }),

    // Deep sub item
    ...(deepSubItem && {
      paddingLeft: theme.spacing(depth),
    }),
  };
});

// ----------------------------------------------------------------------

type StyledIconProps = {
  size?: number;
};

export const StyledIcon = styled(ListItemIcon)<StyledIconProps>(({ size }) => ({
  width: size,
  height: size,
  minWidth: size,
  minHeight: size,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
}));

type StyledDotIconProps = {
  active?: boolean;
};

export const StyledDotIcon = styled('span')<StyledDotIconProps>(({ active, theme }) => ({
  width: 4,
  height: 4,
  borderRadius: '50%',
  backgroundColor: active ? '#24ee89' : '#888',
  transition: theme.transitions.create(['transform', 'backgroundColor'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(active && {
    transform: 'scale(1.5)',
    backgroundColor: '#24ee89',
  }),
}));

// ----------------------------------------------------------------------

type StyledSubheaderProps = {
  config: NavConfigProps;
};

export const StyledSubheader = styled(ListSubheader)<StyledSubheaderProps>(({ config, theme }) => ({
  ...theme.typography.overline,
  fontSize: 11,
  cursor: 'pointer',
  display: 'inline-flex',
  padding: config.itemPadding,
  paddingTop: theme.spacing(2),
  marginBottom: config.itemGap,
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.disabled,
  transition: theme.transitions.create(['color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    color: theme.palette.text.primary,
  },
}));