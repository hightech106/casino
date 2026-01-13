import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
} from '@mui/material';
import { useLocales } from 'src/locales';
import { useRouter } from 'src/routes/hooks';
import Image from 'src/components/image';
import { paths } from 'src/routes/paths';
import type { IBonus } from 'src/types';

type Props = {
  open: boolean;
  data: IBonus | null;
  onClose: VoidFunction;
};

export default function InfoDialog({ open, data, onClose }: Props) {
  const { t, currentLang } = useLocales();
  const router = useRouter();
  const item = data?.lang.find((e) => e.lang === currentLang.value) || data?.lang[0];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          minWidth: { sm: 400 },
          borderRadius: 1,
          bgcolor: '#2B2F3D', // Темно-серый фон для диалога
          border: '2px solid #664401', // Золотистая граница
        },
      }}
    >
      <DialogTitle component={Stack} direction="row" alignItems="center" gap={3}>
        <Image src="/assets/images/casino/bonus.png" sx={{ width: 50 }} />
        <Typography variant="h5" color="#CAAE51">
          {t('special_bonuses')}
        </Typography>{' '}
        {/* Золотистый цвет текста */}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2}>
          <Typography variant="h4" color="#FFFFFF">
            {item?.title}
          </Typography>{' '}
          {/* Белый цвет для заголовка */}
          <Typography
            sx={{
              whiteSpace: 'pre-wrap',
              color: '#FFFFFF', // Белый цвет текста
            }}
          >
            {item?.description}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start' }}>
        <Link
          color="#CAAE51" // Золотистый цвет ссылки
          underline="always"
          onClick={() => router.push(`/${currentLang.value}${paths.home.terms}`)}
          sx={{ cursor: 'pointer', '&:hover': { color: '#A68B3C' } }} // Темнее при наведении
        >
          {t('terms_and_conditions_bonus')}
        </Link>
      </DialogActions>
    </Dialog>
  );
}
