import { useTranslation } from 'next-i18next'
import { Container, Text, MarginPadding } from '@titicaca/core-elements'

export function PricePolicyCouponInfo({
  emphasisColor = 'mint',
  hasOnlyExpectedApplicableCoupon,
  hasAmountAfterUsingCouponPrice,
  displayPricePolicy,
  margin,
}: {
  emphasisColor?: Parameters<typeof Text>[0]['color']
  hasOnlyExpectedApplicableCoupon?: boolean
  hasAmountAfterUsingCouponPrice?: boolean | 0
  displayPricePolicy?: string
  margin?: MarginPadding
}) {
  const { t } = useTranslation('common-web')

  return (
    <Container margin={margin || { top: 4 }}>
      {hasOnlyExpectedApplicableCoupon ? (
        <>
          <Text bold inlineBlock size="tiny" color={emphasisColor}>
            {t('kuponhalin')}
          </Text>
          <Text
            bold
            inlineBlock
            size="tiny"
            color="gray700"
            margin={{ left: 5 }}
          >
            {t('ganeung')}
          </Text>
        </>
      ) : hasAmountAfterUsingCouponPrice ? (
        <>
          <Text bold inlineBlock size="tiny" color="gray700">
            {t('kuponhalinga')}
          </Text>
          <Text
            bold
            inlineBlock
            size="tiny"
            color={emphasisColor}
            margin={{ left: 5 }}
          >
            {displayPricePolicy}
          </Text>
        </>
      ) : (
        <>
          <Text bold inlineBlock size="tiny" color="gray700">
            {t('kuponjeogyongsi')}
          </Text>
          <Text
            bold
            inlineBlock
            size="tiny"
            color={emphasisColor}
            margin={{ left: 5 }}
          >
            {t('muryo')}
          </Text>
        </>
      )}
    </Container>
  )
}
