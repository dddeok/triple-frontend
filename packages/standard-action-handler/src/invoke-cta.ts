import { WebActionParams } from './types'

export default async function invokeCta({
  url: { path },
  options: { navigate, cta },
}: WebActionParams) {
  if (path === '/web-action/cta') {
    if (cta) {
      navigate(cta)

      return true
    }
  }

  return false
}
