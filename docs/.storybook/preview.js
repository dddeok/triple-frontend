import { Suspense } from 'react'
import i18n from 'i18next'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { I18nextTripleWebAssetsBackend } from '@titicaca/i18n'
import { withI18next } from 'storybook-addon-i18next'
import { GlobalStyle } from '@titicaca/core-elements'
import { RouterContext } from 'next/dist/shared/lib/router-context' // next 12

i18n
  .use(initReactI18next)
  .use(I18nextTripleWebAssetsBackend)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'ko',
    ns: 'common-web',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      dev: true,
    },
  })

export const decorators = [
  withI18next({ i18n }),

  (Story) => (
    <Suspense fallback={<div>Loading translations...</div>}>
      <I18nextProvider i18n={i18n}>
        <GlobalStyle />
        <Story />
      </I18nextProvider>
    </Suspense>
  ),
]

export const parameters = {
  actions: {
    argTypesRegex: '^on.*',
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
}
