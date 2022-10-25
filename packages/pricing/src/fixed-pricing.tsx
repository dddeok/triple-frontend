import { ReactNode, SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import {
  Container,
  Drawer,
  Tooltip,
  Text,
  Button,
  MarginPadding,
} from '@titicaca/core-elements'
import { formatNumber } from '@titicaca/view-utilities'

export interface FixedPricingProps {
  active?: boolean
  label?: ReactNode
  discountRate?: ReactNode
  description?: ReactNode
  buttonText?: string
  buttonDisabled?: boolean
  salePrice?: number
  isSoldOut?: boolean
  priceLabelOverride?: ReactNode
  tooltipLabel?: string
  onClick?: (e?: SyntheticEvent) => void
  onTooltipClick?: (e?: SyntheticEvent) => void
  maxWidth?: number
  tooltipColor?: string
  padding?: MarginPadding
}

const FloatedFrame = styled(Container)`
  border-top: 1px solid #efefef;
  background: #fff;

  @supports (padding: max(0px)) and (padding: env(safe-area-inset-bottom)) {
    ${({ padding }) =>
      padding?.bottom
        ? css`
            padding-bottom: max(
              ${padding.bottom}px,
              env(safe-area-inset-bottom, ${padding.bottom}px)
            );
          `
        : css`
            padding-bottom: max(14px, env(safe-area-inset-bottom, 14px));
          `}
  }
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

export default function FixedPricing({
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
}: FixedPricingProps) {
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
          {active && tooltipLabel && (
            <Tooltip
              borderRadius="30"
              backgroundColor={tooltipColor}
              positioning={{ top: -34 }}
              label={tooltipLabel}
              onClick={onTooltipClick}
            />
          )}
          <FloatedPricingContainer floated="left">
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
          </FloatedPricingContainer>

          <PurchaseButtonContainer position="absolute">
            <Button
              as="button"
              fluid
              borderRadius={4}
              size="small"
              color="blue"
              disabled={buttonDisabled}
              onClick={onClick}
            >
              {buttonText}
            </Button>
          </PurchaseButtonContainer>
        </Container>
      </FloatedFrame>
    </Drawer>
  )
}
