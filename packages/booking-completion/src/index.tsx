import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { Container, Text, Button } from '@titicaca/core-elements'
import styled from 'styled-components'
import { TranslatedProperty } from '@titicaca/type-definitions'
import { useAppCallback } from '@titicaca/ui-flow'
import { TransitionType } from '@titicaca/modals'
import { useNavigate } from '@titicaca/router'

interface Region {
  id: string
  names: TranslatedProperty
}

interface BookingCompletionProps {
  title?: string
  myBookingButtonTitle?: string
  compact?: boolean
  onMoveToBookingDetail: () => void
  onMoveToMain?: () => void
  onMoveToRegion?: () => void
  onAddToSchedule?: () => void
  descriptions?: string[]
  region?: Region
}

const DescriptionText = styled(Text)`
  &::before {
    display: inline-block;
    content: '';
    width: 10px;
    height: 10px;
    background-image: url(https://assets.triple.guide/images/img-bullet-check-b@3x.png);
    background-size: 10px;
    background-repeat: no-repeat;
    margin-right: 5px;
  }
`

const GrayButton = styled(Button)`
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #3a3a3a;
  font-weight: bold;
  font-size: 14px;
  height: 45px;
  line-height: normal;
`

function BookingCompletion({
  title,
  myBookingButtonTitle,
  compact,
  onMoveToBookingDetail,
  onMoveToMain = () => {},
  onMoveToRegion = () => {},
  onAddToSchedule,
  descriptions,
  region,
}: BookingCompletionProps) {
  const { t } = useTranslation('common-web')

  const regionName = region?.names.ko || region?.names.en
  const navigate = useNavigate()

  const handleMoveToRegion = useAppCallback(
    TransitionType.General,
    useCallback(() => {
      onMoveToRegion()
      navigate(`/regions/${region?.id}`)
    }, [navigate, onMoveToRegion, region?.id]),
  )

  return (
    <>
      <Container margin={{ bottom: 12 }}>
        <Text size={28} bold>
          {title || t('yeyagi-n-jeobsudoeeossseubnida.')}
        </Text>
      </Container>
      {(descriptions || []).map((description, idx) => (
        <DescriptionText
          key={idx}
          size="small"
          color="blue"
          bold
          margin={{ bottom: 8 }}
        >
          {description}
        </DescriptionText>
      ))}
      <Text color="gray" size="mini" alpha={0.5}>
        {t('jasehan-sahangeun-nae-yeyageseo-hwaginhaejuseyo.')}
      </Text>
      {compact ? (
        <Button
          margin={{ top: 30 }}
          basic
          inverted
          color="blue"
          size="small"
          onClick={onMoveToBookingDetail}
          fluid
        >
          {myBookingButtonTitle || t('nae-yeyageseo-hwagin')}
        </Button>
      ) : (
        <>
          <Container margin={{ top: 30 }}>
            <Button.Group horizontalGap={7}>
              <Button
                basic
                inverted
                color="blue"
                size="small"
                onClick={onMoveToBookingDetail}
              >
                {myBookingButtonTitle || t('nae-yeyageseo-hwagin')}
              </Button>
              <Button
                basic
                inverted
                color="gray"
                size="small"
                onClick={() => {
                  onMoveToMain()
                  navigate('/main')
                }}
              >
                {t('teuripeul-homeuro-gagi')}
              </Button>
            </Button.Group>
          </Container>
          {regionName ? (
            <GrayButton fluid margin={{ top: 6 }} onClick={handleMoveToRegion}>
              {t('regionname-yeohaeng-junbihareo-gagi', { regionName })}
            </GrayButton>
          ) : null}

          {onAddToSchedule ? (
            <GrayButton fluid margin={{ top: 6 }} onClick={onAddToSchedule}>
              {t('nae-iljeonge-cugahagi')}
            </GrayButton>
          ) : null}
        </>
      )}
    </>
  )
}

export default BookingCompletion
