/**
 * Language configuration for internationalization, merging date-fns, MUI, and DataGrid locales.
 * Defines supported languages with their system values, adapter locales, and flag icons.
 * Note: Some languages (Portuguese, Vietnamese, Chinese, Arabic) are commented out but available for future use.
 */
import merge from 'lodash/merge';
import {
  enUS as enUSAdapter,
  ru as ruRUAdapter,
  fr as frFRAdapter,
  nb as nnNOAdapter,
  fi as fiFIAdapter,
  sv as svSEAdapter,
  es as esESAdapter,
  de as deDEAdapter,
  pt as ptPTAdapter,
  vi as viVNAdapter,
  zhCN as zhCNAdapter,
  arSA as arSAAdapter,
} from 'date-fns/locale';
// core
import {
  enUS as enUSCore,
  ruRU as ruRUCore,
  frFR as frFRCore,
  nnNO as nnNOCore,
  fiFI as fiFICore,
  svSE as svSECore,
  deDE as deDECore,
  esES as esESCore,
  ptPT as ptPTCore,
  viVN as viVNCore,
  zhCN as zhCNCore,
  arSA as arSACore,
} from '@mui/material/locale';
// date-pickers
import {
  enUS as enUSDate,
  ruRU as ruRUDate,
  frFR as frFRDate,
  nbNO as nnNODate,
  fiFI as fiFIDate,
  svSE as svSEDate,
  esES as esESDate,
  deDE as deDEDate,
  // ptPT as ptPTDate,
  viVN as viVNDate,
  zhCN as zhCNDate,
} from '@mui/x-date-pickers/locales';
// data-grid
import {
  enUS as enUSDataGrid,
  ruRU as ruRUDataGrid,
  frFR as frFRDataGrid,
  nbNO as nnNODataGrid,
  fiFI as fiFIDataGrid,
  svSE as svSEDataGrid,
  esES as esESDataGrid,
  deDE as deDEDataGrid,
  ptPT as ptPTDataGrid,
  viVN as viVNDataGrid,
  zhCN as zhCNDataGrid,
  arSD as arSDDataGrid,
} from '@mui/x-data-grid';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: merge(enUSDate, enUSDataGrid, enUSCore),
    adapterLocale: enUSAdapter,
    icon: 'flagpack:gb-nir',
  },
  {
    label: 'Russian',
    value: 'ru',
    systemValue: merge(ruRUDate, ruRUDataGrid, ruRUCore),
    adapterLocale: ruRUAdapter,
    icon: 'flagpack:ru',
  },
  {
    label: 'French',
    value: 'fr',
    systemValue: merge(frFRDate, frFRDataGrid, frFRCore),
    adapterLocale: frFRAdapter,
    icon: 'flagpack:fr',
  },
  {
    label: 'Norwegian',
    value: 'nb',
    systemValue: merge(nnNODate, nnNODataGrid, nnNOCore),
    adapterLocale: nnNOAdapter,
    icon: 'flagpack:no',
  },
  {
    label: 'Finnish',
    value: 'fi',
    systemValue: merge(fiFIDate, fiFIDataGrid, fiFICore),
    adapterLocale: fiFIAdapter,
    icon: 'flagpack:fi',
  },
  {
    label: 'Swedish',
    value: 'sv',
    systemValue: merge(svSEDate, svSEDataGrid, svSECore),
    adapterLocale: svSEAdapter,
    icon: 'flagpack:se',
  },
  {
    label: 'Spanish',
    value: 'es',
    systemValue: merge(esESDate, esESDataGrid, esESCore),
    adapterLocale: esESAdapter,
    icon: 'flagpack:es',
  },
  {
    label: 'Germany',
    value: 'de',
    systemValue: merge(deDEDate, deDEDataGrid, deDECore),
    adapterLocale: deDEAdapter,
    icon: 'flagpack:de',
  },
  // {
  //   label: 'Portuguese',
  //   value: 'pt',
  //   systemValue: merge(enUSDate, ptPTDataGrid, ptPTCore),
  //   adapterLocale: ptPTAdapter,
  //   icon: 'flagpack:pt',
  // },
  // {
  //   label: 'Vietnamese',
  //   value: 'vi',
  //   systemValue: merge(viVNDate, viVNDataGrid, viVNCore),
  //   adapterLocale: viVNAdapter,
  //   icon: 'flagpack:vn',
  // },
  // {
  //   label: 'Chinese',
  //   value: 'cn',
  //   systemValue: merge(zhCNDate, zhCNDataGrid, zhCNCore),
  //   adapterLocale: zhCNAdapter,
  //   icon: 'flagpack:cn',
  // },
  // {
  //   label: 'Arabic',
  //   value: 'ar',
  //   systemValue: merge(arSDDataGrid, arSACore),
  //   adapterLocale: arSAAdapter,
  //   icon: 'flagpack:sa',
  // },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
