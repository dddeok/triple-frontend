import { TFunction } from 'next-i18next'

import type { Category } from './types'

export function getCategoryHref(category?: Category) {
  switch (category) {
    case 'air':
      return '/air'
    case 'hotels':
      return '/hotels'
    case 'tna':
      return '/tna'
    default:
      return '/'
  }
}

export function getCategoryTitle({
  category,
  t,
}: {
  category?: Category
  t: TFunction
}) {
  switch (category) {
    case 'air':
      return t('triple-hanggong-hom')
    case 'hotels':
      return t('triple-sugso-hom')
    case 'tna':
      return t('triple-tueo-tikes-hom')
    default:
      return t('triple-hom')
  }
}

export function getCategoryImageProps({
  category,
  t,
}: {
  category?: Category
  t: TFunction
}) {
  switch (category) {
    case 'air':
      return {
        alt: t('hanggong'),
        src: 'https://assets.triple.guide/images/img_intro_logo_air.svg',
      }
    case 'hotels':
      return {
        alt: t('sugso'),
        src: 'https://assets.triple.guide/images/img_intro_logo_hotels.svg',
      }
    case 'tna':
      return {
        alt: t('tueo-tikes'),
        src: 'https://assets.triple.guide/images/img_intro_logo_tna.svg',
      }
    default:
      return {}
  }
}
