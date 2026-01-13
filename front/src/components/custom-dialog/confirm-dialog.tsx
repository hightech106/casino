// @mui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useLocales } from 'src/locales';
//
import type { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  action,
  open,
  onClose,
  ...other
}: ConfirmDialogProps) {
  const { t } = useLocales();
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 1
        }
      }} {...other} >
      <DialogTitle component="div" sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
