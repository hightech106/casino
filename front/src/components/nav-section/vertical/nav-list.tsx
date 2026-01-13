import { useState, useEffect, useCallback } from 'react';
// @mui
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';
// routes
import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';
import { RouterLink } from 'src/routes/components';
//
import type { NavListProps, NavConfigProps } from '../types';
import NavItem from './nav-item';

// ----------------------------------------------------------------------

type NavListRootProps = {
  data: NavListProps;
  depth: number;
  hasChild: boolean;
  config: NavConfigProps;
};

export default function NavList({ data, depth, hasChild, config }: NavListRootProps) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, hasChild);

  const externalLink = data.path.includes('http');

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        externalLink={externalLink}
        onClick={handleToggle}
        config={config}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} config={config} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type NavListSubProps = {
  data: NavListProps[];
  depth: number;
  config: NavConfigProps;
};

function NavSubList({ data, depth, config }: NavListSubProps) {
  const pathname = usePathname();
  const isSmMobile = useMediaQuery('(max-width:520px)');
  
  return (
    <Box
      sx={{
        mt: 1,
        mb: 1,
        px: isSmMobile ? 0 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSmMobile ? 'stretch' : 'center',
        width: '100%',
      }}
    >
      {data.map((list) => {
        const active = pathname === list.path || pathname.startsWith(`${list.path}/`);
        const cleanTitle = list.title.replace(/\s*\(\d+\)$/, '');
        
        return (
          <Box
            key={list.title + list.path}
            component={RouterLink}
            href={list.path}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSmMobile ? 'flex-start' : 'center',
              py: isSmMobile ? 1.5 : 0.3,
              px: isSmMobile ? 3 : 0.5,
              mx: isSmMobile ? 1 : 0,
              mb: isSmMobile ? 1 : 0,
              width: isSmMobile ? 'calc(100% - 16px)' : '90%',
              textAlign: isSmMobile ? 'left' : 'center',
              color: active ? '#24ee89' : '#FFF',
              textDecoration: 'none',
              fontSize: isSmMobile ? 14 : 11,
              fontWeight: active ? 600 : 400,
              borderRadius: 1,
              bgcolor: (() => {
                if (isSmMobile && active) return 'rgba(138, 43, 226, 0.1)';
                if (isSmMobile) return '#2B2F3D';
                return 'transparent';
              })(),
              border: isSmMobile && active ? '1px solid rgba(138, 43, 226, 0.3)' : '1px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#24ee89',
                backgroundColor: 'rgba(138, 43, 226, 0.1)',
                border: isSmMobile ? '1px solid rgba(138, 43, 226, 0.3)' : 'none',
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: isSmMobile ? 14 : 11,
                fontWeight: 'inherit',
                color: 'inherit',
                textAlign: 'inherit',
                textTransform: isSmMobile ? 'capitalize' : 'lowercase',
                '&::first-letter': {
                  textTransform: 'uppercase',
                },
                whiteSpace: isSmMobile ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cleanTitle}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
