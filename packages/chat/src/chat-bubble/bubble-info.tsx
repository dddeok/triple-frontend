import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import {Container, CSSProps, Text} from '@titicaca/core-elements'

const BubbleInfoContainer = styled(Container)`
  vertical-align: bottom;
`

const UnreadMessageCountText = styled.div`
  color: #26cec2;
  font-size: 10px;
`

moment.locale('ko')

export function BubbleInfo({
  unreadCount,
  date,
  css,
}: {
  unreadCount: number | null
  date: string
} & CSSProps) {
  const showDate = !moment().isSame(date, 'day')
  const showYear = !moment().isSame(date, 'year')

  return (
    <BubbleInfoContainer
      position="relative"
      display="inline-block"
      css={css}
    >
      {unreadCount ? (
        <UnreadMessageCountText>{unreadCount}</UnreadMessageCountText>
      ) : null}

      {showDate ? (
        <Text size={10} alpha={0.51}>
          {moment(date).format(showYear ? 'YYYY.MM.DD' : 'MM.DD')}
        </Text>
      ) : null}

      <Text size={10} alpha={0.51}>
        {moment(date).format('A hh:mm')}
      </Text>
    </BubbleInfoContainer>
  )
}
