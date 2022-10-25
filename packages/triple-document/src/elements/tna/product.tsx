import { MouseEventHandler, SyntheticEvent, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { Text, Tag, Container, Image, Rating } from '@titicaca/core-elements'
import { formatNumber } from '@titicaca/view-utilities'
import { StaticIntersectionObserver } from '@titicaca/intersection-observer'
import { OverlayScrapButton } from '@titicaca/scrap-button'
import { useUserAgentContext } from '@titicaca/react-contexts'

import { TnaProductData, DomesticArea } from './types'
import { generateCoupon } from './helpers'
import { PricePolicyCouponInfo } from './price-policy-coupon-info'

const PLACEHOLDER_IMAGE_URL =
  'https://assets.triple.guide/images/ico_blank_see@2x.png'

function Pricing({
  basePrice,
  salePrice,
}: Parameters<typeof Container>[0] & {
  basePrice?: number
  salePrice: number
}) {
  const { t } = useTranslation('common-web')

  const formattedBasePrice = formatNumber(basePrice)
  const formattedSalePrice = formatNumber(salePrice)

  const rate = basePrice
    ? Math.floor(((basePrice - salePrice) / basePrice) * 100)
    : null

  return (
    <Container margin={{ top: 10 }}>
      {rate ? (
        <Container margin={{ bottom: 2 }}>
          <Text color="red" bold>
            {rate}%
          </Text>
        </Container>
      ) : null}

      <Container>
        <Text inline bold size={18} color="gray">
          {t('formattedsaleprice-weon', { formattedSalePrice })}
        </Text>

        {basePrice ? (
          <Text
            inline
            color="gray300"
            size="mini"
            strikethrough
            margin={{ left: 5 }}
          >
            {t('formattedbaseprice-weon', { formattedBasePrice })}
          </Text>
        ) : null}
      </Container>
    </Container>
  )
}

export function TnaProductWithPrice({
  product,
  product: {
    id,
    title,
    heroImage,
    tags,
    salePrice: rawSalePrice,
    basePrice: rawBasePrice,
    reviewRating,
    reviewsCount,
    domesticAreas = [],
    applicableCoupon,
    expectedApplicableCoupon,
    scraped,
    bestSelfPackageDiscountSpec,
  },
  index,
  onIntersect,
  onClick,
}: {
  index: number
  product: TnaProductData
  onClick: (e: SyntheticEvent, product: TnaProductData, index: number) => void
  onIntersect: (product: TnaProductData, index: number) => void
}) {
  const { t } = useTranslation('common-web')

  const { isPublic } = useUserAgentContext()

  const salePrice =
    typeof rawSalePrice === 'string' ? parseInt(rawSalePrice) : rawSalePrice
  const basePrice =
    typeof rawBasePrice === 'string' ? parseInt(rawBasePrice) : rawBasePrice
  const primaryDomesticArea: DomesticArea | undefined =
    domesticAreas.find(({ representative }) => representative) ||
    domesticAreas[0]
  const {
    hasCoupon,
    hasOnlyExpectedApplicableCoupon,
    hasAmountAfterUsingCouponPrice,
    displayPricePolicy,
  } = generateCoupon({
    applicableCoupon,
    expectedApplicableCoupon,
    t,
  })
  const hasSelfPackageBenefit = !!bestSelfPackageDiscountSpec

  const handleIntersectionChange = useCallback(
    ({ isIntersecting }: IntersectionObserverEntry) => {
      if (isIntersecting) {
        onIntersect(product, index)
      }
    },
    [index, onIntersect, product],
  )

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onClick(e, product, index)
    },
    [index, onClick, product],
  )

  return (
    <StaticIntersectionObserver onChange={handleIntersectionChange}>
      <Container onClick={handleClick} clearing>
        <Image>
          <Image.FixedDimensionsFrame size="small" width={90} floated="left">
            {heroImage ? (
              <Image.Img
                src={heroImage}
                alt={t('title-yi-sseomneil', { title })}
              />
            ) : (
              <Image.Placeholder src={PLACEHOLDER_IMAGE_URL} />
            )}
          </Image.FixedDimensionsFrame>
        </Image>
        {isPublic ? (
          <Container position="absolute" positioning={{ top: 3, left: 51 }}>
            <OverlayScrapButton
              resource={{ id, scraped, type: 'tna' }}
              size={36}
            />
          </Container>
        ) : null}

        <Container margin={{ left: 104 }}>
          <Text bold size="large" color="gray" ellipsis>
            {title}
          </Text>

          {primaryDomesticArea && (
            <Text color="gray400" size="tiny" margin={{ top: 4 }}>
              {primaryDomesticArea.displayName}
            </Text>
          )}

          {tags && tags.length > 0 && (
            <Container margin={{ top: 3 }}>
              {tags.map(({ text, type, style }, i) => (
                <Tag
                  key={i}
                  type={type}
                  style={style}
                  margin={{ top: 4, right: i < tags.length - 1 ? 4 : 0 }}
                >
                  {text}
                </Tag>
              ))}
            </Container>
          )}

          {reviewsCount ? (
            <Container margin={{ top: 4 }}>
              <Rating size="tiny" score={reviewRating} />
              <Text
                inlineBlock
                size="tiny"
                color="gray400"
                lineHeight={1.08}
                margin={{ left: 6 }}
              >
                ({reviewsCount})
              </Text>
            </Container>
          ) : null}

          {salePrice !== undefined ? (
            <Pricing
              salePrice={salePrice}
              basePrice={
                !!basePrice && salePrice !== basePrice ? basePrice : undefined
              }
            />
          ) : null}

          {hasCoupon && (
            <PricePolicyCouponInfo
              hasOnlyExpectedApplicableCoupon={hasOnlyExpectedApplicableCoupon}
              hasAmountAfterUsingCouponPrice={hasAmountAfterUsingCouponPrice}
              displayPricePolicy={displayPricePolicy}
            />
          )}

          {hasSelfPackageBenefit && (
            <Text bold size="small" color="gray700" margin={{ top: 4 }}>
              {t('selpeupaekiji-cugahalin-ganeung')}
            </Text>
          )}
        </Container>
      </Container>
    </StaticIntersectionObserver>
  )
}
