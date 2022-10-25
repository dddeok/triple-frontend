import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  Section,
  Container,
  longClickable,
  Text,
  Icon,
  Rating,
} from '@titicaca/core-elements'
import {
  useEventTrackingContext,
  useHistoryFunctions,
  useUriHash,
} from '@titicaca/react-contexts'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'
import { formatNumber } from '@titicaca/view-utilities'
import { TranslatedProperty } from '@titicaca/type-definitions'

import CopyActionSheet from '../copy-action-sheet'
import AreaNames from '../area-names'
import { HASH_COPY_ACTION_SHEET } from '../constants'

const ArrowButton = styled.button`
  display: inline-block;
  color: var(--color-blue);
  background: transparent;
  border: 0;
  outline: 0;
  text-decoration: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 0 14px 0 6px;
  background-image: url('https://assets.triple.guide/images/ico-arrow-right-blue.png');
  background-size: 14px 14px;
  background-position: right center;
  background-repeat: no-repeat;
  height: 14px;
`

const LongClickableSection = longClickable(Section)

interface Area {
  id: number | string
  name: string
}

export default function DetailHeaderV2({
  names,
  areaName,
  areas = [],
  scrapsCount,
  reviewsCount,
  reviewsRating,
  onReviewsRatingClick,
  onCopy,
  onAreaClick,
  vicinity,
  ...props
}: {
  names: TranslatedProperty
  areaName?: string
  /**
   * @deprecated areaName 으로 통합됩니다.
   */
  areas?: Area[]
  scrapsCount: number
  reviewsCount: number
  reviewsRating: number
  onReviewsRatingClick: () => void
  onAreaClick?: () => void
  onCopy: (value: string) => void
  /**
   * @deprecated areaName 으로 통합됩니다.
   */
  vicinity?: string
} & Parameters<typeof Section>['0']) {
  const { t } = useTranslation('common-web')

  const app = useTripleClientMetadata()
  const uriHash = useUriHash()
  const { push, back } = useHistoryFunctions()
  const { trackEvent } = useEventTrackingContext()

  const handleLongClick = useCallback(() => {
    trackEvent({ fa: { action: '장소명_복사하기_노출' } })
    push(HASH_COPY_ACTION_SHEET)
  }, [push, trackEvent])

  return (
    <>
      <LongClickableSection
        onLongClick={app ? handleLongClick : undefined}
        {...props}
      >
        <Text.Title margin={{ bottom: 6 }}>
          {names.primary || names.ko || names.en}
        </Text.Title>
        <Text size="tiny" alpha={0.5}>
          {names.local || names.en}
        </Text>
        {(reviewsRating || scrapsCount > 0) && (
          <Container margin={{ top: 14 }}>
            {scrapsCount > 0 ? (
              <Text inline bold size="mini" alpha={1} margin={{ right: 10 }}>
                <Icon name="save" size="tiny" />
                {` ${formatNumber(scrapsCount)}`}
              </Text>
            ) : null}
            {reviewsRating > 0 ? (
              <Text inline bold size="mini" alpha={1}>
                <Rating score={reviewsRating} />
                {reviewsCount > 0 && ` ${formatNumber(reviewsCount)}`}
                <ArrowButton onClick={onReviewsRatingClick}>
                  {t('ribyubogi')}
                </ArrowButton>
              </Text>
            ) : null}
          </Container>
        )}
        <AreaNames
          areaName={areaName}
          areas={areas}
          vicinity={vicinity}
          arrowAction={
            onAreaClick ? (
              <ArrowButton onClick={onAreaClick}>{t('jidobogi')}</ArrowButton>
            ) : null
          }
        />
      </LongClickableSection>
      <CopyActionSheet
        open={uriHash === HASH_COPY_ACTION_SHEET}
        names={names}
        onCopy={onCopy}
        onClose={back}
      />
    </>
  )
}
