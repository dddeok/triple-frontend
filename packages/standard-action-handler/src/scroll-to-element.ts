import qs from 'qs'
import { scrollToElement as scrollTo } from '@titicaca/scroll-to-element'

import { WebActionParams } from './types'

export default async function scrollToElement({
  url: { path, query } = {},
  options: { app } = {},
}: WebActionParams) {
  if (path === '/web-action/scroll-to-element' && query) {
    const { hash } = qs.parse(query) as {
      hash?: string
    }

    if (hash) {
      const element = document.getElementById(hash)
      element && scrollTo(element, { offset: app ? -102 : -110 })
    }

    return true
  }

  return false
}
