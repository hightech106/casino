import { useCallback, useEffect, useMemo, useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import SumsubWebSdk from '@sumsub/websdk-react'


import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// country-state-city
import { City, Country, State } from 'country-state-city';
import type { ICity, IState } from 'country-state-city';
import {
    CircularProgress,
    Dialog, DialogActions,
    DialogContent, DialogProps, DialogTitle, IconButton,
    InputAdornment, Tab, Tabs, TextField, Tooltip
} from '@mui/material';
// components
import FormProvider, {
    RHFAutocomplete,
    RHFTextField,
    RHFUploadAvatar
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useLocales } from 'src/locales';
import { useSelector } from 'src/store';

import useApi from 'src/hooks/use-api';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// utils
import { fData } from 'src/utils/format-number';
import { base64ToBlob } from 'src/utils';
import { API_URL, SUMSUB_URL } from 'src/config-global';
// ----------------------------------------------------------------------


import 'react-html5-camera-photo/build/css/index.css';

const GENDER = [
    "Male",
    "Female"
];

const DocumentImg = "/assets/images/document.png";
const FrontPassportImg = "/assets/images/front-id.jpg";
const BackPassportImg = "/assets/images/back-id.jpg";
const SelfieImg = "/assets/images/selfie-id.jpg";

type Props = {
    country: string;
    onClose: () => void;
}

export default function KYCForm({ country, onClose }: Props) {
    const { t, currentLang } = useLocales();

    const TITLES = [
        t("persanal_details"),
        t("upload_your_passport_or_ID"),
        t("upload_your_selfie"),
    ]

    const DESCRIPTIONS = [
        t("persanal_details_desc"),
        t("upload_your_passport_or_ID_desc"),
        t("upload_your_selfie"),
    ]

    const smDown = useResponsive('down', 'sm');
    const { user, token } = useSelector((store) => store.auth);

    const { upload_file, delete_file, verify_KYC, get_sumsub_access_token } = useApi();

    const QRURL = `${API_URL}/${currentLang.value}/kyc/upload?session=${token}`;

    const { copy } = useCopyToClipboard();

    const countries = Country.getAllCountries();
    const [countryCode, setCountryCode] = useState<string>("");
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [order, setOrder] = useState<number>(0);

    const [qrcode, setQrcode] = useState<string>("");
    const [webcamExists, setWebcamExists] = useState(false);

    const [cameraStatus, setCameraStatus] = useState<string>("");
    const [captures, setCaptures] = useState<any>(null);
    const [accessToken, setAccessToken] = useState<string>("");

    const [tab, setTab] = useState(0);

    const validationSchema = Yup.object().shape({
        gender: Yup.string().required().oneOf(['Male', 'Female'], t("valid_gender")),
        postal_code: Yup.string().required(t("postal_code_required")),
        state: Yup.string().required(t("state_required")),
        city: Yup.string().required(t("city_required")),
        passport: tab === 0 ? Yup.mixed<any>().nullable()
            .test('specialString', t("passport_required"), (value) => value !== DocumentImg)
            .required(t("passport_required")) : Yup.mixed<any>().nullable(),
        front_id: tab !== 0 ? Yup.mixed<any>().nullable()
            .test('specialString', t("front_id_required"), (value) => value !== FrontPassportImg)
            .required(t("front_id_required")) : Yup.mixed<any>().nullable(),
        back_id: tab !== 0 ? Yup.mixed<any>().nullable()
            .test('specialString', t("back_id_required"), (value) => value !== BackPassportImg)
            .required(t("back_id_required")) : Yup.mixed<any>().nullable(),
        selfie: Yup.mixed<any>().nullable()
            .test('specialString', t("selife_required"), (value) => value !== SelfieImg)
            .required(t("selife_required")),
    });

    const defaultValues = useMemo(
        () => ({
            gender: user.gender || '',
            postal_code: user.postal_code || '',
            state: user.state || '',
            city: user.city || '',
            passport: user.passport ? `${API_URL}/${user.passport}` : DocumentImg,
            front_id: user.front_id ? `${API_URL}/${user.front_id}` : FrontPassportImg,
            back_id: user.back_id ? `${API_URL}/${user.back_id}` : BackPassportImg,
            selfie: user.selfie ? `${API_URL}/${user.selfie}` : SelfieImg,
        }),
        [user]
    );

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        values: defaultValues,
    });

    const {
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();


    const fileUpload = async (data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        })
        const res = await upload_file(formData);
        if (!res?.data) return null;
        return res.data;
    };

    const handleDrop = useCallback(
        (acceptedFiles: File[], name: string) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                // @ts-ignore
                setValue(name, newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const onSubmit = handleSubmit(async (data) => {
        try {
            let param: any = data;

            delete param.gender;

            let paramU = {};
            if (data.passport === DocumentImg)
                param.passport = ""
            if (data.front_id === FrontPassportImg)
                param.front_id = ""
            if (data.back_id === BackPassportImg)
                param.back_id = ""
            if (data.selfie === SelfieImg)
                param.selfie = ""


            if (data.passport !== DocumentImg && typeof data.passport !== 'string') {
                if (user.passport) delete_file(user.passport);
                paramU = { ...paramU, passport: data.passport };
            }
            if (data.front_id !== FrontPassportImg && typeof data.front_id !== 'string') {
                if (user.front_id) delete_file(user.front_id);
                paramU = { ...paramU, front_id: data.front_id };
            }
            if (data.back_id !== BackPassportImg && typeof data.back_id !== 'string') {
                if (user.back_id) delete_file(user.back_id);
                paramU = { ...paramU, back_id: data.back_id };
            }
            if (data.selfie !== SelfieImg && typeof data.selfie !== 'string') {
                if (user.selfie) delete_file(user.selfie);
                paramU = { ...paramU, selfie: data.selfie };
            }
            if (Object.keys(paramU).length) {
                const cards = await fileUpload(paramU);
                if (Object.keys(paramU).length > 1 && !cards.length) return;
                param = Object.keys(paramU).reduce((row, key, index) => ({
                    ...row,
                    [key]: cards[index]?.uri || cards?.uri || ""
                }), param);
            }
            param = {
                ...param,
                passport: param.passport.replaceAll(`${API_URL}/`, ''),
                front_id: param.front_id.replaceAll(`${API_URL}/`, ''),
                back_id: param.back_id.replaceAll(`${API_URL}/`, ''),
                selfie: param.selfie.replaceAll(`${API_URL}/`, ''),
            };

            const res = await verify_KYC(param)
            if (!res?.data) return;
            console.log(res?.data);

            // enqueueSnackbar(t("update_success"));
            toast.success(t("update_success"));
            onClose();
        } catch (error) {
            console.error(error);
        }
    });

    useEffect(() => {
        const _country = countries.find(
            (e) => e.name === country
        );
        if (!_country) return;
        const data = State.getStatesOfCountry(_country.isoCode);
        setCountryCode(_country.isoCode);
        setStates(data);
        // eslint-disable-next-line
    }, [country]);

    useEffect(() => {
        if (!countryCode) return;
        const _state = states.find(
            (e) => e.name === values.state
        );
        if (!_state) return;
        const data = City.getCitiesOfState(countryCode, _state.isoCode);
        setCities(data);
        // eslint-disable-next-line
    }, [values.state, countryCode]);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const generateQR = async () => {
        try {
            const res = await QRCode.toDataURL(QRURL);
            setQrcode(res);
        } catch (err) {
            console.error("Generating Qr code error => ", err)
        }
    }

    const checkWebcam = async () => {
        try {
            // Request permission for video  
            await navigator.mediaDevices.getUserMedia({ video: true });

            // Enumerate devices  
            const devices = await navigator.mediaDevices.enumerateDevices();

            // Check for video input devices  
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            setWebcamExists(videoDevices.length > 0);
        } catch (error) {
            console.error('Error accessing camera: ', error);
            setWebcamExists(false);
        }
    };

    useEffect(() => {
        generateQR();
        checkWebcam();
        // eslint-disable-next-line
    }, []);

    console.log(webcamExists, "==>webcamExists");


    const getAccessToken = async () => {
        if (!token) return;
        const res = await get_sumsub_access_token(token);
        if (!res?.data) return;
        if (res.data?.code === 402) {
            toast.error(res.data.description);
            return;
        }
        setAccessToken(res.data?.token);
    };

    useEffect(() => {
        getAccessToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const config = {
        lang: 'en',
        theme: 'light',
        container: 'body',
        email: user.email,
        customizationName: "LuckVerse777",
        onLoad: () => {
            console.log("-------onLoad--------");
        }
    }

    const options = { addViewportTag: false, adaptIframeHeight: true }

    const errorHandler = (error: any) => {
        console.log("errorHandler", error);
    }

    const messageHandler = (message: any) => {
        console.log("messageHandler", message);
    }

    const onCopy = useCallback(
        (text: string) => {
            copy(text);
        },
        [copy]
    );

    if (!accessToken) {
        return (
            <DialogContent sx={{ py: 5, bgcolor: "#2B2F3D" }} >
                <Stack justifyContent="center" alignItems="center" >
                    <CircularProgress />
                </Stack>
            </DialogContent>
        )
    }

    const renderQrcode = (
        <Stack justifyContent="center" alignItems="center" >
            <Image src={qrcode} alt="Qrcode" />
        </Stack>
    );


    if (!webcamExists) {
        return (
            <Box width={{ sm: 565 }}>
                <DialogTitle component="div" >
                    <Stack direction="row" justifyContent="space-between" gap={{ xs: 1, sm: 4 }}>
                        <Stack direction="row">
                            <Stack>
                                <Typography variant='h6' fontSize={15}>
                                    {t("scan_qr_code_camera")}
                                </Typography>
                                <Typography fontSize={13} sx={{ opacity: 0.5 }}>
                                    {t("scan_qr_code_camera_desc")}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent >
                    {renderQrcode}
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <TextField
                        fullWidth
                        label="Direct Link"
                        type="text"
                        value={QRURL}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={t("copy")}>
                                        <IconButton
                                            edge="end"
                                            size="large"
                                            onClick={() => onCopy(QRURL)}
                                        >
                                            <Iconify icon="solar:copy-outline" sx={{ fontSize: '1.1rem' }} />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            readOnly: true,
                        }}
                    />
                </DialogActions>
            </Box>
        )
    }

    return (
        <DialogContent sx={{ py: 2, bgcolor: "#2B2F3D" }} >
            <SumsubWebSdk
                accessToken={accessToken}
                expirationHandler={async () => {
                    console.log("accessTokenExpirationHandler");
                    if (!token) return "";
                    const res = await get_sumsub_access_token(token);
                    return res.data.token;
                }}
                config={config}
                options={options}
                onMessage={messageHandler}
                onError={errorHandler}
            />
        </DialogContent>
    )

    const renderPersonalDetail = (
        <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
            }}
            my={2}
        >
            <RHFAutocomplete
                name="gender"
                label={t("gender")}
                autoHighlight
                options={GENDER}
                getOptionLabel={(option) => t(option)}
                disabled
                renderOption={(props, option) => (
                    <li {...props} key={option}>
                        {t(option)}
                    </li>
                )}
            />
            <RHFTextField name="postal_code" label={t("postal_code")} />

            <RHFAutocomplete
                name="state"
                label={t("state")}
                autoHighlight
                options={states.map((e) => e.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                    <li {...props} key={option}>
                        {option}
                    </li>
                )}
            />

            <RHFAutocomplete
                name="city"
                label={t("city")}
                autoHighlight
                options={cities.map((e) => e.name)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                    <li {...props} key={option}>
                        {option}
                    </li>
                )}
            />
        </Box>
    );

    const renderUploadDocuments = (
        <Box
            sx={{
                bgcolor: 'background.paper', ...(!smDown && {
                    display: 'flex',
                    flexGrow: 1,
                })
            }}
        >
            <Tabs
                orientation={smDown ? "horizontal" : "vertical"}
                value={tab}
                onChange={handleChange}
                sx={{ borderRight: 1, borderColor: 'divider' }}
            >
                <Tab label={t("passport")} sx={{ mr: `15px !important`, minWidth: 78, }} />
                <Tab label={t("id")} sx={{ mr: `15px !important`, minWidth: 78, }} />
            </Tabs>
            <TabPanel value={tab} index={0} width={1}>
                <Box>
                    <RHFUploadAvatar
                        name="passport"
                        maxSize={3145728}
                        camera
                        onClick={() => setCameraStatus("passport")}
                        sx={{
                            borderRadius: `10px !important`,
                            "& .component-image": {
                                bgcolor: "#FFFFFF",
                            },
                            "& div, & span": {
                                borderRadius: `10px !important`,
                            }
                        }}
                        helperText={
                            <>
                                <Typography textAlign="center" fontSize={14} my={1}>{t("front_address_document")}</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mx: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                        color: 'text.disabled',
                                    }}
                                >
                                    {t("allowed")} *.jpeg, *.jpg, *.png, *.gif
                                    <br /> {t("max_size_of")} {fData(3145728)}
                                </Typography>
                            </>
                        }
                    />
                </Box>
            </TabPanel>
            <TabPanel value={tab} index={1} width={1}>
                <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                    }}
                    my={2}
                >
                    <RHFUploadAvatar
                        name="front_id"
                        maxSize={3145728}
                        camera
                        onClick={() => setCameraStatus("front_id")}
                        sx={{
                            borderRadius: `10px !important`,
                            "& .component-image": {
                                bgcolor: "#FFFFFF",
                            },
                            "& div, & span": {
                                borderRadius: `10px !important`,
                            }
                        }}
                        helperText={
                            <>
                                <Typography textAlign="center" fontSize={14} mt={1}>{t("front")}</Typography>
                                <Typography color="text.disabled" textAlign="center" fontSize={14} >
                                    {t("face_clearly_visible")}
                                </Typography>
                            </>
                        }
                    />
                    <RHFUploadAvatar
                        name="back_id"
                        maxSize={3145728}
                        onDrop={(e) => handleDrop(e, "back_id")}
                        sx={{
                            borderRadius: `10px !important`,
                            "& .component-image": {
                                bgcolor: "#FFFFFF",
                            },
                            "& div, & span": {
                                borderRadius: `10px !important`,
                            }
                        }}
                        helperText={
                            <>
                                <Typography textAlign="center" fontSize={14} mt={1}>{t("back")}</Typography>
                                <Typography color="text.disabled" textAlign="center" fontSize={14} >
                                    {t("clearly_visible")}
                                </Typography>
                            </>
                        }
                    />
                </Box>
            </TabPanel>
        </Box>

    );

    const renderUploadSelfie = (
        <Box >

            <RHFUploadAvatar
                name="selfie"
                maxSize={3145728}
                camera
                onClick={() => setCameraStatus("selfie")}
                sx={{
                    borderRadius: `10px !important`,
                    "& .component-image": {
                        bgcolor: "#FFFFFF",
                    },
                    "& div, & span": {
                        borderRadius: `10px !important`,
                    }
                }}
                helperText={
                    <Typography textAlign="center" fontSize={14} mt={1}>{t("face_clearly_visible")}</Typography>
                }
            />
        </Box>
    );

    return (
        <Box width={{ sm: 565 }}>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <DialogTitle component="div" >
                    <Stack direction="row" justifyContent="space-between" gap={{ xs: 1, sm: 4 }}>
                        <Stack direction="row">
                            <IconButton sx={{ width: 40, height: 40, ml: -2 }} disabled={order === 0} onClick={() => setOrder(order - 1)} >
                                <Iconify icon="ep:arrow-left-bold" />
                            </IconButton>
                            <Stack>
                                <Typography variant='h6' fontSize={15}>{TITLES[order]}</Typography>
                                <Typography fontSize={13} sx={{ opacity: 0.5 }}>{DESCRIPTIONS[order]}</Typography>
                            </Stack>
                        </Stack>
                        <Typography>
                            {order + 1}/3
                        </Typography>
                    </Stack>
                </DialogTitle>
                <DialogContent sx={{ pt: 3, bgcolor: "#2B2F3D" }} >

                    {order === 0 && renderPersonalDetail}
                    {order === 1 && renderUploadDocuments}
                    {order === 2 && renderUploadSelfie}

                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    {order < 2 ? (
                        <Button
                            size='large'
                            variant='contained'
                            color='success'
                            sx={{ 
                                px: 7, 
                                textTransform: "uppercase",
                                bgcolor: '#24ee89',
                                color: '#000',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(180deg, transparent 0%, #24ee89 100%)',
                                },
                                '&:active': {
                                    background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
                                },
                            }}
                            onClick={() => setOrder(order + 1)}
                            disabled={
                                order === 0 ?
                                    !values.gender || !values.postal_code || !values.state || !values.city :
                                    (tab === 0 && values.passport === DocumentImg) ||
                                    (tab !== 0 && (values.front_id === FrontPassportImg || values.back_id === BackPassportImg))
                            }
                        >
                            {t("next")}
                        </Button>
                    ) : (
                        <LoadingButton
                            size='large'
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ 
                                px: 7,
                                bgcolor: '#24ee89',
                                color: '#000',
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(180deg, transparent 0%, #24ee89 100%)',
                                },
                                '&:active': {
                                    background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
                                },
                            }}
                            disabled={user.kycVerified}
                            loading={isSubmitting}
                        >
                            {t("submit")}
                        </LoadingButton>
                    )}

                </DialogActions>
            </FormProvider>
            <CameraDialog open={cameraStatus !== ""} onClose={() => {
                setCameraStatus("")
                setCaptures(null);
            }} setCaptures={setCaptures} front={cameraStatus === "selfie"} />
        </Box>
    );
}


