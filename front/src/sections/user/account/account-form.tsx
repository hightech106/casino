
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { MenuItem } from '@mui/material';
// components
import { AnimateButton } from 'src/components/animate';
import FormProvider, {
  RHFAutocomplete,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useLocales } from 'src/locales';
import { useDispatch, useSelector } from 'src/store';
import { UpdateInfo } from 'src/store/reducers/auth';

import useApi from 'src/hooks/use-api';
import { useBoolean } from 'src/hooks/use-boolean';
import type { IUpdateUser } from 'src/types';
// utils
import { fData } from 'src/utils/format-number';
import { DEFAULT_COUNTRY_CURRENCY } from 'src/utils';
import { API_URL } from 'src/config-global';
import KYCForm from './kyc-form';
// ----------------------------------------------------------------------

export default function AccountForm() {
  const { t } = useLocales();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { upload_file, delete_file, update_user } = useApi();


  const dialogKYC = useBoolean();

  const NewUserSchema = Yup.object().shape({
    _id: Yup.string().required(t("id_required")),
    surname: Yup.string().max(30).required(t("surname_required")),
    middlename: Yup.string().max(30).required(t("middlename_required")),
    username: Yup.string().min(4).max(30).required(t("name_required")),
    email: Yup.string().required(t("email_required")).email(t("valid_email")),
    birthday: Yup.mixed<any>().nullable().required(t("birthday_required")),
    avatar: Yup.mixed<any>().nullable().required(t("avatar_required")),
  });

  const defaultValues = useMemo(
    () => ({
      _id: user._id || '',
      surname: user.surname || '',
      middlename: user.middlename || '',
      username: user.username || '',
      email: user.email || '',
      birthday: user.birthday ? new Date(user.birthday) : null,
      avatar: user.avatar ? `${API_URL}/${user.avatar}` : null,
      betlimit: user.betlimit || 0,
      betlimit_period: user.betlimit_period || 0,
    }),
    [user]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewUserSchema),
    values: defaultValues,
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const fileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await upload_file(formData);
    if (!res?.data) return null;
    return res.data;
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      // @ts-ignore
      let param: IUpdateUser = {
        ...data,
        update: true,
        userId: data._id,
        birthday: new Date(data.birthday).getTime(),
      };
      console.log(param, "==>param");

      delete param.email;

      if (typeof data.avatar !== 'string') {
        if (user.avatar) delete_file(user.avatar);

        const avatar = await fileUpload(data.avatar);
        if (!avatar) return;
        param = { ...param, avatar: avatar.uri };
      }
      param = { ...param, avatar: param.avatar.replaceAll(`${API_URL}/`, '') };
      const res = await update_user(param);
      if (!res?.data) return;
      dispatch(UpdateInfo(res?.data));
      toast.success(t("update_success"));
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatar', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (

    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <Card sx={{ 
              pt: 10, 
              pb: 5, 
              px: 3, 
              bgcolor: '#2B2F3D !important', 
              border: 'none',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, #24ee89 0%, transparent 100%)',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '1px',
                background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }
            }} >
              <Label color="warning" variant="filled" sx={{ position: 'absolute', top: 24, right: 24, bgcolor: '#24ee89 !important', color: '#000 !important' }}>
                {t("active")}
              </Label>

              <Box sx={{ mb: 5 }}>
                <RHFUploadAvatar
                  name="avatar"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  sx={{
                    // Main container border
                    '& > .MuiBox-root': {
                      borderColor: '#24ee89 !important',
                      border: '1px dashed #24ee89 !important',
                    },
                    // Placeholder stack (contains icon and text)
                    '& .upload-placeholder': {
                      color: '#24ee89 !important',
                      '& .MuiSvgIcon-root': {
                        color: '#24ee89 !important',
                      },
                      '& .MuiTypography-caption': {
                        color: '#24ee89 !important',
                      },
                    },
                    // Any other text elements
                    '& .MuiTypography-root': {
                      color: '#24ee89 !important',
                    },
                    // Override any default styles
                    '& svg': {
                      color: '#24ee89 !important',
                    },
                    ...(isSubmitting && {
                      '& .MuiAvatar-root': {
                        backgroundColor: '#24ee89 !important',
                        color: '#000 !important',
                      },
                    }),
                  }}
                  helperText={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 3,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: '#FFFFFF !important',
                      }}
                    >
                      {t("allowed")} *.jpeg, *.jpg, *.png, *.gif
                      <br /> {t("max_size_of")} {fData(3145728)}
                    </Typography>
                  }
                />
              </Box>

              <Typography textAlign="center" color="text.disabled">
                {t("user_id")} : <Box component="span" sx={{ color: '#24ee89', fontWeight: 600 }}>{values._id}</Box>
              </Typography>
            </Card>
          </Grid>

          <Grid xs={12} md={8}>
            <Card sx={{ 
              p: 3, 
              bgcolor: '#2B2F3D !important', 
              border: 'none',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, #24ee89 0%, transparent 100%)',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '1px',
                background: 'linear-gradient(180deg, #24ee89 0%, transparent 100%)',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }
            }}>
              <Typography variant="h5" sx={{ mb: 2, letterSpacing: '0.04em', transform: 'skew(-5deg)' }}>
                <Box component="span" sx={{ color: '#24ee89', fontWeight: 700, letterSpacing: '0.05em' }}>PERSONAL</Box>{' '}
                <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.02em' }}>INFORMATION</Box>
              </Typography>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="surname" label={t("firstname")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }} />
                <RHFTextField name="middlename" label={t("lastname")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }} />
                <RHFTextField name="username" label={t("user_name")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }} />
                <RHFTextField name="email" label={t("email")} disabled sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#232626 !important',
                      '& fieldset': {
                        borderColor: '#24ee89 !important',
                      },
                    },
                  },
                }} />

                <RHFDatePicker name="birthday" label={t("birthday")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }} />
                <RHFTextField name="address" label={t("address")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }} />

                <RHFTextField type="number" name="betlimit" label={t("betlimit")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }} />
                <RHFSelect name="betlimit_period" label={t("betlimit_period")} sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#232626',
                    '& fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&:hover fieldset': {
                      borderColor: '#24ee89',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#24ee89',
                    },
                  },
                }}>
                  <MenuItem value={1}>A day (1)</MenuItem>
                  <MenuItem value={7}>A Week (7)</MenuItem>
                  <MenuItem value={30}>A Month (30)</MenuItem>
                </RHFSelect>

              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Button 
                    variant='contained' 
                    color='info' 
                    onClick={dialogKYC.onTrue} 
                    fullWidth
                    sx={{
                      bgcolor: '#24ee89', 
                      border: '1px solid #24ee89',
                      color: '#000',
                      fontWeight: 700,
                      transform: 'skew(-5deg)',
                      textAlign: 'center',
                      '&:hover': {
                        bgcolor: '#E6D117',
                        background: 'linear-gradient(180deg, transparent 0%, #24ee89 100%)',
                      },
                    }}
                  >
                    {t("kyc_verify")}
                  </Button>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <AnimateButton>
                    <LoadingButton
                      type="submit"
                      variant="outlined"
                      color="warning"
                      loading={isSubmitting}
                      disabled={user.kycVerified}
                      fullWidth
                      sx={{
                        borderColor: '#24ee89',
                        color: '#24ee89',
                        fontWeight: 700,
                        transform: 'skew(-5deg)',
                        textAlign: 'center',
                        background: 'linear-gradient(180deg, rgba(255,231,26,0.25) 0%, rgba(255,231,26,0) 100%)',
                        '&:hover': {
                          borderColor: '#24ee89',
                          background: 'linear-gradient(180deg, rgba(255,231,26,0.35) 0%, rgba(255,231,26,0) 100%)',
                        },
                      }}
                    >
                      {t("save_changes")}
                    </LoadingButton>
                  </AnimateButton>
                </Box>
              </Stack>

            </Card>

          </Grid>
        </Grid>
      </FormProvider>
      <Dialog
        open={dialogKYC.value}
        onClose={dialogKYC.onFalse}
        PaperProps={{
          sx: {
            width: 1, maxWidth: 565
          }
        }}
      >
        <KYCForm country="" onClose={dialogKYC.onFalse} />
      </Dialog>
      {/* <Dialog open={dialogKYC.value} onClose={dialogKYC.onFalse} maxWidth="sm">
        <DialogTitle component="div" >
          <Stack direction="row" justifyContent="space-between" gap={{ xs: 1, sm: 4 }}>
           
          </Stack>
        </DialogTitle>
      </Dialog> */}

    </>
  );
}
