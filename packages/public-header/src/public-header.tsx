import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { white, brightGray } from '@titicaca/color-palette'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'

import {
  HEADER_DESKTOP_HEIGHT,
  HEADER_MOBILE_HEIGHT,
  MIN_DESKTOP_WIDTH,
  TRANSITION_TIME,
} from './constants'
import type { Category } from './types'
import {
  getCategoryHref,
  getCategoryImageProps,
  getCategoryTitle,
} from './categories'
import { useAutoHide } from './use-auto-hide'
import { ExtraActionsContainer } from './extra-actions-container'
import { ExtraActionItem } from './extra-action-item'
import { PublicHeaderDeeplink } from './public-header-deeplink'

const Wrapper = styled.div<{ visible: boolean }>`
  transition: height ease ${TRANSITION_TIME}ms;
  overflow: hidden;
  top: 0;
  height: ${({ visible }) => (visible ? `${HEADER_MOBILE_HEIGHT}px` : '0px')};

  &:focus-within {
    height: ${HEADER_MOBILE_HEIGHT}px;
  }

  @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
    height: ${({ visible }) =>
      visible ? `${HEADER_DESKTOP_HEIGHT}px` : '0px'};

    &:focus-within {
      height: ${HEADER_DESKTOP_HEIGHT}px;
    }
  }
`

const HeaderFrame = styled.div`
  background-color: ${white};
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${brightGray};
  padding: 0 6px;
  height: ${HEADER_MOBILE_HEIGHT}px;
  box-sizing: border-box;

  @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
    height: ${HEADER_DESKTOP_HEIGHT}px;
    padding: 0 42px;
  }
`

const Logo = styled.a`
  margin: 0;
  padding: 10px 8px;
  text-decoration: none;
  display: flex;
`

const LogoImage = styled.img`
  display: block;
  width: 57px;
  height: 20px;

  @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
    width: 68px;
    height: 24px;
  }
`

const LogoCategoryImage = styled.img`
  display: block;
  margin-left: 2px;
  width: auto;
  height: 20px;

  @media (min-width: ${MIN_DESKTOP_WIDTH}px) {
    height: 24px;
  }
`

export interface PublicHeaderProps {
  category?: Category
  /**
   * 앱에서 열 수 있는 path. ex) inlink or 네이티브 딥링크
   */
  deeplinkPath?: string
  disableAutoHide?: boolean
  onClick?: () => void
  linkHref?: string
  linkLabel?: string
}

export function PublicHeader({
  category,
  deeplinkPath,
  disableAutoHide,
  onClick,
  linkHref = '/my-bookings',
  linkLabel,
}: PublicHeaderProps) {
  const { t } = useTranslation('common-web')

  const app = useTripleClientMetadata()
  const visible = useAutoHide(disableAutoHide)

  if (app) {
    return null
  }

  return (
    <Wrapper visible={visible}>
      <HeaderFrame>
        <Logo
          href={getCategoryHref(category)}
          title={getCategoryTitle({ category, t })}
        >
          <LogoImage
            alt="Triple"
            src="https://assets.triple.guide/images/img_intro_logo_dark.svg"
          />
          {category && (
            <LogoCategoryImage {...getCategoryImageProps({ category, t })} />
          )}
        </Logo>

        <ExtraActionsContainer>
          <ExtraActionItem href={linkHref} onClick={onClick}>
            {linkLabel ?? t('nae-yeyag')}
          </ExtraActionItem>
          {deeplinkPath && <PublicHeaderDeeplink deeplinkPath={deeplinkPath} />}
        </ExtraActionsContainer>
      </HeaderFrame>
    </Wrapper>
  )
}
