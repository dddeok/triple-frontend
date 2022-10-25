import { ComponentType, FC, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Text } from '@titicaca/core-elements'
import {
  useEventTrackingContext,
  useHistoryFunctions,
  useUriHash,
} from '@titicaca/react-contexts'
import { DeepPartial } from 'utility-types'

import Actions from './actions'
import Modal from './modal-base'

type ShowTransitionModal = (type: TransitionType) => void

const IconImage = styled.img`
  display: block;
  width: 66px;
  height: 66px;
  margin: 40px auto 10px auto;
`

export enum TransitionType {
  General = 'general',
  Gallery = 'gallery',
  Scrap = 'scrap',
  Review = 'review',
  ReviewWrite = 'reviewWrite',
  ReviewThumbnail = 'reviewThumbnail',
  Article = 'article',
  Tna = 'tna',
  Hotel = 'hotel',
  View = 'view',
}

const MODAL_CONTENT: {
  [type: string]: {
    description?: string
    eventLabel?: string
  }
} = {
  [TransitionType.General]: {},
  [TransitionType.Gallery]: {
    eventLabel: '대표사진_선택',
  },
  [TransitionType.Scrap]: {},
  [TransitionType.Review]: {
    eventLabel: '리뷰_리뷰글더보기',
  },
  [TransitionType.ReviewWrite]: {
    eventLabel: '리뷰_리뷰쓰기',
  },
  [TransitionType.ReviewThumbnail]: {
    eventLabel: '리뷰_리뷰사진썸네일',
  },
  [TransitionType.Article]: {
    eventLabel: '추천가이드_더보기',
  },
  [TransitionType.Tna]: {
    eventLabel: '투어티켓_상품선택',
  },
  [TransitionType.Hotel]: {
    eventLabel: '호텔_선택',
  },
  [TransitionType.View]: {
    description:
      'iljeong-jjagibuteo-hotel-tueotikes-yeyagggaji-teuripeulro-han-beone-yeohaeng-junbihaseyo.',
    eventLabel: '컨텐츠_연속보기',
  },
}

export function TransitionModal({
  deepLink,
  onActionClick,
}: {
  deepLink: string
  onActionClick?: () => void
}) {
  const { t } = useTranslation('common-web')

  const uriHash = useUriHash()
  const { back } = useHistoryFunctions()
  const { trackEvent } = useEventTrackingContext()
  const matchData = (uriHash || '').match(/^transition\.(.+)$/)

  if (matchData && Object.keys(MODAL_CONTENT).includes(matchData[1])) {
    const {
      description = 'teuripeul-aebeseo-deoug-dayanghan-gineungeul-pyeonrihage-iyonghaeboseyo.',
      eventLabel = '',
    } = MODAL_CONTENT[matchData[1]] || {}

    const icon = 'https://assets.triple.guide/images/ico-popup-app@4x.png'

    return (
      <Modal open onClose={back}>
        <IconImage src={icon} />
        {description ? (
          <Text
            center
            alpha={0.7}
            size="small"
            margin={{ bottom: 30, left: 30, right: 30 }}
          >
            {t(description)}
          </Text>
        ) : null}

        <Actions
          negative={{
            text: t('cwiso'),
            onClick: back,
          }}
          positive={{
            text: t('teuripeul-gagi'),
            onClick: () => {
              onActionClick?.()

              trackEvent({
                ga: [
                  '설치유도팝업',
                  ['선택_트리플가기', eventLabel].filter((v) => v).join('_'),
                ],
              })

              window.location.href = deepLink
            },
          }}
        />
      </Modal>
    )
  }

  return null
}

export function useTransitionModal(): { show: ShowTransitionModal } {
  const { push } = useHistoryFunctions()

  return useMemo(() => ({ show: (type) => push(`transition.${type}`) }), [push])
}

export interface WithTransitionModalBaseProps {
  showTransitionModal: ShowTransitionModal
}

export function withTransitionModal<
  P extends DeepPartial<WithTransitionModalBaseProps>,
>(Component: ComponentType<P>): FC<Omit<P, 'showTransitionModal'>> {
  return function TransitionModalComponent(props) {
    const { push } = useHistoryFunctions()

    return (
      <Component
        {...({
          ...props,
          showTransitionModal: (type) => push(`transition.${type}`),
        } as P)}
      />
    )
  }
}
