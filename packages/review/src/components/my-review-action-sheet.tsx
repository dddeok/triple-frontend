import { useTranslation } from 'next-i18next'
import ActionSheet from '@titicaca/action-sheet'
import { Confirm } from '@titicaca/modals'
import {
  useMyReviewsContext,
  useHistoryFunctions,
  useUriHash,
} from '@titicaca/react-contexts'

import { useDeleteReviewMutation, graphqlClient } from '../services'

import { ResourceType, ReviewData, ReviewDeleteHandler } from './types'

interface MyReviewActionSheetProps {
  myReview: ReviewData
  resourceType: ResourceType
  resourceId: string
  notifyReviewDeleted: (resourceId: string, reviewId: string) => void
  /**
   * @deprecated 리뷰 작성 함수를 자체 구현하면
   * 다양한 방어 로직을 중복 구현하게 됩니다.
   * 이 prop을 사용하지 말아주세요.
   */
  onReviewEdit?: () => void
  onReviewDelete?: ReviewDeleteHandler
}

export const HASH_MY_REVIEW_ACTION_SHEET =
  'common.reviews-list.my-review-action-sheet'

const HASH_DELETION_MODAL = 'common.reviews-list.deletion-modal'

export default function MyReviewActionSheet({
  myReview,
  resourceType,
  resourceId,
  notifyReviewDeleted,
  onReviewEdit,
  onReviewDelete,
}: MyReviewActionSheetProps) {
  const { t } = useTranslation('common-web')

  const uriHash = useUriHash()
  const { replace, back } = useHistoryFunctions()
  const { deleteMyReview } = useMyReviewsContext()

  const { mutate } = useDeleteReviewMutation(graphqlClient)

  const handleDeleteMenuClick = () => {
    replace(HASH_DELETION_MODAL)

    return true
  }

  const handleDeleteReview = ({
    resourceType,
    resourceId,
    reviewId,
  }: {
    resourceId: string
    reviewId: string
    resourceType: ResourceType
  }) => {
    mutate({ id: myReview.id })
    notifyReviewDeleted(resourceId, reviewId)
    deleteMyReview({ id: reviewId, resourceId, resourceType })

    back()
  }

  return (
    <>
      <ActionSheet
        open={uriHash === HASH_MY_REVIEW_ACTION_SHEET}
        onClose={back}
        zTier={3}
      >
        {!myReview.blindedAt ? (
          <ActionSheet.Item icon="review" onClick={onReviewEdit}>
            {t('sujeonghagi')}
          </ActionSheet.Item>
        ) : null}
        <ActionSheet.Item icon="delete" onClick={handleDeleteMenuClick}>
          {t('sagjehagi')}
        </ActionSheet.Item>
      </ActionSheet>

      <Confirm
        open={uriHash === HASH_DELETION_MODAL}
        onClose={back}
        onConfirm={
          onReviewDelete
            ? (e) => onReviewDelete(e, myReview.id)
            : () =>
                handleDeleteReview({
                  resourceType,
                  resourceId,
                  reviewId: myReview.id,
                })
        }
      >
        {t(
          'sagjehagessseubnigga-sagjehamyeon-jeogribdoen-ribyu-pointeudo-hamgge-sarajibnida.',
        )}
      </Confirm>
    </>
  )
}
