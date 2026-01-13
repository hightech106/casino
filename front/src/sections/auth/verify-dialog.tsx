import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { useLocales } from 'src/locales';
import { Dialog, Typography, Stack, Link, DialogContent, IconButton } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode } from 'src/components/hook-form';
import { EmailInboxIcon } from 'src/assets/icons';

type ModalProps = {
    modalStatus: boolean;
    verifyType: { type: string, value: string } | null;
    onClose: () => void;
    resend: () => Promise<void>;
    verify: (code: string) => Promise<void>;
};

const VerifyModal = ({ modalStatus, verifyType, resend, verify, onClose }: ModalProps) => {
    const { t } = useLocales();

    const [loading, setLoading] = useState<boolean>(false);

    const VerifySchema = Yup.object().shape({
        code: Yup.string().min(6, t("character_required")).required(t("code_required")),
        // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    });

    const defaultValues = {
        code: '',
        // email: '',
    };

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(VerifySchema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        try {
            await verify(data.code);
            reset();
        } catch (error) {
            console.error(error);
        }
    });

    const resendCode = async () => {
        setLoading(true);
        await resend();
        setLoading(false);
    }


    const renderForm = (
        <Stack spacing={2} alignItems="center">
            {/* <RHFTextField
                name="email"
                label="Email"
                placeholder="example@gmail.com"
                InputLabelProps={{ shrink: true }}
            /> */}

            <RHFCode name="code" />

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting || loading}
            >
                {t("verify")}
            </LoadingButton>

            <Typography variant="body2">
                {t("dont_have_code")}
                <Link
                    variant="subtitle2"
                    sx={{
                        cursor: 'pointer',
                    }}
                    onClick={resendCode}
                >
                    {t("resend_code")}
                </Link>
            </Typography>
        </Stack>
    );

    const renderHead = (
        <>
            <EmailInboxIcon sx={{ height: 96 }} />

            <Stack spacing={1} sx={{ my: 3 }}>
                <Typography variant="h5">{t("please_check_your", { label: verifyType?.type })} !</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t("verify_desc", { label: verifyType?.type, value: verifyType?.value })}.
                </Typography>
            </Stack>
        </>
    );


    return (
        <Dialog
            className="game-modal-content"
            open={modalStatus}
            onClose={onClose}
            sx={{
                "& .MuiPaper-root": {
                    maxWidth: 440,
                    py: 5, px: 2,
                    textAlign: "center"
                }
            }}
        >
            <IconButton
                color="primary"
                onClick={onClose}
                sx={{ position: 'absolute', right: 5, top: 5 }}
            >
                <Iconify icon="mdi:close" />
            </IconButton>
            <DialogContent>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    {renderHead}

                    {renderForm}
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
};

export default VerifyModal;
