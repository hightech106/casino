/**
 * Custom React hook for copying text to clipboard with success/error notifications.
 * Uses the Clipboard API and provides translated toast messages for user feedback.
 * Note: Falls back gracefully if clipboard API is not supported, showing appropriate error messages.
 */
import { useLocales } from 'src/locales';
import { useState } from 'react';
import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

type ReturnType = {
  copy: CopyFn;
  copiedText: CopiedValue;
};

export function useCopyToClipboard(): ReturnType {
  const { t } = useLocales();
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      toast.error(t('clipboard_not_supported'));
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(t('successfully_copied'));
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      toast.error(t('copy_failed'));
      setCopiedText(null);
      return false;
    }
  };

  return { copiedText, copy };
}
