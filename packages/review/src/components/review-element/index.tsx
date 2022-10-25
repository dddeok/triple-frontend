import {
  useState,
  PropsWithChildren,
  ComponentType,
  MouseEventHandler,
  useCallback,
  SyntheticEvent,
} from 'react'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import * as CSS from 'csstype'
import { StaticIntersectionObserver as IntersectionObserver } from '@titicaca/intersection-observer'
import { FlexBox, List, Container, Text, Rating } from '@titicaca/core-elements'
import { useEventTrackingContext } from '@titicaca/react-contexts'
import { useSessionCallback } from '@titicaca/ui-flow'

import { useReviewLikesContext } from '../review-likes-context'
import { ReviewData } from '../types'
import {
  useLikeReviewMutation,
  useUnlikeReviewMutation,
  graphqlClient,
} from '../../services'

import User from './user'
import Comment from './comment'
import FoldableComment from './foldable-comment'
import Media from './media'

type ReviewEventHandler<T = Element, E = Event> = (
  e: SyntheticEvent<T, E>,
  review: ReviewData,
) => void

export interface ReviewElementProps {
  review: ReviewData
  isMyReview: boolean
  index: number
  onUserClick?: ReviewEventHandler
  onUnfoldButtonClick?: ReviewEventHandler
  onMenuClick: ReviewEventHandler
  onReviewClick: (
    e: SyntheticEvent,
    reviewId: string,
    recentTrip: boolean,
  ) => void
  onMessageCountClick: (
    e: SyntheticEvent,
    reviewId: string,
    resourceType: string,
  ) => void
  onShow?: (index: number) => void
  reviewRateDescriptions?: string[]
  DateFormatter?: ComponentType<{ date: string }>
  resourceId: string
  isMorePage: boolean
}

const MetaContainer = styled.div`
  margin-top: 5px;
  height: 27px;
`

const MoreIcon = styled.img`
  margin-top: -3px;
  margin-left: 5px;
  width: 30px;
  height: 30px;
  vertical-align: middle;
  cursor: pointer;
`

const MessageCount = styled(Container)<{ isCommaVisible?: boolean }>`
  font-weight: bold;
  background-image: url('https://assets.triple.guide/images/btn-lounge-comment-off@3x.png');
  background-size: 18px 18px;
  background-repeat: no-repeat;

  ${({ isCommaVisible }) =>
    isCommaVisible &&
    css`
      margin-left: 8px;
      &::before {
        position: absolute;
        left: -10px;
        content: '·';
      }
    `}
`

const LikeButton = styled(Container)<{ liked?: boolean }>`
  font-weight: bold;
  text-decoration: none;
  background-size: 18px 18px;
  background-repeat: no-repeat;
  color: ${({ liked }) => (liked ? '--color-blue' : '--color-gray400')};
  background-image: ${({ liked }) =>
    liked
      ? "url('https://assets.triple.guide/images/btn-lounge-thanks-on@3x.png')"
      : "url('https://assets.triple.guide/images/btn-lounge-thanks-off@3x.png')"};
`

