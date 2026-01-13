import { format, formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
// store
import { dispatch } from 'src/store';
import { updateHistory } from 'src/store/reducers/sports';
// hooks
import { useLocales } from 'src/locales';
import useApi from 'src/hooks/use-api';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useRouter } from 'src/routes/hooks';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { paths } from 'src/routes/paths';
import { API_URL } from 'src/config-global';
import type { SportsHistoryProps } from 'src/types';
import { fShortNumber } from 'src/utils/format-number';

import { StatusBadge, WTab, WTabs } from './others';
import { MyBetsSportsSkeleton } from './skeleton';
//

// ----------------------------------------------------------------------

export default function MyBetsSportsView() {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const settings = useSettingsContext();
  const { get_sports_history } = useApi();
  const { copy } = useCopyToClipboard();

  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<SportsHistoryProps[]>([]);
  const [showed, setShowed] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  const getList = async () => {
    setLoading(true);
    const res = await get_sports_history(activeTab === 0 ? 'Active' : 'Settled');
    setLoading(false);
    if (!res?.data) return;
    if (activeTab === 0) dispatch(updateHistory(res?.data));
    setList(res.data);
  };

  const tabChangeHandler = (event: React.SyntheticEvent, index: number) => {
    setActiveTab(index);
  };

  const onCopy = useCallback(
    (text: string) => {
      if (text) {
        copy(text);
      }
    },
    [copy]
  );

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, [activeTab]);

  return (
    <Container maxWidth={false} sx={{ bgcolor: '#232626', minHeight: '100vh', py: 3 }}>
      <CustomBreadcrumbs
        heading={t('sports')}
        links={[
          {
            name: t('my_bets'),
          },
          {
            name: t('sports'),
          },
        ]}
        sx={{
          mb: 3,
          '& .MuiBreadcrumbs-ol': {
            color: '#FFFFFF'
          },
          '& .MuiTypography-root': {
            color: '#24ee89',
            fontWeight: 600
          }
        }}
      />
      <Stack>
        <Box sx={{ mb: 3 }}>
          <WTabs
            value={activeTab}
            onChange={tabChangeHandler}
            aria-label="icon"
            sx={{
              '& .MuiTabs-flexContainer': {
                bgcolor: '#2B2F3D',
                border: '1px solid #3A3F50',
                borderRadius: '12px',
                padding: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              },
              '& .MuiTab-root': {
                bgcolor: 'transparent',
                color: '#FFFFFF',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                '&.Mui-selected': {
                  bgcolor: '#24ee89',
                  color: '#050514',
                  borderRadius: '8px',
                  transform: 'scale(1.02)',
                  boxShadow: '0 2px 8px rgba(138, 43, 226, 0.4)',
                },
                '&:hover': {
                  bgcolor: 'rgba(138, 43, 226, 0.1)',
                }
              },
            }}
          >
            <WTab label={t('active')} iconPosition="start" />
            <WTab label={t('settled')} iconPosition="start" />
          </WTabs>
        </Box>
        <Grid container spacing={2}>
          {loading
            ? [...Array(3)].map((_, index) => <MyBetsSportsSkeleton key={index} />)
            : (list.length === 0 && (
                <EmptyContent
                  title={t('no_data')}
                  sx={{
                    py: 10,
                  }}
                />
              )) ||
              list.map((row, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Card sx={{ 
                    borderRadius: '12px', 
                    bgcolor: '#2B2F3D', 
                    border: '1px solid #3A3F50',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(138, 43, 226, 0.2)',
                      border: '1px solid #24ee89'
                    }
                  }}>
                    <CardHeader
                      sx={{ 
                        py: 2, 
                        bgcolor: '#24ee89',
                        borderRadius: '12px 12px 0 0',
                        '& .MuiCardHeader-title': {
                          fontSize: '14px'
                        }
                      }}
                      title={
                        <Stack
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack flexDirection="row" alignItems="center" gap={1.5}>
                            <Stack>
                              <Iconify
                                icon={
                                  row.type === 'single'
                                    ? 'ph:bookmark-simple-fill'
                                    : 'bi:bookmarks-fill'
                                }
                                sx={{ width: 22, height: 22, color: '#000' }}
                              />
                            </Stack>
                            <Box>
                              <StatusBadge status={row.status} />
                            </Box>
                          </Stack>
                          <Typography fontSize={12} sx={{ 
                            color: '#000', 
                            fontWeight: 600,
                            opacity: 0.8
                          }}>
                            {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                          </Typography>
                        </Stack>
                      }
                    />
                    <CardContent sx={{ p: 0 }}>
                      <Box px={3} pt={3}>
                        <Stack width={1} flexDirection="row" justifyContent="space-between">
                          <Box
                            sx={{
                              width: 1,
                              display: 'grid',
                              textAlign: 'right',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: 1.5,
                              '& .label': {
                                textAlign: 'left',
                                color: '#FFFFFF',
                                fontWeight: 600,
                                fontSize: '13px',
                                opacity: 0.8
                              },
                              '& .value': {
                                color: '#24ee89',
                                fontWeight: 700,
                                fontSize: '14px'
                              }
                            }}
                          >
                            <Typography className="label">{t('total_odds')}</Typography>
                            <Typography className="value">{fShortNumber(row.odds)}</Typography>
                            <Typography className="label">{t('total_stake')}</Typography>
                            <Typography className="value">{fShortNumber(row.stake)}</Typography>
                            <Typography className="label">{t('payout')}</Typography>
                            <Typography className="value">{fShortNumber(row.potential)}</Typography>
                          </Box>
                        </Stack>
                      </Box>
                      <Stack
                        width={1}
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                        px={3}
                        pb={2}
                        sx={{ '& .MuiDivider-root': { borderColor: '#24ee89' } }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{
                            color: '#24ee89',
                            borderColor: '#24ee89',
                            borderRadius: '8px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '12px',
                            px: 2,
                            py: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': { 
                              borderColor: '#A64BFF', 
                              color: '#000',
                              bgcolor: '#24ee89',
                              transform: 'scale(1.05)'
                            }
                          }}
                          onClick={() => {
                            if (!showed.includes(index)) setShowed([...showed, index]);
                            else setShowed(showed.filter((e) => e !== index));
                          }}
                        >
                          {!showed.includes(index) ? t('detail') : t('hide')}
                        </Button>
                        <IconButton 
                          onClick={() => onCopy(`${API_URL}?b=${row.betsId}`)}
                          sx={{
                            color: '#24ee89',
                            bgcolor: 'rgba(138, 43, 226, 0.1)',
                            border: '1px solid #24ee89',
                            borderRadius: '8px',
                            width: 40,
                            height: 40,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: '#24ee89',
                              color: '#000',
                              transform: 'scale(1.1)'
                            }
                          }}
                        >
                          <Iconify icon="flowbite:link-outline" width={18} />
                        </IconButton>
                      </Stack>
                      <Collapse in={showed.includes(index)} timeout="auto" unmountOnExit>
                        <Box sx={{ bgcolor: '#232626', borderRadius: '0 0 12px 12px' }}>
                          {row.bettings.map((e, i) => (
                            <Stack
                              key={i}
                              sx={{
                                p: 3,
                                ...(i !== 0 && {
                                  borderTop: '1px dashed rgba(138, 43, 226, 0.3)',
                                }),
                              }}
                            >
                              <Stack flexDirection="row" gap={1} alignItems="center" mb={1}>
                                <Box
                                  component="i"
                                  className={`sportsicons sportsicon-${e.SportId}`}
                                  sx={{ 
                                    color: '#24ee89',
                                    fontSize: '18px'
                                  }}
                                />
                                <Link
                                  color="#FFFFFF"
                                  fontSize={15}
                                  sx={{ 
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    '&:hover': {
                                      color: '#24ee89',
                                      textDecoration: 'underline'
                                    }
                                  }}
                                  onClick={() => {
                                    router.push(
                                      `/${currentLang.value}${paths.sports.root}/${e.SportId}/detail/${e.eventId}`
                                    );
                                  }}
                                >
                                  {`${e.HomeTeam} - ${e.AwayTeam}`}
                                </Link>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                sx={{ mb: 1 }}
                              >
                                <Typography 
                                  fontSize={13} 
                                  sx={{ 
                                    color: '#FFFFFF',
                                    opacity: 0.7,
                                    fontWeight: 500
                                  }}
                                >
                                  {e.marketName}
                                </Typography>
                                <Typography 
                                  fontSize={11} 
                                  sx={{ 
                                    color: '#24ee89',
                                    opacity: 0.8,
                                    fontWeight: 600
                                  }}
                                >
                                  {format(new Date(e.Time), 'EEE, MMM dd, h:mm a')}
                                </Typography>
                              </Stack>

                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                  bgcolor: 'rgba(138, 43, 226, 0.1)',
                                  borderRadius: '6px',
                                  p: 1.5,
                                  border: '1px solid rgba(138, 43, 226, 0.2)'
                                }}
                              >
                                <Typography 
                                  sx={{ 
                                    color: '#FFFFFF',
                                    fontWeight: 600,
                                    fontSize: '13px'
                                  }}
                                >
                                  {e.oddName}
                                </Typography>
                                <Typography 
                                  sx={{ 
                                    color: '#24ee89',
                                    fontWeight: 700,
                                    fontSize: '14px'
                                  }}
                                >
                                  {e.odds}
                                </Typography>
                              </Stack>
                            </Stack>
                          ))}
                        </Box>
                      </Collapse>

                      <Divider sx={{ my: 1 }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Stack>
    </Container>
  );
}
