import { TFunction } from 'next-i18next'

import Handler from './handler'
import serial from './serial'
import invokeCta from './invoke-cta'
import showToast from './show-toast'
import fetchApi from './fetch-api'
import share from './share'
import copyToClipboard from './copy-to-clipboard'
import newWindow from './new-window'
import imageDownload from './image-download'
import scrollToElement from './scroll-to-element'
import { ContextOptions } from './types'

export function initialize(options: ContextOptions, t: TFunction) {
  const handler = new Handler({
    handlers: [
      serial,
      invokeCta,
      showToast,
      fetchApi,
      share,
      copyToClipboard,
      newWindow,
      imageDownload,
      scrollToElement,
    ],
    options,
    t,
  })

  return handler.toFunction()
}
