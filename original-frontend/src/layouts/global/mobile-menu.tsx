import { memo, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, ToggleButton, ToggleButtonGroup, toggleButtonGroupClasses, Typography } from '@mui/material';

import Iconify from 'src/components/iconify';
import { usePathname, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { ICONS } from './config-navigation';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    bottom: 0,
    zIndex: 99,
    width: '100vw',
    height: '60px',
    position: 'fixed',
    alignItems: 'center',
    borderRadius: "3px 3px 0 0",
    display: "flex",
    justifyContent: "space-between",
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: "8px 8px 0",
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
        },
    },
}));

const MOBILEMENU = [
    {
        url: paths.home.root,
        label: "Home",
        icon: ICONS.home
    },
    {
        url: paths.crash.root,
        label: "Crash",
        icon: ICONS.crash
    },
    {
        url: paths.coinflip.root,
        label: "Coinflip",
        icon: ICONS.coinflip
    },
    {
        url: paths.plinko.root,
        label: "Plinko",
        icon: ICONS.plinko
    },
    {
        url: paths.user.history,
        label: "Profile",
        icon: ICONS.profile
    }
]


const MobileMenu = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [activeIndex, setActiveIndex] = useState<string>("/");

    const handleClick = (event: React.MouseEvent<HTMLElement>,
        value: string) => {
        router.push(value);
    }

    useEffect(() => {
        const actived = MOBILEMENU.find((e) => e.url === pathname);
        if (!actived) return;
        setActiveIndex(actived?.url);
    }, [pathname])

    return (
        // <Stack
        //     direction="row"
        //     justifyContent="space-around"
        //     sx={{
        // bottom: 0,
        // zIndex: 99,
        // width: '100vw',
        // height: '60px',
        // position: 'fixed',
        // alignItems: 'center',
        // borderTop: "1px solid #67F962",
        // bgcolor: "background.paper",
        //     }}
        // >
        //     {MOBILEMENU.map((menu, key) => (
        //         <Stack alignItems="center" key={key} onClick={() => handleClick(menu.url)} >
        //             <Iconify icon={menu.icon} />
        //             <Typography sx={{ fontSize: '12px', color: 'white' }}>
        //                 {menu.label}
        //             </Typography>
        //         </Stack>
        //     ))}

        // </Stack>
        <StyledToggleButtonGroup
            size="small"
            value={activeIndex}
            exclusive
            onChange={handleClick}
        >
            {MOBILEMENU.map((menu, index) => (
                <ToggleButton
                    key={index}
                    value={menu.url}
                    sx={{
                        py: 0.8,
                        px: 1.5,
                        fontWeight: 500,
                        borderRadius: "4px !important",
                        whiteSpace: 'nowrap',
                        textTransform: "uppercase",
                        color: "text.primary",
                    }}
                >
                    <Stack alignItems="center" >
                        {menu.icon}
                        <Typography sx={{ fontSize: '12px', color: 'white' }}>
                            {menu.label}
                        </Typography>
                    </Stack>
                </ToggleButton>
            ))}
        </StyledToggleButtonGroup>
    );
};

export default memo(MobileMenu);
