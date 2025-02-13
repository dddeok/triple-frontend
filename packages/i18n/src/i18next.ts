import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import FetchBackend from './backend'

i18n
  .use(initReactI18next)
  .use(FetchBackend)
  .init({
    fallbackLng: ['ko'],
    ns: 'common',
    /* eslint-disable @typescript-eslint/naming-convention */
    defaultNS: 'common',

    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
