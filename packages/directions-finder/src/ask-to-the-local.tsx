import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  Button,
  Container,
  Drawer,
  HR1,
  Section,
  Text,
  safeAreaInsetMixin,
} from '@titicaca/core-elements'
import Popup from '@titicaca/popup'

const DrawerContentContainer = styled(Container)`
  ${safeAreaInsetMixin}
`

const CallButton = styled(Button)`
  font-size: 14px;
  line-height: 17px;
  padding-top: 16px;
  padding-bottom: 15px;
`

export default function AskToTheLocal({
  open,
  onClose,
  localName,
  localAddress,
  primaryName,
  phoneNumber,
  isDomestic,
}: {
  open: boolean
  onClose: () => void
  localName: string
  localAddress: string
  primaryName: string
  phoneNumber?: string
  isDomestic?: boolean
}) {
  const { t } = useTranslation('common-web')

  const handleCall = useCallback(() => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`
    }
  }, [phoneNumber])

  return (
    <Popup open={open} onClose={onClose} borderless>
      <Section margin={{ top: 20 }}>
        <Text maxLines={2} textStyle="M4" color="blue">
          {localName}
        </Text>
        <Text textStyle="M" margin={{ top: 10 }}>
          {localAddress}
        </Text>
        <HR1 compact margin={{ top: 20, bottom: 20 }} />
        <Text textStyle="M" alpha={0.7}>
          {primaryName}
        </Text>
        {phoneNumber ? (
          <Drawer active>
            <DrawerContentContainer
              margin={{ left: 30, right: 30 }}
              padding={{ bottom: 10 }}
            >
              <CallButton fluid borderRadius={4} onClick={handleCall}>
                {t('jeonhwahagi')}
              </CallButton>
              {isDomestic ? null : (
                <Text
                  textStyle="S3"
                  alpha={0.5}
                  padding={{ top: 6, bottom: 0 }}
                >
                  {t('gugje-jeonhwa-yogeumi-bugwadoel-su-issseubnida.')}
                </Text>
              )}
            </DrawerContentContainer>
          </Drawer>
        ) : null}
      </Section>
    </Popup>
  )
}
