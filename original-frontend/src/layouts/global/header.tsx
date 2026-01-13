// @mui
import { useTheme } from '@mui/material/styles';

import {
  Box, Stack, Button, AppBar, Typography, IconButton,
  Toolbar, ButtonGroup
} from '@mui/material';

// theme
import { bgBlur } from 'src/theme/css';

// store
import { useSelector } from 'src/store';

// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';
// utils
import { fCurrency } from 'src/utils/format-number';
//
import { HEADER, NAV } from '../config-layout';
import {
  Searchbar,
  AccountPopover
} from '../_common';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};

export default function Header({ onOpenNav }: Props) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  const { balance } = useSelector((store) => store.auth);

  const renderContent = (
    <>
      {/* {lgUp && isNavHorizontal && <Logo sx={{ mr: 2.5 }} />} */}
      <Logo sx={{ mr: 2.5 }} />

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >

        <ButtonGroup
          disableElevation
          variant="contained"
          sx={{
            position: "relative",
            boxShadow:
              'rgba(0, 0, 0, 0.2) 0px -1px 3px 0px, rgba(0, 0, 0, 0.12) 0px -1px 2px 0px, rgba(255, 255, 255, 0.04) 0px -1px 0px 0px inset',
          }}
        >
          <Button
            variant="contained"
            color="info"
          >
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography
                className="text-ellipse"
                sx={{
                  fontSize: 14,
                  lineHeight: '100%',
                  maxWidth: '100px',
                  '@media (max-width: 319px)': {
                    maxWidth: '75px',
                  },
                }}
              >
                {balance ? fCurrency(balance, false) : "0.00"}
              </Typography>
              <Box
                width={16}
                component="img"
                src="/assets/icons/coin/usdt.png"
                alt="icon"
              />

            </Stack>
          </Button>

        </ButtonGroup>

        {/* <LanguagePopover />

        <NotificationsPopover />

        <ContactsPopover />

        <SettingsButton /> */}

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        boxShadow: "#0003 0 4px 6px -1px,#0505141f 0 2px 4px -1px",
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
