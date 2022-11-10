import { post } from '@titicaca/fetcher'

export async function checkIfReviewed({ resourceId }: { resourceId: string }) {
  const response = await post<{ ids: string[] }>('/api/reviews/v2/check', {
    headers: { 'content-type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ ids: [resourceId] }),
  })

  if (response.ok === true) {
    const {
      parsedBody: { ids },
    } = response
    return ids.includes(resourceId)
  } else {
    throw new Error(`Failed to fetch reviewed check: ${resourceId}`)
  }
}
