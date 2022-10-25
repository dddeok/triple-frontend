import styled from 'styled-components'
import { useTranslation } from 'next-i18next'

const MoreImageOverlayLink = styled.a`
  display: block;
  width: 100%;
  text-align: center;
  color: white;
  vertical-align: middle;
  top: 50%;
  position: absolute;
  transform: translateY(-50%);
  text-decoration: none;
  font-size: 16px;
`

export default function CtaOverlay() {
  const { t } = useTranslation('common-web')

  return (
    <MoreImageOverlayLink>
      {t('teuripeul-aebeseo-deobogi')}
    </MoreImageOverlayLink>
  )
}
