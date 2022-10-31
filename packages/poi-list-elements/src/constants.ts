import { PoiListElementType } from './types'

export const POI_IMAGE_PLACEHOLDERS: {
  [key in PoiListElementType['type']]: string
} = {
  attraction: 'https://assets.triple.guide/images/ico_blank_see@2x.png',
  restaurant: 'https://assets.triple.guide/images/ico_blank_eat@2x.png',
  hotel: 'https://assets.triple.guide/images/ico_blank_hotel@2x.png',
}

