import { PropsWithChildren, MouseEventHandler } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Container, Text } from '@titicaca/core-elements'

import { UserData } from '../types'

const UserPhoto = styled.img`
  margin-right: 9px;
  width: 36px;
  height: 36px;
  float: left;
  background-color: #efefef;
  border-radius: 19px;
  object-fit: cover;
`

const Badge = styled.img`
  position: absolute;
  top: 22px;
  left: 25px;
  width: 18px;
  height: 18px;
`

export default function User({
  user: { photo, name, userBoard, mileage, unregister },
  onClick,
}: {
  onClick?: MouseEventHandler
  user: UserData
}) {
  const { t } = useTranslation('common-web')

  const { reviewsV2: reviewsCount } = userBoard || {}
  const { badges = [], level } = mileage || {}

  return (
    <Container padding={{ bottom: 2 }} display="flex">
      <UserPhoto src={photo} onClick={onClick} />
      {badges.length > 0 ? <Badge src={badges[0].icon.image_url} /> : null}
      <div>
        <Name onClick={onClick}>{name}</Name>
        {!unregister ? (
          <Text
            margin={{ top: 3 }}
            size="mini"
            color="gray"
            alpha={0.4}
            onClick={onClick}
          >
            {level && level > 0 ? `LEVEL${level} / ` : null}
            {reviewsCount
              ? t('reviewscount-gaeyi-ribyu', { reviewsCount })
              : null}
          </Text>
        ) : null}
      </div>
    </Container>
  )
}

function Name({
  onClick,
  children,
}: PropsWithChildren<{ onClick?: MouseEventHandler<HTMLDivElement> }>) {
  return (
    <Text bold size="medium" onClick={onClick} wordBreak="break-word">
      {children}
    </Text>
  )
}
