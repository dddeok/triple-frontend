import { scroll } from './scroll'
import { calculateScrollOffset } from './calculates'
import { ScrollOptions } from './types'

export function scrollToElement(elementId: string, options: ScrollOptions) {
  setTimeout(() => {
    const element = document.getElementById(elementId)

    if (!element) {
      return
    }

    scroll({
      x: 0,
      y: calculateScrollOffset({
        element,
        offset: options.offset,
        alignment: options.align,
      }),
      options,
    })
  }, 1500)
}
