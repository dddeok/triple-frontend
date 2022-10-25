import {
  useEffect,
  useState,
  useCallback,
  SyntheticEvent,
  useMemo,
} from 'react'
import { useTranslation, Trans } from 'next-i18next'
import styled from 'styled-components'
import {
  FlexBox,
  Section,
  Container,
  Text,
  Button,
  Spinner,
} from '@titicaca/core-elements'
import { formatNumber } from '@titicaca/view-utilities'
import {
  useEventTrackingContext,
  useSessionAvailability,
} from '@titicaca/react-contexts'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'
import { TransitionType, withLoginCtaModal } from '@titicaca/modals'
import { useAppCallback, useSessionCallback } from '@titicaca/ui-flow'

import {
  useClientActions,
  useDescriptions,
  useReviews,
  useMyReview,
  useReviewCount,
} from '../services'

import ReviewsPlaceholder from './review-placeholder-with-rating'
import ReviewsList from './reviews-list'
import {
  ReviewData,
  AppNativeActionProps,
  ResourceType,
  ReviewDeleteHandler,
} from './types'
import SortingOptions, {
  DEFAULT_SORTING_OPTION,
  ORDER_BY_RECENCY,
  SortingOptionsProps,
} from './sorting-options'
import MyReviewActionSheet from './my-review-action-sheet'
import RecentCheckBox from './recent-checkbox'

const REVIEWS_SECTION_ID = 'reviews'
const DEFAULT_REVIEWS_COUNT_PER_PAGE = 20
const SHORTENED_REVIEWS_COUNT_PER_PAGE = 4

const WriteIcon = styled.img`
  margin-top: -5px;
  width: 34px;
  height: 34px;
  float: right;
`

const MileageButton = styled.div`
  position: relative;
  box-sizing: border-box;
  display: block;
  border-radius: 4px;
  background-color: rgba(58, 58, 58, 0.03);
  width: 100%;
  margin-top: 25px;
  padding: 22px 20px 19px;
  font-size: 13px;
  color: #2987f0;
  cursor: pointer;

  @media only screen and (max-width: 640px) {
    padding: 16px 14px 16px 20px;
  }
`

const BulletRight = styled.img.attrs({
  src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxwYXRoIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjMjk4N0YwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS42IiBkPSJNNy4wNyAxNkwxMyAxMC4wMzUgNyA0Ii8+Cjwvc3ZnPgo=',
})`
  position: absolute;
  right: 20px;
  margin: 0;
  top: 50%;
  transform: translateY(-50%);
  @media only screen and (max-width: 640px) {
    right: 9px;
  }
`

