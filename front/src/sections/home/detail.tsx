// @mui
import { Container, Stack, Typography, Button, Link, Breadcrumbs, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import Image from 'src/components/image';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import type { IBlogData } from 'src/types';
import { API_URL } from 'src/config-global';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

// Styled components for custom fonts and effects
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
// ----------------------------------------------------------------------

type Props = {
    data: IBlogData;
    onClose: () => void;
}

export default function BlogDetailView({ data, onClose }: Props) {

    useScrollToTop();

    const router = useRouter();
    const { title, description, image } = data;
    const smDown = useResponsive('down', 'sm');


    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        onClose();
    }


    return (
        <Stack gap={{ xs: 2, sm: 3 }} py={{ xs: 2, sm: 3 }}>
            {/* Back button - gray arrow */}
            <Box sx={{ px: { xs: 2, sm: 3 } }}>
                <Button
                    startIcon={<Iconify icon="eva:arrow-back-fill" />}
                    onClick={onClose}
                    sx={{
                        color: '#A0A3A7',
                        '&:hover': {
                            color: '#FFFFFF',
                            bgcolor: 'transparent',
                        },
                        textTransform: 'none',
                        fontSize: '16px',
                        fontWeight: 400,
                    }}
                >
                    Back to all posts
                </Button>
            </Box>

            {/* Banner image - full width */}
            <Box
                sx={{
                    width: 1,
                    height: { xs: 200, sm: 300, md: 400 },
                    overflow: 'hidden',
                    mb: { xs: -4, sm: -6, md: -8 }, // Negative margin to allow overlap
                }}
            >
                <Image
                    src={`${API_URL}/${image}`}
                    sx={{
                        width: 1,
                        height: 1,
                        '& img': { 
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                        },
                    }}
                />
            </Box>

            {/* Content block that slightly overlaps the banner */}
            <Container maxWidth="lg">
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        width: { xs: '90%', sm: '80%', md: '70%' },
                        maxWidth: '800px',
                        mx: 'auto',
                        bgcolor: '#232626',
                        border: '2px solid #2B2F3D',
                        borderRadius: 2,
                        p: { xs: 3, sm: 4, md: 5 },
                    }}
                >
                    <Stack spacing={{ xs: 3, sm: 4 }}>
                        {/* Post title - yellow, FONTSPRING DEMO - Blunt Con It, uppercase, skew -5deg */}
                        <StyledPostTitle
                            variant="h2"
                            sx={{
                                color: '#24ee89',
                                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                                lineHeight: 1.2,
                                textAlign: 'center',
                            }}
                        >
                            {title}
                        </StyledPostTitle>

                        {/* Description - Geogrotesque Cyr, 16px, regular */}
                        <StyledDescription
                            sx={{
                                fontSize: '16px',
                                color: '#FFFFFF',
                                lineHeight: 1.6,
                                whiteSpace: 'pre-wrap',
                                textAlign: 'left',
                            }}
                        >
                            {description}
                        </StyledDescription>
                    </Stack>
                </Box>
            </Container>
        </Stack>
    );
}
