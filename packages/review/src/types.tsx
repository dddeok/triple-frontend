import React from 'react'
import { ImageMeta } from '@titicaca/type-definitions'

export type ResourceType = 'article' | string

export interface UserData {
  photo: string
  name: string
  userBoard: {
    itineraries: number
    reports: number
    reviews: number
    reviewsV2: number
    scraps: number
    thanks: number
    trips: number
  }
  mileage: {
    badges: {
      icon: {
        imageUrl: string
      }
    }[]
    level: number
    point: number
  }
  uid: string
  unregister?: boolean | null
}

export interface ReviewData {
  id: string
  liked: boolean
  likesCount: number
  user: UserData
  comment: string
  createdAt: string
  blindedAt?: string | null
  rating?: number | null
  media?: ImageMeta[] | null
}

export type ReviewDeleteHandler = (
  e?: React.SyntheticEvent,
  id?: string,
) => Promise<void> | void

export interface AppNativeActionProps {
  subscribeReviewUpdateEvent?: (
    handler: (params?: { id: string }) => void,
  ) => void
  unsubscribeReviewUpdateEvent?: (
    handler: (params?: { id: string }) => void,
  ) => void
  showToast: (message: string) => void
  notifyReviewDeleted: (resourceId: string, reviewId: string) => void
}
