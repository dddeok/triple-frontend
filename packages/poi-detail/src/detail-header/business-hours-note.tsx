import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Container, FlexBox, Text } from '@titicaca/core-elements'

import { TimeIcon, RightArrowIcon } from './business-hours-icons'

const IconBox = styled.div`
  width: 16px;
  height: 16px;
`

export default function BusinessHoursNote({
  todayBusinessHours,
  onClick,
}: {
  todayBusinessHours?: string
  onClick: () => void
}) {
  const { t } = useTranslation('common-web')

  return (
    <Container margin={{ top: 10 }}>
      <FlexBox flex alignItems="center">
        <IconBox>
          <TimeIcon />
        </IconBox>

        <Text
          size={15}
          bold
          lineHeight="16px"
          color="red"
          margin={{ left: 4 }}
          ellipsis
          onClick={onClick}
        >
          {todayBusinessHours
            ? t('yeongeobjunbijung-todaybusinesshours', { todayBusinessHours })
            : t('hyumuil')}
        </Text>

        <IconBox>
          <RightArrowIcon />
        </IconBox>

        <Container />
      </FlexBox>
    </Container>
  )
}
