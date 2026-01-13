import { useMemo } from 'react';
import { useSelector } from 'src/store';
import { useLocales } from 'src/locales';
import { useBoolean } from 'src/hooks/use-boolean';
// routes
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';

import { MissionModal } from 'src/sections/user/missions';

// ----------------------------------------------------------------------

const iconify = (name: string) => <Iconify icon={name} width={24} height={24} />;

const ICONS = {
  account: iconify('mdi:account-outline'),
  wallet: iconify('solar:wallet-outline'),
  myshares:iconify('mdi:gift'),
  referral: iconify('solar:cup-outline'),
  password: iconify('ri:key-fill'),
  alert: iconify('fluent:alert-snooze-12-filled'),
  support: iconify('material-symbols:support-agent-sharp'),
  ticket: iconify('heroicons:ticket-20-solid'),
  missions: iconify('mdi:flag-checkered'),
  mypurchases: iconify('mdi:shopping-outline'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t, currentLang } = useLocales();

  const { notification, unreadSupport } = useSelector((store) => store.auth);
  const unReadNote = notification.filter((e) => e.isUnRead).length;

  const data = useMemo(
    () => [
      {
        subheader: t('account'),
        items: [
          {
            title: t('account'),
            path: `/${currentLang.value}${paths.user.account}`,
            icon: ICONS.account,
          },
          {
            title: t('wallet'),
            path: `/${currentLang.value}${paths.user.wallet}`,
            icon: ICONS.wallet,
          },
          {
            title: t('myshares'),
            path: `/${currentLang.value}${paths.user.myshares}`,
            icon: ICONS.myshares,
          },
          // {
          //   title: t('mypurchases'),
          //   path: `/${currentLang.value}${paths.user.mypurchases}`,
          //   icon: ICONS.mypurchases,
          // },
          {
            title: t('notification'),
            path: `/${currentLang.value}${paths.user.notification}`,
            icon: ICONS.alert,
            ...(unReadNote && {
              info: unReadNote,
            }),
          },
          {
            title: t('referral'),
            path: `/${currentLang.value}${paths.user.referral}`,
            icon: ICONS.referral,
          },
          {
            title: t('change_password'),
            path: `/${currentLang.value}${paths.user.password}`,
            icon: ICONS.password,
          },
          {
            title: t('support'),
            path: `/${currentLang.value}${paths.user.support}`,
            icon: ICONS.support,
            ...(unreadSupport > 0 && {
              info: unreadSupport,
            }),
          },
          {
            title: t('ticket'),
            path: `/${currentLang.value}${paths.user.ticket}`,
            icon: ICONS.ticket,
          },
        ],
      },
      {
        subheader: t('bet'),
        items: [
          {
            title: t('my_bets'),
            path: `/${currentLang.value}${paths.user.mybets}`,
            icon: ICONS.referral,
            children: [
              { title: t('sports'), path: `/${currentLang.value}${paths.user.mybets_sports}` },
              { title: t('casino'), path: `/${currentLang.value}${paths.user.mybets_casino}` },
            ],
          },
        ],
      },
    ],
    [unReadNote, unreadSupport, t, currentLang]
  );

  return data;
}