interface TabPanelProps extends BoxProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </Box>
    );
}

interface CameraDialogProps extends DialogProps {
    open: boolean;
    onClose: () => void;
    setCaptures: (data: any) => void;
    front?: boolean
}

const CameraDialog = ({ open, onClose, setCaptures, front = false }: CameraDialogProps) => {

    const capture = async (dataUri: string) => {
        const blob = base64ToBlob(dataUri);
        const file = new File([blob], `${new Date().getTime()}.png`, { type: 'image/png' });
        const newFile = Object.assign(file, {
            preview: URL.createObjectURL(file),
        });
        setCaptures({
            src: dataUri,
            file: newFile,
        });

        setTimeout(() => {
            onClose();
        }, 500);
    };

    const onError = async (error: any) => {
        console.log(error, "==>error");
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{
            "& .MuiPaper-root": {
                width: "fit-content",
                height: "98vh",
                maxWidth: "100vw",
            }
        }}>
            <DialogTitle component="div" >
                <IconButton sx={{ width: 35, height: 35, position: "absolute", right: 20, top: 10 }} onClick={onClose} >
                    <Iconify icon="mdi:close" />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                pb: 2,
                px: { xs: 0.5 },
                "& .react-html5-camera-photo": {
                    height: 1,
                },
                "& video": {
                    height: `100% !important`,
                }
            }}>
                <Camera
                    onTakePhotoAnimationDone={capture}
                    idealFacingMode={front ? FACING_MODES.USER : FACING_MODES.ENVIRONMENT}
                    imageType={IMAGE_TYPES.PNG}
                    imageCompression={0.97}
                    sizeFactor={1}
                    isDisplayStartCameraError={false}
                    onCameraError={onError}
                />
            </DialogContent>
        </Dialog>
    )
}