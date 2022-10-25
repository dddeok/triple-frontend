import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { useEnv } from '@titicaca/react-contexts'

export function FacebookAppLinkMeta({
  appName,
  iosAppStoreId = '1225499481',
  appPath = '/',
  appPackageName = 'com.titicacacorp.triple',
}: {
  appName?: string
  iosAppStoreId?: string
  appPath?: string
  appPackageName?: string
}) {
  const { t } = useTranslation('common-web')

  const { appUrlScheme } = useEnv()

  return (
    <Head>
      <meta
        key="al-ios-app-name"
        property="al:ios:app_name"
        content={appName ?? t('teuripeul')}
      />
      <meta
        key="al-android-app-name"
        property="al:android:app_name"
        content={appName ?? t('teuripeul')}
      />
      <meta
        key="al-ios-url"
        property="al:ios:url"
        content={`${appUrlScheme}://${appPath}`}
      />
      <meta
        key="al-ios-app-store-id"
        property="al:ios:app_store_id"
        content={iosAppStoreId}
      />
      <meta
        key="al-android-url"
        property="al:android:url"
        content={`${appUrlScheme}://${appPath}`}
      />
      <meta
        key="al-android-package"
        property="al:android:package"
        content={appPackageName}
      />
    </Head>
  )
}
