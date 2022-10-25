import { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import {
  Text,
  layeringMixin,
  LayeringMixinProps,
} from '@titicaca/core-elements'

const AppBannerFrame = styled.header<
  { fixed?: boolean; maxWidth?: number } & LayeringMixinProps
>`
  background-color: #ffffff;
  border-bottom: 1px solid #efefef;
  height: 60px;
  position: sticky;

  ${layeringMixin(0)}

  ${({ fixed }) =>
    fixed &&
    css`
      top: 0;
    `};
  ${({ maxWidth }) =>
    maxWidth &&
    css`
      @media (min-width: ${maxWidth + 1}px) {
        display: none;
      }
    `};
`

const Logo = styled.h1`
  background-repeat: no-repeat;
  background-size: 34px 34px;
  background-image: url(https://assets.triple.guide/images/app-download@2x.png);
  width: 34px;
  height: 34px;
  margin: 0;
  padding: 0;
  top: 50%;
  left: 20px;
  margin-top: -17px;
  position: absolute;
`

const ContentContainer = styled.div`
  top: 50%;
  left: 64px;
  margin-top: -15.5px;
  position: absolute;
  height: 31px;
`

const CallToAction = styled.a`
  box-sizing: border-box;
  position: absolute;
  right: 20px;
  top: 50%;
  margin-top: -15px;
  padding: 9px 15px 8px 15px;
  height: 30px;
  border-radius: 15px;
  line-height: 13px;
  font-size: 11px;
  font-weight: bold;
  color: #ffffff;
  background-color: #0bd0af;
  text-decoration: none;
  cursor: pointer;
`

export default function AppBanner({
  title,
  description,
  cta,
  href,
  onCtaClick,
  zTier,
  zIndex = 1,
  ...props
}: {
  title?: string
  description?: string
  cta?: string
  href?: string
  onCtaClick?: (e?: SyntheticEvent) => void
} & LayeringMixinProps) {
  const { t } = useTranslation('common-web')

  return (
    <AppBannerFrame {...props} zTier={zTier} zIndex={zIndex}>
      <Logo />
      <ContentContainer>
        <Text
          bold
          size="mini"
          lineHeight="15px"
          color="gray"
          margin={{ bottom: 1 }}
        >
          {title}
        </Text>
        <Text size="mini" lineHeight="15px" color="gray" alpha={0.7}>
          {description}
        </Text>
      </ContentContainer>
      <CallToAction href={href} onClick={onCtaClick}>
        {cta || t('aebeseo-bogi')}
      </CallToAction>
    </AppBannerFrame>
  )
}
