import qs from 'qs'

import { createClipboardCopier } from './services/copy'
import { WebActionParams } from './types'

export default async function copyToClipboard({
  url: { query, path },
  t,
}: WebActionParams) {
  if (path === '/web-action/copy-to-clipboard' && query) {
    const { text } = qs.parse(query || '') as { text?: string }

    if (text) {
      const textClipboardCopier = createClipboardCopier()

      textClipboardCopier({
        text,
        message: t('keulribbodeue-bogsadoeeossseubnida.'),
      })
    }

    return true
  }

  return false
}
