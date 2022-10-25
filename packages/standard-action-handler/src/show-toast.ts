import qs from 'qs'
import { showToast as nativeShowToast } from '@titicaca/triple-web-to-native-interfaces'

import { WebActionParams } from './types'

export default async function showToast({
  url: { path, query },
}: WebActionParams) {
  if (path === '/web-action/show-toast' && query) {
    const { text } = qs.parse(query, { ignoreQueryPrefix: true })

    nativeShowToast(text as string)

    return true
  }

  return false
}
