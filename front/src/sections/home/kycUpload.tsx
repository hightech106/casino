import { useCallback, useEffect, useMemo, useState } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
    Dialog, DialogActions,
    DialogContent, DialogProps, DialogTitle, IconButton, Tab, Tabs
} from '@mui/material';
// components
import FormProvider, {
    RHFAutocomplete,
    RHFTextField,
    RHFUploadAvatar
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import useApi from 'src/hooks/use-api';
import { useSearchParams } from 'src/routes/hooks';
// utils
import { base64ToBlob } from 'src/utils';
import { fData } from 'src/utils/format-number';
import { API_URL } from 'src/config-global';
// ----------------------------------------------------------------------
import type { UserProfile } from 'src/types';
import Page500 from '../error/500-view';

import 'react-html5-camera-photo/build/css/index.css';

const GENDER = [
    "Male",
    "Female"
];

const TITLES = [
    "Persanal Details",
    "Upload your passport or ID",
    "Upload your Selfie"
]

const DESCRIPTIONS = [
    "Enter Your Details As They Appear On Your Identification Document.",
    "Upload your passport or ID (front & back)",
    "Upload your Selfie"
]

const DocumentImg = "/assets/images/document.png";
const FrontPassportImg = "/assets/images/front-id.jpg";
const BackPassportImg = "/assets/images/back-id.jpg";
const SelfieImg = "/assets/images/selfie-id.jpg";

export default function KYCForm() {

    const searchParams = useSearchParams();

    const session = searchParams.get('session') || '';

    const { upload_file, delete_file, verify_KYC_mobile, verify_token, get_sumsub_access_token } = useApi();

    const countries = Country.getAllCountries();
    const [countryCode, setCountryCode] = useState<string>("");
    const [loaded, setLoaded] = useState<boolean>(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const [order, setOrder] = useState<number>(0);
    const [accessToken, setAccessToken] = useState<string>("");

    const [cameraStatus, setCameraStatus] = useState<string>("");
    const [captures, setCaptures] = useState<any>(null);

    const [tab, setTab] = useState(0);

    const validationSchema = Yup.object().shape({
        postal_code: Yup.string().required('Postal Code is required'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
        passport: tab === 0 ? Yup.mixed<any>().nullable()
            .test('specialString', 'Passport is required', (value) => value !== DocumentImg)
            .required('Passport is required') : Yup.mixed<any>().nullable(),
        front_id: tab !== 0 ? Yup.mixed<any>().nullable()
            .test('specialString', 'Front of ID is required', (value) => value !== FrontPassportImg)
            .required('Front of ID is required') : Yup.mixed<any>().nullable(),
        back_id: tab !== 0 ? Yup.mixed<any>().nullable()
            .test('specialString', 'Back of ID is required', (value) => value !== BackPassportImg)
            .required('Back of ID is required') : Yup.mixed<any>().nullable(),
        selfie: Yup.mixed<any>().nullable()
            .test('specialString', 'Selife with ID is required', (value) => value !== SelfieImg)
            .required('Selife with ID is required'),
    });

    const defaultValues = useMemo(
        () => ({
            postal_code: user?.postal_code || '',
            state: user?.state || '',
            city: user?.city || '',
            passport: user?.passport ? `${API_URL}/${user?.passport}` : DocumentImg,
            front_id: user?.front_id ? `${API_URL}/${user?.front_id}` : FrontPassportImg,
            back_id: user?.back_id ? `${API_URL}/${user?.back_id}` : BackPassportImg,
            selfie: user?.selfie ? `${API_URL}/${user?.selfie}` : SelfieImg,
        }),
        [user]
    );

    const methods = useForm({
        mode: "onChange",
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
                if (user?.passport) delete_file(user?.passport);
                paramU = { ...paramU, passport: data.passport };
            }
            if (data.front_id !== FrontPassportImg && typeof data.front_id !== 'string') {
                if (user?.front_id) delete_file(user?.front_id);
                paramU = { ...paramU, front_id: data.front_id };
            }
            if (data.back_id !== BackPassportImg && typeof data.back_id !== 'string') {
                if (user?.back_id) delete_file(user?.back_id);
                paramU = { ...paramU, back_id: data.back_id };
            }
            if (data.selfie !== SelfieImg && typeof data.selfie !== 'string') {
                if (user?.selfie) delete_file(user?.selfie);
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

            const res = await verify_KYC_mobile({ ...param, token: session })
            if (!res?.data) return;
            console.log(res?.data);

            toast.success('Update success!');
        } catch (error) {
            console.error(error);
        }
    });

    const verifyToken = async () => {
        const res = await verify_token(session);
        setLoaded(true);
        if (!res?.data) return;
        setUser(res.data);
    }

    useEffect(() => {
        verifyToken();
        // eslint-disable-next-line
    }, []);

    const getAccessToken = async () => {
        if (!session) return;
        const res = await get_sumsub_access_token(session);
        if (!res?.data) return;
        setAccessToken(res.data.token);
    };

    useEffect(() => {
        getAccessToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);


    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };


    const config = {
        lang: 'en',
        theme: 'light',
        container: 'body',
        email: user?.email,
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

    if (!accessToken || !user) return (
        <LoadingScreen />
    );

    return (
        <DialogContent sx={{ py: 2, bgcolor: "#232c20" }} >
            <SumsubWebSdk
                accessToken={accessToken}
                expirationHandler={async () => {
                    console.log("accessTokenExpirationHandler");
                    if (!session) return "";
                    const res = await get_sumsub_access_token(session);
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
            {/* <RHFAutocomplete
                name="gender"
                label='Gender'
                autoHighlight
                options={GENDER}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                    <li {...props} key={option}>
                        {option}
                    </li>
                )}
            /> */}
            <RHFTextField name="postal_code" label="Postal Code" />

            <RHFAutocomplete
                name="state"
                label='State'
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
                label='City'
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
                bgcolor: 'background.paper',
                borderRadius: 0.5,
                px: 2
            }}
        >
            <Tabs
                value={tab}
                onChange={handleChange}
            >
                <Tab label="Passport" sx={{ mr: `15px !important`, minWidth: 78, }} />
                <Tab label="ID" sx={{ mr: `15px !important`, minWidth: 78, }} />
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
                                <Typography textAlign="center" fontSize={14} my={1}>Front of addres document</Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mx: 'auto',
                                        display: 'block',
                                        textAlign: 'center',
                                        color: 'text.disabled',
                                    }}
                                >
                                    Allowed *.jpeg, *.jpg, *.png, *.gif
                                    <br /> max size of {fData(3145728)}
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
                                <Typography textAlign="center" fontSize={14} mt={1}>Front</Typography>
                                <Typography color="text.disabled" textAlign="center" fontSize={14} >
                                    Face clearly visible
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
                                <Typography textAlign="center" fontSize={14} mt={1}>Back</Typography>
                                <Typography color="text.disabled" textAlign="center" fontSize={14} >
                                    Clearly visible
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
                    <>
                        <Typography textAlign="center" fontSize={14} mt={1}>Face clearly visible</Typography>
                    </>
                }
            />
        </Box>
    );

    if (loaded && !user)
        return (
            <Stack justifyContent="center" alignItems="center" >
                <Page500 />
            </Stack>
        );


    return (
        <Box width={{ sm: 565, }} bgcolor="#05051494" px={2} borderRadius={0.5}>
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
                <DialogContent sx={{ px: 0 }} >

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
                            sx={{ px: 7 }}
                            onClick={() => setOrder(order + 1)}
                            disabled={
                                order === 0 ?
                                    !values.postal_code || !values.state || !values.city :
                                    (tab === 0 && values.passport === DocumentImg) ||
                                    (tab !== 0 && (values.front_id === FrontPassportImg || values.back_id === BackPassportImg))
                            }
                        >
                            NEXT
                        </Button>
                    ) : (
                        <LoadingButton
                            size='large'
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ px: 7 }}
                            disabled={user?.kycVerified}
                            loading={isSubmitting}
                        >
                            Submit
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