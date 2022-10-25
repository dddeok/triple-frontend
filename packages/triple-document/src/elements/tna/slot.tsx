import { SyntheticEvent, useCallback, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Container, H1, List, Button } from '@titicaca/core-elements'
import { useEventTrackingContext } from '@titicaca/react-contexts'
import { gray50 } from '@titicaca/color-palette'
import { useNavigate } from '@titicaca/router'

import { TnaProductData } from './types'
import { TnaProductWithPrice } from './product'

export function Slot({
  id: slotId,
  title: slotTitle,
  products,
}: {
  id?: number
  title: string
  products: TnaProductData[]
}) {
  const { t } = useTranslation('common-web')

  const { trackEvent } = useEventTrackingContext()
  const navigate = useNavigate()

  const [showMore, setShowMore] = useState(false)

  const handleClick = useCallback(
    (e: SyntheticEvent, product: TnaProductData, index: number) => {
      trackEvent({
        ga: ['투어티켓_상품선택', `${slotId}_${product.id}_${index}`],
        fa: {
          action: '투어티켓_상품선택',
          slot_id: slotId,
          tna_id: product.id,
          position: index,
        },
      })
      navigate(`/tna/products/${product.id}`)
    },
    [slotId, trackEvent, navigate],
  )

  const handleIntersect = useCallback(
    (product: TnaProductData, index: number) => {
      trackEvent({
        fa: {
          action: '투어티켓_노출',
          slot_id: slotId,
          tna_id: product.id,
          position: index,
        },
      })
    },
    [trackEvent, slotId],
  )

  const handleShowMoreClick = useCallback(() => {
    trackEvent({
      ga: ['투어티켓_더보기'],
      fa: {
        action: '투어티켓_더보기',
        slot_id: slotId,
      },
    })

    setShowMore(true)
  }, [trackEvent, slotId])

  return (
    <Container
      margin={{ top: 30, left: 30, right: 30 }}
      id={`tna-slot-${slotId}`}
    >
      <H1 margin={{ bottom: 20 }}>{slotTitle}</H1>

      <List clearing verticalGap={40} divided dividerColor={gray50}>
        {(showMore ? products : products.slice(0, 3)).map((product, i) => (
          <List.Item key={i}>
            <TnaProductWithPrice
              index={i}
              product={product}
              onClick={handleClick}
              onIntersect={handleIntersect}
            />
          </List.Item>
        ))}
      </List>

      {!showMore && products.length > 3 ? (
        <Button
          basic
          fluid
          compact
          size="small"
          margin={{ top: 20 }}
          onClick={handleShowMoreClick}
        >
          {t('deobogi')}
        </Button>
      ) : null}
    </Container>
  )
}
