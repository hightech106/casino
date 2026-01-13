// @mui
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import { Stack, useMediaQuery } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
// routes
import { RouterLink } from 'src/routes/components';
//
import Iconify from '../../iconify';
//
import type { NavItemProps, NavConfigProps } from '../types';
import { StyledItem, StyledIcon, StyledDotIcon } from './styles';

// ----------------------------------------------------------------------

type Props = NavItemProps & {
  config: NavConfigProps;
};

export default function NavItem({
  item,
  open,
  depth,
  active,
  config,
  externalLink,
  ...other
}: Props) {
  const { title, path, icon, info, children, disabled, caption, roles } = item;

  const subItem = depth !== 1;
  const isSmMobile = useMediaQuery('(max-width:520px)');

  const renderContent = isSmMobile ? (
    // Mobile layout: horizontal rectangle with icon left, text right
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: 56,
        px: 2,
        py: 1,
        mx: 1,
        mb: 1,
        borderRadius: 1,
        bgcolor: active ? 'rgba(138, 43, 226, 0.1)' : '#2B2F3D',
        border: active ? '1px solid #24ee89' : '1px solid transparent',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'rgba(138, 43, 226, 0.05)',
          border: '1px solid rgba(138, 43, 226, 0.3)',
        },
        cursor: 'pointer',
      }}
      {...other}
    >
      {/* Icon on the left */}
      {icon && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 32,
            minHeight: 32,
            mr: 2,
            color: active ? '#24ee89' : '#888',
            '& svg': {
              fontSize: '24px !important',
              width: '24px !important',
              height: '24px !important',
              color: active ? '#24ee89 !important' : '#888 !important',
              fill: active ? '#24ee89 !important' : '#888 !important',
            },
            '& .svg-color': {
              width: '24px !important',
              height: '24px !important',
              bgcolor: active ? '#24ee89 !important' : '#888 !important',
            },
          }}
        >
          {icon}
        </Box>
      )}

      {/* Title on the right */}
      <Box
        sx={{
          flex: 1,
          color: active ? '#24ee89' : '#A0A3A7',
          fontSize: 16,
          fontWeight: active ? 600 : 500,
          textTransform: 'capitalize',
        }}
      >
        {title}
      </Box>

      {/* Arrow for children */}
      {!!children && (
        <Box
          sx={{
            ml: 1,
            color: active ? '#24ee89' : '#888',
          }}
        >
          <Iconify
            width={20}
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
          />
        </Box>
      )}
    </Box>
  ) : (
    // Desktop layout: original vertical layout
    <StyledItem
      disableGutters
      disabled={disabled}
      active={active}
      depth={depth}
      config={config}
      className={active && !subItem ? 'selected' : ''}
      {...other}
    >
      {icon && (
        <StyledIcon
          size={subItem ? 24 : 28}
          sx={{
            mb: subItem ? 0.5 : 1,
            color: active ? '#24ee89 !important' : '#888 !important',
            zIndex: 2,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: subItem ? 24 : 28,
            minHeight: subItem ? 24 : 28,
            '& svg': {
              color: active ? '#24ee89 !important' : '#888 !important',
              fill: active ? '#24ee89 !important' : '#888 !important',
              fontSize: `${subItem ? 20 : 24}px !important`,
              width: `${subItem ? 20 : 24}px !important`,
              height: `${subItem ? 20 : 24}px !important`,
            },
            '& *': {
              color: active ? '#24ee89 !important' : '#888 !important',
              fill: active ? '#24ee89 !important' : '#888 !important',
            },
          }}
        >
          {icon}
        </StyledIcon>
      )}

      {subItem && !icon && (
        <StyledIcon
          size={24}
          sx={{
            mb: 0.5,
            color: active ? '#24ee89 !important' : '#888 !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& *': {
              color: active ? '#24ee89 !important' : '#888 !important',
            },
          }}
        >
          <StyledDotIcon active={active} />
        </StyledIcon>
      )}

      {!(config.hiddenLabel && !subItem) && (
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              color: '#A0A3A7',
              fontSize: subItem ? 10 : 12,
              fontWeight: 500,
              fontFamily: 'sans-serif',
              textTransform: 'uppercase',
              maxWidth: '100%',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: 1,
              letterSpacing: '0%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {title}
          </Box>
        </Box>
      )}

      {info && (
        <Box
          component="span"
          sx={{
            mt: 0.5,
            lineHeight: 0,
            fontSize: 10,
            color: '#A0A3A7',
            textDecoration: 'underline',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {info}
        </Box>
      )}

      {!!children && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          <Iconify
            width={16}
            icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
            sx={{ color: '#24ee89' }}
          />
        </Box>
      )}
    </StyledItem>
  );

  // Hidden item by role
  if (roles && !roles.includes(`${config.currentRole}`)) {
    return null;
  }

  // External link
  if (externalLink)
    return (
      <Link
        href={path}
        target="_blank"
        rel="noopener"
        underline="none"
        color="inherit"
        sx={{
          ...(disabled && {
            cursor: 'default',
          }),
        }}
      >
        {renderContent}
      </Link>
    );

  // Has child
  if (children) {
    return renderContent;
  }

  // Default
  return (
    <Link
      component={RouterLink}
      href={path}
      underline="none"
      color="#A0A3A7"
      sx={{
        ...(disabled && {
          cursor: 'default',
        }),
      }}
    >
      {renderContent}
    </Link>
  );
}