export default function ReviewElement({
  review,
  review: {
    user,
    blindedAt,
    comment,
    recentTrip,
    reviewedAt: originReviewedAt,
    rating,
    media,
    replyBoard,
    resourceType,
    visitDate,
  },
  isMyReview,
  index,
  onUserClick,
  onUnfoldButtonClick,
  onMenuClick,
  onReviewClick,
  onMessageCountClick,
  onShow,
  DateFormatter,
  reviewRateDescriptions,
  resourceId,
  isMorePage,
}: ReviewElementProps) {
  const { t } = useTranslation('common-web')

  const [unfolded, setUnfolded] = useState(false)
  const { deriveCurrentStateAndCount, updateLikedStatus } =
    useReviewLikesContext()
  const { trackEvent } = useEventTrackingContext()
  const { liked, likesCount } = deriveCurrentStateAndCount({
    reviewId: review.id,
    liked: review.liked,
    likesCount: review.likesCount,
  })

  const { mutate: likeReview } = useLikeReviewMutation(graphqlClient)
  const { mutate: unlikeReview } = useUnlikeReviewMutation(graphqlClient)

  const handleLikeButtonClick: MouseEventHandler = useSessionCallback(
    useCallback(async () => {
      const actionName = `리뷰_땡쓰${liked ? '취소' : ''}`

      trackEvent({
        ga: [actionName],
        fa: {
          action: actionName,
          review_id: review.id,
          item_id: resourceId,
        },
      })

      liked
        ? unlikeReview({ reviewId: review.id })
        : likeReview({ reviewId: review.id })
      updateLikedStatus({ [review.id]: !liked }, resourceId)
    }, [
      likeReview,
      liked,
      resourceId,
      review.id,
      trackEvent,
      unlikeReview,
      updateLikedStatus,
    ]),
  )

  const reviewedAt = moment(originReviewedAt).format()

  return (
    <IntersectionObserver
      onChange={({ isIntersecting }) => {
        if (isIntersecting) {
          trackEvent({
            fa: {
              action: `${isMorePage ? '리뷰_전체보기_노출' : '리뷰_노출'}`,
              item_id: review.id,
              poi_id: resourceId,
              ...(review.recentTrip && { recent_trip: '최근여행' }),
            },
          })

          onShow && onShow(index)
        }
      }}
    >
      <List.Item style={{ paddingTop: 6 }}>
        <User
          user={user}
          onClick={onUserClick && ((e) => onUserClick(e, review))}
        />
        {!blindedAt && !!rating ? <Score score={rating} /> : null}
        {!blindedAt ? (
          <RecentReviewInfo visitDate={visitDate} recentTrip={recentTrip} />
        ) : null}
        <Content
          onClick={(e: SyntheticEvent) =>
            onReviewClick(e, review.id, review.recentTrip)
          }
        >
          {blindedAt ? (
            t('singoga-jeobsudoeeo-beulraindeu-ceoridoeeossseubnida.')
          ) : comment ? (
            unfolded ? (
              comment
            ) : (
              <FoldableComment
                comment={comment}
                hasImage={(media || []).length > 0}
                onUnfoldButtonClick={(e) => {
                  trackEvent({
                    ga: ['리뷰_리뷰글더보기'],
                    fa: {
                      action: '리뷰_리뷰글더보기',
                      item_id: resourceId,
                      review_id: review.id,
                    },
                  })
                  setUnfolded(true)

                  onUnfoldButtonClick && onUnfoldButtonClick(e, review)
                }}
              />
            )
          ) : (
            <RateDescription
              rating={rating}
              reviewRateDescriptions={reviewRateDescriptions}
            />
          )}
        </Content>
        {!blindedAt && media && media.length > 0 ? (
          <Container margin={{ top: 10 }}>
            <Media media={media} reviewId={review.id} />
          </Container>
        ) : null}
        <Meta>
          {!blindedAt ? (
            <LikeButton
              display="inline-block"
              margin={{ top: 5 }}
              padding={{ top: 2, bottom: 2, right: 10, left: 20 }}
              height={18}
              liked={liked}
              onClick={handleLikeButtonClick}
            >
              {likesCount}
            </LikeButton>
          ) : null}

          <MessageCount
            display="inline-block"
            position="relative"
            height={18}
            margin={{ top: 5 }}
            padding={{ top: 2, bottom: 2, left: 20, right: 0 }}
            isCommaVisible={!blindedAt}
            onClick={(e: SyntheticEvent) =>
              onMessageCountClick(e, review.id, resourceType)
            }
          >
            {replyBoard
              ? replyBoard.rootMessagesCount + replyBoard.childMessagesCount
              : 0}
          </MessageCount>

          {!blindedAt || (blindedAt && isMyReview) ? (
            <Date floated="right">
              {DateFormatter ? <DateFormatter date={reviewedAt} /> : reviewedAt}
              <MoreIcon
                src="https://assets.triple.guide/images/btn-review-more@4x.png"
                onClick={(e) => onMenuClick(e, review)}
              />
            </Date>
          ) : null}
        </Meta>
      </List.Item>
    </IntersectionObserver>
  )
}

function Score({ score }: { score?: number }) {
  return (
    <Container margin={{ top: 18 }}>
      <Rating size="tiny" score={score} />
    </Container>
  )
}

function Content({
  onClick,
  children,
}: PropsWithChildren<{ onClick?: (e: SyntheticEvent) => void }>) {
  return (
    <Container margin={{ top: 6 }} clearing>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <a onClick={onClick}>
        <Comment>{children}</Comment>
      </a>
    </Container>
  )
}

function Meta({ children }: PropsWithChildren<unknown>) {
  return (
    <MetaContainer>
      <Text size="mini" color="gray" alpha={0.4}>
        {children}
      </Text>
    </MetaContainer>
  )
}

function Date({
  floated,
  children,
}: PropsWithChildren<{ floated?: CSS.Property.Float }>) {
  return (
    <Container floated={floated} margin={{ top: 2 }}>
      {children}
    </Container>
  )
}

function RateDescription({
  rating,
  reviewRateDescriptions,
}: {
  rating?: number | null | undefined
  reviewRateDescriptions: string[] | undefined
}) {
  const comment =
    rating && reviewRateDescriptions ? reviewRateDescriptions[rating] : ''
  return <Comment>{comment}</Comment>
}

function RecentReviewInfo({
  visitDate,
  recentTrip,
}: {
  visitDate?: string
  recentTrip: boolean
}) {
  const { t } = useTranslation('common-web')

  const startDate = moment('2000-01')
  const endDate = moment().subtract(180, 'days').format('YYYY-MM')
  const isOldReview =
    visitDate && moment(visitDate).isBetween(startDate, endDate)

  const [visitYear, visitMonth] = visitDate?.split('-') || []

  return (
    <FlexBox flex alignItems="center" padding={{ top: 8 }}>
      {recentTrip && !isOldReview ? (
        <>
          <img
            width={16}
            height={16}
            src="https://assets.triple.guide/images/ico_recently_badge@4x.png"
            alt="recent-trip-icon"
          />
          <Text padding={{ left: 4, right: 8 }} size={14} color="blue" bold>
            {t('coegeun-yeohaeng')}
          </Text>
        </>
      ) : null}
      {visitDate ? (
        <Text size={14} color="gray700">
          {t('visityear-nyeon-visitmonth-weol-yeohaeng', {
            visitYear,
            visitMonth,
          })}
        </Text>
      ) : null}
    </FlexBox>
  )
}
