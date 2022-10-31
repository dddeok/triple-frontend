import { TFunction } from 'next-i18next'

import { PoiListElementType } from './types'

const TYPE_NAMES: { [key in PoiListElementType['type']]: string } = {
  attraction: 'gwangwangmyeongso',
  restaurant: 'eumsigjeom',
  hotel: 'hotel',
}

export function getTypeNames({
  type,
  t,
}: {
  type: PoiListElementType['type']
  t: TFunction
}) {
  return t(TYPE_NAMES[type])
}
