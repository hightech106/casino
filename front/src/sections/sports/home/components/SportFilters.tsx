import { useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Typography,
  Switch,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import useApi from 'src/hooks/use-api';
import { useLocales } from 'src/locales';
import menu from '../../../../assets/sports/menu.png';

// ----------------------------------------------------------------------

type SportType = {
  _id: string;
  icon: string;
  color: string;
  SportId: number;
  SportName: string;
  live: boolean;
  upcoming: boolean;
  img: string;
  count: number;
};

type SportFiltersProps = {
  activeSport?: number;
  onSportChange?: (sportId: number) => void;
  liveFilter?: boolean;
  onLiveFilterChange?: (isLive: boolean) => void;
  footballMatchCount?: number; // Actual football match count
};

export default function SportFilters({
  activeSport = 1,
  onSportChange,
  liveFilter = false,
  onLiveFilterChange,
  footballMatchCount = 0,
}: SportFiltersProps) {
  const { currentLang } = useLocales();
  const { get_sports_list } = useApi();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [sports, setSports] = useState<SportType[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [internalLiveFilter, setInternalLiveFilter] = useState(liveFilter);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Calculate max visible sports based on screen size
  const getMaxVisibleSports = () => {
    if (isMobile) return 4; // Show 4 on mobile
    if (isTablet) return 6; // Show 6 on tablet
    if (isDesktop) return 10; // Show up to 12 on desktop
    return 8; // Default for medium screens
  };

  const maxVisibleSports = getMaxVisibleSports();

  const fetchSports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await get_sports_list('ALL', currentLang.value);
      if (res?.data) {
        setSports(res.data);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setLoading(false);
    }
  }, [get_sports_list, currentLang.value]);

  useEffect(() => {
    fetchSports();
  }, [fetchSports]);

  // Sync internal state with prop changes
  useEffect(() => {
    setInternalLiveFilter(liveFilter);
  }, [liveFilter]);

  const handleSportClick = (sportId: number) => {
    if (onSportChange) {
      onSportChange(sportId);
    }
  };

  const handleLiveToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setInternalLiveFilter(newValue);
    if (onLiveFilterChange) {
      onLiveFilterChange(newValue);
    }
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownSportClick = (sportId: number) => {
    handleSportClick(sportId);
    handleDropdownClose();
  };

  const handleImageError = (sportId: string) => {
    setImageErrors((prev) => new Set(Array.from(prev).concat(sportId)));
  };

  // Filter sports based on live filter
  const filteredSports = internalLiveFilter
    ? sports.filter((sport) => sport.live === true)
    : sports;

  // Calculate which sports to show and which to hide
  const visibleSports = filteredSports.slice(0, maxVisibleSports);
  const hiddenSports = filteredSports.slice(maxVisibleSports);
  const showDropdown = hiddenSports.length > 0;

  // Function to get the appropriate icon for a sport
  const getSportIcon = (sport: SportType) => {
    // If icon is a URL or path, use it directly
    if (sport.icon?.startsWith('http') || sport.icon?.startsWith('/')) {
      return sport.icon;
    }

    // If icon is an ID, map it to a material icon based on sport name
    const sportIconMap: { [key: string]: string } = {
      Football: 'material-symbols:sports-soccer',
      Soccer: 'material-symbols:sports-soccer',
      Basketball: 'material-symbols:sports-basketball',
      Tennis: 'material-symbols:sports-tennis',
      Volleyball: 'material-symbols:sports-volleyball',
      'Ice Hockey': 'material-symbols:sports-hockey',
      Hockey: 'material-symbols:sports-hockey',
      Cricket: 'material-symbols:sports-cricket',
      Handball: 'material-symbols:sports-handball',
      Baseball: 'material-symbols:sports-baseball',
      'American Football': 'material-symbols:sports-american-football',
      Rugby: 'material-symbols:sports-rugby',
      'Table Tennis': 'material-symbols:sports-table-tennis',
      Badminton: 'material-symbols:sports-badminton',
      Esports: 'material-symbols:sports-esports',
    };

    return sportIconMap[sport.SportName] || 'material-symbols:sports';
  };

  // Function to get the correct match count for a sport
  const getSportCount = (sport: SportType) => {
    // For football (SportId === 1), use the actual match count from Redux
    if (sport.SportId === 1) {
      return footballMatchCount;
    }
    // For other sports, use the API count
    return sport.count;
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ mb: 1, background: '#2B2F3D', px: 2, py: 1 }}
    >
      {/* LIVE Toggle */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: 'none', sm: 'flex' } }}
      >
        <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
          LIVE
        </Typography>
        <Switch
          checked={internalLiveFilter}
          onChange={handleLiveToggle}
          size="small"
          sx={{
            '& .MuiSwitch-switchBase': {
              '&.Mui-checked': {
                color: '#24ee89',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#24ee89',
                },
              },
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#404040',
            },
          }}
        />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ display: { xs: 'flex', sm: 'none' }, width: '100%' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexGrow={1}
          justifyContent="flex-start"
        >
          <Button sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
            <Iconify icon="mdi:soccer" sx={{ width: 30, height: 30 }} />
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              FootBall
            </Typography>
          </Button>
        </Stack>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="medium"
            onClick={showDropdown ? handleDropdownOpen : undefined}
            disabled={!showDropdown}
            sx={{
              borderRadius: '1',
              p: 1,
              color: showDropdown ? 'white' : '#A6A6C2',
              opacity: showDropdown ? 1 : 0.5,
              cursor: showDropdown ? 'pointer' : 'default',
              '&:hover': showDropdown
                ? {
                    bgcolor: '#404040',
                  }
                : {},
              transition: 'all 0.2s ease',
            }}
          >
            <Box component="img" src={menu} sx={{ width: 38, height: 18 }} />
          </Button>
        </div>
      </Stack>

      {/* Sport Icons */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          display: { xs: 'none', sm: 'flex' },
          flex: 1,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: '#2B2F3D',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#24ee89',
            borderRadius: 2,
          },
        }}
      >
        {loading ? (
          // Loading skeleton
          [...Array(5)].map((_, index) => (
            <Box
              key={index}
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#404040',
                borderRadius: 1,
                animation: 'pulse 1.5s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                },
              }}
            />
          ))
        ) : (
          <>
            {visibleSports.map((sport) => (
              <Stack
                key={sport._id}
                direction="row"
                alignItems="center"
                spacing={0.5}
                onClick={() => handleSportClick(sport.SportId)}
                sx={{
                  minWidth: isMobile ? 32 : 36, // Smaller on mobile
                  cursor: 'pointer',
                  p: isMobile ? 0.5 : 0.75, // Less padding
                  borderRadius: 1,
                  bgcolor: 'transparent',
                  color: activeSport === sport.SportId ? '#24ee89' : 'white',
                  '&:hover': {
                    bgcolor: '#404040',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 24 : 28, // Smaller icons
                    height: isMobile ? 24 : 28,
                    borderRadius: '50%',
                    bgcolor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {(() => {
                    const isImageUrl =
                      sport.icon?.startsWith('http') || sport.icon?.startsWith('/');
                    const hasImageError = imageErrors.has(sport._id);

                    if (isImageUrl && !hasImageError) {
                      return (
                        <Box
                          component="img"
                          src={sport.icon}
                          onError={() => handleImageError(sport._id)}
                          sx={{
                            width: isMobile ? 14 : 16,
                            height: isMobile ? 14 : 16,
                            objectFit: 'contain',
                          }}
                        />
                      );
                    }

                    return (
                      <Iconify
                        icon={getSportIcon(sport)}
                        sx={{
                          width: isMobile ? 14 : 16,
                          height: isMobile ? 14 : 16,
                          color: activeSport === sport.SportId ? '#24ee89' : 'white',
                        }}
                      />
                    );
                  })()}
                  {/* Match count badge */}
                  {getSportCount(sport) > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        color: activeSport === sport.SportId ? '#24ee89' : 'white',
                        borderRadius: '50%',
                        width: isMobile ? 12 : 14,
                        height: isMobile ? 12 : 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: isMobile ? '0.5rem' : '0.55rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {getSportCount(sport)}
                    </Box>
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: activeSport === sport.SportId ? '#24ee89' : 'white',
                    fontWeight: activeSport === sport.SportId ? 600 : 400,
                    fontSize: isMobile ? '0.55rem' : '0.6rem',
                    textAlign: 'center',
                    display: { xs: 'none', sm: 'block' }, // Show on smaller screens too
                  }}
                >
                  {sport.SportName}
                </Typography>
              </Stack>
            ))}
          </>
        )}
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            size="medium"
            onClick={showDropdown ? handleDropdownOpen : undefined}
            disabled={!showDropdown}
            sx={{
              borderRadius: '1',
              p: 1,
              color: showDropdown ? 'white' : '#A6A6C2',
              opacity: showDropdown ? 1 : 0.5,
              cursor: showDropdown ? 'pointer' : 'default',
              '&:hover': showDropdown
                ? {
                    bgcolor: '#404040',
                  }
                : {},
              transition: 'all 0.2s ease',
            }}
          >
            <Box component="img" src={menu} sx={{ width: 38, height: 18 }} />
          </Button>
        </div>
      </Stack>

      {/* Dropdown Menu for additional sports */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        PaperProps={{
          sx: {
            bgcolor: '#2B2F3D',
            border: '1px solid #404040',
            borderRadius: 2,
            minWidth: 200,
            maxHeight: 300,
            '& .MuiMenuItem-root': {
              color: 'white',
              '&:hover': {
                bgcolor: '#404040',
              },
              '&.Mui-selected': {
                bgcolor: '#24ee89',
                color: '#232626',
                '&:hover': {
                  bgcolor: '#24ee89',
                },
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {hiddenSports.map((sport) => (
          <MenuItem
            key={sport._id}
            onClick={() => handleDropdownSportClick(sport.SportId)}
            selected={activeSport === sport.SportId}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
              {(() => {
                const isImageUrl = sport.icon?.startsWith('http') || sport.icon?.startsWith('/');
                const hasImageError = imageErrors.has(sport._id);

                if (isImageUrl && !hasImageError) {
                  return (
                    <Box
                      component="img"
                      src={sport.icon}
                      onError={() => handleImageError(sport._id)}
                      sx={{
                        width: 16,
                        height: 16,
                        objectFit: 'contain',
                      }}
                    />
                  );
                }

                return (
                  <Iconify
                    icon={getSportIcon(sport)}
                    sx={{
                      width: 16,
                      height: 16,
                      color: activeSport === sport.SportId ? '#24ee89' : 'white',
                    }}
                  />
                );
              })()}
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  color: activeSport === sport.SportId ? '#24ee89' : 'white',
                  fontWeight: activeSport === sport.SportId ? 600 : 400,
                }}
              >
                {sport.SportName}
              </Typography>
              {getSportCount(sport) > 0 && (
                <Box
                  sx={{
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                  }}
                >
                  {getSportCount(sport)}
                </Box>
              )}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}
