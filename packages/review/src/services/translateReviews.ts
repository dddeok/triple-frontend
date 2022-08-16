import { post, RequestOptions } from '@titicaca/fetcher'

import { TranslatedReviewResult } from '../components/types'

export async function translateReviews({
  ids,
  targetLang,
  options,
}: {
  ids: string[]
  targetLang: string
  options?: RequestOptions
}) {
  const response = await post<TranslatedReviewResult[]>(
    '/api/translator/translate/review',
    {
      ...options,
      body: {
        ids,
        target: targetLang,
      },
    },
  )

  if (!response.ok) {
    return []
  }

  const { parsedBody } = response

  return parsedBody
}
