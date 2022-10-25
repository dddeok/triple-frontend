import qs from 'qs'

import { WebActionParams } from './types'

export default async function newWindow({
  url: { path, query },
  options: { routeExternally },
}: WebActionParams) {
  if (path === '/web-action/new-window' && query) {
    const { href } = qs.parse(query) as {
      href?: string
    }
    if (href && routeExternally) {
      routeExternally({ href, target: 'new' })
      return true
    }
  }
  return false
}
