import { useContext } from 'react'
import { useTranslation, I18nContext } from 'react-i18next'

export default function useI18n(namespaces = 'common-web') {
  const { t, ready, i18n } = useTranslation(namespaces, {
    useSuspense: false,
  })
  const context = useContext(I18nContext)

  if (context) {
    if (ready) {
      return {
        t: (key: string, fallback: string) => t(key, fallback),
        i18n,
      }
    } else {
      return {
        t: (key: string, fallback: string) => fallback,
        i18n,
      }
    }
  }

  return {
    t: (key: string, fallback: string) => fallback,
    i18n: undefined,
  }
}
