import { useMemo } from 'react'
import qs from 'qs'
import { useEnv } from '@titicaca/react-contexts'
import { useNavigate } from '@titicaca/router'
import { ImageMeta } from '@titicaca/type-definitions'

import { ResourceType } from '../components/types'
import { writeReview } from '../data/api'

export function useClientActions() {
  const { appUrlScheme } = useEnv()
  const navigate = useNavigate()

  return useMemo(() => {
    return {
      writeReview(params: {
        resourceType: ResourceType
        resourceId: string
        regionId?: string
        rating?: number
        photoFirst?: boolean
      }) {
        writeReview({ appUrlScheme, ...params })
      },
      editReview({
        regionId,
        resourceId,
        resourceType,
      }: {
        regionId?: string
        resourceId: string
        resourceType: ResourceType
      }) {
        const params = qs.stringify({
          region_id: regionId,
          resource_type: resourceType,
          resource_id: resourceId,
        })
        window.location.href = `${appUrlScheme}:///reviews/edit?${params}`
      },
      navigateReviewList({
        regionId,
        resourceId,
        resourceType,
        recentTrip,
        sortingOption,
      }: {
        regionId?: string
        resourceId: string
        resourceType: ResourceType
        recentTrip: boolean
        sortingOption: string
      }) {
        const params = qs.stringify({
          region_id: regionId,
          resource_id: resourceId,
          resource_type: resourceType,
          recent_trip: recentTrip,
          sorting_option: sortingOption,
        })

        navigate(
          `${appUrlScheme}:///inlink?path=${encodeURIComponent(
            `/reviews/list?_triple_no_navbar&${params}`,
          )}`,
        )
      },
      navigateUserDetail(uid: string) {
        navigate(`${appUrlScheme}:///users/${uid}`)
      },
      navigateImages(images: ImageMeta[], index: number) {
        navigate(
          `${appUrlScheme}:///images?${qs.stringify({
            images: JSON.stringify(images),
            index,
          })}`,
        )
      },
      navigateReviewDetail({
        reviewId,
        regionId,
        resourceId,
        anchor,
      }: {
        reviewId: string
        regionId?: string
        resourceId: string
        anchor?: string
      }) {
        const params = qs.stringify({
          region_id: regionId,
          resource_id: resourceId,
        })
        navigate(
          `${appUrlScheme}:///reviews/${reviewId}/detail?${params}${
            anchor ? `#${anchor}` : ''
          }`,
        )
      },
      navigateMileageIntro() {
        navigate(`${appUrlScheme}:///my/mileage/intro`)
      },
      reportReview(reviewId: string) {
        window.location.href = `${appUrlScheme}:///reviews/${reviewId}/report`
      },
    }
  }, [appUrlScheme, navigate])
}
