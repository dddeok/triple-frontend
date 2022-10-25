import { useTranslation } from 'next-i18next'
import ActionSheet from '@titicaca/action-sheet'
import { useUriHash, useHistoryFunctions } from '@titicaca/react-contexts'

import { ReviewData } from './types'

export const HASH_REVIEW_ACTION_SHEET =
  'common.reviews-list.review-action-sheet'

export default function OthersReviewActionSheet({
  selectedReview,
  onReportReview,
}: {
  selectedReview?: ReviewData | null
  onReportReview: (reportingReviewId: string) => void
}) {
  const { t } = useTranslation('common-web')

  const uriHash = useUriHash()
  const { back } = useHistoryFunctions()

  const handleReportClick = () => {
    if (selectedReview) {
      onReportReview(selectedReview.id)
    }

    back()
  }

  return (
    <ActionSheet
      open={uriHash === HASH_REVIEW_ACTION_SHEET && !!selectedReview}
      onClose={back}
      zTier={3}
    >
      <ActionSheet.Item icon="report" onClick={handleReportClick}>
        {t('singohagi')}
      </ActionSheet.Item>
    </ActionSheet>
  )
}