function ReviewContainer({
  reviewsCount: initialReviewsCount,
  recentTrip: initialRecentTrip = false,
  resourceType,
  regionId,
  resourceId,
  placeholderText,
  appNativeActions: {
    notifyReviewDeleted,
    showToast,
    subscribeReviewUpdateEvent,
    unsubscribeReviewUpdateEvent,
  },
  shortened,
  sortingOption: initialSortingOption = DEFAULT_SORTING_OPTION,
  onReviewWrite,
  onReviewDelete,
  onFullListButtonClick,
  isMorePage = false,
}: {
  resourceId: string
  resourceType: ResourceType
  regionId?: string
  reviewsCount: number
  recentTrip?: boolean
  shortened?: boolean
  reviewed?: boolean
  deepLink?: string
  placeholderText?: string
  appNativeActions: AppNativeActionProps
  sortingOption?: string
  isMorePage?: boolean
  /**
   * @deprecated 리뷰 작성 함수를 자체 구현하면
   * 다양한 방어 로직을 중복 구현하게 됩니다.
   * 이 prop을 사용하지 말아주세요.
   */
  onReviewWrite?: (e?: SyntheticEvent, rating?: number) => void
  onReviewDelete?: ReviewDeleteHandler
  onFullListButtonClick?: (e: SyntheticEvent, sortingOption?: string) => void
}) {
  const { t } = useTranslation('common-web')

  const sessionAvailable = useSessionAvailability()

  const [recentTrip, setRecentTrip] = useState(initialRecentTrip)
  const [sortingOption, setSortingOption] = useState(initialSortingOption)
  const app = useTripleClientMetadata()
  const { trackEvent } = useEventTrackingContext()
  const [[myReview, myReviewIds], setMyReviewStatus] = useState<
    [ReviewData | undefined, Set<string>]
  >([undefined, new Set([])])
  const [totalReviewsCount, setTotalReviewsCount] =
    useState<number>(initialReviewsCount)
  const { writeReview, editReview, navigateReviewList, navigateMileageIntro } =
    useClientActions()
  const latestReview = useMemo(
    () => !!(sortingOption === 'latest'),
    [sortingOption],
  )

  const { reviewsData, isLoaded, moreFetcher } = useReviews({
    resourceId,
    resourceType,
    recentTrip,
    latestReview,
    perPage: shortened
      ? SHORTENED_REVIEWS_COUNT_PER_PAGE + 1
      : DEFAULT_REVIEWS_COUNT_PER_PAGE,
  })
  const descriptionsData = useDescriptions({ resourceId, resourceType })
  const myReviewData = useMyReview({ resourceId, resourceType })
  const reviewsCountData = useReviewCount({ resourceId, resourceType })

  const setMyReview = useCallback(
    (review) =>
      setMyReviewStatus(([, ids]) => [
        review,
        review ? new Set<string>([String(review.id), ...ids]) : ids,
      ]),
    [setMyReviewStatus],
  )

  useEffect(() => {
    const refreshMyReview = async (params?: { id: string }) => {
      if (!params) {
        return
      }

      const { id } = params

      if (id && id === resourceId) {
        if (reviewsCountData) {
          setTotalReviewsCount(reviewsCountData.reviewsCount)
        }

        if (myReviewData) {
          setMyReview(myReviewData.myReview)
        }
      }
    }

    refreshMyReview({ id: resourceId })

    app &&
      subscribeReviewUpdateEvent &&
      subscribeReviewUpdateEvent(refreshMyReview)

    return () => {
      app &&
        unsubscribeReviewUpdateEvent &&
        unsubscribeReviewUpdateEvent(refreshMyReview)
    }
  }, [
    app,
    reviewsCountData,
    myReviewData,
    resourceId,
    resourceType,
    sessionAvailable,
    subscribeReviewUpdateEvent,
    unsubscribeReviewUpdateEvent,
    setMyReview,
  ])

  const handleWriteButtonClick = useAppCallback(
    TransitionType.ReviewWrite,
    useSessionCallback(
      useCallback(
        (e: SyntheticEvent, rating = 0) => {
          e.stopPropagation()

          trackEvent({
            ga: ['리뷰_리뷰쓰기'],
            fa: {
              action: '리뷰_리뷰쓰기',
              item_id: resourceId,
            },
          })

          writeReview({
            resourceType,
            resourceId,
            regionId,
            rating,
          })
        },
        [trackEvent, resourceId, writeReview, resourceType, regionId],
      ),
    ),
  )

  const handleFullListButtonClick = useAppCallback(
    TransitionType.Review,
    useSessionCallback(
      useCallback(
        (e: SyntheticEvent) => {
          trackEvent({
            ga: ['리뷰_리뷰더보기_선택'],
            fa: {
              action: '리뷰_리뷰더보기_선택',
              item_id: resourceId,
              tab_name: latestReview ? '최신순' : '추천순',
            },
          })

          e.stopPropagation()

          navigateReviewList(
            recentTrip === true &&
              isMorePage === false &&
              reviewsData.length === 0
              ? {
                  resourceId,
                  resourceType,
                  recentTrip: false,
                  sortingOption: '',
                }
              : {
                  regionId,
                  resourceId,
                  resourceType,
                  recentTrip,
                  sortingOption,
                },
          )
        },
        [
          trackEvent,
          resourceId,
          latestReview,
          navigateReviewList,
          recentTrip,
          isMorePage,
          reviewsData.length,
          resourceType,
          regionId,
          sortingOption,
        ],
      ),
    ),
  )

  const handleSortingOptionSelect: SortingOptionsProps['onSelect'] = (
    _,
    sortingOption,
  ) => {
    const eventLabel = sortingOption === ORDER_BY_RECENCY ? '최신순' : '추천순'

    trackEvent({
      ga: ['리뷰_리뷰정렬', eventLabel],
      fa: {
        action: '리뷰_리뷰정렬',
        sort_order: eventLabel,
        item_id: resourceId,
        ...(recentTrip && { filter_name: '최근여행' }),
      },
    })

    setSortingOption(sortingOption)
  }

  const handleRecentTripChange = useCallback(() => {
    setRecentTrip((prevState) => !prevState)

    trackEvent({
      fa: {
        action: '최근여행_선택',
        selected: String(recentTrip === false),
      },
    })
  }, [recentTrip, trackEvent])

  const recentReviewsCount = reviewsData.length
  const reviewsCount = recentTrip ? recentReviewsCount : totalReviewsCount
  const numOfRestReviews = reviewsCount - SHORTENED_REVIEWS_COUNT_PER_PAGE

  return (
    <Section anchor={REVIEWS_SECTION_ID}>
      <Container>
        {shortened ? (
          <WriteIcon
            src="https://assets.triple.guide/images/btn-com-write@2x.png"
            onClick={onReviewWrite || handleWriteButtonClick}
          />
        ) : null}

        {shortened ? (
          <>
            {(totalReviewsCount || 0) > 0 ? (
              <Trans i18nKey="ribyu-totalreviewscount">
                <Text bold size="huge" color="gray" alpha={1} inline />
                <Text bold size="huge" color="blue" alpha={1} inline>
                  {{ totalReviewsCount: formatNumber(totalReviewsCount) }}
                </Text>
              </Trans>
            ) : null}
          </>
        ) : (
          <Trans i18nKey="totalreviewscount-gaeyi-ribyu">
            <Text bold size="huge" color="blue" alpha={1} inline>
              {{ totalReviewsCount: formatNumber(totalReviewsCount) }}
            </Text>
            <Text bold size="huge" color="gray" alpha={1} inline />
          </Trans>
        )}
      </Container>

      <FlexBox
        flex
        justifyContent="space-between"
        alignItems="center"
        margin={{ top: 23 }}
      >
        <SortingOptions
          selected={sortingOption}
          onSelect={handleSortingOptionSelect}
        />
        <RecentCheckBox
          isRecentReview={recentTrip}
          onRecentReviewChange={handleRecentTripChange}
        />
      </FlexBox>

      {isLoaded ? (
        <>
          {reviewsCount > 0 ? (
            <ReviewsList
              maxLength={
                shortened ? SHORTENED_REVIEWS_COUNT_PER_PAGE : undefined
              }
              recentTrip={recentTrip}
              myReview={myReview}
              reviews={
                recentTrip
                  ? reviewsData
                  : reviewsData.filter((review) => !myReviewIds.has(review.id))
              }
              regionId={regionId}
              resourceId={resourceId}
              showToast={showToast}
              reviewRateDescriptions={descriptionsData}
              isMorePage={isMorePage}
              fetchNext={!shortened ? moreFetcher : undefined}
            />
          ) : (
            <ReviewsPlaceholder
              recentTrip={recentTrip}
              placeholderText={placeholderText}
              resourceType={resourceType}
              hasReviews={!!(totalReviewsCount > 0)}
              isMorePage={isMorePage}
              onClick={
                recentTrip
                  ? handleFullListButtonClick
                  : onReviewWrite || handleWriteButtonClick
              }
            />
          )}

          {reviewsCount > SHORTENED_REVIEWS_COUNT_PER_PAGE && shortened ? (
            <Container margin={{ top: 40 }}>
              <Button
                basic
                fluid
                compact
                size="small"
                onClick={
                  onFullListButtonClick
                    ? (e) => onFullListButtonClick(e, sortingOption)
                    : handleFullListButtonClick
                }
              >
                {t('numofrestreviews-gae-ribyu-deobogi', { numOfRestReviews })}
              </Button>
            </Container>
          ) : null}

          {shortened ? (
            <MileageButton
              onClick={(e) => {
                trackEvent({
                  ga: ['리뷰_여행자클럽선택'],
                  fa: {
                    action: '리뷰_여행자클럽선택',
                    item_id: resourceId,
                  },
                })
                e.preventDefault()
                if (app) {
                  navigateMileageIntro()
                } else {
                  window.location.href = `/pages/mileage-intro.html`
                }
              }}
            >
              <Text color="gray" size="small" alpha={0.6} lineHeight={1.7}>
                {t('ribyu-sseumyeon-yeohaengja-keulreob-coedae-3pointeu')}
              </Text>
              <Text color="blue" size="small" lineHeight={1.7}>
                {t('pointeubyeol-hyetaeg-bogi')}
              </Text>
              <BulletRight alt={t('pointeubyeol-hyetaeg-bogi')} />
            </MileageButton>
          ) : null}
        </>
      ) : (
        <Spinner />
      )}

      {myReview ? (
        <MyReviewActionSheet
          myReview={myReview}
          resourceType={resourceType}
          resourceId={resourceId}
          notifyReviewDeleted={(resourceId, reviewId) => {
            reviewId === myReview.id && setMyReview(null)
            notifyReviewDeleted(resourceId, reviewId)
          }}
          onReviewEdit={() => {
            if (onReviewWrite) {
              onReviewWrite()
              return
            }

            editReview({ regionId, resourceId, resourceType })
          }}
          onReviewDelete={onReviewDelete}
        />
      ) : null}
    </Section>
  )
}

export default withLoginCtaModal(ReviewContainer)
