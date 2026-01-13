import { useEffect} from 'react';
import { isMobile } from "react-device-detect";
import {
    Button,
    Dialog,
    IconButton,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import Image from "src/components/image";
import Iconify from "src/components/iconify";
import { API_URL } from "src/config-global";
import type { IPopup } from "src/types";

type Props = {
    open: boolean;
    onClose: () => void;
    data: IPopup | null;
};

export const PopupDialog = ({ open, data, onClose }: Props) => {
    const isSmMobile = useMediaQuery('(max-width:520px)');

    useEffect(() => {
    if (open) {
        console.log('PopupDialog opened with data:', data);
    }
}, [open, data]);

    const handleClose = () => {
        onClose();
    };

    const openLink = (link: string) => {
        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            console.warn("Invalid URL provided:", link);
            return;
        }
        window.open(link, "_blank");
    };

    if (!data || !data.link) {
        return <></>;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            sx={{
                zIndex: 10000,
                '& .MuiDialog-paperFullWidth': {
                    maxWidth: 985,
                    position: 'relative',
                    overflow: 'hidden',
                },
            }}
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    height: "auto",
                    width: "auto",
                    ...(isMobile && isSmMobile && {
                        width: "100%",
                        height: "auto",
                        margin: 0,
                        borderRadius: 0,
                        justifyContent: "center",
                        alignItems: "center",
                    }),
                },
            }}
        >
            <Image
                src={`${API_URL}/${data.banner}`}
                sx={{
                    width: "90%",
                    maxHeight: 400,
                    height: "auto",
                    objectFit: "contain",
                    mt: 2,
                    mx: 2,
                    mb: 1,
                    "& img": {
                        width: "100%",
                        height: "auto",
                        maxHeight: 400,
                        objectFit: "contain",
                    },
                }}
            />

            <Stack sx={{ mt: 1, p: 3 }}>
                <Typography variant="h5">{data.popupMessage}</Typography>
                <Typography sx={{ mt: 1, whiteSpace: 'nowrap' }}>{data.note}</Typography>
                <Stack alignItems="center" width={1}>
                    <Button
                        color="primary"
                        variant="outlined"
                        sx={{
                            backgroundColor: '#2B2F3D', borderRadius: 1, color: '#FFFFFF',
                            mt: 2,
                        }}
                        onClick={() => {
                            console.log("Opening link:", data.link);
                            openLink(data.link);
                        }}
                    >
                        Follow to link
                    </Button>
                </Stack>
            </Stack>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    color: 'common.white',
                    "&:hover": {
                        color: 'common.white',
                    },
                    zIndex: 1,
                }}
            >
                <Iconify icon="mdi:close" />
            </IconButton>
        </Dialog>
    );
};