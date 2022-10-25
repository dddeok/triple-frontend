import { ReactNode } from 'react'
import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import { formatNumber } from '@titicaca/view-utilities'
import {
  Container,
  Text,
  MarginPadding,
  GlobalColors,
} from '@titicaca/core-elements'
import { GlobalSizes } from '@titicaca/type-definitions'

import FixedPricing, { FixedPricingProps } from './fixed-pricing'

export type BasePrice = number | null

export { default as FixedPricingV2 } from './fixed-pricing-v2'

interface RegularPricingProps {
  basePrice?: BasePrice
  salePrice?: number
  priceLabelOverride?: ReactNode
  isSoldOut?: boolean
}

interface RichPricingProps {
  basePrice?: BasePrice
  basePriceUnit?: string
  salePrice?: number
  label?: ReactNode
  pricingNote?: string
  description?: ReactNode
  priceLabelOverride?: ReactNode
  hideDiscountRate?: boolean
  isSoldOut?: boolean
}

type PricingProps =
  | ({ rich: true; fixed?: false } & RichPricingProps)
  | ({ rich?: false; fixed: true } & FixedPricingProps)
  | ({
      rich?: false
      fixed?: false
    } & RegularPricingProps)

const FONT_SIZE: Partial<Record<GlobalSizes, string>> = {
  mini: '12px',
  tiny: '13px',
  small: '14px',
  large: '18px',
  big: '20px',
}

type PricingColors = GlobalColors | 'pink' | 'default'

const COLORS: Partial<Record<PricingColors, string>> = {
  pink: 'rgba(253, 46, 105, 1)',
  gray: 'rgba(58, 58, 58, 0.3)',
  blue: 'rgba(54, 143, 255, 1)',
  white: 'rgba(255, 255, 255, 1)',
  default: 'rgba(58, 58, 58, 1)',
}

const PricingContainer = styled.div<{ padding?: MarginPadding }>`
  clear: both;
  position: relative;
  text-align: right;
  font-size: ${FONT_SIZE.large};
  font-weight: bold;
  color: #3a3a3a;

  ${({ padding }) =>
    padding &&
    css`
      padding-top: ${padding.top || 0}px;
      padding-bottom: ${padding.bottom || 0}px;
      padding-left: ${padding.left || 0}px;
      padding-right: ${padding.right || 0}px;
    `};

  small {
    color: rgba(58, 58, 58, 0.3);
    font-weight: normal;
    font-size: ${FONT_SIZE.mini};
    display: inline-block;
    text-decoration: line-through;
    margin-right: 6px;
  }
`

const Label = styled.div<{ size?: GlobalSizes }>`
  position: absolute;
  left: 0;
  bottom: 0;
  color: ${COLORS.blue};
  font-size: ${({ size }) => FONT_SIZE[size || 'tiny']};
`

function DiscountRate({
  basePrice,
  salePrice,
}: {
  basePrice: number
  salePrice: number
}) {
  const rate = Math.floor(((basePrice - salePrice) / basePrice) * 100)

  return rate > 0 ? (
    <Text color="red" size={20} margin={{ right: 5 }} bold inline>
      {rate}%
    </Text>
  ) : null
}

function RichPricing({
  basePrice,
  salePrice = 0,
  label,
  pricingNote,
  description,
  basePriceUnit,
  priceLabelOverride,
  hideDiscountRate,
  isSoldOut,
}: RichPricingProps) {
  const { t } = useTranslation('common-web')

  const formattedSalePrice = formatNumber(salePrice)
  const pricingDescription = description ? (
    typeof description === 'string' ? (
      <Text size="tiny" alpha={0.8} margin={{ top: 3 }}>
        {description}
      </Text>
    ) : (
      description
    )
  ) : null

  const hasBasePrice =
    typeof basePrice === 'number' && basePrice > 0 && basePrice > salePrice

  return (
    <Container textAlign="right">
      <PricingContainer>
        {label ? <Label> {label} </Label> : null}

        {(pricingNote || hasBasePrice) && (
          <Container margin={{ bottom: 3 }}>
            {pricingNote && (
              <Text alpha={0.3} size="mini" inlineBlock margin={{ right: 3 }}>
                {pricingNote}
              </Text>
            )}

            {hasBasePrice && (
              <Text size="mini" strikethrough inline color="gray300">
                {formatNumber(basePrice)}
                {basePriceUnit}
              </Text>
            )}
          </Container>
        )}

        {!hideDiscountRate && hasBasePrice ? (
          <DiscountRate basePrice={basePrice as number} salePrice={salePrice} /> // HACK: hasBasePrice가 true면 basePrice는 무조건 number이다.
        ) : null}

        <Text size={20} bold inline color={isSoldOut ? 'gray300' : 'gray'}>
          {priceLabelOverride ||
            t('formattedsaleprice-weon', { formattedSalePrice })}
        </Text>
      </PricingContainer>
      {pricingDescription}
    </Container>
  )
}

const RegularPricing = ({
  basePrice,
  salePrice = 0,
  priceLabelOverride,
  isSoldOut,
}: RegularPricingProps) => {
  const { t } = useTranslation('common-web')

  const formattedSalePrice = formatNumber(salePrice)
  const hasBasePrice =
    typeof basePrice === 'number' && basePrice > 0 && basePrice > salePrice

  return (
    <PricingContainer padding={{ top: 18 }}>
      {hasBasePrice && (
        <Text
          color="gray300"
          size="mini"
          strikethrough
          inline
          margin={{ right: 5 }}
        >
          {formatNumber(basePrice)}
        </Text>
      )}
      <Text size={18} bold inline color={isSoldOut ? 'gray300' : 'gray'}>
        {priceLabelOverride ||
          t('formattedsaleprice-weon', { formattedSalePrice })}
      </Text>
    </PricingContainer>
  )
}

export default function Pricing(props: PricingProps) {
  const { salePrice, priceLabelOverride } = props

  if (props.rich) {
    const {
      basePrice,
      label,
      pricingNote,
      description,
      basePriceUnit,
      hideDiscountRate,
      isSoldOut,
    } = props

    return (
      <RichPricing
        basePrice={basePrice}
        priceLabelOverride={priceLabelOverride}
        basePriceUnit={basePriceUnit}
        salePrice={salePrice}
        label={label}
        pricingNote={pricingNote}
        description={description}
        hideDiscountRate={hideDiscountRate}
        isSoldOut={isSoldOut}
      />
    )
  } else if (props.fixed) {
    const {
      active,
      label,
      buttonText,
      buttonDisabled,
      description,
      onClick,
      tooltipLabel,
      onTooltipClick,
      isSoldOut,
      maxWidth,
      tooltipColor,
      discountRate,
      padding,
    } = props

    return (
      <FixedPricing
        active={active}
        label={label}
        padding={padding}
        buttonText={buttonText}
        buttonDisabled={buttonDisabled}
        salePrice={salePrice}
        description={description}
        onClick={onClick}
        priceLabelOverride={priceLabelOverride}
        tooltipLabel={tooltipLabel}
        tooltipColor={tooltipColor}
        discountRate={discountRate}
        onTooltipClick={onTooltipClick}
        isSoldOut={isSoldOut}
        maxWidth={maxWidth}
      />
    )
  } else {
    const { basePrice, isSoldOut } = props

    return (
      <RegularPricing
        basePrice={basePrice}
        salePrice={salePrice}
        priceLabelOverride={priceLabelOverride}
        isSoldOut={isSoldOut}
      />
    )
  }
}
