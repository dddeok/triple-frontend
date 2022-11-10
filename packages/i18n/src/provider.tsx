import { PropsWithChildren } from 'react'
import { I18nextProvider, I18nextProviderProps } from 'react-i18next'

import i18n from './i18next'

export default function I18nProvider(
  props: PropsWithChildren<
    { language?: string } & Partial<I18nextProviderProps>
  >,
) {
  const i18nInstance = props.i18n || getI18nInstance()

  i18nInstance.changeLanguage(props.language || 'ko')

  return (
    <I18nextProvider
      i18n={i18nInstance}
      {...props}
      defaultNS={props.defaultNS || 'common-web'}
    />
  )
}

function isServer() {
  return typeof window === 'undefined'
}

function getI18nInstance() {
  return isServer() ? i18n.cloneInstance() : i18n
}
