import { ImageMeta } from '@titicaca/type-definitions'

export interface ArticleListingData {
  id: string
  type: 'article'
  source: {
    title: string
    image?: ImageMeta
  }
  reviewed: boolean
  scraped: boolean
}

export interface InventoryItem {
  image?: string
  desc?: string
  detailedDesc?: string
  text?: string
}
