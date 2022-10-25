import { ReactNode, SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  Container,
  Drawer,
  Tooltip,
  Text,
  MarginPadding,
  Skeleton,
  safeAreaInsetMixin,
} from '@titicaca/core-elements'
import { formatNumber } from '@titicaca/view-utilities'

import PurchaseButton from './purchase-button'

export interface FixedPricingV2Props {
  loading: boolean
  active?: boolean
  label?: ReactNode
  discountRate?: ReactNode
  description?: ReactNode
  buttonText?: string
  buttonDisabled?: boolean
  salePrice?: number
  isSoldOut?: boolean
  priceLabelOverride?: string
  tooltipLabel?: string
  onClick?: (e?: SyntheticEvent) => void
  onTooltipClick?: (e?: SyntheticEvent) => void
  maxWidth?: number
  tooltipColor?: string
  padding?: MarginPadding
  emptyOverride?: ReactNode
}

const FloatedFrame = styled(Container)`
  border-top: 1px solid #efefef;
  background: #fff;

  ${safeAreaInsetMixin}
`

const FloatedPricingContainer = styled(Container)`
  width: 50%;
`

const PurchaseButtonContainer = styled(Container)`
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 41%;
  height: 47px;
`

function LoadingSkeleton() {
  return (
    <>
      <Container clearing>
        <Skeleton borderRadius={2} floated="left" width="40%" height={20} />
      </Container>
      <Container clearing margin={{ top: 5 }}>
        <Skeleton borderRadius={2} floated="left" width="60%" height={22} />
      </Container>
      <Container clearing margin={{ top: 5 }}>
        <Skeleton borderRadius={2} floated="left" width="100%" height={15} />
      </Container>
    </>
  )
}

export default function FixedPricingV2({
  emptyOverride,
  loading,
  active,
  label,
  buttonText,
  buttonDisabled,
  description,
  salePrice,
  tooltipLabel,
  tooltipColor,
  discountRate,
  onClick,
  priceLabelOverride,
  onTooltipClick,
  isSoldOut = false,
  maxWidth,
  padding = { top: 14, right: 20, bottom: 14, left: 20 },
}: FixedPricingV2Props) {
  const { t } = useTranslation('common-web')

  const formattedSalePrice = formatNumber(salePrice)
  const pricingLabel = label ? (
    typeof label === 'string' ? (
      <Text color="gray" alpha={0.5} size="mini">
        {label}
      </Text>
    ) : (
      label
    )
  ) : null

  const pricingDescription = description ? (
    typeof description === 'string' ? (
      <Text size="mini" alpha={0.5} margin={{ top: 1 }}>
        {description}
      </Text>
    ) : (
      description
    )
  ) : null

  return (
    <Drawer active={active} overflow="visible">
      <FloatedFrame padding={padding}>
        <Container
          position="relative"
          clearing
          maxWidth={maxWidth}
          centered={!!maxWidth}
        >
          {emptyOverride || (
            <>
              {!loading && active && tooltipLabel && (
                <Tooltip
                  borderRadius="30"
                  backgroundColor={tooltipColor}
                  positioning={{ top: -34 }}
                  label={tooltipLabel}
                  onClick={onTooltipClick}
                />
              )}
              <FloatedPricingContainer floated="left">
                {loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    {pricingLabel}
                    <Text
                      size="huge"
                      bold
                      margin={{ bottom: 3 }}
                      color={isSoldOut ? 'gray300' : 'gray'}
                    >
                      {priceLabelOverride ||
                        t('formattedsaleprice-weon', { formattedSalePrice })}
                      {discountRate}
                    </Text>
                    {pricingDescription}
                  </>
                )}
              </FloatedPricingContainer>

              <PurchaseButtonContainer position="absolute">
                <PurchaseButton
                  loading={loading}
                  disabled={buttonDisabled}
                  buttonText={buttonText}
                  onClick={onClick}
                />
              </PurchaseButtonContainer>
            </>
          )}
        </Container>
      </FloatedFrame>
    </Drawer>
  )
}
