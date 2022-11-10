import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  Section,
  HR1,
  Button,
  MarginPadding,
  Tooltip,
} from '@titicaca/core-elements'
import { useEffect, useState } from 'react'
import { getWebStorage } from '@titicaca/web-storage'

const ActionButton = styled(Button)`
  position: relative;
  padding-left: 0;
  padding-right: 0;
`

const ReviewTooltip = styled(Tooltip)`
  width: max-content;
  padding: 9px 15px 8px 15px;
  transform: translateX(-50%);
  left: 50%;
  &::after {
    transform: translateX(-50%);
    left: 50%;
  }
`

const REVIEW_TOOLTIP_EXPOSED = 'REVIEW_TOOLTIP_EXPOSED'

export default function Actions({
  scraped,
  reviewed,
  onScheduleAdd,
  onScrapedChange,
  onContentShare,
  onReviewEdit,
  noDivider,
  ...props
}: {
  poiId: string
  scraped: boolean
  reviewed: boolean
  onScheduleAdd?: () => void
  onScrapedChange?: () => void
  onContentShare: () => void
  onReviewEdit: () => void
  margin?: MarginPadding
  padding?: MarginPadding
  noDivider?: boolean
}) {
  const { t } = useTranslation('common-web')

  const [isReviewTooltipExposed, setIsReviewTooltipExposed] = useState(true)

  useEffect(() => {
    const webStorage = getWebStorage()
    setIsReviewTooltipExposed(
      JSON.parse(
        webStorage.getItem(REVIEW_TOOLTIP_EXPOSED) || 'false',
      ) as boolean,
    )
    webStorage.setItem(REVIEW_TOOLTIP_EXPOSED, 'true')
  }, [])

  return (
    <Section {...props}>
      <Button.Group
        horizontalGap={22}
        buttonCount={
          [onScheduleAdd, onScrapedChange, onContentShare, onReviewEdit].filter(
            Boolean,
          ).length
        }
      >
        {onScrapedChange ? (
          <ActionButton
            icon={scraped ? 'saveFilled' : 'saveEmpty'}
            onClick={onScrapedChange}
          >
            {scraped ? t('jeojangcwiso') : t('jeojanghagi')}
          </ActionButton>
        ) : null}
        {onScheduleAdd ? (
          <ActionButton icon="schedule" onClick={onScheduleAdd}>
            {t('iljeongcuga')}
          </ActionButton>
        ) : null}
        <ActionButton
          icon={reviewed ? 'starFilled' : 'starEmpty'}
          onClick={onReviewEdit}
        >
          {!isReviewTooltipExposed ? (
            <ReviewTooltip
              label="이제 영상도 올릴 수 있어요!"
              pointing={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              nowrap={false}
              borderRadius="16.17"
              backgroundColor="var(--color-blue)"
              positioning={{ top: -26 }}
            />
          ) : null}
          {reviewed ? t('ribyusujeong') : t('ribyusseugi')}
        </ActionButton>
        <ActionButton icon="share" onClick={onContentShare}>
          {t('gongyuhagi')}
        </ActionButton>
      </Button.Group>
      {!noDivider && <HR1 margin={{ top: 8, bottom: 0 }} />}
    </Section>
  )
}
