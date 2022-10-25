import { TFunction } from 'next-i18next'
import { parseUrl } from '@titicaca/view-utilities'

import { WebAction, ContextOptions } from './types'

export default class Handler {
  private options: ContextOptions

  private handlers: WebAction[]

  private t: TFunction

  public constructor({
    handlers,
    options,
    t,
  }: {
    handlers: WebAction[]
    options: ContextOptions
    t: TFunction
  }) {
    this.handlers = handlers
    this.options = options
    this.t = t
  }

  public async execute(
    url: string,
    params?: Parameters<ContextOptions['navigate']>[1],
  ) {
    const parsedUrl = parseUrl(url)

    if (parsedUrl.path?.match(/^\/web-action\//)) {
      for (const handler of this.handlers) {
        const result = await handler({
          url: parsedUrl,
          options: this.options,
          handler: this,
          t: this.t,
        })

        if (result) {
          return
        }
      }
    } else {
      this.options.navigate(url, params)
    }
  }

  public toFunction() {
    return this.execute.bind(this)
  }
}
