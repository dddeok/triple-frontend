import qs from 'qs'

import { WebActionParams } from './types'

export default async function serial({
  url: { path, query } = {},
  handler,
}: WebActionParams) {
  if (path === '/web-action/serial' && query) {
    const { actions } = qs.parse(query, { ignoreQueryPrefix: true })

    if (actions && handler) {
      for (const actionUrl of actions as string[]) {
        await handler.execute(actionUrl as string)
        await sleep(0.4)
      }
    }

    return true
  }

  return false
}

function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
  })
}
