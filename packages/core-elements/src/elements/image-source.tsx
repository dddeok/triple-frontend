import { useTranslation } from 'next-i18next'

import formatSourceUrl from '../utils/format-source-url'

export type ImageSourceType = typeof ImageSource

export default function ImageSource({ sourceUrl }: { sourceUrl?: string }) {
  const { t } = useTranslation('common-web')

  if (!sourceUrl) {
    return null
  }

  return <>{formatSourceUrl({ url: sourceUrl, t })}</>
}
