import { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

// @mui
import {
  Stack,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useResponsive } from 'src/hooks/use-responsive';
import Image from 'src/components/image';
import { LoadingScreen } from 'src/components/loading-screen';
import useApi from 'src/hooks/use-api';
import { API_URL } from 'src/config-global';
import type { IBlogData } from 'src/types';
import BlogDetailView from './detail';

// Styled components for custom fonts and effects
const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontStyle: 'italic',
}));

const StyledPostTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  transform: 'skew(-5deg)',
  fontStyle: 'italic',
  textTransform: 'uppercase',
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: '"Geogrotesque Cyr", Arial, sans-serif !important',
  fontWeight: '400 !important',
  fontStyle: 'normal',
}));

const StyledReadMore = styled(Typography)(({ theme }) => ({
  fontFamily: '"FONTSPRING DEMO - Blunt Con It Italic", "Impact", Arial, sans-serif !important',
  fontWeight: '400 !important',
  fontStyle: 'italic',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  color: '#A0A3A7',
  '&:hover': {
    color: '#24ee89',
  },
}));
// ----------------------------------------------------------------------

export default function FAQView() {
  const { get_blogs } = useApi();
  const settings = useSettingsContext();
  const mdDown = useResponsive('down', 'md');

  const [loading, setLoading] = useState<boolean>(false);
  const [allBlogs, setAllBlogs] = useState<IBlogData[]>([]);
  const [selected, setSelected] = useState<IBlogData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const postsPerPage = 12; // 4 posts per row on desktop, 3 rows = 12 posts per page

  const getList = useCallback(async () => {
    setLoading(true);
    const res = await get_blogs();
    setLoading(false);
    if (!res?.data) return;
    if (!res.data.length) return;
    // Sort blogs by creation date (newest first)
    const sortedBlogs = res.data
      .filter((e: IBlogData) => e.type === 'blog')
      .sort((a: IBlogData, b: IBlogData) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    setAllBlogs(sortedBlogs);
  }, [get_blogs]);

  useEffect(() => {
    getList();
  }, [getList]);

  const handleSelect = (item: IBlogData) => {
    setSelected(item);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Function to render main post title with first word yellow, rest white
  const renderMainPostTitle = (title: string) => {
    const words = title.toUpperCase().split(' ');
    const firstWord = words[0];
    const restWords = words.slice(1).join(' ');
    
    return (
      <>
        <span style={{ color: '#24ee89' }}>{firstWord}</span>
        {restWords && <span style={{ color: '#FFFFFF' }}> {restWords}</span>}
      </>
    );
  };

  if (loading) return <LoadingScreen sx={{ height: '70vh' }} />;

  if (selected) return <BlogDetailView data={selected} onClose={() => setSelected(null)} />;

  // Get the latest post (first in sorted array)
  const latestPost = allBlogs[0];
  
  // Get remaining posts for pagination (excluding the latest one)
  const remainingPosts = allBlogs.slice(1);
  const totalPages = Math.ceil(remainingPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = remainingPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <Container maxWidth="xl">
      <Stack gap={{ xs: 1.5, sm: 2.5 }} py={{ xs: 3, sm: 4 }}>
        {/* Banner header with centered text and yellow border - same as promotion view */}
        <Box
          sx={{
            position: 'relative',
            width: 1,
            height: { xs: 140, sm: 200 },
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
        <Image
          src="/assets/promotion/header.png"
          sx={{
            width: 1,
            height: 1,
            '& img': { 
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            },
            filter: 'brightness(0.9)',
          }}
        />
        {/* Inset yellow border */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            p: 1.5, // inset padding
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ border: '3px solid #24ee89', borderRadius: 1.5, width: '100%', height: '100%' }} />
        </Box>

        {/* Center title with gradient lines */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            width: '80%',
            maxWidth: 600,
          }}
        >
          {/* Left gradient line */}
          <Box
            sx={{
              flex: 1,
              height: '3px',
              background: 'linear-gradient(to right, transparent, #24ee89)',
              marginRight: 3,
            }}
          />
          
          <StyledTitle
            variant="h3"
            sx={{
              color: '#FFFFFF',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              fontSize: { xs: '1.8rem', sm: '2.5rem' },
            }}
          >
            BLOG
          </StyledTitle>
          
          {/* Right gradient line */}
          <Box
            sx={{
              flex: 1,
              height: '3px',
              background: 'linear-gradient(to left, transparent, #24ee89)',
              marginLeft: 3,
            }}
          />
        </Box>
      </Box>

      {/* Latest post - featured section */}
      {latestPost && (
        <Box
          sx={{
            mt: { xs: 2, sm: 3 },
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Image - half width */}
            <Grid item xs={12} md={6}>
              <Image
                src={`${API_URL}/${latestPost.image}`}
                sx={{
                  width: 1,
                  height: { xs: 200, sm: 300 },
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.3s ease',
                  },
                }}
                onClick={() => handleSelect(latestPost)}
              />
            </Grid>
            
            {/* Content - half width */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2} height={1} justifyContent="center" px={{ xs: 2, md: 0 }}>
                <StyledPostTitle
                  sx={{
                    fontSize: { xs: '24px', sm: '32px', md: '42px' },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelect(latestPost)}
                >
                  {renderMainPostTitle(latestPost.title)}
                </StyledPostTitle>
                
                <StyledDescription
                  sx={{
                    fontSize: { xs: '14px', sm: '16px' },
                    color: '#FFFFFF',
                    lineHeight: 1.6,
                  }}
                >
                  {latestPost.description}
                </StyledDescription>
                
                <StyledReadMore
                  onClick={() => handleSelect(latestPost)}
                >
                  READ MORE →
                </StyledReadMore>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Other posts grid */}
      {currentPosts.length > 0 && (
        <Box sx={{ mt: { xs: 3, sm: 4 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {currentPosts.map((post, index) => (
              <Grid 
                item 
                xs={6} // 2 posts per row on mobile
                sm={6} 
                md={3} // 4 posts per row on desktop
                key={index}
              >
                <Paper
                  sx={{
                    border: '2px solid #2B2F3D',
                    bgcolor: 'transparent',
                    borderRadius: 2,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleSelect(post)}
                >
                  <Image
                    src={`${API_URL}/${post.image}`}
                    sx={{
                      width: 1,
                      height: { xs: 120, sm: 160 },
                    }}
                  />
                  
                  <Stack spacing={1} p={{ xs: 1.5, sm: 2 }}>
                    <StyledPostTitle
                      sx={{
                        fontSize: { xs: '16px', sm: '20px' },
                        color: '#FFFFFF',
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </StyledPostTitle>
                    
                    <StyledDescription
                      sx={{
                        fontSize: { xs: '14px', sm: '16px' },
                        color: '#FFFFFF',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.description}
                    </StyledDescription>
                    
                    <StyledReadMore
                      sx={{
                        fontSize: { xs: '12px', sm: '14px' },
                        mt: 1,
                      }}
                    >
                      READ MORE →
                    </StyledReadMore>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#FFFFFF',
                borderColor: '#24ee89',
                '&:hover': {
                  bgcolor: '#24ee89',
                  color: '#000',
                },
                '&.Mui-selected': {
                  bgcolor: '#24ee89',
                  color: '#000',
                  '&:hover': {
                    bgcolor: '#E6D117',
                  },
                },
              },
            }}
          />
        </Box>
      )}
      </Stack>
    </Container>
  );
}
