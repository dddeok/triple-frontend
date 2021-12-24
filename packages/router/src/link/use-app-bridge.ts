import { useEnv } from '@titicaca/react-contexts'
import { generateUrl } from '@titicaca/view-utilities'
import qs from 'qs'
import { useMemo } from 'react'

export interface OutlinkOptions {
  target?: 'browser'
  title?: string
}

export function useAppBridge() {
  const { appUrlScheme } = useEnv()

  return useMemo(
    () => ({
      openInlink(path: string) {
        window.location.href = generateUrl({
          scheme: appUrlScheme,
          path: '/inlink',
          query: qs.stringify({
            path,
          }),
        })
      },

      openOutlink(url: string, params?: OutlinkOptions) {
        window.location.href = generateUrl({
          scheme: appUrlScheme,
          path: '/outlink',
          query: qs.stringify({
            url,
            ...params,
          }),
        })
      },

      openNativeLink(path: string) {
        window.location.href = generateUrl({
          scheme: appUrlScheme,
          path: path,
        })
      },
    }),
    [appUrlScheme],
  )
}
